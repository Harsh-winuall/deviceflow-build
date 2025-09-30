"use client";

import { useState } from "react";
import { downloadAttachmentsAsZip, isImageAttachment } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Attachment } from "./chat-interface";
import { AttachmentPreview } from "./attachment-preview";

interface AttachmentsProps {
  attachments: (string | Attachment)[];
}

export function Attachments({ attachments }: AttachmentsProps) {
  const [showAll, setShowAll] = useState(false);

  if (!attachments.length) return null;

  const sorted = [...attachments].sort((a, b) => {
    const isImageA = isImageAttachment(a);
    const isImageB = isImageAttachment(b);
    return Number(isImageB) - Number(isImageA); // Images last
  });

  const visible = showAll ? sorted : sorted.slice(0, 5);
  const hiddenCount = sorted.length - visible.length;

  return (
    <div className="flex flex-wrap gap-2" data-attachment-section>
      {visible.map((attachment, idx) => (
        <AttachmentPreview attachment={attachment} key={idx} />
      ))}

      {!showAll && hiddenCount > 0 && (
        <Button
          variant="ghost"
          className="text-xs text-left text-muted-foreground w-full max-w-[12rem] h-10 font-gilroyMedium justify-start"
          onClick={() => setShowAll(true)}
        >
          +{hiddenCount} more
        </Button>
      )}

      {showAll && (
        <Button
          variant="ghost"
          className="text-xs text-blue-600 hover:text-blue-600 w-full max-w-[12rem] h-10 font-gilroyMedium justify-start"
          onClick={() => downloadAttachmentsAsZip(attachments)}
        >
          Download ZIP
        </Button>
      )}
    </div>
  );
}
