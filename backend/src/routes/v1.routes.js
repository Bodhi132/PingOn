import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as meController from "../controllers/me.controller.js";

export const v1Router = Router();

v1Router.get("/me", asyncHandler(meController.getMe));
