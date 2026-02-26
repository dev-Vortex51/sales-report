import { describe, expect, it } from "vitest";
import {
  addMoney,
  money,
  percent,
  toMoneyNumber,
} from "../../src/shared/utils/money.js";

describe("money utils", () => {
  it("computes decimal-safe totals", () => {
    const subtotal = addMoney(money(10.1), money(2.2));
    const tax = subtotal.mul(percent(10)).div(100);
    const total = addMoney(subtotal, tax);

    expect(toMoneyNumber(subtotal)).toBe(12.3);
    expect(toMoneyNumber(tax)).toBe(1.23);
    expect(toMoneyNumber(total)).toBe(13.53);
  });
});
