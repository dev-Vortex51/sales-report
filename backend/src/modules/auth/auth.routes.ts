import { Router } from "express";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { loginController } from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), asyncHandler(loginController));
