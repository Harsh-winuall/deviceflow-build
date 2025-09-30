"use client";
import { Button as PrimaryButton } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { AIResponse } from "@/components/ui/kibo-ui/ai/response";
import { useSession } from "@/lib/providers/session-provider";
import { cn } from "@/lib/utils";
import {
  createNewChat,
  getAllChats,
  getChatById,
} from "@/server/aiAgentsActions";
import { BASEURL } from "@/server/main";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShinyText } from "../../_landing-page/meet-ai-agents";
import { MessageListWrapper } from "../../tickets/_components/[id]/chat-interface/message-list.wrapper";
import { ParsedMessageContent } from "../../tickets/_components/[id]/chat-interface/new-rich-editor/parsed-message-content";
import { TextEditor } from "./text-editor";

interface ChatMessage {
  type: "user" | "model";
  message: string;
  timestamp: string;
  isStreaming?: boolean;
  isCurrentMessage?: boolean;
}

interface Chat {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  closedAt?: string;
  chats?: ChatMessage[];
}

export const AiAgentsMain = () => {
  const [activeChat, setActiveChat] = useQueryState("chat", {
    defaultValue: "new",
  });
  const session = useSession();
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingChatId, setStreamingChatId] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Fetch all chats
  const { data: allChats, status: allChatsStatus } = useQuery({
    queryKey: ["ai-agents", "all-chats"],
    queryFn: getAllChats,
  });

  // Fetch single chat data - only when not "new"
  const {
    data: currentChatData,
    isLoading: isChatLoading,
    refetch: currentChatRefetch,
  } = useQuery({
    queryKey: ["ai-agents", "chat", activeChat],
    queryFn: () => getChatById({ id: activeChat }),
    enabled: activeChat !== "new",
  });

  // Create new chat mutation
  const newChatMutation = useMutation({
    mutationFn: createNewChat,
    onSuccess: (newChat) => {
      if (newChat?._id) {
        setActiveChat(newChat._id);
        queryClient.invalidateQueries({ queryKey: ["ai-agents", "all-chats"] });
      }
    },
  });

  // Stream AI response using Server-Sent Events
  const streamAIResponse = useCallback(
    async (chatId: string, question: string) => {
      return new Promise<string>((resolve, reject) => {
        setStreamingMessage("");
        setIsStreaming(true);
        setStreamingChatId(chatId);

        let fullMessage = "";

        const fetchStream = async () => {
          try {
            const response = await fetch(`${BASEURL}/edifybackend/v1/genAI`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.session?.user?.user?.token}`,
              },
              body: JSON.stringify({ chatId, question }),
            });

            if (response?.status === 400) {
              currentChatRefetch();
            }

            if (!response.ok) {
              currentChatRefetch();
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
              throw new Error("Readable stream not supported");
            }

            const reader = response.body
              .pipeThrough(new TextDecoderStream())
              .getReader();
            // console.log(reader);
            // const decoder = new TextDecoder();
            // console.log(decoder);

            try {
              while (true) {
                const { value, done } = await reader.read();

                if (done) {
                  break;
                }

                // const chunk = decoder.decode(value, { stream: true });

                // Accumulate the full message
                // fullMessage += value;

                // Update streaming message state
                setStreamingMessage((prev) => prev + value);
              }

              // fullMessage += await response.json();

              // setStreamingMessage(fullMessage);

              // console.log(streamingMessage);

              // Finalize message after streaming is complete
              const currentChat = queryClient.getQueryData<Chat>([
                "ai-agents",
                "chat",
                chatId,
              ]);
              if (currentChat) {
                const aiMessage: ChatMessage = {
                  type: "model",
                  message: fullMessage,
                  timestamp: new Date().toISOString(),
                  isCurrentMessage: true,
                };

                queryClient.setQueryData<Chat>(["ai-agents", "chat", chatId], {
                  ...currentChat,
                  chats: [...(currentChat.chats || []), aiMessage],
                });
              }

              // Invalidate queries to refresh data
              queryClient.invalidateQueries({
                queryKey: ["ai-agents", "all-chats"],
              });
              queryClient.invalidateQueries({
                queryKey: ["ai-agents", "chat", chatId],
              });

              resolve(fullMessage);
            } finally {
              reader.releaseLock();
            }
          } catch (error) {
            currentChatRefetch();
            reject(error);
          } finally {
            setIsStreaming(false);
            setStreamingChatId(null);
          }
        };

        fetchStream();
      });
    },
    [queryClient, streamingMessage]
  );

  // Handle sending message with proper chat creation flow
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    let targetChatId = activeChat;

    try {
      // If it's a new chat, create one first
      if (activeChat === "new") {
        const newChat = await newChatMutation.mutateAsync();
        if (newChat?._id) {
          targetChatId = newChat._id;
          setActiveChat(newChat._id);
        } else {
          throw new Error("Failed to create new chat");
        }
      }

      // Add user message to cache immediately
      const currentChat = queryClient.getQueryData<Chat>([
        "ai-agents",
        "chat",
        targetChatId,
      ]);
      const userMessage: ChatMessage = {
        type: "user",
        message: content,
        timestamp: new Date().toISOString(),
      };

      if (currentChat) {
        queryClient.setQueryData<Chat>(["ai-agents", "chat", targetChatId], {
          ...currentChat,
          chats: [...(currentChat.chats || []), userMessage],
        });
      } else {
        // If no current chat data, create initial structure
        queryClient.setQueryData<Chat>(["ai-agents", "chat", targetChatId], {
          _id: targetChatId,
          chats: [userMessage],
        });
      }

      // Start streaming AI response
      await streamAIResponse(targetChatId, content);
    } catch (error) {
      setIsStreaming(false);
      setStreamingChatId(null);
      setStreamingMessage("");
    }
  };

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    // Close any active streaming
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsStreaming(false);
      setStreamingChatId(null);
      setStreamingMessage("");
    }
    setActiveChat(chatId);
  };

  // Suggested prompts
  const suggestedPrompts = [
    "How many members are in my company?",
    "How many teams are there?",
    "List unassigned devices in a table format.",
    "Show active members in my company.",
    "List all subscriptions in my company.",
  ];

  // Get current messages
  const currentMessages = currentChatData?.chats ?? [];

  // Render chat content based on active chat
  const renderChatContent = () => {
    if (activeChat === "new") {
      return (
        <div className="flex-1 mt-0 justify-center items-center w-full flex flex-col-reverse h-full bg-white border border-[#E5E5E5] rounded-[10px]">
          <div className="w-full flex justify-center px-4 pb-10 pt-5">
            <div className="w-[90%]">
              <TextEditor
                onSendMessage={handleSendMessage}
                loading={isStreaming}
                isClosed={isStreaming}
              />
              <p className="font-gilroyMedium text-[10px] -mb-6 mt-1 text-[#756f6f] text-right">
                FlowGPT can make mistakes.
              </p>
            </div>
          </div>
          <MessageListWrapper className="justify-center">
            <div className="w-full h-full items-center justify-center flex flex-col gap-0">
              <h1 className="text-xl text-center font-gilroySemiBold">
                Hey, How may I help you?
              </h1>
              <p className="text-[#808080] text-center py-1 text-[13px] font-gilroyMedium">
                I'm here to assist you with anything you need — feel free to ask
                questions, get
                <br /> support, or explore options!
              </p>
              <p className="text-[#808080] py-5 text-center text-[13px] font-gilroyMedium">
                Try these prompts
              </p>
              <div className="flex justify-center gap-2 pb-2 items-center flex-wrap">
                {suggestedPrompts.slice(0, 2).map((prompt, index) => (
                  <PrimaryButton
                    key={index}
                    className="rounded-md"
                    variant="outlineTwo"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isStreaming}
                  >
                    {prompt}
                  </PrimaryButton>
                ))}
              </div>
              <div className="flex gap-2 justify-center items-center flex-wrap">
                {suggestedPrompts.slice(2).map((prompt, index) => (
                  <PrimaryButton
                    key={index + 2}
                    className="rounded-md"
                    variant="outlineTwo"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isStreaming}
                  >
                    {prompt}
                  </PrimaryButton>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-center text-[#237B07] text-sm font-gilroySemiBold mt-4">
                <div className="relative flex items-center justify-center size-2.5 rounded-full bg-[#C8F2BB]">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#349915] opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#349915]"></span>
                </div>
                New onboarding workflow ready! Say "Hey! Onboard {"Name"}" to
                use it.
              </div>
            </div>
          </MessageListWrapper>
        </div>
      );
    }

    return (
      <div className="mt-0 w-full h-full flex flex-col-reverse bg-white border border-[#E5E5E5] rounded-[10px]">
        <div className="w-full flex justify-center px-4 pb-10 pt-5">
          <div className="w-[90%]">
            <TextEditor
              onSendMessage={handleSendMessage}
              loading={isStreaming}
            />
            <p className="font-gilroyMedium text-[10px] -mb-6 mt-1 text-[#ccc] text-right">
              FlowGPT can make mistakes.
            </p>
          </div>
        </div>
        <MessageListWrapper outerDivClassName="flex-1 relative h-[50vh] w-full justify-center items-center">
          <div className="absolute top-0 h-20  bg-gradient-to-b from-white/100 via-white/80 from-10% via-50% to-90% to-white/5  w-full left-0 rounded-t-xl"></div>
          {isChatLoading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : (
            <div className="w-full flex justify-center mt-10">
              <div className="space-y-4 w-[90%]">
                {currentMessages.map((msg, index) => (
                  <div
                    key={`${msg.timestamp}-${index}`}
                    className={cn(
                      "flex items-start gap-1 pt-3",
                      msg.type === "model"
                        ? "flex-row w-full"
                        : "flex-row-reverse"
                    )}
                  >
                    {msg.type !== "model" ? (
                      <GetAvatar
                        name={
                          msg.type === "model"
                            ? "Lysa AI"
                            : `${session?.session?.user?.user?.firstName} (Me)`
                        }
                        size={24}
                        isDeviceAvatar={msg.type === "model"}
                        className={msg.type === "model" ? "bg-blue-100" : ""}
                      />
                    ) : (
                      <div
                        className={`flex items-center bg-green-800 justify-center rounded-full font-gilroyMedium flex-shrink-0`}
                        style={{
                          width: 24,
                          height: 24,
                          color: "#fff",
                          fontSize: 24 * 0.4,
                        }}
                      >
                        AI
                      </div>
                    )}

                    <div
                      className={cn(
                        "space-y-2",
                        msg.type !== "model" ? "w-fit" : "w-full" // fixed width only for user
                      )}
                    >
                      <div
                        className={cn(
                          `flex font-gilroyMedium break-words text-sm px-2 pb-2 rounded-md`,
                          msg.type === "model"
                            ? "bg-white text-left"
                            : "bg-muted/40 text-right pt-2 ml-auto"
                        )}
                      >
                        {msg.type === "model" ? (
                          <AIResponse className="font-gilroyMedium w-[75%] text-sm">
                            {msg.message.replace(/\n/g, "  \n")}
                          </AIResponse>
                        ) : (
                          <ParsedMessageContent
                            content={[msg.message.replace(/\n/g, "  \n")]}
                            className="font-gilroyMedium text-[#333] w-fit text-pretty"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* {JSON.stringify(isStreaming)} */}
                {/* Show streaming message only for current chat */}
                {isStreaming && streamingChatId === activeChat && (
                  <div className="flex items-start gap-3 pt-3">
                    <div
                      className={`flex items-center bg-green-800 justify-center rounded-full font-gilroyMedium flex-shrink-0`}
                      style={{
                        width: 24,
                        height: 24,
                        color: "#fff",
                        fontSize: 24 * 0.4,
                      }}
                    >
                      AI
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShinyText
                          text="AI is thinking..."
                          speed={2}
                          className="text-sm font-gilroyMedium"
                        />
                      </div>
                      <div className="flex flex-col gap-3 p-2 pl-4 break-words font-gilroyMedium rounded-md bg-white">
                        <AIResponse className="font-gilroyMedium w-[75%] text-sm white whitespace-pre-line">
                          {streamingMessage.replace(/\n/g, " \n")}
                        </AIResponse>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </MessageListWrapper>
      </div>
    );
  };

  return (
    <div className="flex hide-scrollbar flex-col w-full justify-center items-start min-h-[83vh] max-h-full 2xl:min-h-0 2xl:max-h-screen">
      <section className="flex rounded-md p-5 gap-4 w-[99%] overflow-y-auto h-[86dvh] 2xl:h-[88vh]">
        <div className="w-full h-full flex gap-4">
          <div className="bg-white flex flex-col gap-3 items-start justify-start border w-72 border-[#E5E5E5] rounded-[10px] p-4">
            <div className="flex items-center justify-between w-full mb-3">
              <h1 className="text-xl text-black font-gilroySemiBold">
                FlowGPT
              </h1>
            </div>

            <button
              onClick={() => handleChatSelect("new")}
              className={cn(
                "w-full items-center bg-neutral-50 text-sm font-gilroyMedium hover:bg-neutral-100 flex p-2 rounded-md transition-colors"
              )}
            >
              New Chat
            </button>

            <div className="flex flex-col w-full gap-2 mt-3">
              {allChatsStatus === "pending" && (
                <Loader2 className="mx-auto size-4 animate-spin" />
              )}
              {allChatsStatus === "error" && (
                <p className="text-center text-xs font-gilroyMedium text-destructive/80">
                  An error occurred while loading chats.
                </p>
              )}

              {allChatsStatus === "success" &&
                allChats &&
                allChats.length > 0 && (
                  <>
                    <span className="font-gilroyMedium text-sm">
                      Recent Searches
                    </span>

                    <div className="w-full h-[55vh] flex flex-col gap-2 overflow-y-auto hide-scrollbar">
                      {allChats.map((chatItem) => (
                        <button
                          key={chatItem._id}
                          onClick={() => handleChatSelect(chatItem._id || "")}
                          className={cn(
                            "w-full bg-neutral-50 font-gilroyMedium text-sm hover:bg-neutral-100 text-left justify-start p-2 rounded-md transition-colors",
                            activeChat === chatItem._id && "bg-neutral-100"
                          )}
                        >
                          <span className="line-clamp-1">
                            {chatItem?.title || "New Chat"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
            </div>
          </div>

          <div className="flex-1">{renderChatContent()}</div>
        </div>
      </section>
    </div>
  );
};
