import fs from "fs/promises";
import { Request, Response } from "express";
import { PointSourceType, PointType, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { applyPoints } from "../../services/points.service";
import { deleteLocalProfileAvatar, saveProfileAvatar } from "./avatar.service";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  dateOfBirth: true,
  college: true,
  course: true,
  yearOfStudy: true,
  avatarUrl: true,
  pointsBalance: true,
  createdAt: true
} as const;

export async function profile(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: profileSelect
  });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: user });
}

export async function updateProfile(req: Request, res: Response) {
  const input = z
    .object({
      name: z.string().min(2).max(100).optional(),
      phone: z.string().max(20).optional(),
      dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      college: z.string().max(150).optional(),
      course: z.string().max(100).optional(),
      yearOfStudy: z.coerce.number().int().min(1).max(10).optional()
    })
    .parse(req.body);

  const { dateOfBirth, ...rest } = input;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...rest,
      ...(dateOfBirth ? { dateOfBirth: new Date(`${dateOfBirth}T00:00:00.000Z`) } : {})
    },
    select: profileSelect
  });

  res.json({
    success: true,
    message: "Profile updated successfully.",
    data: user
  });
}

export async function uploadAvatar(req: Request, res: Response) {
  const input = z
    .object({
      imageData: z.string().min(20),
      mimeType: z.enum(["image/jpeg", "image/png", "image/webp"])
    })
    .parse(req.body);

  const currentUser = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { avatarUrl: true }
  });
  if (!currentUser) throw new ApiError(404, "User not found");

  const saved = await saveProfileAvatar(input);

  let user;
  try {
    user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl: saved.avatarUrl },
      select: profileSelect
    });
  } catch (error) {
    await fs.unlink(saved.filePath).catch(() => undefined);
    throw error;
  }

  if (currentUser.avatarUrl !== saved.avatarUrl) {
    await deleteLocalProfileAvatar(currentUser.avatarUrl);
  }

  res.json({
    success: true,
    message: "Profile image updated successfully.",
    data: user
  });
}

export async function pointsHistory(req: Request, res: Response) {
  const items = await prisma.pointTransaction.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json({ success: true, data: items });
}

export async function notifications(req: Request, res: Response) {
  const items = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json({ success: true, data: items });
}

export async function markNotificationRead(req: Request, res: Response) {
  const id = Number(req.params.id);
  const notification = await prisma.notification.findFirst({
    where: { id, userId: req.user!.id }
  });
  if (!notification) throw new ApiError(404, "Notification not found");

  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
  res.json({ success: true });
}

export async function leaderboard(_req: Request, res: Response) {
  const items = await prisma.user.findMany({
    where: { role: Role.USER, status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      college: true,
      course: true,
      avatarUrl: true,
      pointsBalance: true
    },
    orderBy: [{ pointsBalance: "desc" }, { createdAt: "asc" }],
    take: 100
  });
  res.json({ success: true, data: items });
}

export async function adminListStudents(req: Request, res: Response) {
  const search = String(req.query.search || "").trim();
  const items = await prisma.user.findMany({
    where: {
      role: Role.USER,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { college: { contains: search } }
            ]
          }
        : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      college: true,
      course: true,
      yearOfStudy: true,
      avatarUrl: true,
      status: true,
      pointsBalance: true,
      createdAt: true,
      _count: { select: { registrations: true, redemptions: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: items });
}

export async function adminGetStudent(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      registrations: { include: { event: true }, orderBy: { registeredAt: "desc" } },
      pointTransactions: { orderBy: { createdAt: "desc" }, take: 100 },
      redemptions: { include: { reward: true }, orderBy: { requestedAt: "desc" } }
    }
  });
  if (!user || user.role !== Role.USER) throw new ApiError(404, "User not found");
  const { passwordHash, ...safe } = user;
  res.json({ success: true, data: safe });
}

export async function updateStudentStatus(req: Request, res: Response) {
  const input = z.object({ status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]) }).parse(req.body);
  const id = Number(req.params.id);
  const expectedRole = req.baseUrl.includes("organizers") ? Role.ORGANIZER : Role.USER;
  const current = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!current || current.role !== expectedRole) throw new ApiError(404, expectedRole === Role.ORGANIZER ? "Organizer not found" : "User not found");
  const user = await prisma.user.update({ where: { id }, data: { status: input.status } });
  res.json({ success: true, data: { id: user.id, status: user.status } });
}

