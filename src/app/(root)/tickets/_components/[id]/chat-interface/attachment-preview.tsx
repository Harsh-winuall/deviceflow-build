import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Attachment } from "./chat-interface";
import { formatFileSize, isImageAttachment } from "@/lib/utils";

interface AttachmentPreviewProps {
  attachment: string | Attachment;
  preview?: boolean;
}

export function AttachmentPreview({
  attachment,
  preview = false,
}: AttachmentPreviewProps) {
  // Normalize props
  const url = typeof attachment === "string" ? attachment : attachment.url!;
  const name =
    typeof attachment === "string"
      ? url.split("/").pop()!
      : attachment.name || url.split("/").pop()!;
  const size =
    typeof attachment === "object" && attachment.size
      ? formatFileSize(attachment.size)
      : undefined;

  return (
    <div
      className={`flex items-center border rounded-md overflow-hidden ${
        preview ? "w-40" : "w-full max-w-[12rem]"
      }`}
    >
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-white text-gray-500">
        {isImageAttachment ? (
          <div className="p-1 rounded-md">
            <img
              src={url}
              alt={name}
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="text-lg">📄</div>
        )}
      </div>
      <div className="flex-1 min-w-0 px-2 py-2">
        <p className="text-xs font-gilroyMedium truncate text-[#333]">{name}</p>
        {preview && size && <p className="text-xs text-gray-500">{size}</p>}
      </div>
      {!preview && (
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <a
            href={url?.replace(
              "storage.googleapis.com",
              "storage.cloud.google.com"
            )}
            download={name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
