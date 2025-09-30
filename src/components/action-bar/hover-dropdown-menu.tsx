import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";

export const HoverDropdownMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          // onClick={() => setOpen(!open)}
          className="rounded-[5px] border size-9 flex-shrink-0 flex items-center justify-center cursor-pointer"
        >
          <HugeiconsIcon
            icon={MoreVerticalIcon}
            className="size-6 text-black"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
        align="end"
        className="w-[200px] font-gilroyMedium"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
