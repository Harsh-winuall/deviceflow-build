"use server";

import { Address } from "./addressActions";
import { callAPIWithToken, getSession } from "./helper";
import { BASEURL } from "./main";
import { ReportData } from "./checkMateActions";

type OfficeAddress = Address;

type Joinee = {
  _id: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone: string;
  orgId: string;
  employment_type: string;
  created_at: string;
  __v: number;
  date_of_birth: string;
  onboarding_date: string;
  reporting_manager: string;
  updatedAt: string;
  teamId: string;
  role?: number | string; // Since there are both number and string values for "role"
  designation?: string;
  gender?: string;
  interests_and_hobbies?: string;
  about?: string;
  marital_status?: string;
  physically_handicapped?: string;
};

export type Org = {
  _id?: string;
  name?: string;
  gstNo?: string;
  org_address?: string;
  phone?: string;
  logo?: string;
  email?: string;
  legal_entity_name?: string;
  office_address?: OfficeAddress[];
  total_devices?: number;
  total_users?: number;
  upcoming_joinee?: Joinee[];
  total_purchased?: number;
};

export const getGSuiteAuthUrl = async ({
  bulkUpload,
  price,
  redirectUri,
  onboarding,
}: {
  bulkUpload: boolean;
  price: {};
  redirectUri: string;
  onboarding?: boolean;
}) => {
  const sess = await getSession();
  const body = {
    token: sess?.user?.user?.token,
    bulkUpload: bulkUpload,
    price,
    redirectUri: redirectUri,
    onboarding: onboarding,
  };
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=1033288407559-a029ear5m0bgcnsg0lu3hon13dvjtggi.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fstaging.deviceflow.ai%2Fedifybackend%2Fv1%2Fintegration%2Foauth2%2Fcallback&response_type=code&scope=openid%20email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.user%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.group&access_type=offline&prompt=consent&state=${JSON.stringify(body)}`;

  console.log(url)
  return url;
};

export const getGSuiteAuthUrlLogin = async ({
  redirectUri,
}: {
  redirectUri: string;
}) => {
  const sess = await getSession();
  const body = {
    token: sess?.user?.user?.token,
    redirectUri: redirectUri,
  };
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=1033288407559-a029ear5m0bgcnsg0lu3hon13dvjtggi.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fgcp-api.edify.club%2Fedifybackend%2Fv1%2Fintegration%2Foauth2%2Fcallback&response_type=code&scope=openid%20email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.user%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadmin.directory.group&access_type=offline&prompt=consent&state=${JSON.stringify(
    body
  )}`;
  return url;
};

export const getCurrentOrg = async <Org>() => {
  try {
    const sess = await getSession();
    const orgId = sess?.user?.user?.orgId?._id;
    const res = await callAPIWithToken<Org>(
      `${BASEURL}/edifybackend/v1/organisation/${orgId}`, // API endpoint
      "GET", // HTTP method
      null
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch org");
  }
};

export async function updateOrg({
  id,
  title,
  name,
  description,
  logo,
  gstNo,

  legal_entity_name,
}: {
  id?: string;
  phone?: string;
  gstNo?: string;
  name?: string;
  legal_entity_name?: string;
  title?: string;
  description?: string;
  logo?: string | null;
}): Promise<Org> {
  try {
    const res = await callAPIWithToken<Org>(
      `${BASEURL}/edifybackend/v1/organisation/${id}`, // API endpoint
      "PUT", // HTTP method
      {
        title,
        description,
        logo,
        gstNo,
        name,
        legal_entity_name,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to Update org");
  }
}

export const getImageUrl = async (data: { file: File }) => {
  const formData = new FormData();
  formData.append("file", data.file);

  try {
    const response = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/file/upload`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminSummaryServer = async () => {
  try {
    const sess = await getSession();

    const res = await callAPIWithToken<ReportData>(
      `${BASEURL}/edifybackend/v1/quality-check/org-report/ai-summary/${sess?.user?.user?.orgId?._id}`,
      "GET"
    );

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating summary");
  }
};

// AI Agents actions

export const notifyAIAgents = async () => {
  try {
    const sess = await getSession();

    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/integration/Ai-notify`,
      "POST",
      {
        email: sess?.user?.user?.email,
      }
    );
    return res?.data;
  } catch (error) {
    throw new Error("Error notifying user");
  }
};
