import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";

type TokenPayload = {
  sub: number;
  email: string;
  role: Role;
};

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as TokenPayload;

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
