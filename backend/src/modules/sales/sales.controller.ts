import type { Response } from "express";
import type { AuthedRequest } from "../../shared/types/http.js";
import { sendData } from "../../shared/utils/http-response.js";
import {
  createSale,
  getReceiptPayload,
  getSaleById,
  listSales,
} from "./sales.service.js";

export async function createSaleController(req: AuthedRequest, res: Response) {
  const result = await createSale(req.body, req.user!);
  return sendData(res, 201, result);
}

export async function getSaleByIdController(req: AuthedRequest, res: Response) {
  const saleId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const sale = await getSaleById(saleId);
  return sendData(res, 200, sale);
}

export async function listSalesController(req: AuthedRequest, res: Response) {
  const result = await listSales({
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined,
    status: req.query.status as "COMPLETED" | "REFUNDED" | "VOID" | undefined,
    page: Number(req.query.page ?? 1),
    page_size: Number(req.query.page_size ?? 20),
  });

  return sendData(res, 200, result.data, result.meta);
}

export async function getReceiptController(req: AuthedRequest, res: Response) {
  const saleId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const payload = await getReceiptPayload(saleId);
  res.setHeader("Content-Type", "application/pdf");
  res.status(200).send(payload);
}
