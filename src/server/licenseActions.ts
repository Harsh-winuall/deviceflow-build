"use server";

import { ReportData } from "./checkMateActions";
import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";

export const getAllLicenses = async () => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/license/filter`,
      "POST",
      {}
    );

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating summary");
  }
};

export type LicenseData = {
  _id: string;
  platform: string;
  integratedAt: string;
  billingCycle: null | number;
  price: number;
  createdAt: string;
  validity: null | string;
  total_license: number;
  used_license: number;
  licenses: {
    _id: string;
    deviceId: string;
    licenseKey: string;
    deviceName: string;
    serial_no: string;
  }[];
};

export const getLicenseById = async (id: string) => {
  try {
    const res = await callAPIWithToken<LicenseData>(
      `${BASEURL}/edifybackend/v1/license/${id}`,
      "GET",
      null
    );

    return res?.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating summary");
  }
};
