// 'use server';
import { AxiosError } from "axios";
import { StoreDevice } from "./deviceActions";
import { callAPIWithToken, getSession } from "./helper";
import { cache } from "react";
import { BASEURL } from "./main";

const baseUrl = BASEURL;

export type DeviceWithQty = StoreDevice & { quantity: number };

export type Cart = {
  userId: string;
  orgId: string;
  addressId: string;
  items: DeviceWithQty[];
  totalPrice: number;
  status: string;
  addressDetails: {
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
};

export const removeItemFromCart = async (itemId: string): Promise<void> => {
  try {
    // Make the DELETE request to remove the item from the cart
    await callAPIWithToken(
      `${baseUrl}/edifybackend/v1/cart/item/quantity`,
      "PATCH",
      { itemId, quantity: 0 }
    );
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

export const getCart = cache(async function () {
  const sess = await getSession(); // Fetch session details

  try {
    if (sess?.user && sess?.user?.user.userId) {
      // Fetch Cart data
      const response = await callAPIWithToken<Cart>(
        `${baseUrl}/edifybackend/v1/cart`,
        "GET"
      );

      return response?.data; // Return the cart data
      // return
    } else {
      throw new Error("No user session found");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch cart");
  }
});

export const updateCartItemQuantity = async (
  itemId: string,
  quantity: number
): Promise<void> => {
  try {
    const response = await callAPIWithToken<any>(
      `${baseUrl}/edifybackend/v1/cart/item/quantity`,
      "PATCH",
      { itemId: itemId, quantity: quantity }
    );
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};

export async function addItemToCart(itemId: string, quantity: number) {
  try {
    const payload = {
      item: {
        itemId,
        quantity,
      },
    };
    const apiUrl = `${baseUrl}/edifybackend/v1/cart/addItem`;

    const response = await callAPIWithToken(apiUrl, "POST", payload);
    // console.log(response, "ITEM ADDED TO CART");
    return response?.data;
  } catch (error: any) {
    throw new Error(error?.response || "Failed to add item to cart.");
  }
}

export const getPaymentMethods = async (price: number) => {
  const sess = await getSession(); // Fetch session details

  try {
    if (sess?.user && sess?.user?.user.userId) {
      // Fetch Cart data
      const response = await callAPIWithToken<any>(
        `${baseUrl}/edifybackend/v1/payments/methods?amount=${price}`,
        "GET"
      );

      return response?.data; // Return the cart data
    } else {
      throw new Error("No user session found");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch payment methods");
  }
};

export async function createOrderId(amount: number, paymentOption: string) {
  try {
    const payload = {
      amount,
      paymentOption,
    };
    const apiUrl = `${baseUrl}/edifybackend/v1/payments/initiate`;

    const response = await callAPIWithToken(apiUrl, "POST", payload);
    //@ts-ignore
    const orderId = response?.data?.orderId;
    //@ts-ignore
    const paymentMethod = response?.data?.paymentOption;

    const checkoutPayload = {
      payment_mode: paymentMethod,
      orderId,
    };
    const checkoutUrl = `${baseUrl}/edifybackend/v1/cart/checkout`;

    const checkoutRes = await callAPIWithToken(
      checkoutUrl,
      "POST",
      checkoutPayload
    );
    return checkoutRes.data;
  } catch (error: any) {
    throw new Error(error.response || "Failed to create orderID.");
  }
}

// Update Cart Address

export const updateCartAddress = async (addressId: string): Promise<void> => {
  try {
    const response = await callAPIWithToken<any>(
      `${baseUrl}/edifybackend/v1/cart/address`,
      "PATCH",
      { addressId }
    );
    return response?.data;
  } catch (error) {
    throw new Error((error as AxiosError)?.message);
  }
};
