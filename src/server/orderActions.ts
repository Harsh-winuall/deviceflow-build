import { AxiosError } from "axios";
import { callAPIWithToken } from "./helper";
import { cache } from "react";
import { BASEURL } from "./main";

// Define the structure of a Previous Order
export type OrderResponse = {
  soldInventory: {
    response: {
      itemId: {
        _id: string;
        orgId: string;
        device_name: string;
        asset_serial_no: string;
        serial_no: string;
        device_type: string;
        brand: string;
        warranty_expiary_date: string | null;
        purchase_value: number;
        os: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        is_trending: boolean;
        payable: number;
        addressId: string;
        image: {
          url: string;
          color: string;
          _id: string;
        }[];
        latest_release?: boolean;
        ram?: string;
        processor?: string;
        storage?: string[];
        custom_model?: string;
        ownership?: string;
        purchase_order?: string;
        assigned_at?: string;
        userId?: string;
        config?: {
          key: string;
          value: string;
          _id: string;
        }[];
        item_code?: string;
        description?: string;
      };
      quantity: number;
      price: number;
      ordered_on: string;
      _id: string;
    }[];
    cartDetails: {
      _id: string;
      razorpay_order_id: string;
      userId: string;
      addressId: {
        _id: string;
        userId: string;
        orgId: string;
        city: string;
        isPrimary: boolean;
        deleted_at: string | null;
        createdAt: string;
        updatedAt: string;
        __v: number;
      };
      paymentMethod: string;
      pg_type: string;
      razorpay_payment_id: string;
      razorpay_signature: string | null;
      state: string;
      totalPrice: number;
      fee: number;
      tax: number;
    };
  }[];
};

export interface PreviousOrder {
  _id: string;
  itemId: string;
  userId: string;
  orgId: string;
  cartId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Fetch Previous Orders
export const getPreviousOrders = cache(async function (): Promise<
  PreviousOrder[]
> {
  try {
    // API call to fetch previous orders
    const res = await callAPIWithToken<{ soldInventory: PreviousOrder[] }>(
      `${BASEURL}/edifybackend/v1/soldInventory/org`,
      "GET"
    );

    // Validate response structure
    if (!res?.data || !Array.isArray(res?.data?.soldInventory)) {
      throw new Error("Invalid API response structure");
    }

    return res?.data?.soldInventory;
  } catch (e) {
    throw new Error(
      (e as AxiosError)?.message || "Failed to fetch previous orders"
    );
  }
});

// Fetch Previous Orders
export const getSingleOrder = cache(async function ({
  orderId,
}: {
  orderId: any;
}): Promise<any[]> {
  try {
    // API call to fetch previous orders
    const res = await callAPIWithToken<{ soldInventory: any[] }>(
      `${BASEURL}/edifybackend/v1/soldInventory/org?orderId=${orderId}`,
      "GET"
    );

    // Validate response structure
    if (!res?.data || !Array.isArray(res?.data?.soldInventory)) {
      throw new Error("Invalid API response structure");
    }

    return res?.data?.soldInventory;
  } catch (e) {
    throw new Error(
      (e as AxiosError)?.message || "Failed to fetch previous orders"
    );
  }
});
