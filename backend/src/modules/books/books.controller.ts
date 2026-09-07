import crypto from "crypto";

import {
  Request,
  Response,
} from "express";

import {
  BorrowStatus,
  Role,
} from "@prisma/client";

import { z } from "zod";

import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

import {
  deleteBookImage,
  saveBookImage,
} from "./book-image.service";

/* ============================================================
   BOOK VALIDATION
============================================================ */

const bookSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200),

  author: z
    .string()
    .max(150)
    .optional()
    .nullable(),

  isbn: z
    .string()
    .max(60)
    .optional()
    .nullable(),

  description: z
    .string()
    .max(5000)
    .optional()
    .nullable(),

  depositAmount: z.coerce
    .number()
    .min(0),

  stock: z.coerce
    .number()
    .int()
    .min(0)
    .default(1),

  status: z
    .enum([
      "ACTIVE",
      "INACTIVE",
    ])
    .default("ACTIVE"),
});

/* ============================================================
   IMAGE PAYLOAD
============================================================ */

function getImagePayload(
  req: Request
) {
  const imageData =
    typeof req.body.imageData === "string"
      ? req.body.imageData
      : "";

  const mimeType =
    typeof req.body.mimeType === "string"
      ? req.body.mimeType
      : "";

  const removeImage =
    req.body.removeImage === true ||
    req.body.removeImage === "true";

  if (
    (imageData && !mimeType) ||
    (!imageData && mimeType)
  ) {
    throw new ApiError(
      400,
      "Book cover data is incomplete."
    );
  }

  return {
    imageData,
    mimeType,
    removeImage,
  };
}

/* ============================================================
   MANAGER FILTER
============================================================ */

function managerWhere(
  req: Request
) {
  return req.user!.role ===
    Role.ORGANIZER
    ? {
        createdById:
          req.user!.id,
      }
    : {};
}

/* ============================================================
   CHECK BOOK OWNERSHIP
============================================================ */

async function requireManagedBook(
  req: Request,
  id: number
) {
  const book =
    await prisma.book.findUnique({
      where: {
        id,
      },
    });

  if (!book) {
    throw new ApiError(
      404,
      "Book not found"
    );
  }

  if (
    req.user!.role ===
      Role.ORGANIZER &&
    book.createdById !==
      req.user!.id
  ) {
    throw new ApiError(
      403,
      "You are not allowed to manage this book"
    );
  }

  return book;
}

/* ============================================================
   PUBLIC BOOK LIST
============================================================ */

