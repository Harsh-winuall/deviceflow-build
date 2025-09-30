"use client";

import { cn } from "@/lib/utils";
import parse from "html-react-parser";
import { MentionToolTip } from "./mention-tooltip";

type Props = {
  content: any[];
  className?: string;
};

export function ParsedMessageContent({
  content,
  className,
}: {
  content: (string | object)[];
  className?: string;
}) {
  // Step 1: Create flat string and collect mentions
  const mentions: any[] = [];
  let htmlString = "";

  content.forEach((item, index) => {
    if (typeof item === "string") {
      htmlString += item;
    } else if (typeof item === "object") {
      const placeholder = `@@MENTION_${mentions.length}@@`;
      htmlString += placeholder;
      mentions.push(item);
    }
  });

  // Step 2: Replace placeholders after parsing
  const reactContent = parse(htmlString, {
    replace: (domNode) => {
      if (domNode.type === "text") {
        const parts = domNode.data.split(/(@@MENTION_\d+@@)/g);
        if (parts.length === 1) return;

        return (
          <>
            {parts.map((part, i) => {
              const match = part.match(/@@MENTION_(\d+)@@/);
              if (match) {
                const mention = mentions[+match[1]];
                return (
                  <MentionToolTip key={i} mention={mention}>
                    <span className="text-sm rounded-md cursor-default text-[#025CE5]">
                      @{mention.first_name ?? mention.title}
                    </span>
                  </MentionToolTip>
                );
              }
              return part;
            })}
          </>
        );
      }
    },
  });

  return (
    <div className={cn("font-gilroyRegular text-sm", className)}>
      {reactContent}
    </div>
  );
}

export const ParsedMessageSystem = ({ content, className }: Props) => {
  return (
    <div className={cn("font-gilroyRegular text-sm", className)}>
      {content.map((item, i) => {
        // 1) object = mention
        if (item && typeof item === "object") {
          return (
            <MentionToolTip key={i} mention={item}>
              <span className="underline font-gilroySemiBold cursor-pointer mx-1">
                {item.first_name ?? item.title}
              </span>
            </MentionToolTip>
          );
        }

        // 2) only strings get parsed
        if (typeof item === "string") {
          return <span key={i}>{parse(item)}</span>;
        }

        // 3) everything else: render nothing (or you could return null)
        return null;
      })}
    </div>
  );
};
