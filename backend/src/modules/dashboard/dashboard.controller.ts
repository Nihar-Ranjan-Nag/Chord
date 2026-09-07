import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";

export async function studentDashboard(req: Request, res: Response) {
  const userId = req.user!.id;
  const [user, eventsJoined, eventsCompleted, rewardsRedeemed, activeBorrows, returnedBooks, upcomingEvents, recentPoints] = await prisma.$transaction([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, pointsBalance: true } }),
    prisma.eventRegistration.count({ where: { userId } }),
    prisma.eventRegistration.count({ where: { userId, status: "COMPLETED" } }),
    prisma.rewardRedemption.count({ where: { userId } }),
    prisma.bookBorrow.count({ where: { userId, status: { in: ["BORROWED", "RETURN_REQUESTED"] } } }),
    prisma.bookBorrow.count({ where: { userId, status: "RETURNED" } }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { gte: new Date() } },
      include: { category: true, _count: { select: { registrations: true } } },
      orderBy: { startAt: "asc" },
      take: 4
    }),
    prisma.pointTransaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  res.json({
    success: true,
    data: {
      user,
      stats: { eventsJoined, eventsCompleted, rewardsRedeemed, activeBorrows, returnedBooks, pointsBalance: user?.pointsBalance ?? 0 },
      upcomingEvents,
      recentPoints
    }
  });
}

export async function organizerDashboard(req: Request, res: Response) {
  const createdById = req.user!.id;
  const now = new Date();
  const [totalEvents, publishedEvents, upcomingEvents, totalRegistrations, completedUsers, totalBooks, activeBorrows, returnRequests, recentEvents] = await prisma.$transaction([
    prisma.event.count({ where: { createdById } }),
    prisma.event.count({ where: { createdById, status: "PUBLISHED" } }),
    prisma.event.count({ where: { createdById, status: "PUBLISHED", startAt: { gte: now } } }),
    prisma.eventRegistration.count({ where: { event: { createdById } } }),
    prisma.eventRegistration.count({ where: { status: "COMPLETED", event: { createdById } } }),
    prisma.book.count({ where: { createdById } }),
    prisma.bookBorrow.count({ where: { status: "BORROWED", book: { createdById } } }),
    prisma.bookBorrow.count({ where: { status: "RETURN_REQUESTED", book: { createdById } } }),
    prisma.event.findMany({
      where: { createdById },
      include: { category: true, _count: { select: { registrations: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: { totalEvents, publishedEvents, upcomingEvents, totalRegistrations, completedUsers, totalBooks, activeBorrows, returnRequests },
      recentEvents
    }
  });
}

export async function adminDashboard(_req: Request, res: Response) {
  const now = new Date();
  const [
    totalUsers,
    activeUsers,
    totalOrganizers,
    activeOrganizers,
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRedemptions,
    deliveredRedemptions,
    totalBooks,
    activeBookBorrows,
    returnRequests,
    pointsAggregate
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.user.count({ where: { role: Role.USER, status: "ACTIVE" } }),
    prisma.user.count({ where: { role: Role.ORGANIZER } }),
    prisma.user.count({ where: { role: Role.ORGANIZER, status: "ACTIVE" } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: "PUBLISHED", startAt: { gte: now } } }),
    prisma.eventRegistration.count(),
    prisma.rewardRedemption.count({ where: { status: "PENDING" } }),
    prisma.rewardRedemption.count({ where: { status: "DELIVERED" } }),
    prisma.book.count(),
    prisma.bookBorrow.count({ where: { status: "BORROWED" } }),
    prisma.bookBorrow.count({ where: { status: "RETURN_REQUESTED" } }),
    prisma.pointTransaction.aggregate({ where: { type: "CREDIT" }, _sum: { points: true } })
  ]);

  const popularEvents = await prisma.event.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { registrations: { _count: "desc" } },
    take: 5
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        activeUsers,
        totalOrganizers,
        activeOrganizers,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        pendingRedemptions,
        deliveredRedemptions,
        totalBooks,
        activeBookBorrows,
        returnRequests,
        pointsDistributed: pointsAggregate._sum.points ?? 0
      },
      popularEvents
    }
  });
}
