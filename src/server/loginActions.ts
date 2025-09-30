"use server";

import { AxiosError } from "axios";
import { callAPI } from "./helper";
import { BASEURL } from "./main";

export type RequestOtpResponse = {
  message: string;
  userId?: string;
};

type RequestDemoProps = {
  name: string;
  email: string;
  company_name: string;
  team_size: string;
  phone: string;
  type: string;
};

export async function requestOtp(email: string): Promise<RequestOtpResponse> {
  try {
    const { data } = await callAPI<RequestOtpResponse>(
      `${BASEURL}/edifybackend/v1/auth/request-password-reset`,
      "POST",
      { email },
      {
        "Content-Type": "application/json",
      }
    );

    return data;
  } catch {
    throw new Error("Failed to request otp");
  }
}

type ResetPassResponse = {
  message: string;
};
export async function resetPassword(
  userId: string,
  otp: string,
  password: string
): Promise<ResetPassResponse> {
  try {
    const { data } = await callAPI<ResetPassResponse>(
      `${BASEURL}/edifybackend/v1/auth/verify-otp`,
      "POST",
      {
        userId,
        otp,
        newPassword: password,
      },
      {
        "Content-Type": "application/json",
      }
    );
    // console.log(data, "reset pass");

    return data;
  } catch {
    throw new Error("Failed to verify otp");
  }
}

export async function requestForDemo({
  name,
  email,
  teamSize,
  cmpname,
  phone,
  type,
  utm_source,
}: {
  name: string;
  email: string;
  teamSize: string;
  cmpname: string;
  phone: string;
  type?: string;
  utm_source: string;
}) {
  let payload = {};
  if (type === "register") {
    payload = { email, name, company_name: cmpname, phone, utm_source };
  } else {
    payload = {
      email,
      name,
      company_name: cmpname,
      team_size: teamSize,
      phone,
      utm_source,
    };
  }
  try {
    const { data } = await callAPI<RequestDemoProps>(
      `${BASEURL}/edifybackend/v1/auth/user/onboard`,
      "POST",
      { ...payload },
      {
        "Content-Type": "application/json",
      }
    );

    return data;
  } catch (e) {
    throw new Error(
      (e as AxiosError)?.message || "Failed to fetch previous orders"
    );
  }
}


export async function setPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  try {
    const { data } = await callAPI<{ message: string }>(
      `${BASEURL}/edifybackend/v1/auth/set-password`,
      "POST",
      {
        password: password,
        token: token,
      },
      {
        "Content-Type": "application/json",
      }
    );

    return data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message || "Failed to set password");
  }
}
