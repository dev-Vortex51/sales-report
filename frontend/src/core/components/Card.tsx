import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Design-system Card.
 * Groups related content. No nested cards.
 */
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
