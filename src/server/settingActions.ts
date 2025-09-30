import { SubscriptionResponse } from "@/components/settings/subscription-type";
import { callAPI, callAPIWithToken } from "./helper";
import { BASEURL } from "./main";
import { create } from "domain";
export type Location = {
  _id?: string;
  orgId?: string;
  location?: string;
  deleted_at?: string | null;
  label?: string;
  address_type?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  deviceCount?: number;
};

type Plan = {
  _id: string;
  planName: string;
  billingCycles: "Monthly" | "Annually";
  pricingPerSeat?: number; // optional because Custom Plan doesn’t have it
};

type PlanGroup = {
  _id: string; // e.g. "Pro Plan", "Custom Plan"
  plans: Plan[];
};

type PlansResponse = PlanGroup[];

export const addNewLocations = async ({
  label,
  location,
  address_type,
}: {
  label?: string;
  location?: string;
  address_type?: string;
}) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/location`;
    const body = {
      location,
      label,
      address_type,
    };
    const response = await callAPIWithToken<Location>(apiUrl, "POST", body);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};
export const getAllLocations = async () => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/location`;

    const response = await callAPIWithToken<Location[]>(apiUrl, "GET");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};

export const deleteSingleLocations = async ({
  locationId,
}: {
  locationId?: string;
}) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/location/${locationId}`;

    const response = await callAPIWithToken(apiUrl, "DELETE", {});

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};
export const updateSingleLocation = async ({
  locationId,
  label,
  location,
  address_type,
}: {
  locationId?: string;
  label?: string;
  location?: string;
  address_type?: string;
}) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/location/${locationId}`;
    const body = {
      label,
      location,
      address_type,
    };
    const response = await callAPIWithToken<Location>(apiUrl, "PATCH", body);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Chat");
  }
};

export async function sendOtp(phone: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/address/sendOTP`;

    const response = await callAPIWithToken(apiUrl, "POST", { phone: phone });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to send otp");
  }
}

export async function verifyOtpAndLogin(phone: string, otp: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/address/verifyOTP`;

    const response = await callAPIWithToken(apiUrl, "POST", {
      phone: phone,
      otp: otp,
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to verify otp");
  }
}

export const getAvailablePlans = async () => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/availablePlans`;

    const response = await callAPIWithToken<PlansResponse>(apiUrl, "GET");

    return response.data;
  } catch (error) {
    throw new Error("Failed to Get Subscription Plans");
  }
};

// subscription/subscriptionStatus

export const getSubcriptionStatus = async (type?: string) => {
  try {
    const queryString = type === "Extra" || type === "Regular" ? `${type}` : "";
    console.log(queryString);
    const apiUrl =
      `${BASEURL}/edifybackend/v1/subscription/subscriptionStatus?type=` +
      queryString;

    const response = await callAPIWithToken<SubscriptionResponse>(
      apiUrl,
      "GET"
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to Get Subscription Status");
  }
};

export async function cancelSubscription() {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/cancel`;

    const response = await callAPIWithToken(apiUrl, "POST", {});
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to cancel subscription");
  }
}

export async function renewSubscription(planId?: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/renew`;
    console.log(planId)

    const response = await callAPIWithToken(
      apiUrl,
      "POST",
      planId ? { planId } : {}
    );
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to renew subscription");
  }
}

export async function requestPlan(planId: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/requestPlan`;

    console.log(planId);

    const response = await callAPIWithToken(apiUrl, "POST", {
      planId: planId,
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to Request!");
  }
}

// subscription/invoice

export async function createInvoice(seatCount?: number, planId?: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/invoice`;

    console.log({
      type: seatCount ? "Extra Seats" : "Regular Invoice",
      ...(seatCount && { seats: seatCount }),
      ...(planId && { planId: planId }),
      ...(!seatCount && { isUpgrade: true }),
    });

    const response = await callAPIWithToken(apiUrl, "POST", {
      type: seatCount ? "Extra Seats" : "Regular Invoice",
      ...(seatCount && { seats: seatCount }),
      ...(planId && { planId: planId }),
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to Create Invoice!");
  }
}

// subscription/initiatePayment

export async function initiatePayment({
  paymentOption,
  seatCount,
  planId,
  invoiceId,
}: {
  paymentOption: string;
  seatCount?: number;
  planId?: string;
  invoiceId?: string;
}) {
  try {
    const res =
      !invoiceId &&
      (await createInvoice(seatCount && seatCount, planId && planId));
    console.log(res);
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/initiatePayment`;

    console.log("Payload for initiating payment :", {
      invoiceId: invoiceId ? invoiceId : res?._id,
      paymentOption: paymentOption,
    });

    const response = await callAPIWithToken<any>(apiUrl, "POST", {
      invoiceId: invoiceId ? invoiceId : res?._id,
      paymentOption: paymentOption,
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to Create Invoice!");
  }
}

export const getSeatsValidity = async (count?: number) => {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/subscription/isValidCreation?count=${count}`;

    const response = await callAPIWithToken<any>(apiUrl, "GET");

    return response.data;
  } catch (error) {
    throw new Error("Failed to Get Seats Validity");
  }
};

export async function gsuiteUsersAdd(blockedUsers: any) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/user/bulk-gsuite-upload`;

    const response = await callAPIWithToken(apiUrl, "POST", {
      users: blockedUsers,
    });
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to Request!");
  }
}
