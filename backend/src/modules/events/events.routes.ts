import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import {
  createEvent,
  deleteEvent,
  eventParticipants,
  getEvent,
  listPublicEvents,
  managementGetEvent,
  managementListEvents,
  markAttendance,
  markCompleted,
  myEvents,
  registerForEvent,
  updateEvent
} from "./events.controller";

export const eventRouter = Router();
eventRouter.get("/", asyncHandler(listPublicEvents));
eventRouter.get("/mine", authenticate, authorize(Role.USER), asyncHandler(myEvents));
eventRouter.get("/:slug", asyncHandler(getEvent));
eventRouter.post("/:id/register", authenticate, authorize(Role.USER), asyncHandler(registerForEvent));

function buildManagementRouter(...roles: Role[]) {
  const router = Router();
  router.use(authenticate, authorize(...roles));
  router.get("/", asyncHandler(managementListEvents));
  router.get("/:id", asyncHandler(managementGetEvent));
  router.post("/", asyncHandler(createEvent));
  router.put("/:id", asyncHandler(updateEvent));
  router.get("/:id/participants", asyncHandler(eventParticipants));
  router.patch("/:id/participants/:userId/attendance", asyncHandler(markAttendance));
  router.patch("/:id/participants/:userId/complete", asyncHandler(markCompleted));
  return router;
}

export const organizerEventRouter = buildManagementRouter(Role.ORGANIZER);
organizerEventRouter.delete("/:id", asyncHandler(deleteEvent));

export const adminEventRouter = buildManagementRouter(Role.ADMIN);