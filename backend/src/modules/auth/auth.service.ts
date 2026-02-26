import bcrypt from "bcrypt";
import { logger } from "../../config/logger.js";
import { ApiError } from "../../shared/errors/api-error.js";
import { maskEmail } from "../../shared/utils/mask.js";
import { signToken } from "../../shared/utils/token.js";
import { findUserByEmail } from "./auth.repository.js";

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.warn({ email: maskEmail(email) }, "login failed: user not found");
    throw new ApiError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    logger.warn({ email: maskEmail(email) }, "login failed: password mismatch");
    throw new ApiError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS");
  }

  logger.info(
    { userId: user.id, email: maskEmail(user.email) },
    "login succeeded",
  );

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
