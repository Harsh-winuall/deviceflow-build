"use client";

import { Button } from "@/components/buttons/Button";
import Spinner from "@/components/Spinner";
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
import { useState } from "react";
import { toast } from "sonner";

export const ConfirmationModal = ({
  children,
  open,
  setOpen,
  type,
  functionToBeExecuted,
  description,
  title,
  successBtnText,
  skipBtnText = "Cancel",
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (text: boolean) => void;
  functionToBeExecuted: any;
  description: string;
  title?: string;
  type?: "failure" | "success" | "warning";
  successBtnText: string;
  skipBtnText?: string;
}) => {
  // type-> failure, success, warning
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={"w-fit"}
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center flex flex-col gap-4">
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

          <DialogDescription className="p-1 -mt-2 text-sm text-gray-600">
            {description}
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full items-center justify-between ">
            <DialogClose asChild onClick={(e) => e.stopPropagation()}>
              <Button
                className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054] hover:border-black"
                onClick={(e) => e.stopPropagation()}
              >
                {skipBtnText}
              </Button>
            </DialogClose>
            <Button
              className={`w-1/2 rounded-md ${
                type === "failure"
                  ? "bg-[#D92D20]"
                  : type === "warning"
                  ? "bg-black"
                  : "bg-[#039855]"
              } text-white capitalize`}
              onClick={(e) => {
                setLoading(true);
                try {
                  e.stopPropagation();
                  functionToBeExecuted?.();
                } catch (error) {
                  toast.error("Some error occured");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <Spinner size="sm" /> : successBtnText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
