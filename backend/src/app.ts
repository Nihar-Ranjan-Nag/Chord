import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { notFound } from "./middleware/notFound.middleware";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(compression());

// Event, reward and book images are sent as base64 JSON. Images allow up to 4 MB,
// so JSON needs enough room for base64 overhead. Profile avatars use the same API origin.
app.use(express.json({ limit: "7mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Public uploaded files. Example:
// http://localhost:4000/uploads/profiles/profile.jpg
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    maxAge: env.NODE_ENV === "production" ? "7d" : 0,
    immutable: env.NODE_ENV === "production"
  })
);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Student Rewards API is running" });
});

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);
