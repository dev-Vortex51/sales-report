import type { NextFunction, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import type { AuthedRequest } from "../types/http.js";
import { verifyToken } from "../utils/token.js";

export function authMiddleware(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.header("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };

  const requestLog = (
    req as AuthedRequest & {
      log?: { child: (context: Record<string, unknown>) => unknown };
    }
  ).log;
  if (requestLog) {
    (req as AuthedRequest & { log?: unknown }).log = requestLog.child({
      userId: payload.sub,
      userRole: payload.role,
    });
  }

  next();
}
