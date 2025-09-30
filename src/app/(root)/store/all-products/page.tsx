"use client";
import { getStoreDevices, searchStoreDevices } from "@/server/storeActions";
import { Cart, DeviceWithQty, getCart } from "@/server/cartActions";
import { StoreDeviceCard } from "../_components/store-device-card";
import { useEffect, useState } from "react";
import { StoreDevice } from "@/server/deviceActions";
import { useSearchParams } from "next/navigation";
import AllProductsFilter from "./_components/all-products-filter";
import DeviceFlowLoader from "@/components/deviceFlowLoader";
import NoProducts from "./_components/NoProducts";

export default function AllProducts() {
  const [data, setData] = useState<StoreDevice[]>([]);
  const [cart, setCart] = useState<Cart>();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [filterData, setFilterData] = useState({
    ram:"",
    storage:"",
    os:"",
    brand:"",
    searchTerm:"",
  });

  const searchQuery = searchParams?.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await searchStoreDevices({ searchQuery });
        const cartData = await getCart();
        setData(products);
        setCart(cartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const findItemQuantityById = (itemId: string): number => {
    return (
      cart?.items?.reduce((acc: number, item: DeviceWithQty) => {
        return item._id === itemId ? acc + (item.quantity || 0) : acc;
      }, 0) || 0
    );
  };

  return (
    <div className="py-6 px-[5.5rem] flex flex-col gap-9 bg-white">
      <AllProductsFilter setData={setData} setFilterData={setFilterData}/>
      {!loading ? (
        data.length > 0 ? (
          <div className="grid grid-cols-4 gap-x-10 gap-y-8 w-full ">
            {data.map((product) => {
              const quantity = findItemQuantityById(product._id ?? "");
              return (
                <StoreDeviceCard
                  key={product._id}
                  product={product}
                  res={quantity}
                />
              );
            })}
          </div>
        ) : (
          <NoProducts filterData={filterData} searchQuery={searchQuery}/>
        )
      ) : (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <DeviceFlowLoader />
        </div>
      )}
      <div className="pointer-events-none h-[5.5rem] w-full" />
    </div>
  );
}
