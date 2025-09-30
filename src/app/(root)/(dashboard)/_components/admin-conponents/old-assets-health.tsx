"use client";
import React, { useEffect } from "react";
import { DashboardDetails } from "./interface";
import ExcellentDeviceIcon from "@/icons/ExcellentDeviceIcon";
import FairDeviceIcon from "@/icons/FairDeviceIcon";
import Image from "next/image";

export function AssetsHealth({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) {
  return (
    <div className={`flex w-full flex-col `}>
      <div className="font-gilroy flex flex-grow flex-col gap-y-[18px] rounded-3xl border border-solid border-x-[#c0c0c099] border-y-[#c0c0c099] bg-white px-5 pb-[19px] pt-[13px] tracking-[0px] backdrop-blur-[24]">
        <div className="flex items-center">
          <div className="text-sm font-gilroySemiBold leading-[23px]">
            Asset Health Status
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-5 text-center text-[11px] font-gilroyMedium leading-[17px] text-slate-600 min-[461px]:flex-nowrap">
          {(dashboardData?.deviceConditionData?.length || 0) > 0 ? (
            dashboardData?.deviceConditionData?.map(
              (response, index: number) => {
                if (response._id === "Excellent") {
                  return (
                    <div
                      key={`excel-${index}`}
                      className="flex w-[127px]  flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]"
                    >
                      <div className="relative z-0 flex items-center  text-center">
                        <ExcellentDeviceIcon />
                      </div>
                      <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                        {response.count || 0}
                      </div>
                      <div className="text-center  text-[11px]">
                        Excellent Device
                      </div>
                    </div>
                  );
                }
                if (response._id === "Good") {
                  return (
                    <div
                      key={`good-${index}`}
                      className="w-[127px]  flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]"
                    >
                      <div className="relative z-0 flex items-center  text-center">
                        <Image src="/media/dashboard/unassigned.webp" alt="Unassigned" width={28} height={28}/>
                      </div>
                      <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                        {response.count || 0}
                      </div>
                      <div className="text-center">Good Device</div>
                    </div>
                  );
                }
                if (response._id === "Fair") {
                  return (
                    <div
                      key={`fair-${index}`}
                      className=" w-[127px]  flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]"
                    >
                      <div className="relative z-0 flex items-center  text-center">
                        <FairDeviceIcon />
                      </div>
                      <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                        {response.count || 0}
                      </div>
                      <div className="text-center">Fair Device</div>
                    </div>
                  );
                }
              }
            )
          ) : (
            <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-5 text-center text-[11px] font-gilroyMedium leading-[17px] text-slate-600 min-[461px]:flex-nowrap">
              <div className="flex w-[127px]  flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
                <div className="relative z-0 flex items-center  text-center">
                  <ExcellentDeviceIcon />
                </div>
                <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                  0
                </div>
                <div className="text-center  text-[11px]">Excellent Device</div>
              </div>
              <div className="w-[127px]  flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
                <div className="relative z-0 flex items-center  text-center">
                  <Image src="/media/dashboard/unassigned.webp" alt="Unassigned" width={28} height={28}/>
                </div>
                <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                  0
                </div>
                <div className="text-center">Good Device</div>
              </div>
              <div className=" w-[127px]  flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
                <div className="relative z-0 flex items-center  text-center">
                  <FairDeviceIcon />
                </div>
                <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
                  0
                </div>
                <div className="text-center">Fair Device</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
