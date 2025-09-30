"use server";
import { redirect } from "next/navigation";
import { callAPIWithToken, getSession } from "./helper";
import { AxiosError } from "axios";
import { BASEURL } from "./main";
import { Ticket, User } from "./userActions";
export type QCDetail = {
  serial_no: string;
  scannedBy: string;
  score: string;
  condition: string;
  date: string; // ISO date string
};

export interface Software {
  _id: string;
  deleted_at: string;
  licenseKey: string;
  licenseName: string;
  device_type: string;
  used_licenses: number;
  total_licenses: number;
  billingCycle: string;
  validity: string; // ISO date string
  purchased_at: string; // ISO date string
  payable: number;
  associatedDevices: Device[];
  userDetails: User[];
  totalAssociatedDevices: number;
  totalUsers: number;
}

export type StoreDevice = {
  _id?: string;
  is_temp_assigned?: boolean;
  team?: string;
  qcDetails?: QCDetail[];
  duration?: string;
  teams?: string;
  upload_docs: string[];
  createdAt?: string;
  qty?: number | null;
  software?: Software[];
  updatedAt?: string;
  device_name?: string;
  device_type?: string;
  asset_serial_no?: string | null;
  serial_no?: string | null;
  ram?: string | null;
  processor?: string | null;
  storage?: string[] | null;
  custom_model?: string | null;
  brand?: string | null;
  warranty_status?: boolean;
  warranty_expiary_date?: string | null; // Assuming this is a date string
  ownership?: string | null;
  purchase_order?: string | null;
  purchase_value?: number | null;
  payable?: number | null;
  os?: string | null;
  image?: { url: string; color: string }[] | null; // Array of image objects
  invoice?: string | null;
  deleted_at?: string | null; // Assuming this is a date string
  device_purchase_date?: string | null; // Assuming this is a date string
  assigned_at?: string | null; // Assuming this is a date string
  userName?: string | null;
  email?: string | null;
  phone?: string | null;
  designation?: string | null;
  userId?: string | null;
  shelfId?: string;
  tickets?: Ticket[];
  roomNumber?: string;
  floor?: string;
  city?: string | null;
  asset_tag?: string;
  addressId?: string | null;
  perfectFor?: { title?: string }[] | null; // Array of objects with `title` property
  deviceFeatures?:
    | {
        title?: string;
        features?: { title: string; value: string }[];
      }[]
    | null; // Array of feature groups with titles and feature lists
  orgId?: string | null;
  ratings?: unknown[]; // Could specify a type if known
  overallReviews?: number | null;
  overallRating?: number | null;
  ratingDetails?: {
    stars?: number;
    percentage?: number;
    reviewsCount?: number;
  }[];
  reviews?: {
    _id?: string; // MongoDB ObjectId, typically a string
    comment?: string;
    rating?: number; // Assuming ratings are numbers (e.g., 1 to 5)
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    image?: string; // Path or filename for the image
    role?: number; // Assuming roles are represented as numbers
    name?: string;
  }[];
  latest_release?: boolean;
  is_trending?: boolean;
  issues?: IssueData[];
  is_charger_provided?: boolean;
  description?: string;
  config?: { key: string; value: string }[];
  device_condition?: string;
};

//Device type
export type Device = StoreDevice;
export type getAllDevicesProp = Device[];
export type StoreDevicesRes = StoreDevice[];
export type DeviceResponse = {
  devices: StoreDevice[]; // Changed from 'devices' to 'documents'
  total_pages: number;
  current_page: number;
  total: number;
};

// Creating Devices
export const createDevices = async (
  device: Device
): Promise<Device | undefined> => {
  try {
    // Prepare device data with proper types

    // API call
    const sess = await getSession();

    // Flatten the payload
    const payload = {
      ...device,
      orgId: sess?.user?.user?.orgId?._id,
    };

    const res = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices`,
      "POST",
      payload
    );
    console.log("PAYLOAD", payload);
    // console.log("LIcense data", res?.data);
    return res?.data;
  } catch (error: any) {
    // Ensure the error is typed as AxiosError
    if (error instanceof AxiosError) {
      // Handle AxiosError specifically
      if (error?.response && error?.response?.status === 401) {
        redirect("/login");
      } else {
        // Throw a new error with the message from AxiosError
        throw new Error(error?.message || "Failed to create device");
      }
    } else {
      // Handle any other unexpected errors
      throw new Error(error.message);
    }
  }
};

//Update Devices
export const updateDevice = async (
  deviceId: string,
  deviceData: Device | any
): Promise<Device | undefined> => {
  try {
    // API call
    console.log(deviceData);
    const res = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices/${deviceId}`,
      "PUT",
      deviceData
    );

    console.log(res?.data);

    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

//DELETE Devices
export async function deleteDevice(
  deviceId: string
): Promise<Device | undefined> {
  try {
    const deletedDevice = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices/${deviceId}`,
      "DELETE",
      {}
    );

    return deletedDevice?.data;
  } catch (e: any) {
    throw e;
  }
}

// Permanent Delete Device

export async function permanentDeleteDevice(
  deviceId: string
): Promise<Device | undefined> {
  try {
    const deleletedDevice = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices/bulk-delete?permanent=true`,
      "DELETE",
      {}
    );

    return deleletedDevice?.data;
  } catch (e: any) {
    throw e;
  }
}

