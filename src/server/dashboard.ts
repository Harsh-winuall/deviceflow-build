import { cache } from "react";
import { callAPI, callAPIWithToken, getSession } from "./helper";
import { AxiosError } from "axios";
import { BASEURL } from "./main";

const baseUrl = BASEURL;

export const getTotalIntegrationData = async <Org>() =>{
  try {
    const session = await getSession();
    const orgID = session?.user?.user?.orgId?._id;

    const res = await callAPIWithToken<Org>(
      `${baseUrl}/edifybackend/v1/integration/dashboard/${orgID}`,
      "GET", // HTTP method
      null
    );

    // console.log(res.data);

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch org");
  }
};

export const getDashboard = async <Org>() =>{
  try {
    const res = await callAPIWithToken<Org>(
      `${baseUrl}/edifybackend/v1/organisation/dashboard`, // API endpoint
      "GET", // HTTP method
      null
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch org");
  }
};

export const getDashboardSubscriptions = async <Org>() =>{
  try {
    const res = await callAPIWithToken<Org>(
      `${baseUrl}/edifybackend/v1/integration/dashboard/subscriptions`, // API endpoint
      "GET", // HTTP method
      null
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch org");
  }
};

export const getTeamWiseSubscriptions = async <Org>() =>{
  try {
    const res = await callAPIWithToken<Org>(
      `${baseUrl}/edifybackend/v1/integration/dashboard/teams`, // API endpoint
      "GET", // HTTP method
      null
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to fetch org");
  }
};

// Feedback API

export async function sendFeedback({
  rating,
  comment,
}: {
  rating: number;
  comment: string;
}) {
  const sess = await getSession();
  const payload = {
    rating,
    comment,
    orgId: sess?.user?.user?.orgId?._id,
    userId: sess?.user.user.userId,
  };

  try {
    const { data } = await callAPI(
      `${baseUrl}/edifybackend/v1/auth/user/onboard?feedback=true`,
      "POST",
      payload,
      {
        "Content-Type": "application/json",
      }
    );

    return data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message || "Failed to submit feedback");
  }
}
