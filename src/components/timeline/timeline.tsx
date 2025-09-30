import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Check, Circle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Alert01Icon as Alert01Icon,
  Search01Icon as Search01Icon,
  Message01Icon as Message01Icon,
  SmartPhone01Icon as SmartPhone01Icon,
  Location05Icon,
  UserGroup03Icon,
  User03Icon,
  CheckmarkCircle02Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const timelineVariants = cva("grid", {
  variants: {
    positions: {
      left: "[&>li]:grid-cols-[0_min-content_1fr]",
      right: "[&>li]:grid-cols-[1fr_min-content]",
      center: "[&>li]:grid-cols-[1fr_min-content_1fr]",
    },
  },
  defaultVariants: {
    positions: "left",
  },
});

interface TimelineProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ children, className, positions, ...props }, ref) => {
    return (
      <ul
        className={cn(timelineVariants({ positions }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
Timeline.displayName = "Timeline";

const timelineItemVariants = cva("grid items-center gap-x-2", {
  variants: {
    status: {
      done: "text-primary",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

interface TimelineItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, status, ...props }, ref) => (
    <li
      className={cn(timelineItemVariants({ status }), className)}
      ref={ref}
      {...props}
    />
  )
);
TimelineItem.displayName = "TimelineItem";

const timelineDotVariants = cva(
  "col-start-2 col-end-3 row-start-1 row-end-1 flex size-8 items-center justify-center rounded-full border-0", // Changed size and removed border
  {
    variants: {
      status: {
        default: "[&>*]:hidden",
        current:
          "bg-muted [&>*:not(.lucide-circle)]:hidden [&>.lucide-circle]:fill-current [&>.lucide-circle]:text-current",
        done: "bg-primary [&>*:not(.lucide-check)]:hidden [&>.lucide-check]:text-background",
        error:
          "bg-destructive [&>*:not(.lucide-x)]:hidden [&>.lucide-x]:text-background",
        "un-assign-device":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-smartphone01)]:hidden [&>.hugeicons-smartphone01]:text-[#FF0000]",
        "device-deleted":
          "bg-[#edf2f7] [&>*:not(.hugeicons-smartphone01)]:hidden [&>.hugeicons-smartphone01]:text-[#718096]",
        "device-inactive":
          "bg-[#edf2f7] [&>*:not(.hugeicons-smartphone01)]:hidden [&>.hugeicons-smartphone01]:text-[#718096]",
        "add-to-team":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-team)]:hidden [&>.hugeicons-team]:text-[#0D9B00]",
        "delete-team":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-team)]:hidden [&>.hugeicons-team]:text-[#FF0000]",
        "moved-from-team":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-team)]:hidden [&>.hugeicons-team]:text-[#0D9B00]",
        "remove-from-team":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-team)]:hidden [&>.hugeicons-team]:text-[#FF0000]",
        "new-issue":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-alert01)]:hidden [&>.hugeicons-alert01]:text-[#FF0000]",
        "new-scan":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-search01)]:hidden [&>.hugeicons-search01]:text-[#0D9B00]",
        reply:
          "bg-[#EFF6FF] [&>*:not(.hugeicons-message01)]:hidden [&>.hugeicons-message01]:text-[#025CE5]",
        "added-to-shelf":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-location01)]:hidden [&>.hugeicons-location01]:text-[#0D9B00]",
        "asset-assigned":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-smartphone01)]:hidden [&>.hugeicons-smartphone01]:text-[#0D9B00]",
        "device-active":
          "bg-[#E3F2FD] [&>*:not(.hugeicons-smartphone01)]:hidden [&>.hugeicons-smartphone01]:text-[#42A5F5]",
        "user-added":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-user)]:hidden [&>.hugeicons-user]:text-[#0D9B00]",
        "user-inactive":
          "bg-[#edf2f7] [&>*:not(.hugeicons-user)]:hidden [&>.hugeicons-user]:text-[#718096]",
        "user-active":
          "bg-[#E3F2FD] [&>*:not(.hugeicons-user)]:hidden [&>.hugeicons-user]:text-[#42A5F5]",
        "user-deleted":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-user)]:hidden [&>.hugeicons-user]:text-[#FF0000]",
        "issue-closed":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-alert01)]:hidden [&>.hugeicons-alert01]:text-[#0D9B00]",
        "assigned-device-acknowledged":
          "bg-[#ECFDF3] [&>*:not(.hugeicons-acknowledge)]:hidden [&>.hugeicons-acknowledge]:text-[#0D9B00]",
        "assigned-device-not-acknowledged":
          "bg-[#FFEFEF] [&>*:not(.hugeicons-acknowledge)]:hidden [&>.hugeicons-acknowledge]:text-[#FF0000]",
        custom: "[&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {
  customIcon?: React.ReactNode;
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status, customIcon, ...props }, ref) => (
    <div
      role="status"
      className={cn("timeline-dot", timelineDotVariants({ status }), className)}
      ref={ref}
      {...props}
    >
      <Circle className="size-2.5" />
      <Check className="size-3" />
      <X className="size-3" />
      <HugeiconsIcon icon={Alert01Icon} className="size-4 hugeicons-alert01" />
      <HugeiconsIcon
        icon={SecurityCheckIcon}
        className="size-4 hugeicons-search01"
      />
      <HugeiconsIcon
        icon={Location05Icon}
        className="size-4 hugeicons-location01"
      />
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        className="size-4 hugeicons-acknowledge"
      />
      <HugeiconsIcon icon={UserGroup03Icon} className="size-4 hugeicons-team" />
      <HugeiconsIcon
        icon={Message01Icon}
        className="size-4 hugeicons-message01"
      />
      <HugeiconsIcon
        icon={SmartPhone01Icon}
        className="size-4 hugeicons-smartphone01"
      />
      <HugeiconsIcon icon={User03Icon} className="size-4 hugeicons-user" />

      {customIcon}
    </div>
  )
);
TimelineDot.displayName = "TimelineDot";

