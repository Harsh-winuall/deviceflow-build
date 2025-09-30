"use client";

import React, { forwardRef } from "react";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  onClick,
}) => {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer px-2 py-1.5 text-sm rounded-sm "
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface DropdownMenuContentProps {
  className?: string;
  children: React.ReactNode;
  visible: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, children, visible, ...props }, ref) => {
  if (!visible) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 top-12 -left-20 min-w-[8rem] mt-1 rounded-2xl border bg-popover  text-popover-foreground border-primary shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

interface DropdownMenuItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  inset?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, children, onClick, disabled, inset }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
          disabled
            ? "opacity-50 pointer-events-none"
            : "hover:bg-accent hover:text-accent-foreground",
          inset && "pl-8",
          className
        )}
        onClick={!disabled ? onClick : undefined}
      >
        {children}
      </div>
    );
  }
);

interface DropdownMenuCheckboxItemProps {
  className?: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={onChange}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
};

interface DropdownMenuRadioItemProps {
  className?: string;
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({
  className,
  children,
  selected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center rounded-lg py-1.5 pl-8 pr-2 text-sm transition-colors",
        "hover:bg-[#eee] hover:text-primary",
        className
      )}
      onClick={onSelect}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {selected && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </div>
  );
};

interface DropdownMenuLabelProps {
  className?: string;
  children: React.ReactNode;
  inset?: boolean;
}

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  className,
  children,
  inset,
}) => {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-gilroySemiBold",
        inset && "pl-8",
        className
      )}
    >
      {children}
    </div>
  );
};

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
}) => {
  return <div className={cn("my-0.5 h-px bg-muted", className)} />;
};

interface DropdownMenuSubProps {
  children: React.ReactNode;
}

const DropdownMenuSub: React.FC<DropdownMenuSubProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

interface DropdownMenuSubTriggerProps {
  className?: string;
  children: React.ReactNode;
  inset?: boolean;
  onClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(({ className, children, inset, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      onClick={onClick}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </div>
  );
});

interface DropdownMenuSubContentProps {
  className?: string;
  children: React.ReactNode;
  visible: boolean;
}

const DropdownMenuSubContent: React.FC<DropdownMenuSubContentProps> = ({
  className,
  children,
  visible,
}) => {
  if (!visible) return null;
  return (
    <div
      className={cn(
        "absolute left-full top-0 z-50 min-w-[8rem] mt-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

interface DropdownMenuShortcutProps {
  className?: string;
  children: React.ReactNode;
}

const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({
  className,
  children,
}) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    >
      {children}
    </span>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
