import React from "react";
import { DashboardDetails } from "./interface";
import { useRouter } from "next/navigation";
export function ManageIssue({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) {
  const router = useRouter();

  if(!dashboardData) {
    return(
      <div className="w-full  bg-white  rounded-md border border-black/10 flex flex-col justify-center items-center px-3 py-5 gap-6 lg:p-7">
        <img src="/media/dashboard/no-issue.webp" width={200} height={120}/>
        <div className="w-full">
          <p className="text-black text-lg font-gilroySemiBold text-center">You're running perfectly</p>
          <p className="text-gray-400 text-sm font-gilroyMedium text-center">No issues have been reported yet</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex-1 min-w-[250px] max-w-full font-gilroy flex relative border-gray-200 flex-col items-start gap-y-[11px] rounded-[10px] border border-solid bg-white pb-[13px] px-5 pt-[13px] tracking-[0px] backdrop-blur-[24]">
        <div className="flex items-center self-stretch px-[1.3px]">
          <div className="text-sm font-gilroySemiBold w-full flex justify-between leading-[23px]">
            <span>Tickets</span>
            <button className="text-[#0051FF] text-sm font-gilroyMedium" onClick={() => router.push("/tickets")}>
              View All
            </button>
          </div>
        </div>
        <div className="self-stretch pr-[0.8px] mt-3 flex flex-col gap-5">
          {(dashboardData?.ticketData?.length || 0) > 0 ? (
            dashboardData?.ticketData?.slice(0, 3).map((response, index) => {
              const date = new Date(response?.openedOn);
              const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <div className="w-full flex flex-col cursor-pointer" key={`issue-${index}`} onClick={() => router.push(`/tickets/${response?._id}`)}>
                  <div className="flex justify-between">
                    <div className="font-gilroySemiBold text-base text-[#092C4C]">
                      {response?.category}
                    </div>

                    {/* <span className="text-xs font-gilroyMedium cursor-pointer px-3 py-2 border border-[#E5E5E5] rounded-[6px]" onClick={() => router.push(`/tickets/${response._id}`)}>
                      {" "}
                      View More
                    </span> */}
                  </div>

                  <div className="text-[#7E92A2] text-sm font-gilroyRegular -mt-1">
                    {formattedDate}, {response?.code}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col h-full justify-center items-center gap-1">
              <img
                src={"/media/dashboard/no-issue.webp"}
                style={{ width: "100%", height: 183 }}
              />
              <div
                className={`font-gilroy h-12 w-full text-center font-semibold leading-[19px] tracking-[0px]`}
              >
                <span>
                  <p className="text-center text-[15px] leading-[19px]">
                    No issues to fix
                  </p>
                  <p className="text-center text-xs leading-[19px] text-[dimgray]">
                    Devices are issue-free! High-five to that!
                  </p>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <img src="/media/dashboard/Today_sales.svg" alt="" className="mt-1" /> */}
    </>
  );
}
