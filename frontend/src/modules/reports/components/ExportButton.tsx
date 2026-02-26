import { Button } from "@core/components/Button";
import { downloadWeeklyReportPdf } from "../api/reports.api";

interface ExportButtonProps {
  weekStart: string;
  disabled?: boolean;
}

export function ExportButton({ weekStart, disabled }: ExportButtonProps) {
  if (disabled) {
    return (
      <Button variant="secondary" disabled>
        ⬇ Export PDF
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const blobUrl = await downloadWeeklyReportPdf(weekStart);
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      }}
    >
      ⬇ Export PDF
    </Button>
  );
}
