"use client";

import { Button } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AlertSuccess from "@/icons/AlertSuccess";
import WarningDelete from "@/icons/WarningDelete";
import WarningIcon from "@/icons/WarningIcon";

export const NotIntegratedDialog = ({
  children,
  open,
  setOpen,
  description,
  title,
  type,
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (text: boolean) => void;
  description: string;
  title?: string;
  type?: string;
}) => {
  // type-> failure, success, warning
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={"w-full"}
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </DialogTrigger>

        <DialogContent
          className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              {type === "failure" ? (
                <WarningDelete />
              ) : type === "warning" ? (
                <WarningIcon />
              ) : (
                <AlertSuccess />
              )}
            </div>
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            {title}
          </DialogTitle>

          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
