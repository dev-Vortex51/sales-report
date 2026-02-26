import type { Response } from "express";
import type { AuthedRequest } from "../../shared/types/http.js";
import { sendData } from "../../shared/utils/http-response.js";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "./settings.service.js";

export async function getSettingsController(req: AuthedRequest, res: Response) {
  const data = await getBusinessSettings(req.user!);
  return sendData(res, 200, data);
}

export async function updateSettingsController(
  req: AuthedRequest,
  res: Response,
) {
  const data = await updateBusinessSettings(req.body, req.user!);
  return sendData(res, 200, data);
}
