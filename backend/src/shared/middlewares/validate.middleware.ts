import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";
import { ApiError } from "../errors/api-error.js";

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          "VALIDATION_ERROR",
          parsed.error.flatten(),
        ),
      );
    }

    req.body = parsed.data.body;
    req.params = parsed.data.params;
    req.query = parsed.data.query;
    next();
  };
}
