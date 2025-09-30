"use client";

import { Icons } from "@/app/(root)/people/icons";
import { Table } from "@/components/wind/Table";
import {
  IntegrationUsers,
  UserByIntegration,
} from "@/server/integrationActions";
import {
  Settings03Icon,
  UserIcon,
  Wallet01FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import AllIntegrationsDisplay from "./all-integration-display";

interface UserByIntegrationsProps {
  data?: IntegrationUsers;
  selectedPlatform?: string;
  status?: "error" | "success" | "pending";
  integrationData?: IntegrationUsers["allUsers"][0]["integrations"][0];
  platformData?: any;
}

const reverseCycleMap: Record<number, string> = {
  1: "Month",
  3: "Quarter",
  6: "Half year",
  12: "Year",
};

const UserByIntegrations = ({
  platformData,
  data: totalIntegrationData,
  selectedPlatform,
  status,
  integrationData,
}: UserByIntegrationsProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const users = totalIntegrationData?.allUsers;

  // console.log(platformData);

  // console.log(totalIntegrationData);

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg border overflow-y-auto hide-scrollbar">
      {status === "pending" ? (
        <IntegrationHeaderSkeleton />
      ) : (
        <div className="flex justify-between items-center mb-6 ">
          <div className="flex gap-6 items-center w-full">
            {" "}
            {integrationData?.image || platformData?.companyLogo ? (
              <img
                src={integrationData?.image || platformData?.companyLogo}
                alt={integrationData?.platform}
                className="size-16 object-cover rounded-xl"
              />
            ) : (
              <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-4">
                <AltIntegration />
              </div>
            )}
            <div className="flex flex-col gap-5 w-full">
              <div className=" flex items-center gap-2.5">
                <h1 className="text-3xl font-gilroyBold">
                  {integrationData?.platform ?? selectedPlatform}
                </h1>{" "}
                {platformData?.isCustom &&
                  (platformData?.orgBased ||
                  (platformData?.perSeat === false &&
                    platformData?.orgBased === false) ? (
                    <span className="text-[#0051FF] h-fit bg-[#E8F4FF] text-[13px] px-3.5 py-2 rounded-full font-gilroySemiBold">
                      Central Level
                    </span>
                  ) : null)}
              </div>
              <div className="flex gap-5 justify-between w-full">
                <div className="flex gap-5">
                  <div className="flex gap-2 items-center">
                    <HugeiconsIcon
                      icon={Wallet01FreeIcons}
                      className="text-neutral-400 size-4"
                    />
                    <span className="text-sm font-gilroyMedium">
                      ₹
                      {formatNumber(
                        (totalIntegrationData?.platformTotalCost ||
                          platformData?.price?.price) ??
                          0
                      )}
                      {!platformData?.isOneTime &&
                        `/${
                          reverseCycleMap[
                            platformData?.cycle || totalIntegrationData?.cycles
                          ]
                        }`}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <HugeiconsIcon
                      icon={UserIcon}
                      className="text-neutral-400 size-4"
                    />

                    <span className="text-sm font-gilroyMedium">
                      {users?.length} Seats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="rounded-lg border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-gilroyMedium pl-6">Members</h1>
          </div>

          {users?.length !== 0 ? (
            <div className="flex flex-col gap-2">
              <Table
                isLoading={status === "pending"}
                data={users}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                columns={[
                  {
                    title: "Name",
                    render: (record: UserByIntegration) => (
                      <div className="w-28 flex items-center gap-2">
                        <GetAvatar
                          name={record?.first_name ?? record?.name ?? "Guest"}
                        />

                        <div className="relative group">
                          <div className="font-gilroySemiBold text-sm text-black truncate max-w-[150px]">
                            {(() => {
                              const name =
                                record?.first_name ?? record?.name ?? "Guest";
                              const displayName =
                                name.length > 12
                                  ? `${name.slice(0, 12)}...`
                                  : name;
                              return displayName;
                            })()}
                          </div>
                          <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                            {record?.first_name ?? record?.name ?? "Guest"}
                          </div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    title: "Role",
                    render: (record) => <div>{record?.designation ?? "-"}</div>,
                  },
                  {
                    title: "Reporting Manager",
                    render: (record) => (
                      <div>{record?.reporting_manager ?? "-"}</div>
                    ),
                  },
                  {
                    title: "Team",
                    render: (record) => <div>{record?.teamName ?? "-"}</div>,
                  },
                  {
                    title: "Joining Date",
                    render: (record) => {
                      const rawDate = record?.onboarding_date;
                      const diagDate = rawDate ? new Date(rawDate) : null;
                      const isValidDate =
                        diagDate && !isNaN(diagDate.getTime());

                      const formattedDiag = isValidDate
                        ? diagDate.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-";

                      return <div>{formattedDiag}</div>;
                    },
                  },
                  {
                    title: "All Integrations",
                    render: (record: UserByIntegration) => {
                      const filteredIntegrations =
                        record?.integrations?.filter((p) => p.platform) ?? [];

                      if (filteredIntegrations.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }

                      const firstThree = filteredIntegrations.slice(0, 3);
                      const extraCount = filteredIntegrations.length - 3;

                      return (
                        <AllIntegrationsDisplay
                          data={record as unknown as User}
                          allIntegrations={filteredIntegrations}
                        >
                          <div className="flex items-center gap-0">
                            <div className="flex items-center gap-2 -space-x-5">
                              {firstThree.map((i, index) => (
                                <React.Fragment key={index}>
                                  {i?.image ? (
                                    <div className="flex justify-center items-center p-1.5 bg-white rounded-full border">
                                      <img
                                        src={i.image}
                                        alt={i?.platform}
                                        width={16}
                                        height={16}
                                        className="size-4 object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1.5">
                                      <AltIntegration className={"size-4"} />
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                            {extraCount > 0 && (
                              <span className="text-sm text-gray-500 font-gilroySemiBold">
                                +{extraCount}
                              </span>
                            )}
                          </div>
                        </AllIntegrationsDisplay>
                      );
                    },
                  },
                ]}
              />
            </div>
          ) : platformData?.orgBased ||
            (platformData?.perSeat === false &&
              platformData?.orgBased === false) ? (
            <div className="flex flex-col gap-6 justify-center items-center py-8">
              <img src="/media/no_data/central-level.svg" alt="central-level" />
            </div>
          ) : (
            <div className="flex flex-col gap-6 justify-center items-center py-8">
              <Icons.no_people_display />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserByIntegrations;

import { GetAvatar } from "@/components/get-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { User } from "@/server/userActions";
import { AltIntegration } from "../icons";
import React from "react";

function IntegrationHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-6 items-center w-full">
        <Skeleton className="w-28 h-28 rounded-md" />
        <div className="flex flex-col gap-5 w-full">
          <Skeleton className="h-8 w-1/3" /> {/* Title */}
          <div className="flex gap-5 justify-between w-full">
            <div className="flex gap-5">
              <div className="flex gap-2 items-center">
                <Skeleton className="size-4 rounded-full" /> {/* Icon */}
                <Skeleton className="h-4 w-20" /> {/* Price */}
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="size-4 rounded-full" /> {/* Icon */}
                <Skeleton className="h-4 w-16" /> {/* Seats */}
              </div>
            </div>
            {/* <Skeleton className="h-9 w-24 rounded-md" />  */}
          </div>
        </div>
      </div>
    </div>
  );
}
