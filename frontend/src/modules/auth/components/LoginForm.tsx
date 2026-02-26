import { useForm } from "react-hook-form";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="owner@business.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
        })}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
        })}
      />

      {error && (
        <p className="text-sm text-destructive-foreground" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Log In
      </Button>
    </form>
  );
}
