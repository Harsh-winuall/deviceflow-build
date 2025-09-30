"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { StoreDevice } from "@/server/deviceActions";
import Link from "next/link";
import { getStoreDevices } from "@/server/storeActions";
import { useAlert } from "@/hooks/useAlert";
import { DeviceWithQty } from "@/server/cartActions";
import { StoreDeviceCard } from "./store-device-card";
import DeviceFlowLoader from "@/components/deviceFlowLoader";

export const AllProductsSection = ({ cart }: { cart: any }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<StoreDevice[]>([]);
  // const [cart,setCart] = useState<Cart>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStoreDevices();
        setProducts(res);
        setLoading(false);
      } catch (error) {
        console.error(error);
        showAlert({
          title: "Something went wrong !!",
          description: "Failed to fetch data. Please try again.",
          isFailure: true,
          key: "fetch-error-all-devices-store",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const findItemById = (itemId: string) => {
    return cart.items.find((item: DeviceWithQty) => item._id === itemId);
  };

  return (
    <div className="flex flex-col items-center w-full py-5 p-24 bg-white">
      <h1 className="font-gilroySemiBold text-4xl py-8">All Products</h1>

      <div className="mt-6 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <DeviceFlowLoader />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8 w-full">
            {[...products].map((prod) => {
              const res = findItemById(prod?._id ?? "");
              return (
                <StoreDeviceCard key={prod._id} product={prod} res={res} />
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center py-14 w-full">
        <Link href={"/store/all-products"}>
          <button
            type="button"
            className="bg-black hover:bg-white hover:text-black text-white rounded-sm w-60 py-2 font-gilroyMedium text-base hover:ring-1 hover:ring-black"
          >
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};
