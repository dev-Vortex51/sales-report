import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { requireRole } from "../../shared/middlewares/role.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import {
  getSettingsController,
  updateSettingsController,
} from "./settings.controller.js";
import { updateSettingsSchema } from "./settings.schemas.js";

export const settingsRouter = Router();

settingsRouter.use(authMiddleware, requireRole(["OWNER", "ADMIN"]));

settingsRouter.get("/", asyncHandler(getSettingsController));
settingsRouter.patch(
  "/",
  validate(updateSettingsSchema),
  asyncHandler(updateSettingsController),
);
settingsRouter.put(
  "/",
  validate(updateSettingsSchema),
  asyncHandler(updateSettingsController),
);
