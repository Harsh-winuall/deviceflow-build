import * as React from "react";

import CalanderIcon from "@/icons/CalanderIcon";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-gilroyMedium file:text-foreground border-black placeholder:text-[#CCCCCC] focus-visible:outline-none focus-visible:border-primary  disabled:cursor-not-allowed disabled:opacity-50 md:text-base placeholder:text-sm font-gilroyMedium",
          className
        )}
        ref={ref}
        {...props}
      />
      {type === "date" && (
        <button
          type="button"
          className="absolute top-2.5 right-4"
          onClick={(e) => {
            const input = e.currentTarget
              .previousElementSibling as HTMLInputElement;
            input?.focus();
            input?.click();
          }}
        >
          <CalanderIcon className="cursor-pointer" />
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";
