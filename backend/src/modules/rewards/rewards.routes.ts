import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adminListRedemptions,
  adminListRewards,
  createReward,
  listRewards,
  myRedemptions,
  redeemReward,
  updateRedemptionStatus,
  updateReward
} from "./rewards.controller";

export const rewardRouter = Router();
rewardRouter.get("/", asyncHandler(listRewards));
rewardRouter.get("/mine", authenticate, authorize(Role.USER), asyncHandler(myRedemptions));
rewardRouter.post("/:id/redeem", authenticate, authorize(Role.USER), asyncHandler(redeemReward));

export const adminRewardRouter = Router();
adminRewardRouter.use(authenticate, authorize(Role.ADMIN));
adminRewardRouter.get("/", asyncHandler(adminListRewards));
adminRewardRouter.post("/", asyncHandler(createReward));
adminRewardRouter.put("/:id", asyncHandler(updateReward));

export const adminRedemptionRouter = Router();
adminRedemptionRouter.use(authenticate, authorize(Role.ADMIN));
adminRedemptionRouter.get("/", asyncHandler(adminListRedemptions));
adminRedemptionRouter.patch("/:id/status", asyncHandler(updateRedemptionStatus));
