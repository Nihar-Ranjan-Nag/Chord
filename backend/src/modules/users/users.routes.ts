import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adjustPoints, adminDeleteAccount, adminGetOrganizer, adminGetStudent, adminListOrganizers, adminListStudents,
  adminUpdateAccount, leaderboard, markNotificationRead, notifications, pointsHistory, profile, updateProfile, updateStudentStatus, uploadAvatar
} from "./users.controller";

export const userRouter = Router();
userRouter.get("/leaderboard", asyncHandler(leaderboard));
userRouter.use(authenticate);
userRouter.get("/profile", asyncHandler(profile));
userRouter.put("/profile", asyncHandler(updateProfile));
userRouter.post("/profile/avatar", asyncHandler(uploadAvatar));
userRouter.get("/points", asyncHandler(pointsHistory));
userRouter.get("/notifications", asyncHandler(notifications));
userRouter.patch("/notifications/:id/read", asyncHandler(markNotificationRead));

export const adminUserRouter = Router();
adminUserRouter.use(authenticate, authorize(Role.ADMIN));
adminUserRouter.get("/", asyncHandler(adminListStudents));
adminUserRouter.get("/:id", asyncHandler(adminGetStudent));
adminUserRouter.patch("/:id", asyncHandler(adminUpdateAccount));
adminUserRouter.patch("/:id/status", asyncHandler(updateStudentStatus));
adminUserRouter.post("/:id/points", asyncHandler(adjustPoints));
adminUserRouter.delete("/:id", asyncHandler(adminDeleteAccount));

export const adminOrganizerRouter = Router();
adminOrganizerRouter.use(authenticate, authorize(Role.ADMIN));
adminOrganizerRouter.get("/", asyncHandler(adminListOrganizers));
adminOrganizerRouter.get("/:id", asyncHandler(adminGetOrganizer));
adminOrganizerRouter.patch("/:id", asyncHandler(adminUpdateAccount));
adminOrganizerRouter.patch("/:id/status", asyncHandler(updateStudentStatus));
adminOrganizerRouter.delete("/:id", asyncHandler(adminDeleteAccount));
