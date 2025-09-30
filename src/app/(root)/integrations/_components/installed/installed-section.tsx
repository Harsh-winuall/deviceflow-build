"use client";
import { buttonVariants } from "@/components/buttons/Button";
import { formatNumber } from "@/lib/utils";
import { ConnectedIntegrationsRes } from "@/server/integrationActions";
import Link from "next/link";
import ConnectionCard from "./installed-section-connect-card";

export const InstalledSection = ({
  data,
  status: dataStatus,
  startDate,
}: {
  data: ConnectedIntegrationsRes;
  status?: "error" | "success" | "pending";
  startDate?: string;
}) => {

  // console.log(data)
  return (
    <>
      <div className="flex flex-col gap-7">
        {/* {JSON.stringify(data)} */}
        {data && data?.data?.integrations?.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-lg font-gilroySemiBold pt-3">Installed</p>
              <p className="text-[#2E8016] bg-[#E2FBE6] text-base font-gilroyBold flex items-center gap-2 rounded-[5px] px-3 py-1.5">
                <span className="text-sm font-gilroySemiBold">Total:</span>
                {startDate
                  ? `₹${formatNumber(data?.data?.historyTotalPrice ?? 0)}`
                  : `₹${formatNumber(data?.data?.overallTotalPrice ?? 0)}`}
              </p>
            </div>
            <div className="grid justify-items-center gap-7 grid-cols-3 mb-10">
              {data?.data?.integrations.map((company) => {
                return (
                  <Link
                    key={company?._id}
                    className="w-full"
                    href={`/integrations/installed/${company?.platform}`}
                  >
                    <ConnectionCard
                      amount={formatNumber(company?.totalPrice ?? 0)}
                      src={company?.companyLogo}
                      description={`${company?.description}`}
                      name={company?.platform}
                      seats={company?.userCount}
                      orgBased={company?.orgBased}
                      oneTime={company?.isOneTime}
                      perSeat={company?.perSeat}
                      isCustom={company?.isCustom}
                    />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex  font-gilroySemiBold flex-col gap-6 my-5  justify-center items-center ">
            <img
              src="/media/no_data/Integrations.svg"
              alt="No-Integration Logo"
            />
            <Link href={"/integrations/discover"}>
              <button
                className={buttonVariants({
                  variant: "primary",
                  className: "w-full",
                })}
              >
                Discover
              </button>
            </Link>
          </div>
        )}
      </div>
      {/* )} */}
    </>
  );
};
