import { z } from "zod";

const saleItemSchema = z
  .object({
    item_id: z.string().uuid().optional(),
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
    tax_rate: z.number().min(0),
  })
  .strict();

export const createSaleSchema = z.object({
  body: z
    .object({
      branch_id: z.string().uuid().optional(),
      items: z.array(saleItemSchema).min(1),
      customer_name: z.string().optional(),
      customer_email: z.string().email().optional(),
      currency: z.string().length(3).optional(),
    })
    .strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

export const saleIdParamsSchema = z.object({
  body: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid(),
    })
    .strict(),
  query: z.object({}).strict(),
});

export const listSalesSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({}).strict(),
  query: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
      status: z.enum(["COMPLETED", "REFUNDED", "VOID"]).optional(),
      page: z.coerce.number().int().positive().default(1),
      page_size: z.coerce.number().int().positive().max(100).default(20),
    })
    .strict(),
});
