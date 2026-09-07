import { Router } from "express";

import { Role } from "@prisma/client";

import {
  authenticate,
  authorize,
} from "../../middleware/auth.middleware";

import { asyncHandler } from "../../utils/asyncHandler";

import {
  adminListRedemptions,
  adminListRewards,
  createReward,
  listRewards,
  myRedemptions,
  redeemReward,
  updateRedemptionStatus,
  updateReward,
} from "./rewards.controller";

/* ============================================================
   PUBLIC / USER REWARD ROUTES
============================================================ */

export const rewardRouter =
  Router();

/*
 * Public reward listing
 */
rewardRouter.get(
  "/",
  asyncHandler(listRewards)
);

/*
 * Logged-in user's redemptions
 */
rewardRouter.get(
  "/mine",
  authenticate,
  authorize(Role.USER),
  asyncHandler(myRedemptions)
);

/*
 * Redeem a reward
 */
rewardRouter.post(
  "/:id/redeem",
  authenticate,
  authorize(Role.USER),
  asyncHandler(redeemReward)
);

/* ============================================================
   ADMIN REWARD ROUTES
============================================================ */

export const adminRewardRouter =
  Router();

adminRewardRouter.use(
  authenticate,
  authorize(Role.ADMIN)
);

/*
 * List all rewards
 */
adminRewardRouter.get(
  "/",
  asyncHandler(adminListRewards)
);

/*
 * Create reward
 */
adminRewardRouter.post(
  "/",
  asyncHandler(createReward)
);

/*
 * Update reward
 */
adminRewardRouter.put(
  "/:id",
  asyncHandler(updateReward)
);

/* ============================================================
   ADMIN REDEMPTION ROUTES
============================================================ */

export const adminRedemptionRouter =
  Router();

adminRedemptionRouter.use(
  authenticate,
  authorize(Role.ADMIN)
);

/*
 * List all redemption requests
 */
adminRedemptionRouter.get(
  "/",
  asyncHandler(
    adminListRedemptions
  )
);

/*
 * Approve / reject / deliver
 */
adminRedemptionRouter.patch(
  "/:id/status",
  asyncHandler(
    updateRedemptionStatus
  )
);