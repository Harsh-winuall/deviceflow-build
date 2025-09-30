import { AxiosError } from "axios";
import { callAPIWithToken, getSession } from "./helper";
import { BASEURL } from "./main";
import { User } from "./userActions";
import { MentionType } from "@/app/(root)/tickets/_components/[id]/chat-interface/new-rich-editor/rich-text-editor";

export type GlobalSearchUserTeams = {
  users: {
    _id: string;
    first_name: string;
    email: string;
  }[];
  teams: {
    _id: string;
    title: string;
    description: string;
    team_code: string;
  }[];
};

export async function fetchUsersTeams(query: string) {
  try {
    // console.log(query);

    const apiUrl = `${BASEURL}/edifybackend/v1/globalSearch/user-teams`;
    const body = { searchQuery: query };

    const response = await callAPIWithToken<GlobalSearchUserTeams>(
      apiUrl,
      "POST",
      body
    );

    return response.data;
  } catch (err: any) {
    throw new Error(err?.response ?? "Failed to search.");
  }
}

export type ChatPayload = {
  dialogue: {
    message: (string | MentionType)[];
    attachments: string[];
  };
  ticketId: string;
};

export async function sendChatMessage({ payload }: { payload: ChatPayload }) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/ticket/comment`;

    const res = await callAPIWithToken(apiUrl, "PATCH", { ...payload });

    // console.log(res);

    return res.data;
  } catch (error) {
    throw new Error("Failed to send chat message");
  }
}

type AssignedToItem =
  | {
      title: string;
      teamId: string;
    }
  | {
      first_name: string;
      email: string;
      userId: string;
    };

type OpenedByDetails = User;

type DeviceImage = {
  url: string;
  _id: string;
};

type DeviceDetails = {
  _id: string;
  userId: string;
  orgId: string;
  addressId: string | null;
  device_name: string;
  asset_serial_no: string | null;
  serial_no: string;
  device_type: string;
  ram: string;
  processor: string;
  storage: string[];
  custom_model: string;
  brand: string;
  warranty_status: boolean;
  warranty_expiary_date: string;
  device_purchase_date: string;
  purchase_value: number;
  payable: number;
  os: string;
  is_trending: boolean;
  isBestDeal: boolean;
  isBestSeller: boolean;
  latest_release: boolean;
  deleted_at: string | null;
  assigned_at: string;
  image: DeviceImage[];
  device_condition: string;
  qty: number;
  perfectFor: string[];
  deviceFeatures: string[];
  config: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type CommentMessage = {
  timestamp?: string;
  message: MentionType | string[];
  messageBy: string;
  attachments?: string[];
  _id?: string;
  date?: string;
  byDetails?: User;
  type?: string;
};

type CommentByDate = {
  date: string | null;
  messages: CommentMessage[];
};

export type TicketData = {
  _id: string;
  category: string;
  code: string;
  assignedTo: AssignedToItem[];
  severity: string;
  description: string;
  images: string[];
  tags?: { tag: string; _id: string }[];
  openedOn: string;
  closedAt: string | null;
  openedByDetails: OpenedByDetails;
  deviceDetails: DeviceDetails;
  commentsByDate: CommentByDate[];
  reOpenedAt?: string | null;
};

export const createTicket = async (
  issueData: any
): Promise<any | undefined> => {
  const sess = await getSession();
  try {
    if (sess?.user) {
      const issue = {
        ...issueData,
      };
      const res = await callAPIWithToken<any>(
        `${BASEURL}/edifybackend/v1/ticket`,
        "POST",
        issue
      );
      return res?.data;
    }
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

export const getTicketById = async function (ticketId: string) {
  try {
    const res = await callAPIWithToken<TicketData>(
      `${BASEURL}/edifybackend/v1/ticket?ticketId=${ticketId}`,
      "GET",
      null
    );

    // console.log(ticketId, "from server");

    // console.log(res.data, "from server");

    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch Ticket");
  }
};

export const updateTicket = async function (ticketId: string, payload: any) {
  try {
    const res = await callAPIWithToken<TicketData>(
      `${BASEURL}/edifybackend/v1/ticket/${ticketId}`,
      "PUT",
      payload
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch Ticket");
  }
};

export const addTags = async function ({
  tags,
  ticketId,
}: {
  tags: string[];
  ticketId: string;
}) {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/ticket/addTag`,
      "PATCH",
      { tag: tags, ticketId }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to add Tags");
  }
};

export const removeTags = async function ({
  tag_id,
  ticketId,
}: {
  tag_id: string;
  ticketId: string;
}) {
  try {
    // console.log(tag_id, ticketId);
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/ticket/remTag`,
      "PATCH",
      { tag_id, ticketId }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to remove Tags");
  }
};

export const resolveTicket = async function ({
  ticketId,
  remarks,
}: {
  ticketId: string;
  remarks?: string;
}) {
  try {
    const res = await callAPIWithToken<TicketData>(
      `${BASEURL}/edifybackend/v1/ticket/close`,
      "POST",
      { ticketId, remarks }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to resolve Ticket");
  }
};

export const reopenTicket = async function ({
  ticketId,
  remarks,
}: {
  ticketId: string;
  remarks?: string;
}) {
  try {
    const res = await callAPIWithToken<TicketData>(
      `${BASEURL}/edifybackend/v1/ticket/reOpen`,
      "POST",
      { ticketId, remarks }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to Remove Ticket");
  }
};

export const getAllTickets = async function ({
  status,
  searchQuery,
}: {
  status: string;
  searchQuery: string;
}) {
  try {
    const res = await callAPIWithToken<any>(
      !searchQuery
        ? `${BASEURL}/edifybackend/v1/ticket?status=${status}`
        : `${BASEURL}/edifybackend/v1/ticket?status=${status}&searchQuery=${searchQuery}`,
      "GET",
      null
    );
    // console.log(status);

    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch Ticket");
  }
};

export const getAllTicketsEmployee = async function () {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/ticket`,
      "GET",
      null
    );
    // console.log(status);

    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch Ticket");
  }
};

export const aiChatAction = async function ({
  ticketId,
  prompt,
}: {
  ticketId: string;
  prompt?: string;
}) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/ai-chat/${ticketId}`;
    const body = { prompt };
    const response = await callAPIWithToken<Record<string, any[]>>(
      apiUrl,
      "POST",
      body
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};

type ChatResponse = {
  ticketId: string;
  chats: {
    user?: string;
    agent?: string;
    timestamp: string;
    _id: string;
  }[];
};

export const aiChatHistory = async function ({
  ticketId,
}: {
  ticketId: string;
}): Promise<ChatResponse> {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/ai-chat/chat/${ticketId}`;

    const response = await callAPIWithToken<ChatResponse>(apiUrl, "GET");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};

export const switchToHumanChat = async function ({
  ticketId,
}: {
  ticketId: string;
}) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/ticket/aiSwitch/${ticketId}`;

    const response = await callAPIWithToken<ChatResponse>(apiUrl, "PATCH", {});

    return response.data;
  } catch (error) {
    throw new Error("Failed to switch chat");
  }
};
