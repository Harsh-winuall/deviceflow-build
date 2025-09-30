"use client";

import { StoreDevice } from "@/server/deviceActions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export const DeviceDetailedSecx = ({ data }: { data: StoreDevice }) => {
  const [viewMore, setViewMore] = useState(false);
  const [viewFeat, setViewFeat] = useState(1);

  const mockFeatures = [
    {
      title: "Display",
      features: [
        {
          title: "Screen diagonal",
          value: '14"',
        },
        {
          title: "The screen resolution",
          value: "1920x1080",
        },
        {
          title: "The screen refresh rate",
          value: "120 Hz",
        },
        {
          title: "Screen type",
          value: "IPS",
        },
      ],
    },
    {
      title: "CPU",
      features: [
        {
          title: "CPU",
          value: "AMD Ryzen 5 5600U",
        },
        {
          title: "Number of cores",
          value: "6",
        },
      ],
    },
  ];

  const deviceFeatures =
    data?.deviceFeatures && data.deviceFeatures.length !== 0
      ? data?.deviceFeatures
      : mockFeatures;

  useEffect(() => {
    // Set viewFeat based on the number of device features
    setViewFeat(deviceFeatures.length! > 1 ? 1 : deviceFeatures.length!);
  }, [data]);

  const handleViewMore = () => {
    setViewMore(!viewMore);
    // If viewMore is true, show all features; otherwise, show only one
    setViewFeat(viewMore ? 1 : deviceFeatures.length!);
  };

  return (
    <section className="flex px-32 flex-col pt-1.5 pb-4">
      <h2 className="text-2xl 2xl:text-3xl font-gilroySemiBold">Details</h2>
      <p className="text-pretty py-3.5 font-gilroySemiBold text-[#9D9D9D] text-sm 2xl:text-base">
        {data?.description ?? ""}
      </p>
      {deviceFeatures.slice(0, viewFeat).map((feat) => (
        <div key={feat?.title}>
          <h3 className="text-xl 2xl:text-2xl font-gilroySemiBold pt-4 pb-3">
            {feat?.title}
          </h3>
          {feat?.features?.map((v) => (
            <div key={v.title} className="pt-1 pb-3">
              <div className="flex items-center font-gilroyMedium justify-between">
                <span>{v.title}</span>
                <span>{v.value}</span>
              </div>
              <div className="h-[1px] my-2.5 w-full bg-[#CDCDCD]" />
            </div>
          ))}
        </div>
      ))}

      {deviceFeatures.length! > 1 && (
        <div className="flex items-center justify-center py-4">
          <button
            onClick={handleViewMore}
            className="w-40 group h-12 border border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center gap-1.5 rounded-md "
          >
            {viewMore ? (
              <>
                <span className="font-gilroySemiBold text-sm pr-1">
                  View Less
                </span>
                <ChevronUp className="text-black group-hover:text-white" />
              </>
            ) : (
              <>
                <span className="font-gilroySemiBold text-sm">View More</span>
                <ChevronDown className="text-black group-hover:text-white" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
