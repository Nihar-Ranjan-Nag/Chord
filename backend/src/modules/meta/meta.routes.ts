import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { meta } from "./meta.controller";

export const metaRouter = Router();
metaRouter.get("/", asyncHandler(meta));
