"use client";

import "./text-editor.css";
import { cn } from "@/lib/utils";
import Color from "@tiptap/extension-color";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import tippy from "tippy.js";
import { MenuBar } from "./editor-menu-bar";
import DynamicValuesList from "./dynamic-values-list";

export const EmailTextEditor = ({
  content,
  data,
  onChange,
}: {
  content?: string;
  data?: any;
  onChange?: (value: string) => void;
}) => {
  const popupRef = useRef(null);
  const listData = data;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Remove bulletList from StarterKit to avoid conflicts
        bulletList: false,
        listItem: false,
      }),
      // Add BulletList and ListItem as separate extensions
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item",
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Enter message here...",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderText: ({ node }) => `{${node.attrs.label}}`, // Display as {first_name}
        suggestion: {
          char: "{", // Trigger with {
          startOfLine: false,
          command: ({ editor, range, props }) => {
            const formattedLabel = `{ ${props.label} }`;
            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: "text",
                  text: formattedLabel + " ", // Add space after mention for clean typing
                },
              ])
              .run();
          },
          items: async ({ query }) => {
            const strippedQuery = query.replace("{", "").trim(); // ensure clean query
            // ["Email","First Name","Last Name","Role","Employment Type","Team","Designation"]
            const filtered = listData.filter((v) => v.includes(strippedQuery));
            // console.log(filtered, "Filtered");
            return filtered.map((item) => ({
              id: item,
              label: item,
            }));
          },
          render: () => {
            let component;
            return {
              onStart: (props) => {
                component = new ReactRenderer(DynamicValuesList, {
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
                component?.updateProps?.(props);
                popupRef.current?.setProps?.({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown: (props) => {
                if (component?.ref?.onKeyDown?.(props)) return true;
                if (props.event.key === "Escape") {
                  popupRef.current?.hide();
                  return true;
                }
                return false;
              },
              onExit: () => {
                popupRef.current?.destroy();
                popupRef.current = null;
                component?.destroy();
              },
            };
          },
        },
      }),
    ],
    editorProps: {
      handleKeyDown: (view, event) => {
        // Handle Enter key in bullet lists
        if (event.key === "Enter") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // Check if we're in a list item
          if ($from.parent.type.name === "listItem") {
            // If the current list item is empty, exit the list
            if ($from.parent.textContent === "") {
              editor?.chain().focus().liftListItem("listItem").run();
              return true;
            }
            // Otherwise, create a new list item
            editor?.chain().focus().splitListItem("listItem").run();
            return true;
          }
        }
        return false;
      },
    },
    content: content ?? "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onFocus: () => {
      // Ensure the editor gets focus when clicked
      editor?.commands.focus();
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <>
      <MenuBar editor={editor} />
      <div>
        <EditorContent
          editor={editor}
          className={cn(
            "break-words text-sm font-gilroyMedium prose-sm max-w-none min-h-[1rem] max-h-[20rem] overflow-y-auto bg-background focus:outline-none p-2 hide-scrollbar w-full"
          )}
        />
      </div>
    </>
  );
};
