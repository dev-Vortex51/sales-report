import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessSettings } from "../api/settings.api";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";
import { toast } from "@core/components/Toast";
import type { BusinessSettings } from "../types/settings.types";

interface Props {
  settings: BusinessSettings;
}

export function BusinessSettingsForm({ settings }: Props) {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BusinessSettings>({ defaultValues: settings });

  const mutation = useMutation({
    mutationFn: updateBusinessSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businessSettings"] });
      toast("success", "Settings saved.");
    },
    onError: () => toast("error", "Failed to save settings."),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-4 rounded-lg border border-border bg-secondary p-6"
    >
      <h2 className="text-base font-semibold">Business Details</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Business Name"
          {...register("business_name", { required: "Required" })}
          error={errors.business_name?.message}
        />
        <Input label="Phone" {...register("phone")} />
        <Input
          label="Email"
          type="email"
          {...register("email", {
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          })}
          error={errors.email?.message}
        />
        <Input label="Currency" {...register("currency")} />
        <Input
          label="Default Tax Rate (%)"
          type="number"
          step="0.5"
          {...register("tax_rate", { valueAsNumber: true, min: 0, max: 100 })}
          error={errors.tax_rate?.message}
        />
      </div>

      <Input label="Address" {...register("address")} />
      <Input
        label="Receipt Footer"
        {...register("receipt_footer")}
        helperText="Shown at the bottom of every receipt."
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty}
          loading={mutation.isPending}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
