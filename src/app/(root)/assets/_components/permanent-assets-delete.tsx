"use client";

import { Button, buttonVariants } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WarningDelete from "@/icons/WarningDelete";
import { updateDevice } from "@/server/deviceActions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const PermanentAssetsDelete = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
        {/* Warning Icon */}
        <div className="flex mb-1 justify-center ">
          <div>
            <WarningDelete />
          </div>
        </div>

        {/* Title */}
        <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
          Are you sure?
        </DialogTitle>

        {/* Description */}
        <DialogDescription className="-mt-4 mb-3 font-gilroyMedium text-sm text-gray-600">
          Are you sure you want to delete this? This can't be undone.
        </DialogDescription>

        {/* Footer Buttons */}
        <DialogFooter className="flex w-full items-center justify-between ">
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
            className={buttonVariants({
              variant: "outlineTwo",
              className:
                "w-full h-9 bg-[#D92D20] border-none rounded-md text-white",
            })}
            onClick={async () => {
              if (id) {
                try {
                  await updateDevice(id!, { orgId: null });
                  setOpen(false);
                  queryClient.invalidateQueries({
                    queryKey: ["fetch-assets"],
                    exact: false,
                    refetchType: "all",
                  });
                  // router.push("/assets?tab=inactive_assets");
                  // router.refresh();
                } catch (e: any) {}
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
