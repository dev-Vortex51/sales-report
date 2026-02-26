import { useAppSelector } from "@core/hooks/use-store";

/**
 * Returns the current authenticated user and token.
 * Components should use this hook instead of reading the store directly.
 */
export function useAuth() {
  const { user, token } = useAppSelector((s) => s.auth);
  return {
    user,
    token,
    isAuthenticated: !!token,
  };
}
