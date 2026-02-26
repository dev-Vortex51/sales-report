import { Prisma } from "@prisma/client";

const MONEY_SCALE = 2;

export function money(value: number | string | Prisma.Decimal): Prisma.Decimal {
  return new Prisma.Decimal(value).toDecimalPlaces(
    MONEY_SCALE,
    Prisma.Decimal.ROUND_HALF_UP,
  );
}

export function percent(
  value: number | string | Prisma.Decimal,
): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

export function addMoney(
  ...values: Array<number | string | Prisma.Decimal>
): Prisma.Decimal {
  const total = values.reduce<Prisma.Decimal>(
    (acc, value) => acc.plus(new Prisma.Decimal(value)),
    new Prisma.Decimal(0),
  );

  return total.toDecimalPlaces(MONEY_SCALE, Prisma.Decimal.ROUND_HALF_UP);
}

export function toMoneyNumber(value: number | string | Prisma.Decimal): number {
  return Number(money(value).toFixed(MONEY_SCALE));
}
