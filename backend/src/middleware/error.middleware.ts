import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      details: err.flatten()
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists."
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
