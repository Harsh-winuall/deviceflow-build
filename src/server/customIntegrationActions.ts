import { AxiosError } from "axios";
import { callAPIWithToken, getSession } from "./helper";
import { BASEURL } from "./main";

export interface CustomIntegrationType {
  logo?: string;
  platform?: string;
  price?: number;
  website?: string;
  description?: string;
  userIds?: string[];
}
export interface RequestIntegrationType {
  name?: string;
  users?: string;
  purpose?: number;
}

export const customIntegrationAdd = async (payload: CustomIntegrationType) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/integration/custom`;
    const response = await callAPIWithToken(apiUrl, "POST", {
      ...payload,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const categoryAdd = async (payload: CustomIntegrationType) => {
  const session = await getSession();
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/integration/custom-category`;
    const response = await callAPIWithToken(apiUrl, "POST", {
      title: payload?.category,
      orgId: session?.user?.user?.orgId?._id,
    });
    return response.data;
  } catch (error) {
    // console.error("API Error:", error);
    throw new Error("Failed to add new integration category");
  }
};

export const customIntegrationEdit = async ({
  id,
  payload,
}: {
  id: string;
  payload: CustomIntegrationType;
}) => {
  try {
    // console.log({
    //   ...payload,
    //   ...(customCategoryId && { customCategoryId }), // Only add if present
    // })

    // console.log(id);

    const apiUrl = `${BASEURL}/edifybackend/v1/integration/custom/${id}`;
    const response = await callAPIWithToken(apiUrl, "PATCH", {
      ...payload,
    });
    return response.data;
  } catch (error) {
    // console.error("API Error:", error);
    throw new Error("Failed to Update the integration");
  }
};

export const requestIntegration = async (payload: RequestIntegrationType) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/integration/request-Integration`;

    const response = await callAPIWithToken(apiUrl, "POST", payload);
    return response.data;
  } catch (error) {
    // console.error("API Error:", error);
    throw new Error("Failed to add new integration location");
  }
};
export const deleteCustomIntegration = async ({ id }: { id: string }) => {
  try {
    // console.log((await getSession()).user.user.token);

    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/custom/${id}`,
      "DELETE",
      {}
    );
    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};
export const missionUsersIntegration = async ({ id }: { id: string }) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/custom/missing-users/${id}`,
      "GET"
    );
    return res?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};
export const addMembersByUser = async (payload: {
  integrationId?: string;
  userIds?: string[];
}) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/integration/custom/add-members`;

    const response = await callAPIWithToken(apiUrl, "POST", payload);
    return response.data;
  } catch (error) {
    // console.error("API Error:", error);
    throw new Error("Failed to add new integration location");
  }
};

export const bulkUploadUsersIntegration = async (formData: FormData) => {
  try {
    const response = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/add-users-to-integration?userIds=true`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    // console.log(response?.data);
    return response?.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
export const addingBulkUploadUsersIntegration = async ({
  formData,
  integrationId,
}: {
  formData: FormData;
  integrationId?: string;
}) => {
  // console.log(formData, integrationId);
  try {
    const response = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/add-users-to-integration/${integrationId}`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    return response?.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
