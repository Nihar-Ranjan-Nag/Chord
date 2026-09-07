import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  registerOrganizer,
  registerUser,
  resetPassword
} from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register/user", asyncHandler(registerUser));
authRouter.post("/register/organizer", asyncHandler(registerOrganizer));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password", asyncHandler(resetPassword));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", authenticate, asyncHandler(me));
