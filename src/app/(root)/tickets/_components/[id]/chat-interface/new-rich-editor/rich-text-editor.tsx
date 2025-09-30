"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchUsersTeams } from "@/server/ticketActions";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  EditorContent,
  ReactRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AtSign,
  Bold,
  Italic,
  Loader2,
  LucideProps,
  Paperclip,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import tippy from "tippy.js";
import { AttachmentPreview } from "../attachment-preview";
import MentionList from "./mention-list";
import { RawComment } from "../chat-interface";

interface RichTextEditorProps {
  onSendMessage?: (content: string, attachments: File[]) => void;
  loading?: boolean;
  enableEditor?: number;
  isClosed?: boolean;
  reopenedAt?: string;
  messages?: RawComment[];
}

export type MentionType = {
  _id?: string;
  first_name?: string;
  email?: string;
  title?: string;
  description?: string;
  team_code?: string;
  count?: string;
};

const getFilteredMentions = (query: string) => {
  return fetchUsersTeams(query)
    .then((res) => {
      const data = [];
      data.push(...res.teams, ...res.users);
      return data; // Return the populated data array
    })
    .catch((error) => {
      return []; // Return an empty array in case of an error
    });
};

type AttachmentWithId = {
  id: string;
  file: File;
};
export function RichTextEditor({
  onSendMessage,
  enableEditor,
  reopenedAt,
  loading,
  isClosed,
  messages,
}: RichTextEditorProps) {
  const [attachments, setAttachments] = useState<AttachmentWithId[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const popupRef = useRef(null);

  const placeholderRef = useRef<() => string>(() =>
    isClosed ? "Conversation closed" : "Type your message…"
  );

  useEffect(() => {
    placeholderRef.current = () =>
      isClosed ? "Conversation closed" : "Type your message…";
  }, [isClosed]);

  const editor = useEditor({
    editable: !isClosed,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: () => placeholderRef.current(),
        showOnlyWhenEditable: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderText: ({ node }) => `@${node.attrs.label}`,
        suggestion: {
          items: ({ query }) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(getFilteredMentions(query));
              }, 0);
            });
          },

          render: () => {
            let component;
            return {
              onStart: (props) => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });
                if (!props.clientRect) return;
                const instance = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                  theme: "custom",
                });
                popupRef.current = instance[0];
              },
              onUpdate: (props) => {
                // component.updateProps(props);
                if (component?.updateProps) {
                  component.updateProps(props);
                }
                if (!props.clientRect || !popupRef.current) return;
                popupRef.current.setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown: (props) => {
                // const handled = component?.ref?.onKeyDown(props);
                // if (handled) return true;
                if (
                  component?.ref?.onKeyDown &&
                  typeof component.ref.onKeyDown === "function"
                ) {
                  const handled = component.ref.onKeyDown(props);
                  if (handled) return true;
                }
                if (props?.event?.key === "Escape" && popupRef.current) {
                  popupRef.current.hide();
                  return true;
                }
                return false;
              },
              onExit: () => {
                if (popupRef.current) popupRef.current.destroy();
                popupRef.current = null;
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      setIsTyping(editor.getText().trim().length > 0);
    },

    editorProps: {
      handleKeyDown: (view, event) => {
        if (isClosed) return true;
        if (event.key === "Enter") {
          if (event.shiftKey) {
            // allow newline
            return false;
          }
          // prevent default behavior
          event.preventDefault();
          if (popupRef.current) {
            // let suggestion plugin handle selection
            return false;
          }
          // send message
          handleSend();
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });
  // useEffect(() => {
  //   if (editor) {
  //     editor.setEditable(enableEditor >= 3);
  //   }
  // }, [editor, enableEditor]);
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isClosed);
    }
  }, [editor, isClosed]);

  const handleAttachFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentWithId[] = Array.from(files).map(
      (file) => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        file,
      })
    );

    setAttachments((prev) => [...prev, ...newAttachments]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const handleSend = () => {
    if (!editor) return;

    const content = editor.getHTML();
    if (content.trim() === "<p></p>" && attachments.length === 0) return;

    const filesToSend = attachments.map((att) => att.file);

    onSendMessage(content, filesToSend); // Only send File[]
    editor.commands.clearContent();
    setAttachments([]);
    setIsTyping(false);
  };

  const isAi = messages?.[messages?.length - 1]?.user?.id === "ai";
  return (
    <div
      className={cn(
        "space-y-2",
        isClosed &&
          "pointer-events-none opacity-50 cursor-not-allowed select-none",
        !isClosed && reopenedAt && "",
        !isClosed &&
          !reopenedAt &&
          isAi &&
          "pointer-events-none opacity-50 cursor-not-allowed select-none"
      )}
      ref={editorContainerRef}
    >
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
          {attachments.map((attachment) => {
            const file = attachment.file;
            const previewUrl = URL.createObjectURL(file);

            return (
              <div key={attachment.id} className="relative group">
                <div className="relative">
                  <AttachmentPreview
                    attachment={{ name: file.name, url: previewUrl }}
                    preview
                  />
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className={cn(
          "border rounded-md",
          editor?.isFocused
            ? "ring-2 ring-[#52ABFF]/30 border border-blue-500 opacity-100"
            : "opacity-70 border border-neutral-400"
        )}
      >
        <div className="flex items-center justify-between rounded-md px-1.5 py-1  bg-[#fafafa]">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "bg-gray-100" : ""}
              title="Bold"
            >
              <Bold className="size-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? "bg-gray-100" : ""}
              title="Italic"
            >
              <Italic className="size-3" />
            </Button>

            <div className="h-4 w-[1.34px] mx-1 rounded-xl bg-input" />

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => editor?.chain().focus().insertContent("@").run()}
              title="Mention"
            >
              <AtSign className="size-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleAttachFiles}
              title="Attach Files"
            >
              <Paperclip className="size-3" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.doc,.docx,.pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
          </div>

          <div className="flex items-center h-full gap-1">
            {isTyping && (
              <>
                <span className="py-1 mx-4 text-xs font-gilroyRegular text-gray-500">
                  Shift + Enter to add a new line
                </span>
              </>
            )}
          </div>
        </div>
        <div className="h-full p-3 flex relative justify-between">
          {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="flex bg-white border rounded-md shadow-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-gray-100" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-gray-100" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>
            </BubbleMenu>
          )}
          <EditorContent
            editor={editor}
            className={cn(
              "break-words text-sm font-gilroyMedium prose-sm max-w-none max-h-[5rem] overflow-y-auto bg-background focus:outline-none hide-scrollbar w-full"
            )}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!isTyping && attachments.length === 0}
            className="flex items-center w-fit mx-2 rounded-md p-1 absolute right-2 bottom-2 transform text-muted-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin size-4" />
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

export const SendBtn = (props: LucideProps) => (
  <svg
    {...props}
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill={props.fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.12219 12.5L4.50343 6.93015C4.3262 5.33613 5.96735 4.1652 7.41692 4.85259L19.6528 10.6488C21.215 11.3885 21.215 13.6115 19.6528 14.3512L7.41692 20.1484C5.96735 20.8348 4.3262 19.6649 4.50343 18.0709L5.12219 12.5ZM5.12219 12.5H12.2932"
      stroke={props.stroke}
      strokeOpacity="1"
      strokeWidth="1.30103"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
