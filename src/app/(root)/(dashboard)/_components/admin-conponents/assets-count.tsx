import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DashboardDetails } from "./interface";
export function AssetsCount({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) {
  return (
    <div className={`flex w-full items-start rounded-[10px] `}>
      <div
        className="flex h-full w-full flex-shrink-0 flex-col gap-y-4 overflow-clip rounded-[10px] bg-white px-4 pt-2 pb-4 tracking-[0px] backdrop-blur-[24]"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.10)",
        }}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center gap-x-[18px] pt-[0.08px]">
            <div className="text-sm font-gilroySemiBold leading-[23px]">
              Asset Count
            </div>
            <Badge className="text-purple-700 bg-purple-50">
              {(dashboardData?.deviceStatusData?.[0]?.assigned || 0) +
                (dashboardData?.deviceStatusData?.[0]?.inactive || 0) +
                (dashboardData?.deviceStatusData?.[0]?.un_assigned || 0)}{" "}
              Total Assets
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-5 text-center text-[11px] font-gilroyMedium leading-[17px] text-slate-600 min-[461px]:flex-nowrap">
          <div className="flex w-1/3 flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
            <div className="relative z-0 flex items-center text-center">
              <Image
                src="/media/dashboard/assigned.webp"
                alt="Assigned"
                width={28}
                height={28}
              />
            </div>
            <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
              {dashboardData?.deviceStatusData?.[0]?.assigned || 0}
            </div>
            <div className="text-center  text-[11px]">Assigned</div>
          </div>
          <div className="w-1/3 flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
            <div className="relative z-0 flex items-center  text-center">
              <Image
                src="/media/dashboard/unassigned.webp"
                alt="Unassigned"
                width={28}
                height={28}
              />
            </div>
            <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
              {dashboardData?.deviceStatusData?.[0]?.un_assigned || 0}
            </div>
            <div className="text-center">Unassigned</div>
          </div>
          <div className=" w-1/3 flex flex-col items-start gap-y-[5.4px] rounded-[11px] border-x-[1.1px] border-t-[1.1px] border-solid border-x-[gainsboro] border-y-[gainsboro] bg-white pb-[10px] pl-3.5  pt-3.5 [border-bottom-width:1.1px]">
            <div className="relative z-0 flex items-center  text-center">
              <Image
                src="/media/dashboard/inactive.webp"
                alt="Inactive"
                width={28}
                height={28}
              />
            </div>
            <div className="pt-1.5 text-[17px] font-gilroySemiBold leading-[23px]">
              {dashboardData?.deviceStatusData?.[0]?.inactive || 0}
            </div>
            <div className="text-center">Inactive</div>
          </div>
        </div>
      </div>
    </div>
  );
}
