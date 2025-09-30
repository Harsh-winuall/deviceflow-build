"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { ConfirmationModal } from "./confirmation-popup";

const WorkFlowOptions = ({
  children,
  onRename,
  onDelete,
  open: openOptions,
  setOpen: setOpenOptions,
}: {
  children: React.ReactNode;
  onRename: () => void;
  onDelete: () => void;
  open: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={openOptions} onOpenChange={setOpenOptions}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 font-gilroyMedium rounded-[10px]"
        align="start"
      >
        <DropdownMenuGroup className="flex flex-col gap-2">
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              onRename?.();
            }}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Rename
          </DropdownMenuItem>

          <ConfirmationModal
            open={open}
            setOpen={setOpen}
            functionToBeExecuted={onDelete}
            title="Are you sure?"
            description="Are you sure you want to delete the workflow?"
            type="failure"
            successBtnText="Delete"
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className="text-red-500  focus:text-red-500 cursor-pointer font-gilroyMedium"
            >
              <HugeiconsIcon icon={Delete01Icon} />
              Delete workflow
            </DropdownMenuItem>
          </ConfirmationModal>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkFlowOptions;
