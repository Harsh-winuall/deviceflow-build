"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";

type IfConditionDialogProps = {
  children: React.ReactNode;
  data: string[];
  onSelect: (value: string) => void;
};

function IfConditionDialog({ children, data, onSelect, open, onOpenChange }) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-w-sm mt-2 max-h-40 rounded-[10px] font-gilroyMedium"
        align="end"
        onKeyDown={(e) => e.stopPropagation()}
      >
        {data?.map((app, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center cursor-pointer py-2"
            onSelect={() => {
              onSelect?.(app);
              onOpenChange(false); // close dropdown after select
            }}
          >
            <p className="font-gilroyMedium">{app}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default IfConditionDialog;
