"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SendBtn } from "../../tickets/_components/[id]/chat-interface/new-rich-editor/rich-text-editor";
import "./text-editor.css";

type TextEditorProps = {
  onSendMessage?: (content: string) => void;
  loading?: boolean;
  isClosed?: boolean;
};

export function TextEditor({
  onSendMessage,
  loading,
  isClosed,
}: TextEditorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const placeholderRef = useRef<() => string>(() =>
    isClosed ? "" : "Ask me something.."
  );

  // 2️⃣ Update that ref whenever `isClosed` changes:
  useEffect(() => {
    placeholderRef.current = () => (isClosed ? "" : "Ask me something..");
  }, [isClosed]);

  const editor = useEditor({
    editable: !isClosed,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        bulletList: false,
        listItem: false,
        orderedList: false,
      }),
      Placeholder.configure({
        placeholder: () => placeholderRef.current(),
        showOnlyWhenEditable: false,
      }),
    ],
    onUpdate: ({ editor }) => {
      setIsTyping(editor.getText().trim().length > 0);
    },

    editorProps: {
      handleKeyDown: (view, event) => {
        if (loading) return true;
        if (isClosed) return true;
        if (event.key === "Enter") {
          if (event.shiftKey) {
            // allow newline
            return false;
          }
          // prevent default behavior
          event.preventDefault();
          // send message
          handleSend();
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!isClosed);
    }
  }, [editor, isClosed]);

  const handleSend = () => {
    if (loading) return;
    if (isClosed) return;
    if (!editor) return;

    const content =
      editor?.getText({
        blockSeparator: "\n",
      }) ?? "";

    if (content.trim() === "") return;

    onSendMessage(content);
    editor.commands.clearContent();
    setIsTyping(false);
  };

  return (
    <div
      className={cn(
        "space-y-2",
        isClosed &&
          "pointer-events-none opacity-50 cursor-not-allowed select-none",
        loading &&
          "pointer-events-none opacity-50 cursor-not-allowed select-none"
      )}
      ref={editorContainerRef}
    >
      <div
        className={cn(
          "border rounded-md",
          editor?.isFocused
            ? "ring-2 ring-[#52ABFF]/30 border border-blue-500 opacity-100"
            : "opacity-70 border border-neutral-400"
        )}
      >
        <div className="h-full px-3 p-2 flex relative justify-between">
          <EditorContent
            editor={editor}
            className={cn(
              "break-words text-sm font-gilroyMedium prose-sm max-w-none max-h-[5rem] overflow-y-auto bg-background focus:outline-none hide-scrollbar w-full"
            )}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!isTyping}
            className="flex items-center w-fit mx-2 rounded-md p-0 absolute right-2 bottom-2 transform text-muted-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin size-5 mb-1" />
              </>
            ) : (
              <>
                <SendBtn
                  fill={isTyping ? "#008910" : "#e6e6e6"}
                  stroke={"#ffffff"}
                />
              </>
            )}
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
