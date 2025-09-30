"use client";

import { Button } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WarningDelete from "@/icons/WarningDelete";

export const DeleteModal = ({
  handleBulkAction,
  children,
  open,
  setOpen,
  type,
}: {
  handleBulkAction: () => void;
  children: React.ReactNode;
  open: boolean;
  setOpen: (text: boolean) => void;
  type: string;
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            Are you sure you want to {type.toLowerCase()} this?
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full items-center justify-between ">
            <Button
              className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2 rounded-md bg-[#D92D20] text-white"
              onClick={handleBulkAction}
            >
              {type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
