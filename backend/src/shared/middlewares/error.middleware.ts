import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestLog = (
    req as Request & { log?: { error: (...args: unknown[]) => void } }
  ).log;

  if (err instanceof ApiError) {
    requestLog?.error({ err, code: err.code }, "request failed");
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  if (err instanceof ZodError) {
    requestLog?.error({ err }, "validation failed");
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.flatten(),
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    requestLog?.error({ err }, "database operation failed");
    return res.status(400).json({
      error: {
        code: "DATABASE_ERROR",
        message: "Database operation failed",
        details: { prismaCode: err.code },
      },
    });
  }

  const fallback = err as {
    statusCode?: number;
    code?: string;
    message?: string;
    details?: unknown;
  };
  requestLog?.error({ err }, "unhandled request error");
  return res.status(fallback.statusCode ?? 500).json({
    error: {
      code: fallback.code ?? "INTERNAL_ERROR",
      message: fallback.message ?? "Internal server error",
      details: fallback.details,
    },
  });
}
