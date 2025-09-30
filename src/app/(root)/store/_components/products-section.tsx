"use client";

import { useState, useEffect } from "react";
import { Tab } from "../../teams/_components/Tab";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { StoreDevice } from "@/server/deviceActions";
import { useQueryState } from "nuqs";
import { useAlert } from "@/hooks/useAlert";
import { getTrendingDevice, getLatestReleases } from "@/server/storeActions";
import { ProductSlider } from "./product-slider";
import DeviceFlowLoader from "@/components/deviceFlowLoader";

export const ProductsSection = ({ cart }: { cart: any }) => {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "best_sellers",
  });
  const { showAlert } = useAlert();
  const [products, setProducts] = useState<StoreDevice[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        let response: StoreDevice[];
        setLoading(true);
        switch (activeTab) {
          case "best_sellers":
            response = await getTrendingDevice();
            break;
          case "latest_release":
            response = await getLatestReleases();
            break;
          default:
            response = [];
        }
        setProducts(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tab data:", error);
        showAlert({
          title: "Something went wrong !!",
          description: "Failed to fetch data. Please try again.",
          isFailure: true,
          key: "fetch-error-store-device",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "best_sellers":
        return (
          <>
            {loading ? (
              <div className="flex justify-center items-center w-full my-20">

              <DeviceFlowLoader />
              </div>
            ) : (
              <ProductSlider key={"best-sellers"} data={products} cart={cart} />
            )}
          </>
        );
      case "latest_release":
        return (
          <>
            {loading ? (
              <div className="flex justify-center items-center w-full my-20">

              <DeviceFlowLoader />
              </div>
            ) : (
              <ProductSlider
                key={"latest-release"}
                data={products}
                cart={cart}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  const tabs = [
    {
      key: "best_sellers",
      label: "Best Sellers",
      content: <ProductSlider data={products} cart={cart} />,
    },
    {
      key: "latest_release",
      label: "Latest Release",
      content: <ProductSlider data={products} cart={cart} />,
    },
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="flex flex-col items-center w-full max-[1380px]:w-[90vw] py-1.5 p-24 bg-white">
      <h1 className="font-gilroySemiBold text-4xl py-8">Best Seller</h1>

      <div className="relative flex flex-col items-center w-full">
        <div className="flex items-center justify-between w-full border-b border-[#909090]">
          <div className="relative  flex gap-4">
            {tabs?.map((tab) => (
              <Tab
                id={tab.key}
                key={tab?.key}
                active={activeTab === tab?.key}
                onClick={() => handleTabChange(tab?.key)}
                label={tab?.label}
                triangleBackgroundColor="#fff" // Light yellow
                triangleBorderTopColor="#fff" // Orange
                className="after:left-[-39%] after:w-[178%]"
              />
            ))}
          </div>
          <Link href={"/store/all-products"}>
            <h1 className="cursor-pointer font-gilroyMedium text-lg">
              View all
            </h1>
          </Link>
        </div>
      </div>

      <div className="mt-2 w-full">
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
};
