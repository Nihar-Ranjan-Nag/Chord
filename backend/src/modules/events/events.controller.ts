import { Request, Response } from "express";
import { PointSourceType, PointType, RegistrationStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { slugify } from "../../utils/slug";
import { applyPoints } from "../../services/points.service";
import { createEventSchema, updateEventSchema } from "./events.validation";
import { deleteLocalEventImage, saveEventImage } from "./event-image.service";

function isAdminRole(role: Role) {
  return role === Role.ADMIN;
}

function canManageEvent(req: Request, createdById: number) {
  if (isAdminRole(req.user!.role)) return true;
  return req.user!.role === Role.ORGANIZER && req.user!.id === createdById;
}

async function requireManagedEvent(req: Request, eventId: number) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ApiError(404, "Event not found");
  if (!canManageEvent(req, event.createdById)) {
    throw new ApiError(403, "You are not allowed to manage this event");
  }
  return event;
}

function getImagePayload(req: Request) {
  const imageData = typeof req.body.imageData === "string" ? req.body.imageData : "";
  const mimeType = typeof req.body.mimeType === "string" ? req.body.mimeType : "";
  const removeImage = req.body.removeImage === true || req.body.removeImage === "true";
  if ((imageData && !mimeType) || (!imageData && mimeType)) {
    throw new ApiError(400, "Event image data is incomplete.");
  }
  return { imageData, mimeType, removeImage };
}

export async function listPublicEvents(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)));
  const search = String(req.query.search || "").trim();
  const where: any = {
    status: "PUBLISHED",
    ...(search ? { title: { contains: search } } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      include: { category: true, createdBy: { select: { id: true, name: true, role: true } }, _count: { select: { registrations: true } } },
      orderBy: { startAt: "asc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.event.count({ where })
  ]);

  res.json({ success: true, data: { items, total, page, limit } });
}

export async function getEvent(req: Request, res: Response) {
  const event = await prisma.event.findUnique({
    where: { slug: String(req.params.slug) },
    include: { category: true, createdBy: { select: { id: true, name: true, role: true } }, _count: { select: { registrations: true } } }
  });
  if (!event) throw new ApiError(404, "Event not found");
  res.json({ success: true, data: event });
}

export async function registerForEvent(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  const userId = req.user!.id;

  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId }, include: { _count: { select: { registrations: true } } } });
    if (!event || event.status !== "PUBLISHED") throw new ApiError(404, "Event is not available");

    const now = new Date();
    if (event.registrationStartsAt && now < event.registrationStartsAt) throw new ApiError(400, "Registration has not started");
    if (event.registrationEndsAt && now > event.registrationEndsAt) throw new ApiError(400, "Registration is closed");
    if (event.capacity && event._count.registrations >= event.capacity) throw new ApiError(400, "Event is full");

    const existing = await tx.eventRegistration.findUnique({ where: { userId_eventId: { userId, eventId } } });
    if (existing) throw new ApiError(409, "You are already registered for this event");

    const registration = await tx.eventRegistration.create({ data: { userId, eventId } });

    if (event.participationPoints > 0) {
      await applyPoints({
        tx,
        userId,
        points: event.participationPoints,
        type: PointType.CREDIT,
        sourceType: PointSourceType.EVENT_REGISTRATION,
        sourceRef: `event:${event.id}:registration`,
        description: `Registered for ${event.title}`,
        uniqueSource: true
      });
    }

    await tx.notification.create({ data: { userId, title: "Event registration confirmed", message: `You are registered for ${event.title}.` } });
    return registration;
  });

  res.status(201).json({ success: true, data: result });
}

export async function myEvents(req: Request, res: Response) {
  const items = await prisma.eventRegistration.findMany({
    where: { userId: req.user!.id },
    include: { event: { include: { category: true } } },
    orderBy: { registeredAt: "desc" }
  });
  res.json({ success: true, data: items });
}

export async function managementListEvents(req: Request, res: Response) {
  const where = req.user!.role === Role.ORGANIZER ? { createdById: req.user!.id } : {};
  const items = await prisma.event.findMany({
    where,
    include: { category: true, createdBy: { select: { id: true, name: true, email: true, role: true } }, _count: { select: { registrations: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: items });
}

export async function managementGetEvent(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  await requireManagedEvent(req, eventId);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { category: true, createdBy: { select: { id: true, name: true, email: true, role: true } }, _count: { select: { registrations: true } } }
  });
  res.json({ success: true, data: event });
}

export async function createEvent(req: Request, res: Response) {
  const input = createEventSchema.parse(req.body);
  const { imageData, mimeType } = getImagePayload(req);
  let savedImage: Awaited<ReturnType<typeof saveEventImage>> | null = null;
  if (imageData && mimeType) savedImage = await saveEventImage({ imageData, mimeType });

  let slug = slugify(input.title);
  const duplicate = await prisma.event.findUnique({ where: { slug } });
  if (duplicate) slug = `${slug}-${Date.now()}`;

  const creator = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } });

  try {
    const event = await prisma.event.create({
      data: {
        ...input,
        bannerUrl: savedImage?.bannerUrl || null,
        organizer: input.organizer || creator?.name || null,
        meetingUrl: input.meetingUrl || null,
        slug,
        createdById: req.user!.id
      }
    });
    res.status(201).json({ success: true, message: "Event created successfully.", data: event });
  } catch (error) {
    if (savedImage) await deleteLocalEventImage(savedImage.bannerUrl);
    throw error;
  }
}

