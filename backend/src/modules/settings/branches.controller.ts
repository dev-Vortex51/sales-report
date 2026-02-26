import type { Response } from "express";
import type { AuthedRequest } from "../../shared/types/http.js";
import { sendData } from "../../shared/utils/http-response.js";
import {
  createBranch,
  listBranches,
  updateBranch,
} from "./settings.service.js";

export async function listBranchesController(
  req: AuthedRequest,
  res: Response,
) {
  const data = await listBranches(req.user!);
  return sendData(res, 200, data);
}

export async function createBranchController(
  req: AuthedRequest,
  res: Response,
) {
  const data = await createBranch(req.body, req.user!);
  return sendData(res, 201, data);
}

export async function updateBranchController(
  req: AuthedRequest,
  res: Response,
) {
  const branchId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const data = await updateBranch(branchId, req.body, req.user!);
  return sendData(res, 200, data);
}
