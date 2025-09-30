import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";

export async function createNewChat() {
  try {
    const res = await callAPIWithToken<GetChatByIdResponse>(
      `${BASEURL}/edifybackend/v1/genAI/create`,
      "POST",
      {}
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to create new chat");
  }
}

export async function sendAiChatMessage({
  chatId,
  question,
}: {
  question: string;
  chatId: string;
}) {
  try {
    const res = await callAPIWithToken<string>(
      `${BASEURL}/edifybackend/v1/genAI`,
      "POST",
      { chatId, question }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to send chat message");
  }
}

export type GetAllChatsResponse = {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  closedAt?: string;
};

export async function getAllChats() {
  try {
    const res = await callAPIWithToken<GetAllChatsResponse[]>(
      `${BASEURL}/edifybackend/v1/genAI/get`,
      "GET"
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to get all chats");
  }
}

export type GetChatByIdResponse = {
  closedAt?: string | null;
  _id?: string;
  orgId?: string;
  userId?: string;
  chats?: {
    type?: string;
    message?: string;
    timestamp?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  title?: string | null;
};

export async function getChatById({ id }: { id: string }) {
  try {
    const res = await callAPIWithToken<GetChatByIdResponse>(
      `${BASEURL}/edifybackend/v1/genAI/get?chatId=${id}`,
      "GET"
    );

    return res.data?.[0];
  } catch (error) {
    throw new Error("Failed to get chat");
  }
}