export async function updateEvent(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  const currentEvent = await requireManagedEvent(req, eventId);
  const input = updateEventSchema.parse(req.body);
  const { imageData, mimeType, removeImage } = getImagePayload(req);

  let savedImage: Awaited<ReturnType<typeof saveEventImage>> | null = null;
  if (imageData && mimeType) savedImage = await saveEventImage({ imageData, mimeType });

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...input,
        ...(savedImage ? { bannerUrl: savedImage.bannerUrl } : removeImage ? { bannerUrl: null } : {})
      }
    });

    if ((savedImage || removeImage) && currentEvent.bannerUrl) {
      await deleteLocalEventImage(currentEvent.bannerUrl);
    }

    res.json({ success: true, message: "Event updated successfully.", data: event });
  } catch (error) {
    if (savedImage) await deleteLocalEventImage(savedImage.bannerUrl);
    throw error;
  }
}

export async function deleteEvent(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await requireManagedEvent(req, eventId);

  await prisma.event.delete({
    where: { id: eventId }
  });

  if (event.bannerUrl) {
    await deleteLocalEventImage(event.bannerUrl);
  }

  res.json({
    success: true,
    message: "Event deleted successfully.",
    data: { id: eventId }
  });
}

export async function eventParticipants(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  await requireManagedEvent(req, eventId);
  const items = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true, name: true, email: true, phone: true, avatarUrl: true,
          college: true, course: true, yearOfStudy: true, pointsBalance: true, role: true, status: true, createdAt: true
        }
      }
    },
    orderBy: { registeredAt: "asc" }
  });
  res.json({ success: true, data: items });
}

export async function markAttendance(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  const userId = Number(req.params.userId);
  await requireManagedEvent(req, eventId);

  const result = await prisma.$transaction(async (tx) => {
    const registration = await tx.eventRegistration.findUnique({ where: { userId_eventId: { userId, eventId } }, include: { event: true } });
    if (!registration) throw new ApiError(404, "Registration not found");

    const updated = await tx.eventRegistration.update({
      where: { id: registration.id },
      data: { status: RegistrationStatus.ATTENDED, attendedAt: registration.attendedAt ?? new Date() }
    });

    if (registration.event.attendancePoints > 0) {
      await applyPoints({
        tx,
        userId,
        points: registration.event.attendancePoints,
        type: PointType.CREDIT,
        sourceType: PointSourceType.EVENT_ATTENDANCE,
        sourceRef: `event:${eventId}:attendance`,
        description: `Attendance verified for ${registration.event.title}`,
        createdById: req.user!.id,
        uniqueSource: true
      });
    }

    await tx.notification.create({ data: { userId, title: "Attendance verified", message: `Your attendance for ${registration.event.title} has been verified.` } });
    return updated;
  });

  res.json({ success: true, data: result });
}

export async function markCompleted(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  const userId = Number(req.params.userId);
  await requireManagedEvent(req, eventId);

  const result = await prisma.$transaction(async (tx) => {
    const registration = await tx.eventRegistration.findUnique({ where: { userId_eventId: { userId, eventId } }, include: { event: true } });
    if (!registration) throw new ApiError(404, "Registration not found");
    if (!["ATTENDED", "COMPLETED"].includes(registration.status)) throw new ApiError(400, "Attendance must be verified before completion");

    const updated = await tx.eventRegistration.update({
      where: { id: registration.id },
      data: { status: RegistrationStatus.COMPLETED, completedAt: registration.completedAt ?? new Date() }
    });

    if (registration.event.completionPoints > 0) {
      await applyPoints({
        tx,
        userId,
        points: registration.event.completionPoints,
        type: PointType.CREDIT,
        sourceType: PointSourceType.EVENT_COMPLETION,
        sourceRef: `event:${eventId}:completion`,
        description: `Completed ${registration.event.title}`,
        createdById: req.user!.id,
        uniqueSource: true
      });
    }

    await tx.notification.create({ data: { userId, title: "Event completed", message: `Congratulations! ${registration.event.title} has been marked completed.` } });
    return updated;
  });

  res.json({ success: true, data: result });
}