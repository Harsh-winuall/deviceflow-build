"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";

import { bulkAssignDevices } from "@/server/deviceActions";
import BulkAssign from "@/components/bulk-upload/bulk-assign";
import { useAlert } from "@/hooks/useAlert";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileEmpty02Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function BulkAssignAssets({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const { mutate: bulkAssignMutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("file", file);
      return await bulkAssignDevices(formData);
    },
    onSuccess: (response) => {
      const emails = response?.emails || [];
      const serials = response?.serials || [];

      if (emails?.length > 0 || serials?.length > 0) {
        showAlert({
          title: "Some Assets were Assigned!",
          description: `${
            emails?.length > 0 && serials?.length === 0
              ? "Some Users are not Available in Deviceflow!"
              : serials?.length > 0 && emails?.length === 0
              ? "Some Assets are not Available in Deviceflow!"
              : "Some Users and Assets are not Available in Deviceflow!"
          }`,
          isFailure: false,
          key: "emails-sent",
        });
        resetState();
        return;
      }
      if (response?.counts > 0) {
        toast.error(
          `${response?.counts} device(s) could not be assigned. Possible reason: software already assigned to the user.`
        );
      }
      if (response?.skippedSerialNumbers) {
        if (response?.skippedSerialNumbers?.length === 0) {
          showAlert({
            title: "WOHOOO!! 🎉",
            description: `Bulk Assigned successfully!`,
            isFailure: false,
            key: "bulk-assign-success",
          });
        } else {
          showAlert({
            title: "Few Devices Uploaded!",
            description: `Skipped Serial Numbers : ${response?.skippedSerialNumbers?.join(
              ", "
            )}`,
            isFailure: false,
            key: "bulk-assign-partial",
          });
        }
      } else {
        showAlert({
          title: "WOHOOO!! 🎉",
          description: `Bulk Assigned successfully!`,
          isFailure: false,
          key: "bulk-assign-fallback",
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
      });

      resetState();
    },
    onError: (error: any) => {
      console.error("bulk assign error", error);
      if (error?.message?.includes("E11000 duplicate key error")) {
        const match = error.message.match(
          /index: (\w+)_1 dup key: \{ (\w+): "(.*?)"/
        );
        if (match) {
          setCsvError(
            `Duplicate entry detected: ${match[2]} with value "${match[3]}" already exists.`
          );
        } else {
          toast.error(
            "A duplicate entry error occurred. Please check your data."
          );
        }
      } else {
        toast.error("Error occurred during bulk Assign!");
      }
    },
  });

  const handleUploadComplete = (file: File, data: any, isValid: boolean) => {
    setFile(file);
    setCsvData(data);
    setIsValid(isValid);
  };

  const resetState = () => {
    setFile(null);
    setCsvData(null);
    setIsValid(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) resetState();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col">
        <DialogTitle className="text-start pb-2">
          Bulk Assign Assets
        </DialogTitle>

        <BulkAssign
          type="Assign"
          sampleData={{
            serial_no: "XXXX1234",
            email: "sdfsds@gmail.com",
          }}
          closeBtn={() => setOpen(false)}
          requiredKeys={["email", "serial_no"]}
          onUploadComplete={handleUploadComplete}
        />

        {csvData && (
          <div className="relative w-full h-16 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group">
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="bg-blue-500 text-white p-2 rounded-full">
                <HugeiconsIcon icon={FileEmpty02Icon} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-center">
                  {file?.name.split("/").pop()?.substring(0, 30)}..
                </p>
                <p className="text-xs text-gray-500">CSV File</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="text-white size-4" />
            </button>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <DialogClose asChild>
            <Button
              type="button"
              className="w-1/2 text-[13px]"
              variant="outlineTwo"
            >
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton
            type="button"
            variant="primary"
            className="w-1/2 text-[13px]"
            onClick={() => bulkAssignMutate()}
            disabled={!isValid}
            loading={isPending}
          >
            Done
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default BulkAssignAssets;
