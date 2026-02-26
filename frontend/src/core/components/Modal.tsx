import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** "sm" = 480px, "md" = 640px */
  size?: "sm" | "md";
}

/**
 * Design-system Modal.
 * Focus-trapped, closeable via Escape, overlay-dimmed.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "sm" ? "480px" : "640px";

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 flex h-full w-full items-center justify-center bg-transparent p-4 backdrop:bg-foreground/50"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // Close on overlay click
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div
        className="w-full overflow-y-auto rounded-xl bg-card p-6 shadow-xl"
        style={{ maxWidth: maxW, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </dialog>
  );
}
