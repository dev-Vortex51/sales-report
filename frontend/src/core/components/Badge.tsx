type BadgeVariant = "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" /* TODO: No token match for --status-success */,
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400" /* TODO: No token match for --status-warning */,
  error: "bg-destructive/10 text-destructive-foreground",
  neutral: "bg-muted text-muted-foreground",
};

/**
 * Design-system Badge.
 * Read-only status indicator. Never interactive.
 */
export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
