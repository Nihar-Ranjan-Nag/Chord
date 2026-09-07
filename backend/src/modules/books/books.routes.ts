import { Router } from "express";

import { Role } from "@prisma/client";

import {
  authenticate,
  authorize,
} from "../../middleware/auth.middleware";

import { asyncHandler } from "../../utils/asyncHandler";

import {
  borrowBook,
  createBook,
  listBooks,
  managementListBooks,
  managementListBorrows,
  myBorrows,
  requestBookReturn,
  updateBook,
  updateBorrowStatus,
} from "./books.controller";

/* ============================================================
   PUBLIC / USER BOOK ROUTES
============================================================ */

export const bookRouter =
  Router();

/*
 * Public book listing
 */
bookRouter.get(
  "/",
  asyncHandler(listBooks)
);

/*
 * Logged-in user's borrowed books
 */
bookRouter.get(
  "/mine",
  authenticate,
  authorize(Role.USER),
  asyncHandler(myBorrows)
);

/*
 * Borrow book
 */
bookRouter.post(
  "/:id/borrow",
  authenticate,
  authorize(Role.USER),
  asyncHandler(borrowBook)
);

/*
 * Request book return
 */
bookRouter.patch(
  "/borrows/:id/request-return",
  authenticate,
  authorize(Role.USER),
  asyncHandler(
    requestBookReturn
  )
);

/* ============================================================
   MANAGER ROUTER
============================================================ */

function buildManagerRouter(
  ...roles: Role[]
) {
  const router =
    Router();

  router.use(
    authenticate,
    authorize(...roles)
  );

  /*
   * List books
   */
  router.get(
    "/",
    asyncHandler(
      managementListBooks
    )
  );

  /*
   * Create book
   */
  router.post(
    "/",
    asyncHandler(createBook)
  );

  /*
   * Update book
   */
  router.put(
    "/:id",
    asyncHandler(updateBook)
  );

  /*
   * List borrow records
   */
  router.get(
    "/borrows/all",
    asyncHandler(
      managementListBorrows
    )
  );

  /*
   * Update borrow status
   */
  router.patch(
    "/borrows/:id/status",
    asyncHandler(
      updateBorrowStatus
    )
  );

  return router;
}

/* ============================================================
   ORGANIZER BOOK ROUTES
============================================================ */

export const organizerBookRouter =
  buildManagerRouter(
    Role.ORGANIZER
  );

/* ============================================================
   ADMIN BOOK ROUTES
============================================================ */

export const adminBookRouter =
  buildManagerRouter(
    Role.ADMIN
  );