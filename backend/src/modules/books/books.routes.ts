import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middleware/auth.middleware";
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
  updateBorrowStatus
} from "./books.controller";

export const bookRouter = Router();
bookRouter.get("/", asyncHandler(listBooks));
bookRouter.get("/mine", authenticate, authorize(Role.USER), asyncHandler(myBorrows));
bookRouter.post("/:id/borrow", authenticate, authorize(Role.USER), asyncHandler(borrowBook));
bookRouter.patch("/borrows/:id/request-return", authenticate, authorize(Role.USER), asyncHandler(requestBookReturn));

function buildManagerRouter(...roles: Role[]) {
  const router = Router();
  router.use(authenticate, authorize(...roles));
  router.get("/", asyncHandler(managementListBooks));
  router.post("/", asyncHandler(createBook));
  router.put("/:id", asyncHandler(updateBook));
  router.get("/borrows/all", asyncHandler(managementListBorrows));
  router.patch("/borrows/:id/status", asyncHandler(updateBorrowStatus));
  return router;
}

export const organizerBookRouter = buildManagerRouter(Role.ORGANIZER);
export const adminBookRouter = buildManagerRouter(Role.ADMIN);
