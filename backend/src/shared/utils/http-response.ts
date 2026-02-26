import type { Response } from "express";

export function sendData<T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: Record<string, unknown>,
) {
  if (meta) {
    return res.status(statusCode).json({ data, meta });
  }

  return res.status(statusCode).json({ data });
}
