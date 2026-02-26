import { describe, expect, it } from "vitest";
import { createSaleSchema } from "../../src/modules/sales/sales.schemas.js";

describe("create sale schema", () => {
  it("enforces strict payload shape", () => {
    const result = createSaleSchema.safeParse({
      body: {
        items: [
          {
            description: "Item",
            quantity: 1,
            unit_price: 12,
            tax_rate: 5,
            extra: "not-allowed",
          },
        ],
      },
      params: {},
      query: {},
    });

    expect(result.success).toBe(false);
  });
});