//Upload bulk device

export const bulkUploadDevices = async (
  formData: FormData
): Promise<Device> => {
  try {
    // Call the API with multipart/form-data
    const response = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices/upload`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const bulkAssignDevices = async (
  formData: FormData
): Promise<Device | any> => {
  try {
    // Call the API with multipart/form-data
    const response = await callAPIWithToken<Device | any>(
      `${BASEURL}/edifybackend/v1/devices/bulk-upload-assign`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const bulkDeleteAssets = async (
  deviceIds: string[],
  type: string
): Promise<any> => {
  try {
    const response = await callAPIWithToken(
      type !== "soft"
        ? `${BASEURL}/edifybackend/v1/devices/bulk-delete?permanent=true`
        : `${BASEURL}/edifybackend/v1/devices/bulk-delete`,
      "POST",
      { deviceIds },
      {
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const bulkAssetsUnassign = async (deviceIds: string[]): Promise<any> => {
  try {
    const response = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/devices/Bulk-unassign`,
      "PATCH",
      { deviceIds },
      {
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createDeviceLocation = async ({
  location,
}: {
  location: string;
}): Promise<any> => {
  try {
    const response = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/location`,
      "POST",
      { location, label: "", address_type: "" },
      {
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllLocation = async () => {
  try {
    const url = `${BASEURL}/edifybackend/v1/location`;

    const response = await callAPIWithToken(url, "GET");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Get Device by ID
// export const getDeviceById = cache(async (deviceId: string): Promise<any> => {
//   try {
//     // Make the GET request to fetch a single device by ID
//     const res = await callAPIWithToken<Device>(
//       `${BASEURL}/edifybackend/v1/devices/${deviceId}`,
//       "GET"
//     );

//     // Return the fetched device
//     return res?.data;
//   } catch (error) {
//     throw new Error((error as AxiosError)?.message);
//   }
// });

// Get Device by ID
export const getDeviceById = async (deviceId: string): Promise<any> => {
  try {
    // Make the GET request to fetch a single device by ID
    const res = await callAPIWithToken<Device>(
      `${BASEURL}/edifybackend/v1/devices/${deviceId}`,
      "GET"
    );

    // Return the fetched device
    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

// Getting Devices by User ID

export const getDevicesByUserId = async (): Promise<getAllDevicesProp> => {
  const sess = await getSession(); // Fetch session details

  try {
    if (sess?.user && sess?.user?.user.userId) {
      if (sess?.user?.user?.role === 1) {
        // Make the GET request to fetch Devices of user ID

        const res = await callAPIWithToken<getAllDevicesProp>(
          `${BASEURL}/edifybackend/v1/devices/userDetails`,
          "GET"
        );
        // console.log(res?.data);

        // Return the list of Devices
        return res.data;
      } else {
        const requestBody = {
          fields: [
            "device_name",
            "custom_model",
            "processor",
            "brand",
            "os",
            "device_condition",
            "serial_no",
            "ram",
            "storage",
            "image",
          ],
          filters: [],
          page: 1,
          pageLimit: 100000,
        };

        const res = await callAPIWithToken<DeviceResponse>(
          `${BASEURL}/edifybackend/v1/devices/filter`,
          "POST", // Changed to POST as the new API requires it
          requestBody // Pass the request body
        );

        return res?.data?.devices;
      }
    }
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

// SearchInput initial Fetch
export const fetchDevices = async (): Promise<any> => {
  try {
    const requestBody = {
      fields: [
        "device_name",
        "custom_model",
        "serial_no",
        "ram",
        "storage",
        "image",
      ],
      filters: [],
      page: 1,
      pageLimit: 100000,
    };

    const res = await callAPIWithToken<DeviceResponse>(
      `${BASEURL}/edifybackend/v1/devices/filter`,
      "POST", // Changed to POST as the new API requires it
      requestBody // Pass the request body
    );
    console.log("Varun" + res?.data);
    return res?.data?.devices;
  } catch (e) {
    throw new Error("Failed to fetch devices");
  }
};

export const fetchUnassignedDevices = async (): Promise<any> => {
  try {
    const requestBody = {
      fields: [
        "device_name",
        "custom_model",
        "serial_no",
        "ram",
        "storage",
        "image",
      ],
      filters: [],
      // ["userId", "null"]
      page: 1,
      pageLimit: 1000000,
    };

    const res = await callAPIWithToken<DeviceResponse>(
      `${BASEURL}/edifybackend/v1/devices/filter`,
      "POST", // Changed to POST as the new API requires it
      requestBody // Pass the request body
    );

    return res?.data?.devices;
  } catch (e) {
    throw new Error("Failed to fetch devices");
  }
};

export const addAssetsTags = async function ({
  tags,
  deviceId,
}: {
  tags: string[];
  deviceId: string;
}) {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/devices/addTag`,
      "PATCH",
      { tag: tags, deviceId }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to add Tags");
  }
};
export const addLicenseTags = async function ({
  tags,
  licenseId,
}: {
  tags: string[];
  licenseId: string;
}) {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/devices/license/addTag`,
      "PATCH",
      { tag: tags, licenseId }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to add Tags");
  }
};

export const removeAssetsTags = async function ({
  tag_id,
  deviceId,
}: {
  tag_id: string;
  deviceId: string;
}) {
  try {
    // console.log(tag_id, deviceId);
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/devices/remTag`,
      "PATCH",
      { tag_id, deviceId }
    );

    return res.data;
  } catch (error) {
    throw new Error("Failed to remove Tags");
  }
};

export async function sendMakingOtp() {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/devices/send-otp`;

    const response = await callAPIWithToken(apiUrl, "POST", {});
    return response?.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response || "Failed to send otp");
  }
}

export async function verifyMakingOtp({
  id,
  otp,
}: {
  otp: string;
  id: string;
}) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/devices/verify-otp`;

    const response = await callAPIWithToken(apiUrl, "POST", {
      otp: otp,
      licenseId: id,
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to verify otp");
  }
}
export const fetchAllSoftware = async (): Promise<any> => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/license`;

    const response = await callAPIWithToken(url, "GET");
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAllIntegration = async (): Promise<any[]> => {
  try {
    const url = `${BASEURL}/edifybackend/v1/integration/get-all`;

    const response = await callAPIWithToken(url, "GET");
    // Ensure it's always an array
    return response?.data?.data ?? [];
  } catch (error) {
    console.log(error);
    return []; // fallback
  }
};

export const fetchAllIntegrationByTeamId = async ({
  teamId,
}: {
  teamId?: string;
}): Promise<any[]> => {
  try {
    const url = `${BASEURL}/edifybackend/v1/integration/get-all/${teamId}`;

    const response = await callAPIWithToken(url, "GET");
    // Ensure it's always an array
    return response?.data?.data ?? [];
  } catch (error) {
    console.log(error);
    return []; // fallback
  }
};

export const getLicenseByID = async (liceseId: { licenseId: string }) => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/license/${liceseId}`;

    const response = await callAPIWithToken(url, "POST", {});
    // console.log(response.data, "INtegration data");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
export const assignLicensesToDevice = async (
  licenseId: string,
  deviceId: string
) => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/assign-license/${licenseId}`;

    const response = await callAPIWithToken(url, "PATCH", {
      deviceId: deviceId,
    });
    console.log(licenseId, deviceId);
    // console.log(response.data, "INtegration data");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const removeDuplicateLicense = async (
  userId: string,
  integrationId: string
) => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/remove/${userId}`;

    const response = await callAPIWithToken(url, "PATCH", {
      integrationId: integrationId,
    });

    // console.log(response.data, "error INtegration data");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const downloadReportsAssets = async ({
  startDate,
  endDate,
  filterType,
}: {
  startDate: string;
  endDate?: string;
  filterType?: string;
}) => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/download-assets`;

    const response = await callAPIWithToken(url, "POST", {
      startDate: startDate,
      endDate: endDate,
      filterType,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSingleSoftware = async (id: string) => {
  try {
    const url = `${BASEURL}/edifybackend/v1/devices/license/${id}`;

    const response = await callAPIWithToken(url, "DELETE", {});
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getIntegrationByIdForLicense = async ({ id }: { id: string }) => {
  try {
    // console.log((await getSession()).user.user.token);

    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/integration/data/${id}`,
      "GET"
    );
    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};
export const updateCustomIntegration = async ({
  integrationId,
  payload,
}: {
  integrationId: string;
  payload: any;
}) => {
  try {
    // console.log((await getSession()).user.user.token);

    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/${integrationId}`,
      "PATCH",
      payload
    );
    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};
