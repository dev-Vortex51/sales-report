import { useQuery } from "@tanstack/react-query";
import { getBusinessSettings } from "../api/settings.api";
import { BusinessSettingsForm } from "../components/BusinessSettingsForm";
import { BranchManager } from "../components/BranchManager";

export function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["businessSettings"],
    queryFn: getBusinessSettings,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-primary">Settings</h1>

      {isLoading || !settings ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-border bg-tertiary"
            />
          ))}
        </div>
      ) : (
        <BusinessSettingsForm settings={settings} />
      )}

      <BranchManager />
    </div>
  );
}
