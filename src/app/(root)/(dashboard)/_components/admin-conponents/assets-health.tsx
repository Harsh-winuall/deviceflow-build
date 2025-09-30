"use client";
import ExcellentDeviceIcon from "@/icons/ExcellentDeviceIcon";
import FairDeviceIcon from "@/icons/FairDeviceIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardDetails } from "./interface";
import CreateDeviceDialog from "@/app/(root)/assets/_components/addDevices/_components/add-device-form";

export function AssetsHealth({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) {
  // Define colors for each device condition
  const CONDITION_COLORS: Record<string, string> = {
    Excellent: "#63bc48",
    Good: "#FFAE4C",
    Fair: "#FF928A",
  };

  // Define the desired order
  const CONDITION_ORDER: Record<string, number> = {
    Excellent: 1,
    Good: 2,
    Fair: 3,
  };

  const totalCount = dashboardData?.deviceConditionData?.reduce(
    (acc, item) => acc + item.count,
    0
  );

  // Prepare and sort data for pie chart
  const data = dashboardData?.deviceConditionData
    ?.map((response) => {
      const titles: { [key: string]: string } = {
        Excellent: "Excellent",
        Good: "Good",
        Fair: "Fair",
      };

      if (!titles[response._id]) return null;

      return {
        name: titles[response._id],
        value: response.count,
        color: CONDITION_COLORS[response._id] || "#7086FD", // fallback color
        order: CONDITION_ORDER[response._id] || 99, // default to high number if not found
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0)); // Sort by the defined order

  // Sort the original deviceConditionData for the list display
  const sortedDeviceConditionData = dashboardData?.deviceConditionData
    ?.map((item) => ({
      ...item,
      order: CONDITION_ORDER[item._id] || 99,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="font-gilroy flex flex-col gap-y-4 rounded-[10px] border border-solid border-gray-200 bg-white px-5 pb-9 pt-3.5 tracking-tight backdrop-blur-[24px]">
      <div className="text-sm font-gilroySemiBold leading-[23px]">
        Asset Health Status
      </div>

      <div className="flex flex-col gap-y-8 h-full">
        {(dashboardData?.deviceConditionData?.length || 0) > 0 ? (
          <div className="flex flex-col gap-4">
            {/* Horizontal Bar */}
            <div className="w-full h-[37px] rounded-lg overflow-hidden flex">
              {data?.map((entry, index) => {
                const widthPercent = totalCount
                  ? (entry.value / totalCount) * 100
                  : 0;
                return (
                  <div
                    key={index}
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: entry.color,
                    }}
                  />
                );
              })}
            </div>

            {/* Device Condition List */}
            <div className="flex gap-5 justify-start items-center">
              {sortedDeviceConditionData?.map((response, index) => {
                const titles: { [key: string]: string } = {
                  Excellent: "Excellent",
                  Good: "Good",
                  Fair: "Fair",
                };

                if (!titles[response._id]) return null;

                return (
                  <div
                    key={index}
                    className="flex gap-2 items-center justify-between mt-4"
                  >
                    <div className="flex gap-2 items-start justify-center">
                      <div
                        className="mt-1.5"
                        style={{
                          width: 30,
                          height: 5,
                          borderRadius: 100,
                          background: CONDITION_COLORS[response._id],
                        }}
                      />

                      <div className="flex gap-2 flex-col">
                        <span className="text-black font-gilroySemiBold text-xs xl:text-sm">
                          {titles[response._id]}
                        </span>
                        <span className="text-black font-gilroySemiBold text-xs xl:text-sm  ">
                          {response.count} Devices
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className=" w-full bg-white  rounded-md border-black/10 flex flex-col justify-center items-center px-3  lg:p-7">
            <img
              src="/media/dashboard/assets-empty.webp"
              width={180}
              height={120}
            />
            <div className="w-full mt-4">
              <p className="text-black text-lg font-gilroySemiBold text-center">
                Add your first device
              </p>
              <p className="text-gray-400 text-sm font-gilroyMedium text-center">
                Start adding your devices to get data
              </p>
            </div>

            <CreateDeviceDialog>
              <div className="bg-black cursor-pointer px-3 py-2 mt-8 text-sm rounded-[6px] text-white font-gilroyMedium">
                Add Device
              </div>
            </CreateDeviceDialog>
          </div>
        )}
      </div>
    </div>
  );
}
