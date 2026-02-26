import { z } from "zod";

export const updateSettingsSchema = z.object({
  body: z
    .object({
      business_name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      currency: z.string().length(3).optional(),
      tax_rate: z.number().min(0).optional(),
      receipt_footer: z.string().optional(),
    })
    .strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

export const createBranchSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      address: z.string(),
    })
    .strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

export const updateBranchSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      address: z.string().optional(),
      is_active: z.boolean().optional(),
    })
    .strict(),
  params: z
    .object({
      id: z.string().uuid(),
    })
    .strict(),
  query: z.object({}).strict(),
});
