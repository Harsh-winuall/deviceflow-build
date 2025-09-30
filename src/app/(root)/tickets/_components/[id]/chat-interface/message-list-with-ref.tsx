"use client";

import { Button } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { formatChatTimestamp, isToday, isYesterday } from "@/lib/utils";
import { resolveTicket } from "@/server/ticketActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Attachments } from "./attachments";
import { RawComment } from "./chat-interface";
import { MessageListWrapper } from "./message-list.wrapper";
import { AIResponse } from "./new-rich-editor/ai-chat-markdown";
import {
  ParsedMessageContent,
  ParsedMessageSystem,
} from "./new-rich-editor/parsed-message-content";

interface MessageListProps {
  messages: RawComment[];
  isConnectedToHuman?: any;
  setIsConnectedToHuman?: any;
  chatLength?: number;
  loading?: any;
  ticketId?: string;
  mutation?: any;
  onConnectToHuman?: () => void;
}

export const MessageList = ({
  messages,
  isConnectedToHuman,
  chatLength,
  mutation,
  ticketId,
  loading,
  setIsConnectedToHuman,
  onConnectToHuman,
}: MessageListProps) => {
  const queryClient = useQueryClient();
  const now = Date.now();

  const grouped = useMemo(() => {
    return messages?.reduce((acc, msg) => {
      const day = msg?.timestamp?.slice(0, 10);
      (acc[day] ??= []).push(msg);
      return acc;
    }, {});
  }, [messages]);

  const CloseIssuemutation = useMutation({
    mutationFn: resolveTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id"],
        exact: false,
        type: "all",
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["chat-data-key", ticketId],
        exact: false,
        type: "all",
        refetchType: "all",
      });
    },
  });

  const isTicketClosed = useMemo(() => {
    return messages.some(
      (msg) => msg.type === "system" && msg.content[0].includes("closed")
    );
  }, [messages]);

  const sortedDays = Object.keys(grouped ?? []);

  return (
    <MessageListWrapper>
      {sortedDays?.map((day, i) => {
        if (!day || typeof day !== "string") return null;

        const date = new Date(day);
        if (isNaN(date.getTime())) return null;

        let label = isToday(date)
          ? "Today"
          : isYesterday(date)
          ? "Yesterday"
          : day;

        return (
          <div key={`${day}-${i + 1}`} className="flex flex-col gap-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink-0 mx-4 font-gilroyMedium text-xs text-gray-500">
                {label}
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {grouped[day].map((msg, i) => {
              const isLastIndex =
                i === grouped[day].length - 1 &&
                sortedDays.indexOf(day) === sortedDays.length - 1;
              const isLastAIMessage = msg.user.id === "ai" && isLastIndex;
              const msSince = Date.now() - new Date(msg.timestamp).getTime();
              const justArrived = msSince < 10000; // arrived in past 10 seconds
              const shouldStream = isLastAIMessage && justArrived;

              return (
                <>
                  {msg.type === "system" ? (
                    <div
                      key={`${msg.timestamp}-${i + 34}`}
                      className="flex justify-center items-start"
                    >
                      <div className="flex-1 flex items-center justify-center">
                        {msg.content[0].includes("closed") ? (
                          <ParsedMessageSystem
                            content={msg?.content}
                            className="text-xs mx-2 text-red-500 font-gilroyMedium"
                          />
                        ) : msg.content[0] === "Connected to Human" ? (
                          <ParsedMessageSystem
                            content={msg?.content}
                            className="text-xs mx-2 text-[#008910] font-gilroyMedium"
                          />
                        ) : (
                          <ParsedMessageSystem
                            content={msg?.content}
                            className="text-xs mx-2 text-[#008910] font-gilroyMedium"
                          />
                        )}
                      </div>
                    </div>
                  ) : msg.type === "comment" ? (
                    <div
                      key={`${msg.timestamp}-${i + 9}`}
                      className={`flex items-start gap-3 pt-3 
                    }`}
                    >
                      <GetAvatar
                        name={msg?.user?.name}
                        size={24}
                        className={msg.user.id === "ai" ? "bg-blue-100" : ""}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-gilroySemiBold text-sm">
                            {msg.user.name}
                          </span>
                          <span className="text-xs font-gilroyRegular text-muted-foreground">
                            {formatChatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`flex flex-col gap-3 p-2 pl-4 rounded-md ${
                            msg.user.id === "ai" ? "bg-white" : "bg-muted/40"
                          }`}
                        >
                          <ParsedMessageContent
                            content={msg?.content}
                            className={`font-gilroyMedium ${
                              msg.user.id === "ai"
                                ? "text-blue-900"
                                : "text-[#333]"
                            }`}
                          />
                          {msg.attachments?.length > 0 && (
                            <Attachments attachments={msg.attachments} />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={`${msg.timestamp}-${i + 9}`}
                      className={`flex items-start gap-3 pt-3 
                    }`}
                    >
                      <GetAvatar
                        name={msg?.user?.name}
                        size={24}
                        className={msg.user.id === "ai" ? "bg-blue-100" : ""}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-gilroySemiBold text-sm">
                            {msg.user.name}
                          </span>
                          <span className="text-xs font-gilroyRegular text-muted-foreground">
                            {formatChatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`flex flex-col gap-3 p-2 pl-4 rounded-md ${
                            msg.user.id === "ai" ? "bg-white" : "bg-muted/40"
                          }`}
                        >
                          {msg.user.id === "ai" ? (
                            <>
                              <AIResponse shouldStream={shouldStream}>
                                {msg.content[0] as string}
                              </AIResponse>
                            </>
                          ) : (
                            <ParsedMessageContent
                              content={msg?.content}
                              className={`font-gilroyMedium ${
                                msg.user.id === "ai"
                                  ? "text-blue-900"
                                  : "text-[#333]"
                              }`}
                            />
                          )}
                          {msg.attachments?.length > 0 && (
                            <Attachments attachments={msg.attachments} />
                          )}

                          {chatLength <= 3 &&
                            msg.isCurrentMessage &&
                            !isTicketClosed && (
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  disabled={loading}
                                  className="w-fit px-4 py-2 text-xs rounded-[5px]"
                                  onClick={() =>
                                    mutation.mutate(
                                      {
                                        ticketId: ticketId,
                                        prompt: "No it didnt help",
                                      },
                                      {
                                        onSuccess: () => {
                                          queryClient.invalidateQueries({
                                            queryKey: [
                                              "chat-data-key",
                                              ticketId,
                                            ],
                                          });
                                        },
                                      }
                                    )
                                  }
                                >
                                  No, Still same issue
                                </Button>
                                <Button
                                  variant="primary"
                                  disabled={loading}
                                  className="w-fit px-4 py-2 text-xs rounded-[5px]"
                                  onClick={() =>
                                    CloseIssuemutation.mutate({
                                      ticketId: ticketId,
                                      remarks:
                                        "Issue is Successfully closed by AI",
                                    })
                                  }
                                >
                                  Yes, It&apos;s helpful
                                </Button>
                              </div>
                            )}

                          {chatLength > 3 &&
                            msg.isCurrentMessage &&
                            !isTicketClosed &&
                            !isConnectedToHuman && (
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  disabled={loading}
                                  className={`w-fit px-4 py-2 text-xs rounded-[5px]`}
                                  onClick={() => {
                                    setIsConnectedToHuman(true);
                                    onConnectToHuman?.();
                                  }}
                                >
                                  Connect to Human
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        );
      })}
    </MessageListWrapper>
  );
};
