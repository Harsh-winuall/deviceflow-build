"use client";

import { Button } from "@/components/ui/button";
import {
  LeftToRightListBulletIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 bg-[#FAFAFA] p-2">
      {/* Bold Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <span
          className={`font-gilroyMedium ${
            editor.isActive("bold") ? "text-black" : "text-[#A1A1A1]"
          }`}
        >
          B
        </span>
      </button>

      {/* Italic Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <HugeiconsIcon
          icon={TextItalicIcon}
          className={`size-4 ${
            editor.isActive("italic") ? "text-black" : "text-[#A1A1A1]"
          }`}
        />
      </button>

      {/* Underline Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`px-2 rounded font-gilroyMedium hover:bg-gray-200`}
      >
        <span
          className={`underline ${
            editor.isActive("underline") ? "text-black" : "text-[#A1A1A1]"
          }`}
        >
          U
        </span>
      </button>

      <div className="h-[2px] mt-3 w-4 bg-[#E4E4E4] rotate-90"></div>

      {/* Center Align Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <HugeiconsIcon
          icon={TextAlignCenterIcon}
          className={`size-4 ${
            editor.isActive({ textAlign: "center" })
              ? "text-black"
              : "text-[#A1A1A1]"
          }`}
        />
      </button>

      {/* Left Align Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <HugeiconsIcon
          icon={TextAlignLeftIcon}
          className={`size-4 ${
            editor.isActive({ textAlign: "left" })
              ? "text-black"
              : "text-[#A1A1A1]"
          }`}
        />
      </button>

      {/* Right Align Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <HugeiconsIcon
          icon={TextAlignRightIcon}
          className={`size-4 ${
            editor.isActive({ textAlign: "right" })
              ? "text-black"
              : "text-[#A1A1A1]"
          }`}
        />
      </button>

      <div className="h-[2px] mt-3 w-4 bg-[#E4E4E4] rotate-90"></div>

      {/* Bullet List Button - Simple toggle */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 rounded hover:bg-gray-200`}
      >
        <HugeiconsIcon
          icon={LeftToRightListBulletIcon}
          className={`size-4 ${
            editor.isActive("bulletList") ? "text-black" : "text-[#A1A1A1]"
          }`}
        />
      </button>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => editor?.chain().focus().insertContent("{").run()}
        title="Mention"
      >
        {`{ }`}
      </Button>
    </div>
  );
};