const timelineContentVariants = cva(
  "row-start-2 row-end-2 pb-3 text-muted-foreground",
  {
    variants: {
      side: {
        right: "col-start-3 col-end-4 mr-auto text-left",
        left: "col-start-1 col-end-2 ml-auto text-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, side, ...props }, ref) => (
    <div
      className={cn(timelineContentVariants({ side }), className)}
      ref={ref}
      {...props}
    />
  )
);
TimelineContent.displayName = "TimelineContent";

const timelineHeadingVariants = cva(
  "row-start-1 row-end-1 line-clamp-1 max-w-full truncate",
  {
    variants: {
      side: {
        right: "col-start-3 col-end-4 mr-auto text-left",
        left: "col-start-1 col-end-2 ml-auto text-right",
      },
      variant: {
        primary: "text-base font-medium text-primary",
        secondary: "text-sm font-light text-muted-foreground",
      },
    },
    defaultVariants: {
      side: "right",
      variant: "primary",
    },
  }
);

interface TimelineHeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof timelineHeadingVariants> {}

const TimelineHeading = React.forwardRef<
  HTMLParagraphElement,
  TimelineHeadingProps
>(({ className, side, variant, ...props }, ref) => (
  <p
    role="heading"
    aria-level={variant === "primary" ? 2 : 3}
    className={cn(timelineHeadingVariants({ side, variant }), className)}
    ref={ref}
    {...props}
  />
));
TimelineHeading.displayName = "TimelineHeading";

interface TimelineLineProps extends React.HTMLAttributes<HTMLHRElement> {
  done?: boolean;
}

const TimelineLine = React.forwardRef<HTMLHRElement, TimelineLineProps>(
  ({ className, done = false, ...props }, ref) => {
    return (
      <hr
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full min-h-16 w-0.5 justify-center rounded-full",
          done ? "bg-muted" : "bg-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TimelineLine.displayName = "TimelineLine";

export {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineHeading,
  TimelineLine,
};
