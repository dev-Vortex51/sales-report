import type { NextFunction, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import type { AuthedRequest } from "../types/http.js";

export function requireRole(allowedRoles: string[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
}
