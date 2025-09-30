import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../buttons/Button";
import WarningIcon from "@/icons/WarningIcon";

function ConfirmRole({
  onConfirm,
  open,
  setOpen,
}: {
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-50  text-yellow-400">
            <WarningIcon />
            {/* Lucide-react icon */}
          </div>
        </div>
        <DialogHeader>
          {/* Title */}
          <DialogTitle className="text-lg text-center font-gilroySemiBold text-gray-900">
            Are you sure ?
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 w-full">
          <DialogClose asChild>
            <Button className="w-1/2" variant="outlineTwo">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-1/2" onClick={onConfirm} variant="primary">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmRole;
