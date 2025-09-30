"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/buttons/Button";
import { deleteDevice } from "@/server/deviceActions";
import { useAlert } from "@/hooks/useAlert";
import WarningDelete from "@/icons/WarningDelete";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const SoftDeleteAsset = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteDevice(id);
        setOpen(false);
        // router.push("/assets?tab=un_assigned_assets");
        // router.refresh();
        toast.success("Asset deleted Successfully!");
        queryClient.invalidateQueries({
          queryKey: ["fetch-assets"],
          exact: false,
          refetchType: "all",
        });
      } catch (e: any) {
        showAlert({
          title: "Failed to delete the asset.",
          description:
            "This asset is assigned to a user. Please unassign the asset before deleting.",
          isFailure: true,
          key: "delete-asset",
        });
        setOpen(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center  mb-1">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            Are you sure you want to delete this?
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full mt-1 items-center justify-between ">
            <button
              className={buttonVariants({
                variant: "outlineTwo",
                className: "w-full",
              })}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <Button
              variant="outlineTwo"
              className={"w-full bg-[#D92D20] h-9 text-white border-none"}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
