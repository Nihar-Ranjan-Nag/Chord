import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminDashboard, organizerDashboard, studentDashboard } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/student", authenticate, authorize(Role.USER), asyncHandler(studentDashboard));
dashboardRouter.get("/organizer", authenticate, authorize(Role.ORGANIZER), asyncHandler(organizerDashboard));
dashboardRouter.get("/admin", authenticate, authorize(Role.ADMIN), asyncHandler(adminDashboard));
