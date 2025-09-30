"use client";

import type React from "react";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { ConfirmationModal } from "./confirmation-popup";
import PathConditionDialog from "../dialogs/set-path-condition.dialog";

interface EditPathProps {
  children: React.ReactNode;
  type: "edit" | "set";
  onRename: () => void;
  onDelete: () => void;
  parentData: any;
}

const EditPath = ({
  children,
  parentData,
  type,
  onRename,
  onDelete,
}: EditPathProps) => {
  const [open, setOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 font-gilroyMedium rounded-[10px]"
        align="start"
      >
        <DropdownMenuGroup className="flex flex-col gap-0.5">
          <PathConditionDialog
            parentData={parentData}
            onDelete={onDelete}
            open={conditionOpen}
            setOpen={setConditionOpen}
          />
          <DropdownMenuItem
            className="flex items-center"
            onSelect={(e) => {
              setConditionOpen(true);
              e.preventDefault();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/media/edit-condition.svg"
              alt="duplicate"
              width={16}
              height={16}
            />
            {type === "edit" ? "Edit" : "Set"} Condition
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRename?.();
            }}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
            Rename
          </DropdownMenuItem>

          <ConfirmationModal
            open={open}
            setOpen={setOpen}
            functionToBeExecuted={() => {
              onDelete();
              setOpen(false);
            }}
            title="Are you sure?"
            description="Are you sure you want to delete the path?"
            type="failure"
            successBtnText="Delete"
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-red-500 focus:text-red-500  font-gilroyMedium w-full cursor-pointer"
            >
              <HugeiconsIcon icon={Delete01Icon} size={16} />
              Delete Path
            </DropdownMenuItem>
          </ConfirmationModal>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditPath;
