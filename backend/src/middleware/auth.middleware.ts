import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/tokens";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(header.substring(7));
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You are not allowed to perform this action"));
    }
    next();
  };
