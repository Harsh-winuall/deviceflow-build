import { StoreDevice } from "./deviceActions";
import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";
import { UserResponse } from "./userActions";

const baseUrl = BASEURL;

export interface FilterApiParams {
  filters?: any[][];
  fields?: string[];
  searchQuery?: string;
  pageLength?: number;
  pageLimit?: number;
  page?: number;
  isDeleted?: boolean;
}
export interface activeFilterApiParams {
  filters?: any[][];
  fields?: string[];
  searchQuery?: string;
  pageLimit?: number;
  page?: number;
  isDeleted?: boolean;
}
export interface inactiveFilterApiParams {
  filters?: any[][];
  fields?: string[];
  searchQuery?: string;
  pageLimit?: number;
  page?: number;
  isDeleted?: boolean;
}

export const devicesFilterFields = [
  { label: "Device Name", value: "device_name" },
  { label: "Device Type", value: "device_type" },
  { label: "OS", value: "os" },
  { label: "Brand", value: "brand" },
  { label: "Serial No", value: "serial_no" },
  { label: "Assigned To", value: "userName" },
  { label: "RAM", value: "ram" },
  { label: "Warranty Expiry Date", value: "warranty_expiary_date" },
  { label: "Price", value: "purchase_value" },
  { label: "Warranty Status", value: "warranty_status" },
  { label: "Storage", value: "storage" },
  // ...rest of the fields
];

export const devicesFields = [
  "device_name",
  "device_type",
  "os",
  "image",
  "brand",
  "custom_model",
  "asset_serial_no",
  "ownership",
  "processor",
  "end_life",
  "purchase_order",
  "purchase_value",
  "userName",
  "ram",
  "userId",
  "serial_no",
  "deleted_at",
  "storage",
  "device_condition",
  "warranty_expiary_date",
  "device_purchase_date",
  "payable",

  "assigned_at",
  "warranty_status",
  // Fields from the db model that were missing
  "orgId",
  "addressId",
  "description",
  "invoice",
  "perfectFor",
  "deviceFeatures",
  "is_trending",
  "latest_release",
  "is_charger_provided",
  "config",
];

export const userFilterFields = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Gender", value: "gender" },
  { label: "Employement type", value: "employment_type" },
  { label: "Role", value: "role" },
  { label: "Designation", value: "designation" },
  { label: "Reporting Manager", value: "reporting_manager" },
  { label: "Onboarding date", value: "onboarding_date" },
];
export const usersFields = [
  "first_name",
  "last_name",
  "gender",
  "date_of_birth",
  "marital_status",
  "physically_handicapped",
  "about",
  "image",
  "interests_and_hobbies",
  "role",
  "designation",
  "employment_type",
  "emp_id",
  "onboarding_date",
  "reporting_manager",
  "email",
  "phone",
  "deleted_at",
];

export const activeUsers = async ({
  filters = [],
  fields = usersFields,
  searchQuery = "",
  isDeleted,
  page = 1,
  pageLimit = 20,
}: activeFilterApiParams = {}): Promise<any> => {
  try {
    const payload = {
      fields,
      filters: filters?.length > 0 ? filters : [],
      page,
      pageLimit,
      isDeleted,
    };

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/user/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<UserResponse>(apiUrl, "POST", payload);
    // Check if response has data
    if (res && res?.data) {
      return res?.data; // Return the filtered data
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    // Throw more specific error message
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter Users. Please try again later."
    );
  }
};

export const assignedAssets = async ({
  filters = [],
  fields = devicesFields,
  searchQuery = "",
  page = 1,
  pageLimit = 20,
  isDeleted,
}: FilterApiParams = {}): Promise<any> => {
  try {
    const payload = {
      fields,
      filters: filters?.length > 0 ? filters : [],
      page,
      pageLimit,
      isDeleted,
    };

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/devices/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<StoreDevice[]>(apiUrl, "POST", payload);

    // Check and return response data
    if (res && res?.data) {
      return res?.data;
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter devices. Please try again later."
    );
  }
};

export const unAssignedAssets = async ({
  filters = [],
  fields = devicesFields,
  searchQuery = "",
  page = 1,
  pageLimit = 50000000,
}: FilterApiParams = {}): Promise<any> => {
  try {
    const payload = {
      fields,
      filters:
        filters?.length > 0
          ? [...filters, ["userId", "null"]]
          : [["userId", "null"]],
      page: page,
      pageLimit,
    };

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/devices/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<StoreDevice[]>(apiUrl, "POST", payload);

    // Check and return response data
    if (res && res?.data) {
      return res?.data;
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter devices. Please try again later."
    );
  }
};

export const inActiveAssets = async ({
  filters = [],
  fields = devicesFields,
  searchQuery = "",
  page = 1,
  pageLimit = 5000000,
  isDeleted = true,
}: inactiveFilterApiParams = {}): Promise<any> => {
  try {
    const payload = {
      fields,
      filters: filters?.length > 0 ? filters : [],
      page,
      pageLimit,
      isDeleted,
    };

    // Construct the URL with an optional search query
    const apiUrl = `${baseUrl}/edifybackend/v1/devices/filter${
      searchQuery ? `?searchQuery=${encodeURIComponent(searchQuery)}` : ""
    }`;

    // API call
    const res = await callAPIWithToken<StoreDevice[]>(apiUrl, "POST", payload);

    // Check and return response data
    if (res && res?.data) {
      return res?.data;
    } else {
      throw new Error("No data received from the API");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to filter devices. Please try again later."
    );
  }
};