export async function adjustPoints(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!target || target.role !== Role.USER) throw new ApiError(404, "User not found");
  const input = z
    .object({
      type: z.enum(["CREDIT", "DEBIT"]),
      points: z.coerce.number().int().positive(),
      description: z.string().min(3).max(255)
    })
    .parse(req.body);

  const transaction = await prisma.$transaction(async (tx) =>
    applyPoints({
      tx,
      userId,
      points: input.points,
      type: input.type as PointType,
      sourceType: PointSourceType.ADMIN_ADJUSTMENT,
      sourceRef: `admin:${req.user!.id}:${Date.now()}`,
      description: input.description,
      createdById: req.user!.id
    })
  );

  res.json({ success: true, data: transaction });
}


export async function adminListOrganizers(req: Request, res: Response) {
  const search = String(req.query.search || "").trim();
  const items = await prisma.user.findMany({
    where: {
      role: Role.ORGANIZER,
      ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      status: true,
      createdAt: true,
      _count: { select: { createdEvents: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: items });
}

export async function adminGetOrganizer(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      createdEvents: {
        include: { category: true, _count: { select: { registrations: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!user || user.role !== Role.ORGANIZER) throw new ApiError(404, "Organizer not found");
  const { passwordHash, ...safe } = user;
  res.json({ success: true, data: safe });
}


const adminAccountUpdateSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).nullable().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  college: z.string().max(150).nullable().optional(),
  course: z.string().max(100).nullable().optional(),
  yearOfStudy: z.coerce.number().int().min(1).max(10).nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional()
});

export async function adminUpdateAccount(req: Request, res: Response) {
  const id = Number(req.params.id);
  const expectedRole = req.baseUrl.includes("organizers") ? Role.ORGANIZER : Role.USER;
  const current = await prisma.user.findUnique({ where: { id } });
  if (!current || current.role !== expectedRole) throw new ApiError(404, expectedRole === Role.ORGANIZER ? "Organizer not found" : "User not found");
  const input = adminAccountUpdateSchema.parse(req.body);
  if (input.email) {
    const email = input.email.toLowerCase();
    const existing = await prisma.user.findFirst({ where: { email, id: { not: id } } });
    if (existing) throw new ApiError(409, "Email is already registered");
    input.email = email;
  }
  const { dateOfBirth, ...accountData } = input;
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...accountData,
      ...(dateOfBirth !== undefined
        ? { dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00.000Z`) : null }
        : {})
    },
    select: profileSelect
  });
  res.json({ success: true, message: "Account updated successfully.", data: user });
}

export async function adminDeleteAccount(req: Request, res: Response) {
  const id = Number(req.params.id);
  const expectedRole = req.baseUrl.includes("organizers") ? Role.ORGANIZER : Role.USER;
  const current = await prisma.user.findUnique({ where: { id } });
  if (!current || current.role !== expectedRole) throw new ApiError(404, expectedRole === Role.ORGANIZER ? "Organizer not found" : "User not found");

  await prisma.$transaction(async (tx) => {
    // User-owned activity.
    await tx.eventRegistration.deleteMany({ where: { userId: id } });
    await tx.bookBorrow.deleteMany({ where: { userId: id } });
    await tx.rewardRedemption.deleteMany({ where: { userId: id } });
    await tx.pointTransaction.deleteMany({ where: { userId: id } });
    await tx.notification.deleteMany({ where: { userId: id } });
    await tx.refreshToken.deleteMany({ where: { userId: id } });
    await tx.passwordResetToken.deleteMany({ where: { userId: id } });

    if (expectedRole === Role.ORGANIZER) {
      const eventIds = (await tx.event.findMany({ where: { createdById: id }, select: { id: true } })).map(x => x.id);
      if (eventIds.length) await tx.eventRegistration.deleteMany({ where: { eventId: { in: eventIds } } });
      await tx.event.deleteMany({ where: { createdById: id } });
      const bookIds = (await tx.book.findMany({ where: { createdById: id }, select: { id: true } })).map(x => x.id);
      if (bookIds.length) await tx.bookBorrow.deleteMany({ where: { bookId: { in: bookIds } } });
      await tx.book.deleteMany({ where: { createdById: id } });
    }

    await tx.user.delete({ where: { id } });
  });

  await deleteLocalProfileAvatar(current.avatarUrl);
  res.json({ success: true, message: "Account deleted successfully." });
}
