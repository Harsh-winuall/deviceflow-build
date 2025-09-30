"use client";

import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";
import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  assignLicensesToDevice,
  fetchAllSoftware,
  removeDuplicateLicense,
  Software,
} from "@/server/deviceActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const AssignSoftwareDialog = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const queryClient = useQueryClient();
  const [conflictDialog, setConflictDialog] = useState(false);

  const mutation = useMutation({
    mutationFn: (licenseId: string) => assignLicensesToDevice(licenseId, id),
    onSuccess: (data) => {
      if (data?.error) {
        setConflictDialog(true);
        return;
      }
      toast.success("Software assigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["device-timeline"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
      setOpen(false);
      setSelectedSoftware("");
    },
    onError: () => {
      toast.error("Failed to assign software");
    },
  });

  const handleAssign = () => {
    if (!selectedSoftware) {
      toast.error("Please select a software");
      return;
    }
    mutation.mutate(selectedSoftware); // pass valuem
    // mutation?.data?.conflict?.integrationId
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
    },
    onError: () => {
      toast.error("Failed to remove");
    },
  });

  const handleRemoveDuplicationSubmit = () => {
    removeDuplicateMutation.mutate({
      userId: mutation?.data?.conflict?.userId,
      integrationId: mutation?.data?.conflict?.integrationId,
    });
    setConflictDialog(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col ">
        <DialogTitle>Assign Software</DialogTitle>
        <label className="font-gilroyMedium pt-4 text-[13px]">
          Choose Software
        </label>

        <AsyncSelect<Software>
          queryKey="software-list"
          fetcher={fetchAllSoftware}
          preload
          renderOption={(software) => (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="font-gilroyMedium">{software?.licenseName}</div>
                <div className="text-xs font-gilroyRegular text-muted-foreground">
                  {software?.licenseKey}
                </div>
              </div>
            </div>
          )}
          filterFn={(software, query) =>
            software?.licenseKey
              ?.toLowerCase()
              ?.includes(query?.toLowerCase()) ||
            software?.licenseName?.toLowerCase()?.includes(query?.toLowerCase())
          }
          getOptionValue={(software) => software?._id}
          getDisplayValue={(software) => (
            <div className="flex items-center gap-2 text-left w-full">
              <div className="flex flex-col leading-tight">
                <div className="font-gilroyMedium">{software?.licenseName}</div>
              </div>
            </div>
          )}
          notFound={
            <div className="py-6 text-center font-gilroyMedium text-sm">
              All software are assigned
            </div>
          }
          label="Choose"
          placeholder="Choose"
          value={selectedSoftware}
          onChange={(selected) => {
            setSelectedSoftware(selected._id);
          }}
          className="text-[13px]"
          triggerClassName="text-[13px]"
          width="100%"
        />
        {conflictDialog && (
          <ConfirmationModal
            skipBtnText="Discard"
            functionToBeExecuted={handleRemoveDuplicationSubmit}
            type="warning"
            open={conflictDialog}
            setOpen={setConflictDialog}
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

        <DialogFooter className="pt-3">
          <div className="flex gap-2 w-full  ">
            <Button
              variant="outlineTwo"
              className="w-full rounded-[5px]"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <LoadingButton
              variant="primary"
              className="w-full rounded-[5px]"
              type="button"
              onClick={handleAssign}
              loading={mutation.isPending}
            >
              Submit
            </LoadingButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
