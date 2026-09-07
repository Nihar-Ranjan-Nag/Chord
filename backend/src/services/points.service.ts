import { PointSourceType, PointType, Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";

type Tx = Prisma.TransactionClient;

type ApplyPointsInput = {
  tx: Tx;
  userId: number;
  points: number;
  type: PointType;
  sourceType: PointSourceType;
  sourceRef?: string;
  description: string;
  createdById?: number;
  uniqueSource?: boolean;
};

export async function applyPoints(input: ApplyPointsInput) {
  const {
    tx,
    userId,
    points,
    type,
    sourceType,
    sourceRef,
    description,
    createdById,
    uniqueSource = false
  } = input;

  if (points <= 0) throw new ApiError(400, "Points must be greater than zero");

  if (uniqueSource && sourceRef) {
    const existing = await tx.pointTransaction.findFirst({
      where: { userId, sourceType, sourceRef }
    });
    if (existing) return existing;
  }

  const user = await tx.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const delta = type === PointType.CREDIT ? points : -points;
  const nextBalance = user.pointsBalance + delta;

  if (nextBalance < 0) {
    throw new ApiError(400, "Insufficient points balance");
  }

  await tx.user.update({
    where: { id: userId },
    data: { pointsBalance: nextBalance }
  });

  return tx.pointTransaction.create({
    data: {
      userId,
      type,
      points,
      sourceType,
      sourceRef,
      description,
      balanceAfter: nextBalance,
      createdById
    }
  });
}
