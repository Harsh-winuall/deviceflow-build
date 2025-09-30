"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "./icons";
import { Button } from "./buttons/Button";
import WarningDelete from "@/icons/WarningDelete";
import AlertSuccess from "@/icons/AlertSuccess";

export const GlobalAlert = ({
  isOpen,
  onClose,
  title,
  description,
  isFailure,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isFailure: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isFailure ? (
        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            {title ?? "An error occurred"}
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="p-1 text-sm font-gilroyMedium text-gray-600">
            {description}
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full items-center pb-3 justify-center ">
            <Button
              className="w-[90%] rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertSuccess />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            {title ?? "WOHOOO!! 🎉"}
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="p-1 text-sm font-gilroyMedium text-gray-600">
            {description}
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full items-center pb-3 justify-center ">
            <Button
              className="w-[90%] rounded-md border border-[#D0D5DD] bg-[#039855] shadow-sm text-[#FFFFFF]"
              onClick={onClose}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
