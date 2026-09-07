import { z } from "zod";

const dateOfBirthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date <= new Date();
  }, "Please enter a valid date of birth");

export const userRegisterSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  dateOfBirth: dateOfBirthSchema,
  password: z.string().min(8).max(100),
  college: z.string().trim().max(150).optional()
});

export const organizerRegisterSchema = z.object({
  organizationName: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({ refreshToken: z.string().min(1) });
export const forgotPasswordSchema = z.object({ email: z.string().email() });
export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8).max(100)
});
