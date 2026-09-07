import {
  Request,
  Response,
} from "express";

import {
  PointSourceType,
  PointType,
  RedemptionStatus,
  RewardStatus,
} from "@prisma/client";

import { z } from "zod";

import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { applyPoints } from "../../services/points.service";
import { slugify } from "../../utils/slug";

import {
  deleteRewardImage,
  saveRewardImage,
} from "./reward-image.service";

/* ============================================================
   REWARD VALIDATION
============================================================ */

const rewardSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(150),

  description: z
    .string()
    .max(5000)
    .optional(),

  categoryId: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  pointsCost: z.coerce
    .number()
    .int()
    .positive(),

  stock: z.coerce
    .number()
    .int()
    .min(0),

  status: z
    .enum([
      "ACTIVE",
      "INACTIVE",
      "OUT_OF_STOCK",
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
    typeof req.body.imageData ===
    "string"
      ? req.body.imageData
      : "";

  const mimeType =
    typeof req.body.mimeType ===
    "string"
      ? req.body.mimeType
      : "";

  const removeImage =
    req.body.removeImage === true ||
    req.body.removeImage ===
      "true";

  if (
    (imageData && !mimeType) ||
    (!imageData && mimeType)
  ) {
    throw new ApiError(
      400,
      "Reward image data is incomplete."
    );
  }

  return {
    imageData,
    mimeType,
    removeImage,
  };
}

/* ============================================================
   PUBLIC REWARDS
============================================================ */

export async function listRewards(
  _req: Request,
  res: Response
) {
  const rewards =
    await prisma.reward.findMany({
      where: {
        status: {
          in: [
            RewardStatus.ACTIVE,
            RewardStatus.OUT_OF_STOCK,
          ],
        },
      },

      include: {
        category: true,
      },

      orderBy: [
        {
          pointsCost: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  res.json({
    success: true,
    data: rewards,
  });
}

/* ============================================================
   USER REDEMPTIONS
============================================================ */

export async function myRedemptions(
  req: Request,
  res: Response
) {
  const items =
    await prisma.rewardRedemption.findMany(
      {
        where: {
          userId: req.user!.id,
        },

        include: {
          reward: true,
        },

        orderBy: {
          requestedAt: "desc",
        },
      }
    );

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   REDEEM REWARD
============================================================ */

export async function redeemReward(
  req: Request,
  res: Response
) {
  const rewardId = Number(
    req.params.id
  );

  const userId =
    req.user!.id;

  if (
    !Number.isInteger(rewardId) ||
    rewardId <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid reward id"
    );
  }

  const redemption =
    await prisma.$transaction(
      async (tx) => {
        const reward =
          await tx.reward.findUnique({
            where: {
              id: rewardId,
            },
          });

        if (
          !reward ||
          reward.status !==
            RewardStatus.ACTIVE
        ) {
          throw new ApiError(
            404,
            "Reward is not available"
          );
        }

        if (reward.stock <= 0) {
          throw new ApiError(
            400,
            "Reward is out of stock"
          );
        }

        const user =
          await tx.user.findUnique({
            where: {
              id: userId,
            },
          });

        if (
          !user ||
          user.pointsBalance <
            reward.pointsCost
        ) {
          throw new ApiError(
            400,
            "You do not have enough points"
          );
        }

        await applyPoints({
          tx,

          userId,

          points:
            reward.pointsCost,

          type:
            PointType.DEBIT,

          sourceType:
            PointSourceType.REDEMPTION,

          sourceRef:
            `reward:${reward.id}:${Date.now()}`,

          description:
            `Redeemed ${reward.name}`,
        });

        await tx.reward.update({
          where: {
            id: reward.id,
          },

          data: {
            stock: {
              decrement: 1,
            },

            ...(reward.stock === 1
              ? {
                  status:
                    RewardStatus.OUT_OF_STOCK,
                }
              : {}),
          },
        });

        const created =
          await tx.rewardRedemption.create(
            {
              data: {
                userId,

                rewardId:
                  reward.id,

                pointsSpent:
                  reward.pointsCost,
              },
            }
          );

        await tx.notification.create({
          data: {
            userId,

            title:
              "Redemption requested",

            message:
              `Your request for ${reward.name} has been submitted.`,
          },
        });

        return created;
      }
    );

  res.status(201).json({
    success: true,
    data: redemption,
  });
}

/* ============================================================
   ADMIN LIST REWARDS
============================================================ */

export async function adminListRewards(
  _req: Request,
  res: Response
) {
  const items =
    await prisma.reward.findMany({
      include: {
        category: true,
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
   CREATE REWARD
============================================================ */

export async function createReward(
  req: Request,
  res: Response
) {
  const input =
    rewardSchema.parse(
      req.body
    );

  const {
    imageData,
    mimeType,
  } = getImagePayload(req);

  let savedImage:
    | Awaited<
        ReturnType<
          typeof saveRewardImage
        >
      >
    | null = null;

  /*
   * Upload to Cloudinary through
   * saveLocalImage()
   */
  if (
    imageData &&
    mimeType
  ) {
    savedImage =
      await saveRewardImage(
        imageData,
        mimeType
      );
  }

  let slug =
    slugify(input.name);

  if (
    await prisma.reward.findUnique({
      where: {
        slug,
      },
    })
  ) {
    slug =
      `${slug}-${Date.now()}`;
  }

  try {
    const item =
      await prisma.reward.create({
        data: {
          ...input,

          /*
           * Cloudinary HTTPS URL
           * will be stored here.
           */
          imageUrl:
            savedImage?.imageUrl ||
            null,

          slug,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Reward created successfully.",
      data: item,
    });
  } catch (error) {
    /*
     * If DB creation fails after
     * Cloudinary upload, remove
     * uploaded image.
     */
    if (savedImage) {
      await deleteRewardImage(
        savedImage.imageUrl
      );
    }

    throw error;
  }
}

/* ============================================================
   UPDATE REWARD
============================================================ */

export async function updateReward(
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
      "Invalid reward id"
    );
  }

  const current =
    await prisma.reward.findUnique({
      where: {
        id,
      },
    });

  if (!current) {
    throw new ApiError(
      404,
      "Reward not found"
    );
  }

  const input =
    rewardSchema
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
          typeof saveRewardImage
        >
      >
    | null = null;

  /*
   * Upload new reward image
   * to Cloudinary first.
   */
  if (
    imageData &&
    mimeType
  ) {
    savedImage =
      await saveRewardImage(
        imageData,
        mimeType
      );
  }

  try {
    const item =
      await prisma.reward.update({
        where: {
          id,
        },

        data: {
          ...input,

          ...(savedImage
            ? {
                imageUrl:
                  savedImage.imageUrl,
              }
            : removeImage
              ? {
                  imageUrl:
                    null,
                }
              : {}),
        },
      });

    /*
     * DB update succeeded.
     *
     * Delete previous Cloudinary
     * image only after success.
     */
    if (
      (savedImage ||
        removeImage) &&
      current.imageUrl
    ) {
      await deleteRewardImage(
        current.imageUrl
      );
    }

    res.json({
      success: true,
      message:
        "Reward updated successfully.",
      data: item,
    });
  } catch (error) {
    /*
     * If DB update fails,
     * delete newly uploaded
     * Cloudinary image.
     */
    if (savedImage) {
      await deleteRewardImage(
        savedImage.imageUrl
      );
    }

    throw error;
  }
}

/* ============================================================
   ADMIN LIST REDEMPTIONS
============================================================ */

export async function adminListRedemptions(
  _req: Request,
  res: Response
) {
  const items =
    await prisma.rewardRedemption.findMany(
      {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          reward: true,
        },

        orderBy: {
          requestedAt: "desc",
        },
      }
    );

  res.json({
    success: true,
    data: items,
  });
}

/* ============================================================
   UPDATE REDEMPTION STATUS
============================================================ */

export async function updateRedemptionStatus(
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
      "Invalid redemption id"
    );
  }

  const body = z
    .object({
      status: z.enum([
        "APPROVED",
        "REJECTED",
        "DELIVERED",
      ]),

      note: z
        .string()
        .max(500)
        .optional(),
    })
    .parse(req.body);

  const result =
    await prisma.$transaction(
      async (tx) => {
        const redemption =
          await tx.rewardRedemption.findUnique(
            {
              where: {
                id,
              },

              include: {
                reward: true,
              },
            }
          );

        if (!redemption) {
          throw new ApiError(
            404,
            "Redemption not found"
          );
        }

        /*
         * REJECT
         */
        if (
          body.status ===
          "REJECTED"
        ) {
          if (
            redemption.status !==
            RedemptionStatus.PENDING
          ) {
            throw new ApiError(
              400,
              "Only pending redemptions can be rejected"
            );
          }

          await applyPoints({
            tx,

            userId:
              redemption.userId,

            points:
              redemption.pointsSpent,

            type:
              PointType.CREDIT,

            sourceType:
              PointSourceType.REVERSAL,

            sourceRef:
              `redemption:${id}:reversal`,

            description:
              `Points returned for rejected redemption: ${redemption.reward.name}`,

            createdById:
              req.user!.id,

            uniqueSource: true,
          });

          await tx.reward.update({
            where: {
              id:
                redemption.rewardId,
            },

            data: {
              stock: {
                increment: 1,
              },

              status:
                RewardStatus.ACTIVE,
            },
          });
        }

        /*
         * DELIVERED requires APPROVED
         */
        if (
          body.status ===
            "DELIVERED" &&
          redemption.status !==
            RedemptionStatus.APPROVED
        ) {
          throw new ApiError(
            400,
            "Redemption must be approved before delivery"
          );
        }

        const updated =
          await tx.rewardRedemption.update(
            {
              where: {
                id,
              },

              data: {
                status:
                  body.status,

                reviewedById:
                  req.user!.id,

                reviewedAt:
                  new Date(),

                rejectionNote:
                  body.status ===
                  "REJECTED"
                    ? body.note
                    : undefined,

                deliveryNote:
                  body.status ===
                  "DELIVERED"
                    ? body.note
                    : undefined,

                deliveredAt:
                  body.status ===
                  "DELIVERED"
                    ? new Date()
                    : undefined,
              },
            }
          );

        await tx.notification.create(
          {
            data: {
              userId:
                redemption.userId,

              title:
                `Reward ${body.status.toLowerCase()}`,

              message:
                `${redemption.reward.name} redemption is now ${body.status.toLowerCase()}.`,
            },
          }
        );

        return updated;
      }
    );

  res.json({
    success: true,
    data: result,
  });
}