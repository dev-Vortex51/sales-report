import { z } from "zod";

export const weeklyQuerySchema = z.object({
  body: z.object({}).strict(),
  params: z.object({}).strict(),
  query: z
    .object({
      week_start: z.string().optional(),
      branch_id: z.string().uuid().optional(),
      date: z.string().optional(),
      format: z.enum(["pdf", "csv"]).optional(),
    })
    .strict(),
});

export const dailyPdfQuerySchema = z.object({
  body: z.object({}).strict(),
  params: z.object({}).strict(),
  query: z
    .object({
      date: z.string().optional(),
      branch_id: z.string().uuid().optional(),
    })
    .strict(),
});
