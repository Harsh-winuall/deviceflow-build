"use server";

import { callAPI, callAPIWithToken, getSession } from "./helper";
import { User } from "./userActions";
import { BASEURL } from "./main";

type RequestOTPProps = {
  message: string;
  userId?: string;
};

type RequestDemoProps = {
  name: string;
  email: string;
  company_name: string;
  team_size: string;
  phone: string;
};

export const createSignupLink = async (teamId: string) => {
  try {
    const sess = await getSession();
    const res = await callAPIWithToken<{ message: string; link: string }>(
      `${BASEURL}/edifybackend/v1/auth/generate-temp-link`, // API endpoint
      "POST", // HTTP method
      {
        orgId: sess?.user.user.orgId?._id,
        teamId: teamId,
      }
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to create link");
  }
};

type ValidationResponse = {
  message: string;
  data?: {
    teamId: string;
    orgId: {
      _id: string;
      name: string;
      email: string;
    };
  };
};

export const validateToken = async (token: string) => {
  try {
    const res = await callAPI<ValidationResponse>(
      `${BASEURL}/edifybackend/v1/auth/validate/temp-link`, // API endpoint
      "POST", // HTTP method
      {
        token: token,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to create link");
  }
};

export const signupReqOTP = async (email: string) => {
  try {
    const res = await callAPI<{}>(
      `${BASEURL}/edifybackend/v1/auth/send/email-otp`,
      "POST",
      {
        email: email,
      }
    );
    // console.log(res);
    return res?.data;
  } catch (e) {
    throw new Error("Failed to send otp");
  }
};

export const verifySignupOTP = async (email: string, otp: string) => {
  try {
    const res = await callAPI<{}>(
      `${BASEURL}/edifybackend/v1/auth/verify/email-otp`,
      "POST",
      {
        email: email,
        otp: otp,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to verify otp");
  }
};

export const signupEmployee = async ({
  token,
  first_name,
  phone,
  email,
  reporting_manager,
  date_of_birth,
  gender,
  onboarding_date,
  employment_type,
  designation,
}: {
  token: string;
  first_name: string;
  phone: string;
  email: string;
  reporting_manager: string;
  date_of_birth: string;
  gender: string;
  onboarding_date: string;
  employment_type: string;
  designation: string;
}) => {
  try {
    const res = await callAPI<User>(
      `${BASEURL}/edifybackend/v1/auth/link-register`,
      "POST",
      {
        token,
        first_name,
        phone,
        email,
        reporting_manager,
        date_of_birth,
        gender,
        onboarding_date,
        employment_type,
        designation,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to create user");
  }
};
