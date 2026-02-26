import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@core/hooks";
import { setCredentials } from "../state/auth.slice";
import { loginApi } from "../api/auth.api";
import { LoginForm } from "../components/LoginForm";
import { toast } from "@core/components/Toast";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleLogin(values: { email: string; password: string }) {
    setLoading(true);
    setError(undefined);
    try {
      const data = await loginApi(values);
      dispatch(setCredentials(data));
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response
        ?.status;
      if (status === 401) {
        setError("Invalid email or password.");
        toast("error", "Invalid email or password.");
      } else {
        setError("Connection failed. Please try again.");
        toast("error", "Connection failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Sales Manager</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
