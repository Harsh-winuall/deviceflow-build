import { AxiosError } from "axios";
import { callAPIWithToken, getSession } from "./helper";
import { cache } from "react";
import { BASEURL } from "./main";

const baseUrl = BASEURL;

export type Address = {
  isPrimary?: boolean;
  deleted_at?: string;
  _id?: string;
  city?: string;
  deviceId?: string;
  title?: string;
  phone?: string;
  location?: string;
  address_type?: string;
  landmark?: string;
  address?: string;
  state?: string;
  pinCode?: string;
};

export const getAddress = async (): Promise<Address[]> => {
  try {
    const res = await callAPIWithToken<Address[]>(
      `${baseUrl}/edifybackend/v1/address`,
      "GET"
    );
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export async function createAddress(address: Address): Promise<Address> {
  try {
    const sess = await getSession();

    const res = await callAPIWithToken<Address>(
      `${baseUrl}/edifybackend/v1/address`, // API endpoint
      "POST", // HTTP method
      {
        userId: sess?.user?.user.userId,
        orgId: sess?.user?.user?.orgId?._id,
        ...address,
      }
    );

    return res?.data;
  } catch (e) {
    throw new Error("Failed to create Address");
  }
}

export async function updateAddress(
  id: string,
  address: Address
): Promise<Address> {
  try {
    const res = await callAPIWithToken<Address>(
      `${baseUrl}/edifybackend/v1/address/${id}`, // API endpoint
      "PUT", // HTTP method
      {
        ...address,
      }
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to Update Address");
  }
}

export async function deleteAddress<Address>(addressId: string) {
  try {
    const res = await callAPIWithToken<Address>(
      `${baseUrl}/edifybackend/v1/address/${addressId}`, // API endpoint
      "DELETE",
      {}
    );
    return res?.data;
  } catch (e) {
    throw new Error("Failed to delete Address");
  }
}
