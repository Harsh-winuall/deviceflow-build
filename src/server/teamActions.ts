"use server";

import { AxiosError } from "axios";
import { FilterApiParams } from "./filterActions";
import { callAPIWithToken, getSession } from "./helper";
import { BASEURL } from "./main";
import { User } from "./userActions";

const baseUrl = BASEURL;

export type Team = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  size?: string;
  employees_count?: number;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
  team_code?: string;
  orgId?: string | null;
  __v?: number;
  active_manager?:
    | { _id: string; first_name: string; image?: string }[]
    | string;
  manager?: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    image?: string;
  }[];
};

export type TeamsResponse = {
  teams: Team[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

const teamFields = [
  "title",
  "description",
  "createdAt",
  "updatedAt",
  "image",
  "employees_count",
  "orgId",
  "deleted_at",
  "team_code",
  "manager",
];

export const fetchTeams = async ({
  filters = [],
  fields = teamFields,
  searchQuery = "",
  pageLimit = 200000,
  page = 1,
  isDeleted = false,
}: FilterApiParams = {}): Promise<Team[]> => {
  try {
    const payload = {
      fields,
      filters: filters?.length > 0 ? filters : [],
      pageLimit,
      page,
      isDeleted,
    };
    // console.log("teams api");

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/teams/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<TeamsResponse>(apiUrl, "POST", payload);
    // Check if response has data
    // console.log(res.data, "TEam actions");
    if (res && res?.data) {
      return res?.data.teams;
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    // Throw more specific error message
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter teams. Please try again later."
    );
  }
};
export const fetchActiveTeams = async ({
  filters = [],
  fields = teamFields,
  searchQuery = "",
  pageLimit = 10000,
  page = 1,
  isDeleted,
}: FilterApiParams = {}): Promise<any> => {
  try {
    const payload = {
      fields,
      filters: filters?.length > 0 ? filters : [],
      pageLimit,
      page,
      isDeleted,
    };
    // console.log("teams api");

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/teams/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<TeamsResponse>(apiUrl, "POST", payload);
    // Check if response has data
    // console.log(res.data, "TEam actions");
    if (res && res?.data) {
      return res?.data;
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    // Throw more specific error message
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter teams. Please try again later."
    );
  }
};

export async function createTeam({
  title,
  userId,
}: {
  title: string;

  userId?: string;
}): Promise<Team> {
  try {
    const sess = await getSession();

    const res = await callAPIWithToken<Team>(
      `${baseUrl}/edifybackend/v1/teams`, // API endpoint
      "POST", // HTTP method
      {
        title,

        orgId: sess?.user?.user?.orgId?._id,
        userId: userId,
      }
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to create team");
  }
}

export const getTeamById = async (teamId: string) => {
  try {
    const res = await callAPIWithToken<Team>(
      `${baseUrl}/edifybackend/v1/teams/${teamId}`, // API endpoint
      "GET", // HTTP method
      null
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch team");
  }
};

export async function updateTeam(
  id: string,
  team:
    | Team
    | {
        deleted_at?: string | null;
        orgId?: string | null;
        userId?: string | null;
      }
): Promise<Team> {
  try {
    const res = await callAPIWithToken<Team>(
      `${baseUrl}/edifybackend/v1/teams/${id}`, // API endpoint
      "PUT", // HTTP method
      {
        ...team,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to Update team");
  }
}

export async function deleteTeam<Team>(teamId: string) {
  try {
    const res = await callAPIWithToken<Team>(
      `${baseUrl}/edifybackend/v1/teams/${teamId}`, // API endpoint
      "DELETE",
      {}
    );
    return res?.data;
  } catch (e: any) {
    throw e;
  }
}

export async function fetchNotInTeamPeople() {
  try {
    const res = await callAPIWithToken<{ users: User[] }>(
      `${BASEURL}/edifybackend/v1/teams/not-in-team`,
      "GET"
    );
    // console.log(res?.data);
    return res.data?.users;
  } catch (error) {
    throw new Error("Failed to fetch people");
  }
}

export const teamActivityLog = async (teamId: string) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/activitylog/team/${teamId}`,
      "GET"
    );

    return res?.data;
  } catch (e) {
    console.error("API error:", e); // 👈 Add this
    throw new Error((e as AxiosError)?.message);
  }
};
