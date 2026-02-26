import { describe, expect, it } from "vitest";
import { loginSchema } from "../../src/modules/auth/auth.schemas.js";

describe("login schema", () => {
  it("rejects unknown fields", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "owner@example.com",
        password: "password123",
        injected: true,
      },
      params: {},
      query: {},
    });

    expect(result.success).toBe(false);
  });
});
