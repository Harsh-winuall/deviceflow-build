
import { DashboardDetails } from "./interface";
import Image from "next/image";

export const Teams = ({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) => {
  return (
    <div className="font-gilroy flex  w-full flex-shrink-0 flex-col gap-y-4 overflow-clip rounded-3xl border border-solid border-x-[#c0c0c099] border-y-[#c0c0c099] bg-white pb-5 pl-[20px] pr-5 pt-[13px] tracking-[0px] backdrop-blur-[24]">
      <div className="flex items-center">
        <div className="flex items-center justify-center gap-x-[18px] pt-[0.08px]">
          <div className="text-sm font-gilroySemiBold leading-[23px]">
            Teams
          </div>
          <div className="rounded-[17px] bg-purple-50 px-2 py-0.5 text-center text-xs font-gilroyMedium leading-[19px] text-purple-700">
            {(dashboardData?.teamsData?.[0]?.activeTeams || 0) +
              (dashboardData?.teamsData?.[0]?.inactiveTeams || 0)}{" "}
            Total Teams
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-5 text-center text-[11px] font-gilroyMedium leading-[17px] text-slate-600 min-[461px]:flex-nowrap">
        <div className="flex w-[127px] flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
          <div className="relative z-0 flex items-center text-center">
            <Image src="/media/dashboard/assigned.webp" alt="Assigned" width={28} height={28}/>
          </div>
          <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
            {dashboardData?.teamsData?.[0]?.activeTeams || 0}
          </div>
          <div className="text-center  text-[11px]">Active</div>
        </div>
        <div className="w-[127px] flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
          <div className="relative z-0 flex items-center  text-center">
            <Image src="/media/dashboard/unassigned.webp" alt="Unassigned" width={28} height={28}/>
          </div>
          <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
            {dashboardData?.teamsData?.[0]?.inactiveTeams || 0}
          </div>
          <div className="text-center">Deleted</div>
        </div>
      </div>
    </div>
  );
};
