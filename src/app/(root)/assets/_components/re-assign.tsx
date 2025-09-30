"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import type React from "react";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  type Device,
  removeDuplicateLicense,
  updateDevice,
} from "@/server/deviceActions";
import type { User } from "@/server/userActions";
import { AsyncSelect } from "@/components/ui/async-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "../../workflows/[id]/_components/dropdowns/confirmation-popup";
import { buttonVariants } from "@/components/buttons/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type FormData = {
  device: Device | null;
  user: User | null;
};

type FormErrors = {
  device: string;
  user: string;
};

export default function ReAssign({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [conflictDialog, setConflictDialog] = useState(false);
  const [finalConfirm, setFinalConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    device: null,
    user: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    device: "",
    user: "",
  });
  const [pendingReassignment, setPendingReassignment] = useState<{
    deviceId: string;
    userId: string;
  } | null>(null);

  // Reset form when sheet opens/closes
  useEffect(() => {
    setFormErrors({ device: "", user: "" });
    setFormData({ device: null, user: null });
  }, [open]);

  // Mutation for reassigning device
  const reAssignMutation = useMutation({
    mutationFn: ({ deviceId, userId }: { deviceId: string; userId: string }) =>
      updateDevice(deviceId, { userId }),
    onSuccess: (data) => {
      if (data?.error) {
        setPendingReassignment({
          deviceId: formData.device!._id,
          userId: formData.user!._id,
        });
        setConflictDialog(true);
        return;
      }
      toast.success("Assigned asset to user!");
      setOpen(false);
      setPendingReassignment(null);
      queryClient.invalidateQueries({
        queryKey: ["fetch-devices"],
        exact: false,
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to assign to user!");
      setPendingReassignment(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    let hasError = false;
    const errors: FormErrors = { device: "", user: "" };
    if (!formData?.device?._id) {
      errors.device = "Device required";
      hasError = true;
    }
    if (!formData?.user?._id) {
      errors.user = "User required";
      hasError = true;
    }
    setFormErrors(errors);
    if (hasError) return;

    // Call mutation
    reAssignMutation.mutate({
      deviceId: formData.device!._id,
      userId: formData.user!._id,
    });
  };
  const removeDuplicateMutation = useMutation({
    mutationFn: ({
      userId,
      integrationId,
    }: {
      userId: string;
      integrationId: string;
    }) => removeDuplicateLicense(userId, integrationId),
    onSuccess: () => {
      toast.success("Software removed from user");
      if (pendingReassignment) {
        reAssignMutation.mutate(pendingReassignment);
      }
      setConflictDialog(false);
    },
    onError: () => {
      toast.error("Failed to remove");
      setPendingReassignment(null);
      setConflictDialog(false);
    },
  });

  const handleRemoveDuplicationSubmit = () => {
    removeDuplicateMutation.mutate({
      userId: reAssignMutation?.data?.conflict?.userId,
      integrationId: reAssignMutation?.data?.conflict?.integrationId,
    });
  };

  const handleAssign = () => {
    if (pendingReassignment) {
      reAssignMutation.mutate(pendingReassignment);
    }
    setFinalConfirm(false);
  };

  const handleConflictCancel = () => {
    setConflictDialog(false);
    setPendingReassignment(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="p-4 rounded-[10px]"
      >
        <div className="flex justify-center w-full h-full items-start">
          <div className="flex flex-col  w-full">
            <h1 className="font-gilroySemiBold w-full text-start text-xl">
              Reassign Asset
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 pt-3 h-full"
            >
              {/* Device Select */}
              <div className="flex flex-col gap-2 ">
                <AsyncSelect<Device>
                  fetcher={() =>
                    import("@/server/deviceActions").then((m) =>
                      m.fetchDevices()
                    )
                  }
                  queryKey="fetch-devices"
                  preload
                  renderOption={(device) => (
                    <div className="flex flex-col">
                      <span className="font-gilroyMedium">
                        {device?.custom_model}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {device?.device_name}
                      </span>
                    </div>
                  )}
                  filterFn={(device, query) =>
                    device?.custom_model
                      ?.toLowerCase()
                      .includes(query?.toLowerCase()) ||
                    device?.device_name
                      ?.toLowerCase()
                      .includes(query?.toLowerCase())
                  }
                  getOptionValue={(device) => device?._id || ""}
                  getDisplayValue={() => formData.device?.custom_model ?? ""}
                  label="Device"
                  placeholder="Assign Device"
                  value={formData.device?._id || ""}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, device: selected }))
                  }
                  width="100%"
                />
                {formErrors.device && (
                  <p className="text-destructive/80 text-xs">
                    {formErrors.device}
                  </p>
                )}
              </div>

              {/* User Select */}
              <div className="flex flex-col gap-2 ">
                <AsyncSelect<User>
                  fetcher={() =>
                    import("@/server/userActions").then((m) => m.fetchUsers())
                  }
                  queryKey="fetch-users"
                  preload
                  renderOption={(user) => (
                    <div className="flex flex-col">
                      <span className="font-gilroyMedium">
                        {user?.first_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  )}
                  filterFn={(user, query) =>
                    user?.first_name
                      ?.toLowerCase()
                      .includes(query?.toLowerCase()) ||
                    user?.email?.toLowerCase().includes(query?.toLowerCase())
                  }
                  getOptionValue={(user) => user?._id || ""}
                  getDisplayValue={() => formData.user?.first_name ?? ""}
                  label="User"
                  placeholder="Assigning To"
                  value={formData.user?._id || ""}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, user: selected }))
                  }
                  width="100%"
                />
                {formErrors.user && (
                  <p className="text-destructive/80 text-xs">
                    {formErrors.user}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2  w-full">
                <Button
                  variant="outlineTwo"
                  className="w-full"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <LoadingButton
                  variant="primary"
                  className="w-full"
                  type="submit"
                  disabled={reAssignMutation.isPending}
                  loading={reAssignMutation.isPending}
                >
                  Reassign
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>

        {conflictDialog && (
          <ConfirmationModal
            skipBtnText="Discard"
            functionToBeExecuted={handleRemoveDuplicationSubmit}
            type="warning"
            open={conflictDialog}
            setOpen={handleConflictCancel}
            title="Duplicate Software"
            description="The software is assigned to both the user and the asset. It will be removed from the user."
            successBtnText="Confirm"
          >
            <div
              className={buttonVariants({
                variant: "outlineTwo",
                className: "hidden",
              })}
            >
              Duplicate
            </div>
          </ConfirmationModal>
        )}

        {finalConfirm && (
          <ConfirmationModal
            skipBtnText="Discard"
            functionToBeExecuted={handleAssign}
            type="warning"
            open={finalConfirm}
            setOpen={setFinalConfirm}
            title="Are your sure?"
            description="This installed software will be assigned to the user as well."
            successBtnText="Confirm"
          >
            <div
              className={buttonVariants({
                variant: "outlineTwo",
                className: "hidden",
              })}
            >
              Final Confirm
            </div>
          </ConfirmationModal>
        )}
      </DialogContent>
    </Dialog>
  );
}
