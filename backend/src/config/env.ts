import "dotenv/config";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().url(),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce.number().int().min(5).max(1440).default(30),
  SMTP_HOST: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.preprocess(
    emptyToUndefined,
    z.enum(["true", "false"]).transform((value) => value === "true").optional()
  ),
  SMTP_USER: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PASS: z.preprocess(emptyToUndefined, z.string().optional()),
  MAIL_FROM: z.string().default("CampusSpark <no-reply@campusspark.local>")
});

export const env = envSchema.parse(process.env);
