import type { Request, Response } from "express";
import { sendData } from "../../shared/utils/http-response.js";
import { login } from "./auth.service.js";

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);
  return sendData(res, 200, result);
}
