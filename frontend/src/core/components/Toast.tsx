import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  variant: ToastVariant;
  message: string;
}

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/* TODO: No token match for --status-success, --status-warning, --status-info. Using standard Tailwind colors. */
const accentColors: Record<ToastVariant, string> = {
  success: "#10b981",
  error: "oklch(0.577 0.245 27.325)",
  warning: "#f59e0b",
  info: "#3b82f6",
};

// ── Simple pub/sub for toasts ──
type Listener = (toasts: ToastMessage[]) => void;
let toasts: ToastMessage[] = [];
const listeners = new Set<Listener>();
function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function toast(variant: ToastVariant, message: string) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, variant, message }];
  notify();

  // Auto-dismiss (errors stay until manually closed)
  if (variant !== "error") {
    setTimeout(() => dismissToast(id), 4000);
  }
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

/**
 * Toast container — renders at the top-right (desktop) / top-center (mobile).
 * Mount once in AppLayout or at root level.
 */
export function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {items.map((t) => {
        const Icon = icons[t.variant];
        return (
          <div
            key={t.id}
            role={t.variant === "error" ? "alert" : "status"}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: accentColors[t.variant],
            }}
          >
            <Icon
              size={18}
              style={{
                color: accentColors[t.variant],
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <p className="flex-1 text-sm text-foreground">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
