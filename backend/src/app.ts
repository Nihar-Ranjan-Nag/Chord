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

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // e.g. browser URL, Postman, curl, health checks
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================================
   SECURITY
========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(compression());

/* =========================================================
   BODY PARSING
========================================================= */

app.use(
  express.json({
    limit: "7mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/* =========================================================
   LOGGING
========================================================= */

app.use(
  morgan(
    env.NODE_ENV === "production"
      ? "combined"
      : "dev"
  )
);

/* =========================================================
   STATIC UPLOADS
========================================================= */

app.use(
  "/uploads",
  express.static(
    path.resolve(process.cwd(), "uploads"),
    {
      maxAge:
        env.NODE_ENV === "production"
          ? "7d"
          : 0,

      immutable:
        env.NODE_ENV === "production",
    }
  )
);

/* =========================================================
   RATE LIMIT
========================================================= */

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

/* =========================================================
   HEALTH
========================================================= */

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "CHORD API is running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Student Rewards API is running",
  });
});

/* =========================================================
   API
========================================================= */

app.use("/api/v1", apiRouter);

/* =========================================================
   ERROR HANDLERS
========================================================= */

app.use(notFound);
app.use(errorHandler);