export async function listBooks(
  req: Request,
  res: Response
) {
  const search = String(
    req.query.search || ""
  ).trim();

  const items =
    await prisma.book.findMany({
      where: {
        status: "ACTIVE",

        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains:
                      search,
                  },
                },

                {
                  author: {
                    contains:
                      search,
                  },
                },

                {
                  isbn: {
                    contains:
                      search,
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            borrows: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   MY BORROWS
============================================================ */

export async function myBorrows(
  req: Request,
  res: Response
) {
  const items =
    await prisma.bookBorrow.findMany(
      {
        where: {
          userId:
            req.user!.id,
        },

        include: {
          book: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }
    );

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   BORROW BOOK
============================================================ */

export async function borrowBook(
  req: Request,
  res: Response
) {
  const bookId = Number(
    req.params.id
  );

  if (
    !Number.isInteger(bookId) ||
    bookId <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid book id"
    );
  }

  const input = z
    .object({
      dueAt: z.coerce
        .date()
        .optional(),
    })
    .parse(req.body || {});

  const borrow =
    await prisma.$transaction(
      async (tx) => {
        const book =
          await tx.book.findUnique(
            {
              where: {
                id: bookId,
              },
            }
          );

        if (
          !book ||
          book.status !==
            "ACTIVE"
        ) {
          throw new ApiError(
            404,
            "Book is not available"
          );
        }

        if (book.stock < 1) {
          throw new ApiError(
            400,
            "This book is currently out of stock"
          );
        }

        const active =
          await tx.bookBorrow.findFirst(
            {
              where: {
                userId:
                  req.user!.id,

                bookId,

                status: {
                  in: [
                    "BORROWED",
                    "RETURN_REQUESTED",
                  ],
                },
              },
            }
          );

        if (active) {
          throw new ApiError(
            409,
            "You already have an active borrow for this book"
          );
        }

        const created =
          await tx.bookBorrow.create(
            {
              data: {
                borrowCode:
                  `BRW-${Date.now()}-${crypto
                    .randomBytes(3)
                    .toString("hex")
                    .toUpperCase()}`,

                bookId,

                userId:
                  req.user!.id,

                paidAmount:
                  book.depositAmount,

                refundAmount: 0,

                paymentStatus:
                  "PAID",

                status:
                  "BORROWED",

                dueAt:
                  input.dueAt,
              },

              include: {
                book: true,
              },
            }
          );

        await tx.book.update({
          where: {
            id: bookId,
          },

          data: {
            stock: {
              decrement: 1,
            },
          },
        });

        await tx.notification.create(
          {
            data: {
              userId:
                req.user!.id,

              title:
                "Book borrowed",

              message:
                `${book.title} has been borrowed. Deposit paid: ₹${Number(
                  book.depositAmount
                ).toFixed(2)}.`,
            },
          }
        );

        return created;
      }
    );

  res.status(201).json({
    success: true,
    message:
      "Book borrowed successfully.",
    data: borrow,
  });
}

/* ============================================================
   REQUEST RETURN
============================================================ */

export async function requestBookReturn(
  req: Request,
  res: Response
) {
  const id = Number(
    req.params.id
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid borrow id"
    );
  }

  const item =
    await prisma.bookBorrow.findFirst(
      {
        where: {
          id,

          userId:
            req.user!.id,
        },
      }
    );

  if (!item) {
    throw new ApiError(
      404,
      "Borrow record not found"
    );
  }

  if (
    item.status !==
    "BORROWED"
  ) {
    throw new ApiError(
      400,
      "Only borrowed books can be submitted for return"
    );
  }

  const updated =
    await prisma.bookBorrow.update({
      where: {
        id,
      },

      data: {
        status:
          "RETURN_REQUESTED",

        returnRequestedAt:
          new Date(),
      },
    });

  res.json({
    success: true,
    message:
      "Return request submitted.",
    data: updated,
  });
}

/* ============================================================
   MANAGEMENT BOOK LIST
============================================================ */

export async function managementListBooks(
  req: Request,
  res: Response
) {
  const items =
    await prisma.book.findMany({
      where:
        managerWhere(req),

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        _count: {
          select: {
            borrows: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   CREATE BOOK
============================================================ */

export async function createBook(
  req: Request,
  res: Response
) {
  const input =
    bookSchema.parse(
      req.body
    );

  const {
    imageData,
    mimeType,
  } = getImagePayload(req);

  let savedImage:
    | Awaited<
        ReturnType<
          typeof saveBookImage
        >
      >
    | null = null;

  /*
   * Upload cover to Cloudinary.
   */
  if (
    imageData &&
    mimeType
  ) {
    savedImage =
      await saveBookImage(
        imageData,
        mimeType
      );
  }

  try {
    const book =
      await prisma.book.create({
        data: {
          ...input,

          /*
           * Cloudinary HTTPS URL
           * gets stored in coverUrl.
           */
          coverUrl:
            savedImage?.coverUrl ||
            null,

          createdById:
            req.user!.id,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Book created successfully.",
      data: book,
    });
  } catch (error) {
    /*
     * If DB creation fails,
     * remove uploaded Cloudinary cover.
     */
    if (savedImage) {
      await deleteBookImage(
        savedImage.coverUrl
      );
    }

    throw error;
  }
}

/* ============================================================
   UPDATE BOOK
============================================================ */

export async function updateBook(
  req: Request,
  res: Response
) {
  const id = Number(
    req.params.id
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid book id"
    );
  }

  const current =
    await requireManagedBook(
      req,
      id
    );

  const input =
    bookSchema
      .partial()
      .parse(req.body);

  const {
    imageData,
    mimeType,
    removeImage,
  } = getImagePayload(req);

  let savedImage:
    | Awaited<
        ReturnType<
          typeof saveBookImage
        >
      >
    | null = null;

  /*
   * Upload new cover first.
   */
  if (
    imageData &&
    mimeType
  ) {
    savedImage =
      await saveBookImage(
        imageData,
        mimeType
      );
  }

  try {
    const book =
      await prisma.book.update({
        where: {
          id,
        },

        data: {
          ...input,

          ...(savedImage
            ? {
                coverUrl:
                  savedImage.coverUrl,
              }
            : removeImage
              ? {
                  coverUrl:
                    null,
                }
              : {}),
        },
      });

    /*
     * DB update succeeded.
     * Delete old image afterwards.
     */
    if (
      (savedImage ||
        removeImage) &&
      current.coverUrl
    ) {
      await deleteBookImage(
        current.coverUrl
      );
    }

    res.json({
      success: true,
      message:
        "Book updated successfully.",
      data: book,
    });
  } catch (error) {
    /*
     * If DB update fails,
     * clean up new Cloudinary image.
     */
    if (savedImage) {
      await deleteBookImage(
        savedImage.coverUrl
      );
    }

    throw error;
  }
}

/* ============================================================
   MANAGEMENT BORROWS
============================================================ */

export async function managementListBorrows(
  req: Request,
  res: Response
) {
  const status =
    req.query.status
      ? String(
          req.query.status
        ) as BorrowStatus
      : undefined;

  const items =
    await prisma.bookBorrow.findMany(
      {
        where: {
          ...(status
            ? {
                status,
              }
            : {}),

          ...(req.user!.role ===
          Role.ORGANIZER
            ? {
                book: {
                  createdById:
                    req.user!.id,
                },
              }
            : {}),
        },

        include: {
          book: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },

          reviewedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }
    );

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   UPDATE BORROW STATUS
============================================================ */

export async function updateBorrowStatus(
  req: Request,
  res: Response
) {
  const id = Number(
    req.params.id
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid borrow id"
    );
  }

  const input = z
    .object({
      status: z.enum([
        "RETURNED",
        "DID_NOT_RETURN",
        "CANCELLED",
      ]),

      note: z
        .string()
        .max(2000)
        .optional(),
    })
    .parse(req.body);

  const current =
    await prisma.bookBorrow.findUnique(
      {
        where: {
          id,
        },

        include: {
          book: true,
        },
      }
    );

  if (!current) {
    throw new ApiError(
      404,
      "Borrow record not found"
    );
  }

  if (
    req.user!.role ===
      Role.ORGANIZER &&
    current.book.createdById !==
      req.user!.id
  ) {
    throw new ApiError(
      403,
      "You are not allowed to manage this borrow record"
    );
  }

  if (
    [
      "RETURNED",
      "DID_NOT_RETURN",
      "CANCELLED",
    ].includes(
      current.status
    )
  ) {
    throw new ApiError(
      400,
      "This borrow record is already closed"
    );
  }

  const result =
    await prisma.$transaction(
      async (tx) => {
        const returned =
          input.status ===
          "RETURNED";

        const cancelled =
          input.status ===
          "CANCELLED";

        const refund =
          returned || cancelled
            ? current.paidAmount
            : 0;

        const updated =
          await tx.bookBorrow.update(
            {
              where: {
                id,
              },

              data: {
                status:
                  input.status,

                paymentStatus:
                  returned ||
                  cancelled
                    ? "REFUNDED"
                    : "FORFEITED",

                refundAmount:
                  refund,

                returnedAt:
                  returned
                    ? new Date()
                    : undefined,

                reviewedById:
                  req.user!.id,

                note:
                  input.note,
              },

              include: {
                book: true,

                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            }
          );

        if (
          returned ||
          cancelled
        ) {
          await tx.book.update({
            where: {
              id:
                current.bookId,
            },

            data: {
              stock: {
                increment: 1,
              },
            },
          });
        }

        await tx.notification.create(
          {
            data: {
              userId:
                current.userId,

              title: returned
                ? "Book returned"
                : input.status ===
                    "DID_NOT_RETURN"
                  ? "Book marked not returned"
                  : "Book borrow cancelled",

              message:
                returned ||
                cancelled
                  ? `${current.book.title}: ₹${Number(
                      refund
                    ).toFixed(
                      2
                    )} marked for refund.`
                  : `${current.book.title}: deposit forfeited because the book was not returned.`,
            },
          }
        );

        return updated;
      }
    );

  res.json({
    success: true,
    message:
      "Borrow status updated.",
    data: result,
  });
}