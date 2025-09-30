import { devicesFields, usersFields } from "./filterActions";
import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";
import type {
  FilterAssetsArgs,
  FilterAssetsResponse,
  FilterPeopleArgs,
  FilterPeopleResponse,
  FilterTeamsArgs,
  FilterTeamsResponse,
  FilterTicketsArgs,
  FilterTicketsResponse,
} from "./types/newFilterTypes";

const baseUrl = BASEURL;

export const filterAssets = async ({
  filters = [],
  searchQuery = "",
  page = 1,
  pageLimit = 1,
  type = "assigned",
  sortOption,
}: FilterAssetsArgs) => {
  try {
    const payloadBody = {
      fields: devicesFields,
      pageLimit,
      page,
      sortOption,
    };

    if (type === "assigned") {
      payloadBody["filters"] =
        filters?.length > 0
          ? [...filters, ["userId", "Equals", "not null"]]
          : [["userId", "Equals", "not null"]];
    } else if (type === "unassigned") {
      payloadBody["filters"] =
        filters?.length > 0
          ? [...filters, ["userId", "Equals", "null"]]
          : [["userId", "Equals", "null"]];
    } else if (type === "inactive") {
      payloadBody["isDeleted"] = true;
      payloadBody["filters"] = filters?.length > 0 ? [...filters] : [];
    }

    // console.log({ ...payloadBody, searchQuery }, "payload");

    const res = await callAPIWithToken<FilterAssetsResponse>(
      `${baseUrl}/edifybackend/v1/devices/filter/${
        searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
      }`,
      "POST",
      payloadBody
    );

    return res?.data;
  } catch (error) {
    // console.error(error);
    throw new Error("Error filtering assets");
  }
};

export const filterTeams = async ({
  filters = [],
  searchQuery = "",
  type = "active",
}: FilterTeamsArgs) => {
  try {
    const payloadBody = {
      fields: [
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
      ],
      pageLimit: 1000,
      page: 1,
      filters,
    };

    if (type === "active") {
      payloadBody["isDeleted"] = false;
    } else if (type === "inactive") {
      payloadBody["isDeleted"] = true;
    }

    // console.log({ ...payloadBody, searchQuery }, "payload");

    const res = await callAPIWithToken<FilterTeamsResponse>(
      `${baseUrl}/edifybackend/v1/teams/filter/${
        searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
      }`,
      "POST",
      payloadBody
    );

    // console.log(res?.data, "FILTER RESPONSE ");

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering teams");
  }
};

export const filterPeople = async ({
  filters = [],
  searchQuery = "",
  page = 1,
  pageLimit = 100000000,
  type = "active",
  sortOption,
}: FilterPeopleArgs) => {
  try {
    const payloadBody = {
      fields: usersFields,
      pageLimit,
      page,
      filters,
      sortOption,
    };

    if (type === "active") {
      payloadBody["isDeleted"] = false;
    } else if (type === "inactive") {
      payloadBody["isDeleted"] = true;
    }

    // console.log({ ...payloadBody, searchQuery, type }, "payload");

    const res = await callAPIWithToken<FilterPeopleResponse>(
      `${baseUrl}/edifybackend/v1/user/filter/${
        searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
      }`,
      "POST",
      payloadBody
    );

    // console.log(res?.data, "FILTER RESPONSE ");

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering people");
  }
};

export const filterTickets = async ({
  filters = [],
  searchQuery = "",
  page = 1,
  pageLimit = 1,
  type = "open",
}: FilterTicketsArgs) => {
  try {
    const payloadBody = {
      fields: [],
      pageLimit,
      page,
      filters,
    };

    if (type === "open") {
      payloadBody["status"] = "open";
    } else if (type === "closed") {
      payloadBody["status"] = "close";
    }

    // console.log({ ...payloadBody, searchQuery, type }, "payload");

    const res = await callAPIWithToken<FilterTicketsResponse>(
      `${baseUrl}/edifybackend/v1/ticket/filter/${
        searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
      }`,
      "POST",
      payloadBody
    );

    // console.log(res?.data, "FILTER RESPONSE ");

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering tickets");
  }
};
