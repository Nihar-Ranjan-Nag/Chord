import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../utils/apiError";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../utils/tokens";
import { forgotPasswordSchema, loginSchema, organizerRegisterSchema, refreshSchema, resetPasswordSchema, userRegisterSchema } from "./auth.validation";
import { sendPasswordResetEmail } from "../../services/mail.service";

function safeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function registerUser(req: Request, res: Response) {
  const input = userRegisterSchema.parse(req.body);
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email is already registered");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash,
      role: "USER",
      dateOfBirth: new Date(`${input.dateOfBirth}T00:00:00.000Z`),
      college: input.college || undefined
    }
  });

  res.status(201).json({
    success: true,
    message: "User registration successful",
    data: safeUser(user)
  });
}

export async function registerOrganizer(req: Request, res: Response) {
  const input = organizerRegisterSchema.parse(req.body);
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email is already registered");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const organizer = await prisma.user.create({
    data: {
      name: input.organizationName,
      email,
      passwordHash,
      role: "ORGANIZER"
    }
  });

  res.status(201).json({
    success: true,
    message: "Organizer registration successful",
    data: safeUser(organizer)
  });
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.status !== "ACTIVE") throw new ApiError(403, "Account is not active");

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date((decoded.exp ?? 0) * 1000)
    }
  });

  res.json({
    success: true,
    data: {
      user: safeUser(user),
      accessToken,
      refreshToken
    }
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) }
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token is no longer valid");
  }

  const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
  if (!user || user.status !== "ACTIVE") throw new ApiError(401, "User is unavailable");

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ success: true, data: { accessToken } });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);

  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() }
  });

  res.json({ success: true, message: "Logged out successfully" });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: safeUser(user) });
}


export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotPasswordSchema.parse(req.body);
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  // Always return the same public response to avoid revealing registered emails.
  if (user && user.status === "ACTIVE") {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + env.PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000
    );

    await prisma.$transaction(async (tx) => {
      // Invalidate any previous unused reset links for this user.
      await tx.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() }
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt
        }
      });
    });

    const resetUrl = `${env.FRONTEND_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresMinutes: env.PASSWORD_RESET_EXPIRES_MINUTES
    });
  }

  res.json({
    success: true,
    message: "If an account exists for that email, a password reset link has been sent."
  });
}

export async function resetPassword(req: Request, res: Response) {
  const input = resetPasswordSchema.parse(req.body);
  const tokenHash = hashToken(input.token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date() ||
    resetToken.user.status !== "ACTIVE"
  ) {
    throw new ApiError(400, "This password reset link is invalid or has expired");
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    });

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: now }
    });

    // Invalidate any other outstanding reset links.
    await tx.passwordResetToken.updateMany({
      where: {
        userId: resetToken.userId,
        usedAt: null,
        id: { not: resetToken.id }
      },
      data: { usedAt: now }
    });

    // Force all existing sessions to log in again after a password change.
    await tx.refreshToken.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: now }
    });
  });

  res.json({
    success: true,
    message: "Password reset successfully. You can now sign in with your new password."
  });
}
