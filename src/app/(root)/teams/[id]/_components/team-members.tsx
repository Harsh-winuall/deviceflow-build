"use client";
import { AltIntegration } from "@/app/(root)/integrations/_components/icons";
import AllIntegrationsDisplay from "@/app/(root)/integrations/_components/installed/all-integration-display";
import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/wind/Table";
import { Team } from "@/server/teamActions";
import { getUsersByTeamId, User } from "@/server/userActions";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import AddTeamMember from "./add-team-member";
import MoveTeamMember from "./move-team-member";
import { RemoveTeamMember } from "./remove-team-member";

const TeamMembers = ({
  teamData,
  status,
  selectedIds,
  setSelectedIds,
  handleSelectionChange,
  cycle,
  setTotalCost,
  integration,
}: {
  teamData: Team;
  status: string;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  handleSelectionChange: (selected: string[]) => void;
  cycle?: string;
  setTotalCost?: (cost: number) => void;
  integration?: string;
}) => {
  const router = useRouter();

  const { data, status: userStatus } = useQuery({
    queryKey: ["get-users-by-team-id", teamData?._id, cycle, integration],
    queryFn: () => getUsersByTeamId(teamData?._id, 1, cycle, integration),
  });

  setTotalCost(data?.totalTeamSubscriptionCost);

  // console.log("Team Members Data : ", data);

  return (
    <div
      className="rounded-[5px] flex flex-col "
      style={{ border: "1px solid #F6F6F6" }}
    >
      {status !== "pending" && data?.users?.length === 0 ? (
        <div className="flex flex-col  justify-center items-center py-4">
          <img
            src="/media/no_data/people.webp"
            alt="No-People Logo"
            className="h-[53vh]"
          />
          {teamData?.deleted_at === null && (
            <AddTeamMember teamData={teamData}>
              <div className={buttonVariants({ variant: "primary" })}>
                <div className=" group-hover:text-black text-nowrap text-sm font-gilroyMedium">
                  Add Members
                </div>
              </div>
            </AddTeamMember>
          )}
        </div>
      ) : (
        <>
          {userStatus === "pending" ? (
            <div className="flex gap-3 p-3 items-center">
              <Skeleton className="h-4 w-32 ml-3" />

              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ) : (
            <div className="flex gap-3 p-3 items-center">
              <h2 className="text-base pl-3 font-gilroyMedium text-gray-800">
                Team Members
              </h2>

              <Badge className="bg-[#F9F5FF] font-gilroySemiBold text-[#6941C6]">
                {data?.total
                  ? `${data?.total} ${data?.total > 1 ? "Members" : "Member"}`
                  : "N/A"}
              </Badge>
            </div>
          )}

          <>
            <div className="flex flex-col">
              <Table
                data={data?.users ?? []}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isLoading={userStatus === "pending"}
                checkboxSelection={{
                  uniqueField: "_id",
                  onSelectionChange: handleSelectionChange,
                }}
                columns={[
                  {
                    title: "Name",
                    render: (data) => (
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => router.push(`/people/${data?._id}`)}
                      >
                        <GetAvatar name={data?.first_name ?? ""} size={30} />

                        <div className="relative group">
                          <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                            {data?.first_name?.length! > 12
                              ? `${data?.first_name!.slice(0, 12)}...`
                              : data?.first_name}
                          </div>
                          <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                            {data?.first_name ?? "-"}
                          </div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    title: "Email",
                    render: (data) => <div>{data?.email || "-"}</div>,
                  },
                  {
                    title: "Role",
                    render: (data) => <div>{data?.designation || "-"}</div>,
                  },
                  {
                    title: "Joining Date",
                    render: (record) => {
                      const onboardingDate = record?.onboarding_date;

                      // Check if onboardingDate is null, undefined, or empty
                      if (!onboardingDate) {
                        return <div>-</div>; // Return "-" for null, undefined, or empty value
                      }

                      const date = new Date(onboardingDate);

                      // Check if the date is valid
                      if (isNaN(date.getTime())) {
                        return <div>-</div>; // Return "-" for invalid date
                      }

                      const formattedDate = date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      return <div>{formattedDate}</div>;
                    },
                  },
                  {
                    title: "Assets assigned",
                    render: (user: User) =>
                      user?.devices && user?.devices?.length > 0 ? (
                        <Badge className={`bg-[#ECFDF3] text-[#027A48]`}>
                          {`${user?.devices?.length} Assigned`}
                        </Badge>
                      ) : (
                        <div>-</div>
                      ),
                  },
                  {
                    title: "Subscriptions",
                    render: (record: User) => {
                      // const filteredIntegrations = (
                      //   record?.subscriptions ?? []
                      // ).filter((i) => i.platform !== selectedPlatform);
                      const integrations =
                        record?.subscriptions?.filter((p) => p.platform) ?? [];

                      if (integrations?.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }

                      const firstThree = integrations?.slice(0, 3);
                      const extraCount = integrations?.length - 3;

                      return (
                        <AllIntegrationsDisplay
                          data={record}
                          allIntegrations={integrations}
                          isTeamBased
                          cycle={cycle}
                        >
                          <div className="flex items-center gap-0">
                            <div className="flex items-center gap-2 -space-x-5">
                              {firstThree.map((i, index) => (
                                <React.Fragment key={index}>
                                  {i?.image ? (
                                    <div className="flex justify-center items-center p-1.5 bg-white rounded-full border">
                                      <img
                                        src={i.image ?? ""}
                                        width={16}
                                        height={16}
                                        className=" object-contain "
                                        alt="Integration"
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
                  {
                    title: "",
                    render: (data) => (
                      <div className="flex justify-start items-center gap-5 2xl:gap-10 -ml-2">
                        <RemoveTeamMember userData={data}>
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={22}
                            className="text-[#656B70]"
                          />
                        </RemoveTeamMember>
                        <MoveTeamMember userData={data}>
                          {/* <EditTableIcon className="size-5" /> */}
                          <span
                            className={buttonVariants({
                              variant: "outlineTwo",
                            })}
                          >
                            Move
                          </span>
                        </MoveTeamMember>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </>
        </>
      )}
    </div>
  );
};

export default TeamMembers;
