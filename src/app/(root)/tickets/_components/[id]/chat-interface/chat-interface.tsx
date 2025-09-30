"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/components/utils/upload";
import {
  aiChatAction,
  aiChatHistory,
  sendChatMessage,
  switchToHumanChat,
  TicketData,
} from "@/server/ticketActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageList } from "./message-list-with-ref";
import {
  MentionType,
  RichTextEditor,
} from "./new-rich-editor/rich-text-editor";
import "./text-editor.css";

export interface Attachment {
  id?: string;
  name?: string;
  type?: string;
  url?: string;
  size?: number;
}

export interface Message {
  id: string;
  content: string;
  attachments: Attachment[];
}

export type RawComment = {
  id?: string;
  user: { id: string; name: string; email: string };
  agent?: string; // Add agent field for AI responses
  timestamp: string;
  isCurrentMessage?: boolean;
  content: string[] | MentionType;
  attachments: string[];
  type?: string;
  reOpenedAt?: string;
};

export default function ChatInterface({ data }: { data: TicketData }) {
  const [messages, setMessages] = useState<RawComment[]>([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [chatLength, setChatLength] = useState(0);
  const [isConnectedToHuman, setIsConnectedToHuman] = useState(false);

  const {
    data: chatData,
    isLoading: isChatLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat-data-key", data?._id],
    queryFn: () => aiChatHistory({ ticketId: data!._id }),
    enabled: !!data?._id,
    refetchInterval: (query) => (query.state.error ? false : 5000),
  });

  // Combine ticket comments and AI chat history
  useEffect(() => {
    if (!data?.commentsByDate && !chatData) return;

    setLoading(true);

    // Process regular comments
    const flatComments =
      data?.commentsByDate?.flatMap((group) =>
        group.messages.map((raw) => ({
          user: {
            id: raw.byDetails._id,
            name: raw.byDetails.first_name,
            email: raw.byDetails.email,
          },
          timestamp: raw.timestamp,
          content: raw.message,
          attachments: raw.attachments,
          type: raw.type,
        }))
      ) || [];

    // Procclgess AI chat history
    const aiChats =
      chatData?.chats?.flatMap((chat) => {
        const messages: RawComment[] = [];

        // if (chat.user) {
        //   messages.push({
        //     user: {
        //       id: "user",
        //       name: "You",
        //       email: "",
        //     },
        //     timestamp: chat.timestamp,
        //     content: [chat.user],
        //     attachments: [],
        //   });
        // }

        if (chat.agent) {
          messages.push({
            user: {
              id: "ai",
              name: "Lysa AI",
              email: "",
            },
            agent: chat.agent,
            timestamp: chat.timestamp,
            content: [chat.agent],
            attachments: [],
          });

          //messages of last element isCurrentMessage we need to make this true
        }

        return messages;
      }) || [];
    if (aiChats.length > 0) {
      aiChats[aiChats.length - 1].isCurrentMessage = true;
    }
    setChatLength(aiChats.length);
    // Combine and sort all messages by timestamp
    const allMessages = [...flatComments, ...aiChats].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    setMessages(allMessages);
    setLoading(false);
  }, [data, chatData]);

  const hasSystemComment = data?.commentsByDate
    ?.flatMap((group) =>
      group.messages.map((raw) => ({
        user: {
          id: raw.byDetails._id,
          name: raw.byDetails.first_name,
          email: raw.byDetails.email,
        },
        timestamp: raw.timestamp,
        content: raw.message,
        attachments: raw.attachments,
        type: raw.type,
      }))
    )
    .some((comment) => comment.type === "system");
  const aiMutation = useMutation({
    mutationFn: aiChatAction,
    onMutate: () => {
      setIsAiResponding(true);
    },
    onSuccess: (data) => {
      // Handle streaming response if needed
      // For now, we'll assume the backend returns the complete response
      queryClient.invalidateQueries({
        queryKey: ["chat-data-key", data?._id],
      });

      setIsAiResponding(false);
    },
    onError: () => {
      toast.error("Error getting AI response");
      setIsAiResponding(false);
    },
  });

  const messageMutation = useMutation({
    mutationFn: sendChatMessage,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id", data?._id],
      });
      setLoading(false);
    },
    onError: () => {
      toast.error("Error sending message");
      setLoading(false);
    },
  });

  function htmlToApiArray(
    html: string
  ): Array<string | MentionType | MentionType> {
    const result: Array<string | MentionType | MentionType> = [];
    let lastIndex = 0;

    // same regex as before
    const mentionRegex =
      /<span[^>]*data-type="mention"[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?<\/span>/g;

    let m: RegExpExecArray | null;
    while ((m = mentionRegex.exec(html))) {
      // 1) push any HTML between the last match and this one
      if (m.index > lastIndex) {
        result.push(html.substring(lastIndex, m.index));
      }

      // 2) decode &quot; → " and parse the JSON
      try {
        const rawAttr = m[1];
        const decoded = rawAttr.replace(/&quot;/g, '"');
        const data = JSON.parse(decoded);

        const { _id, ...rest } = data;
        // user vs team by checking keys
        if ("title" in data) {
          // data.map((m) => m._id) to m.teamId
          result.push({ teamId: _id, ...rest });
        } else {
          // data.map((m) => m._id) to m.userId
          result.push({ userId: _id, ...rest });
        }
      } catch {
        // fallback to raw tag if parse fails
        result.push(m[0]);
      }

      lastIndex = mentionRegex.lastIndex;
    }

    // 3) any trailing HTML after the last mention
    if (lastIndex < html.length) {
      result.push(html.substring(lastIndex));
    }

    return result;
  }

  const handleSendMessage = async (content: string, files: File[]) => {
    const isContentEmpty = (html: string) => {
      // Remove HTML tags
      const text = html
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, "")
        .trim();
      return text === "";
    };

    if (isContentEmpty(content) && files.length === 0) return;

    setLoading(true);

    try {
      const apiMessage = htmlToApiArray(content);

      // Upload files
      const validFiles = files.filter((file) => {
        const isValidSize = file.size <= 1024 * 1024 * 5; // 5MB
        return isValidSize;
      });

      if (validFiles.length !== files.length) {
        toast.error("Some files were too large. Max size allowed is 5MB.");
      }

      let uploadedUrls: string[] = [];

      if (validFiles.length > 0) {
        const uploadPromises = validFiles.map((file) => getImageUrl({ file }));
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.map((res) => res.fileUrl);
      }

      // First send the user message
      chatLength === 4 || data?.reOpenedAt
        ? await messageMutation.mutateAsync({
            payload: {
              dialogue: { message: apiMessage, attachments: uploadedUrls },
              ticketId: data?._id,
            },
          })
        : !data?.reOpenedAt && // Then send to AI and get response
          (await aiMutation.mutateAsync({
            ticketId: data?._id,
            prompt: content.replace(/<[^>]+>/g, ""),
          }));
    } catch (error) {
      toast.error("Failed to send message.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const switchChatMutation = useMutation({
    mutationFn: switchToHumanChat,
  });

  const handleConnectToHuman = async () => {
    try {
      // Create the connection message with current timestamp
      const connectionMessage: RawComment = {
        id: Date.now().toString(),
        user: {
          id: "system",
          name: "System",
          email: "",
        },
        timestamp: new Date().toISOString(),
        content: ["Connected to Human"],
        attachments: [],
        type: "system",
      };

      // Optimistically update the UI by adding the message immediately
      setMessages((prev) => {
        // Find the index of the current message (the one with isCurrentMessage: true)
        const currentMsgIndex = prev.findIndex((msg) => msg.isCurrentMessage);

        if (currentMsgIndex >= 0) {
          // Insert the connection message after the current message
          const newMessages = [...prev];
          newMessages.splice(currentMsgIndex + 1, 0, connectionMessage);
          return newMessages;
        }

        // If no current message found, just append to the end
        return [...prev, connectionMessage];
      });

      // Send the actual request to connect to human
      await messageMutation.mutateAsync({
        payload: {
          dialogue: {
            message: ["Requesting connection to human agent"],
            attachments: [],
          },
          ticketId: data?._id,
        },
      });

      switchChatMutation.mutate({ ticketId: data?._id });

      setIsConnectedToHuman(true);
    } catch (error) {
      toast.error("Failed to connect to human agent");
      // Rollback the optimistic update if the request fails
      setMessages((prev) =>
        prev.filter((msg) => msg.content[0] !== "Connected to Human")
      );
    }
  };

  return (
    <Card className="w-full rounded-none h-full border-none shadow-none">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          {/* <pre>{JSON.stringify(chatData ?? "-", null, 2)}</pre> */}

          <CardTitle className="font-gilroyMedium font-medium">
            Messages
          </CardTitle>
        </div>
      </CardHeader>
      {/* <pre>{JSON.stringify(data ?? "-", null, 2)}</pre> */}
      <CardContent className="p-0 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 pt-4 hide-scrollbar">
            <MessageList
              messages={messages}
              setIsConnectedToHuman={setIsConnectedToHuman}
              isConnectedToHuman={isConnectedToHuman}
              chatLength={chatLength}
              mutation={aiMutation}
              ticketId={data?._id}
              loading={loading || messageMutation.isPending || isAiResponding}
              onConnectToHuman={handleConnectToHuman}
            />
          </div>
          <div className="p-4">
            <RichTextEditor
              reopenedAt={data?.reOpenedAt}
              messages={messages}
              enableEditor={chatLength}
              isClosed={data?.closedAt ? true : false}
              loading={loading || messageMutation.isPending || isAiResponding}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
