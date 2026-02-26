import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import {
  createSaleController,
  getReceiptController,
  getSaleByIdController,
  listSalesController,
} from "./sales.controller.js";
import {
  createSaleSchema,
  listSalesSchema,
  saleIdParamsSchema,
} from "./sales.schemas.js";

export const salesRouter = Router();

salesRouter.use(authMiddleware);

salesRouter.post(
  "/",
  validate(createSaleSchema),
  asyncHandler(createSaleController),
);
salesRouter.get(
  "/",
  validate(listSalesSchema),
  asyncHandler(listSalesController),
);
salesRouter.get(
  "/:id",
  validate(saleIdParamsSchema),
  asyncHandler(getSaleByIdController),
);
salesRouter.get(
  "/:id/receipt",
  validate(saleIdParamsSchema),
  asyncHandler(getReceiptController),
);
