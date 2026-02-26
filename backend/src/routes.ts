import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { branchesRouter } from "./modules/settings/branches.routes.js";
import { reportsRouter } from "./modules/reports/reports.routes.js";
import { salesRouter } from "./modules/sales/sales.routes.js";
import { settingsRouter } from "./modules/settings/settings.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/sales", salesRouter);
router.use("/reports", reportsRouter);
router.use("/settings", settingsRouter);
router.use("/branches", branchesRouter);
