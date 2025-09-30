import { AxiosError } from "axios";
import { callAPI, callAPIWithToken, getSession } from "./helper";
import { BASEURL } from "./main";

// export async function qualityCheck(userId:string) {
//   const sess = await getSession();
//   const result = sess.user.user.userId;
//   if ( sess?.user &&sess.user.user.userId ){
//     const apiUrl="https://778c-13-235-211-22.ngrok-free.app/edifybackend/v1/quality-check/check-quality-checks"
//   }
//   return result;
// }

const qcUrl = BASEURL;

export async function qualityCheck() {
  try {
    const session = await getSession();

    const payload = {
      userId: session.user.user.userId ?? "",
    };
    const apiUrl = `${qcUrl}/edifybackend/v1/quality-check/check-quality-checks`;

    const response = await callAPIWithToken(apiUrl, "POST", payload);
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to get quality check");
  }
}

export async function uniqueIdGeneration() {
  try {
    const apiUrl = `${qcUrl}/edifybackend/v1/quality-check/unique-id`;

    const response = await callAPIWithToken(apiUrl, "GET");
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to get unique id");
  }
}

export type QcReportResponse = {
  success: boolean;
  data: {
    _id?: string;
    device_score?: number;
    name?: string;
    serial_no?: string;
    user_image?: string;
    diagnosed_on?: string;
    device_name?: string;
    warranty_status?: string;
    assets_health?: string;
    device_image?: string;
  }[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
};

export async function fetchQcReportsEmployee({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  try {
    const session = await getSession();
    const payload = {
      userId: session.user.user.userId ?? "",
      page,
      limit,
    };
    const apiUrl = `${qcUrl}/edifybackend/v1/quality-check/show-employee`;
    // console.log("employee");

    const response = await callAPIWithToken<QcReportResponse>(
      apiUrl,
      "POST",
      payload
    );
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to get qc reports");
  }
}

export async function fetchQcReportsAdmin({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  try {
    const session = await getSession();
    const payload = {
      orgId: session.user.user.orgId._id ?? "",
      page,
      limit,
    };
    const apiUrl = `${qcUrl}/edifybackend/v1/quality-check/show-admin`;
    // console.log("admin");

    const response = await callAPIWithToken<QcReportResponse>(
      apiUrl,
      "POST",
      payload
    );
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to get qc reports");
  }
}

export type ReportData = {
  success: boolean;
  data: {
    serial_no: string;
    processor: string;
    score: string;
    Name: string;
    Device: string;
    Ram: string;
    Storage: string;
    "Processor Generation": string;
    "Screen Size(in Inches)": string;
    "Battery Health": string;
    "Backup In Minute": string;
    "Reported On": string;
    [key: string]: string; // For additional dynamic checks
  };
};

export async function downloadReport({ userId }: { userId?: string }) {
  try {
    const session = await getSession();
    let apiUrl = "";
    if (session?.user?.user?.role === 1) {
      apiUrl = `${qcUrl}/edifybackend/v1/quality-check/employee-report/${userId}`;
    } else {
      apiUrl = `${qcUrl}/edifybackend/v1/quality-check/admin-report/${userId}`;
    }

    const response = await callAPIWithToken<ReportData>(apiUrl, "GET");
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to get qc reports");
  }
}

export async function getAISummaryReport({ data }: { data: any }) {
  try {
    const url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/proxy"
        : `https://deviceflow.ai/api/proxy`;
    const res = await callAPI<{}>(
      url,
      "POST",
      { ...data },
      {
        Authorization:
          "Bearer mOgvFKFWg9LLGIHqvqRe6HVgIkHUYUjGidJhAdRdMP9WCAzZoo1YSdIBk5QsZX66",
        "Content-Type": "application/json",
      }
    );

    return res.data;
  } catch {
    throw new Error("Failed to generate ai summary");
  }
}
// const handleAISummaryReport = async (recordData) => {
//   const res = await downloadReport({ userId: recordData?._id });
//   const resData = await fetch("/api/proxy", {
//     method: "POST",
//     headers: {
//       Authorization:
//         "Bearer mOgvFKFWg9LLGIHqvqRe6HVgIkHUYUjGidJhAdRdMP9WCAzZoo1YSdIBk5QsZX66",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ ...res.data }),
//   });
//   const data = await resData.json();
//   setAiSummaryData(data);
// };

export const getQcDataById = async (qcId: string) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/quality-check/admin-report/${qcId}`,
      "GET"
    );

    return res?.data;
  } catch (e) {
    console.error("API error:", e); // 👈 Add this
    throw new Error((e as AxiosError)?.message);
  }
};
