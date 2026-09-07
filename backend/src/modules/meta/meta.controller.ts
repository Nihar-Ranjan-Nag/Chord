import { Response } from "express";
import { prisma } from "../../config/prisma";

export async function meta(_req: any, res: Response) {
  const [eventCategories, rewardCategories] = await prisma.$transaction([
    prisma.eventCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.rewardCategory.findMany({ orderBy: { name: "asc" } })
  ]);

  res.json({
    success: true,
    data: { eventCategories, rewardCategories }
  });
}
