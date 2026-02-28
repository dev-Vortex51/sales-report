interface StatusBadgeProps {
  status: "COMPLETED" | "VOID" | "REFUNDED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isCompleted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}
