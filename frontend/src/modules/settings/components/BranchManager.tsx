import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listBranches, createBranch, updateBranch } from "../api/settings.api";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";
import { Badge } from "@core/components/Badge";
import { toast } from "@core/components/Toast";

export function BranchManager() {
  const qc = useQueryClient();
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: listBranches,
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const addMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast("success", "Branch created.");
      setName("");
      setAddress("");
    },
    onError: () => toast("error", "Failed to create branch."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateBranch(id, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches"] }),
  });

  function handleAdd() {
    if (!name.trim()) return;
    addMutation.mutate({ name: name.trim(), address: address.trim() });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary p-6">
      <h2 className="text-base font-semibold">Branches</h2>

      {isLoading ? (
        <p className="text-sm text-secondary">Loading…</p>
      ) : branches.length === 0 ? (
        <p className="text-sm text-tertiary">No branches configured.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {branches.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-md border border-border px-4 py-3"
            >
              <div>
                <span className="text-sm font-medium">{b.name}</span>
                {b.address && (
                  <span className="ml-2 text-xs text-secondary">
                    — {b.address}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={b.is_active ? "success" : "neutral"}>
                  {b.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button
                  variant="ghost"
                  onClick={() =>
                    toggleMutation.mutate({ id: b.id, is_active: !b.is_active })
                  }
                >
                  {b.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add branch inline form */}
      <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <Input
          label="Branch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={handleAdd}
          loading={addMutation.isPending}
        >
          + Add Branch
        </Button>
      </div>
    </div>
  );
}
