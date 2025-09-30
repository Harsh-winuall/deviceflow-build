"use client";
import { useQueryState } from "nuqs";
import { Search, Download, ArrowUpDown } from "lucide-react"; // Importing icons from lucide-react
import { useState, useEffect, Suspense } from "react";
import Spinner from "@/components/Spinner";
import { Tab } from "../teams/_components/Tab";
import { Icons } from "@/components/icons";
import AllOrders from "./_components/AllOrders";
import DeviceFlowLoader from "@/components/deviceFlowLoader";

function TabDisplay() {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "orders",
  });

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full h-[80vh]">
                <DeviceFlowLoader />
              </div>
            }
          >
            <AllOrders />
          </Suspense>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col 2xl:gap-2  pt-[14px]">
        <h1 className="text-gray-400 font-gilroyMedium 2xl:text-lg text-base">
          Orders
        </h1>
        <div className="flex justify-between items-center">
          <h1 className="2xl:text-3xl text-2xl font-gilroyBold pt-[10px]">
            Manage Orders
          </h1>

          <div className="flex w-fit items-center py-1.5 gap-1  pl-3 pr-3 text-[#7F7F7F] border border-gray-400 rounded-full hover:text-black hover:border-black transition-all duration-300">
            <Search size={20} className="text-[#7F7F7F]" />

            <input
              className=" bg-transparent text-base  font-gilroyMedium whitespace-nowrap focus:outline-none"
              placeholder="Search Orders"
            />
          </div>
        </div>
      </div>

      <div className="border 2xl:mt-[9px] mt-[7.5px]"></div>

      <div className="mt-4">{renderContent()}</div>
    </>
  );
}

export default TabDisplay;
