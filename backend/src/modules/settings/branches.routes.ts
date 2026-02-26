import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { requireRole } from "../../shared/middlewares/role.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import {
  createBranchController,
  listBranchesController,
  updateBranchController,
} from "./branches.controller.js";
import { createBranchSchema, updateBranchSchema } from "./settings.schemas.js";

export const branchesRouter = Router();

branchesRouter.use(authMiddleware, requireRole(["OWNER", "ADMIN"]));

branchesRouter.get("/", asyncHandler(listBranchesController));
branchesRouter.post(
  "/",
  validate(createBranchSchema),
  asyncHandler(createBranchController),
);
branchesRouter.patch(
  "/:id",
  validate(updateBranchSchema),
  asyncHandler(updateBranchController),
);
