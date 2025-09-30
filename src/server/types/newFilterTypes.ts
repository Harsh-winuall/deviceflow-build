import { Device } from "../deviceActions";
import { Team } from "../teamActions";
import { TicketData } from "../ticketActions";
import { User } from "../userActions";

export type FilterSelection = { [key: string]: string[] };

export type FilterAssetsResponse = {
  devices: Device[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  filterOptions: {
    // warrantyStatus: boolean[];
    [key: string]: string[];
  };
};

export type FilterAssetsArgs = {
  filters?: string[][];
  searchQuery?: string;
  page?: number;
  pageLimit?: number;
  type?: "assigned" | "unassigned" | "inactive";
  sortOption: string
};

export type FilterTeamsResponse = {
  teams: Team[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  filterOptions: {
    [key: string]: string[];
  };
};

export type FilterTeamsArgs = {
  filters?: string[][];
  searchQuery?: string;
  type?: "active" | "inactive";
};

export type FilterPeopleResponse = {
  users: User[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  filterOptions: {
    // warrantyStatus: boolean[];
    [key: string]: string[];
  };
};

export type FilterPeopleArgs = {
  filters?: string[][];
  searchQuery?: string;
  page?: number;
  pageLimit?: number;
  type?: "active" | "inactive";
  sortOption?: string
};

export type FilterTicketsResponse = {
  tickets: TicketData[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  filterOptions: {
    // warrantyStatus: boolean[];
    [key: string]: string[];
  };
};

export type FilterTicketsArgs = {
  filters?: string[][];
  searchQuery?: string;
  page?: number;
  pageLimit?: number;
  type?: "open" | "closed";
};
