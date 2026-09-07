import { z } from "zod";

export const eventBaseSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  organizer: z.string().max(150).optional(),
  location: z.string().max(255).optional(),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  registrationStartsAt: z.coerce.date().optional(),
  registrationEndsAt: z.coerce.date().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  participationPoints: z.coerce.number().int().min(0).default(0),
  attendancePoints: z.coerce.number().int().min(0).default(0),
  completionPoints: z.coerce.number().int().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  terms: z.string().optional()
});

export const createEventSchema = eventBaseSchema.refine((d) => d.endAt > d.startAt, {
  message: "Event end time must be after start time",
  path: ["endAt"]
});

export const updateEventSchema = eventBaseSchema.partial();
