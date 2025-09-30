"use client";

import { GetAvatar } from "@/components/get-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MentionType } from "./rich-text-editor";

export const MentionToolTip = ({
  children,
  mention,
}: {
  children: React.ReactNode;
  mention: MentionType;
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          showArrow
          className="p-2 text-white bg-[#494949] max-w-fit w-fit min-w-fit"
        >
          <div className="flex max-w-80 flex-col gap-3 break-words p-1 md:min-w-52">
            <div className="flex items-center gap-2">
              <GetAvatar
                name={mention?.first_name ?? mention?.title}
                size={36}
              />
              <div className="flex flex-col font-gilroyMedium">
                <span>{mention?.first_name ?? mention?.title}</span>
                <span>{mention?.email ?? mention?.description}</span>
                {mention?.count ? <span>{mention?.count} Seats</span> : null}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
