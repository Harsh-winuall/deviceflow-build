import * as React from "react";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
  outerDivClassName?: string;
}

const MessageListWrapper = React.forwardRef<
  HTMLDivElement,
  ChatMessageListProps
>(
  (
    { className, children, outerDivClassName, smooth = false, ...props },
    _ref
  ) => {
    const {
      scrollRef,
      isAtBottom,
      autoScrollEnabled,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth,
      content: children,
    });

    return (
      <div className={cn("relative w-full h-full", outerDivClassName)}>
        <div
          className={`flex flex-col w-full h-full p-4 overflow-y-auto hide-scrollbar ${className}`}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col gap-6 hide-scrollbar">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="xs"
            variant="outline"
            className="absolute bottom-2 right-2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-2.5" />
          </Button>
        )}
      </div>
    );
  }
);

MessageListWrapper.displayName = "MessageListWrapper";

export { MessageListWrapper };
