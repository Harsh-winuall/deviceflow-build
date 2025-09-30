import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";

export interface LogEntry {
  _id: string;
  orgId: string;
  logType: "device" | "user";
  actor: {
    userId: string;
    name: string;
    role: number;
  };
  target: {
    userId: string;
    userName: string;
    deviceId?: string;
    deviceName?: string;
    deviceSerialNumber?: string;
    issueId?: string;
    issueText?: string;
    teamId?: string;
    teamName?: string;
    teamCode?: string;
  };
  action:
    | "device-added"
    | "issue-raised"
    | "issue-closed"
    | "assign-device"
    | "un-assign-device"
    | "created-team";
  createdAt: string;
  __v: number;
}

export interface LogsResponse {
  logs: LogEntry[];
}

import { AxiosError } from "axios";
// const BASEURL = "https://1e82-34-47-179-100.ngrok-free.app";
export const userActivityLog = async (userId: string) => {
  try {
    const res = await callAPIWithToken<{}>(
      `${BASEURL}/edifybackend/v1/activitylog/user/${userId}`,
      "GET"
    );

    return res?.data;
  } catch (e) {
    console.error("API error:", e); // 👈 Add this
    throw new Error((e as AxiosError)?.message);
  }
};

export const assetActivityLog = async (deviceId: string) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/activitylog/device/${deviceId}`,
      "GET"
    );

    return res?.data;
  } catch (e) {
    console.error("API error:", e); // 👈 Add this
    throw new Error((e as AxiosError)?.message);
  }
};
