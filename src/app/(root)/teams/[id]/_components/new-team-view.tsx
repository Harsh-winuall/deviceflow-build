"use client";

import {
  TabSkelton,
  TimelineSkelton,
} from "@/app/(root)/(userRoutes)/_components/profile-main-skeleton";
import { formatDate } from "@/app/(root)/people/[id]/_components/user-timeline-table";
import { GetAvatar } from "@/components/get-avatar";
import TabBar from "@/components/TabBar/tabbar";
import { cn, formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  PencilEdit01Icon,
  User03Icon,
  Wallet04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import DeviceDetailViewSkeltonLeft from "../../../assets/[id]/_components/device-detail-view-skelton-left";

import Dropdown from "@/components/accordian";
import { type Team, teamActivityLog, updateTeam } from "@/server/teamActions";
import AllTeamSubscriptions from "./all-subscription";
import AllTeamMembersTable from "./all-team-members";
import TeamTimelineTable from "./team-timeline-detail";
import { getUsersByTeamId, fetchUsers, type User } from "@/server/userActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { AsyncSelect } from "@/components/ui/async-select";

const SimpleTabBar = ({
  tabs,
  status,
  defaultActiveTab,
  className,
  tabClassName,
  activeTabClassName,
}: {
  tabs: any[];
  status?: string;
  defaultActiveTab?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <div className="flex border-b border-[rgba(0, 0, 0, 0.10)]">
          <div className="flex mx-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-2 mr-4 pt-2 flex items-center gap-2 font-gilroyMedium text-sm focus:outline-none",
                  "transition-colors duration-200",
                  tabClassName,
                  activeTab === tab.id
                    ? cn(
                        "text-black border-b-2 border-black -mb-[1px]",
                        activeTabClassName
                      )
                    : "text-[#808080]"
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
                {tab?.number && (
                  <span className="bg-[#FF0000] -mt-1 p-2 text-white text-[9px] rounded-full size-4 flex justify-center items-center">
                    <span>{tab.number}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {status === "pending" ? (
        <div className="h-[20vh] flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        tabs.some((tab) => tab.content) && (
          <div className="mt-4">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        )
      )}
    </div>
  );
};

const NewTeamView = ({
  id,
  selectedIds,
  setSelectedIds,
  userStatus,
  handleSelectionChange,
  integrationByTeamData,
}: {
  id?: string;
  userStatus?: string;
  selectedIds?: any;
  setSelectedIds: any;
  integrationByTeamData?: any;
  handleSelectionChange?: any;
}) => {
  const [showAllSoftwares, setShowAllSoftwares] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: teamTimeLineData, status: timeLineStatus } = useQuery({
    queryKey: ["team-timeline", id],
    queryFn: () => teamActivityLog(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue, getValues, reset } = useForm<{
    reporting_manager: User | null;
    reporting_manager_id: string;
  }>({
    defaultValues: {
      reporting_manager: null,
      reporting_manager_id: "",
    },
  });
  const { mutate: updateTeamMutate, isPending: isUpdating } = useMutation({
    mutationFn: (input: { id: string; teamData: Team }) =>
      updateTeam(input.id, input.teamData),
    onSuccess: (teamData) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-team-by-id"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["get-users-by-team-id"],
        exact: false,
        refetchType: "all",
      });
      const teamName =
        integrationByTeamData?.teamDetail?.title?.trim() || "team";
      toast.success(`Manager of ${teamName} is updated`);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Team update error:", error);
      toast.error("Failed to update manager");
    },
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Memoize tabs to prevent re-rendering and flickering
  const tabs = useMemo(
    () => [
      {
        id: "members",
        label: "Members",
        content: (
          <AllTeamMembersTable
            handleSelectionChange={handleSelectionChange}
            data={integrationByTeamData?.users}
            status={userStatus}
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
          />
        ),
      },
      {
        id: "timeline",
        label: "Activity log",
        content: <TeamTimelineTable data={teamTimeLineData} />,
      },
    ],
    [
      handleSelectionChange,
      integrationByTeamData?.users,
      userStatus,
      setSelectedIds,
      selectedIds,
      teamTimeLineData,
    ]
  );

  const sections = [
    {
      key: "team_details",
      show: true,
    },
    {
      key: "subscription_used",
      show: true,
    },
  ];

  const firstVisibleSection = sections.find((s) => s.show)?.key;

  const teamDetails = [
    {
      label: "Name:",
      value: integrationByTeamData?.teamDetail?.title?.trim() || "",
    },
    {
      label: "Manager:",
      value: integrationByTeamData?.teamDetail?.active_manager[0]?.name || "",
    },
    {
      label: "Members:",
      value: integrationByTeamData?.total,
    },

    {
      label: "Created on:",
      value: integrationByTeamData?.teamDetail?.createdAt
        ? formatDate(integrationByTeamData.teamDetail?.createdAt)
            .split(",")
            .slice(0, 2)
            .join(",")
        : "",
    },
    {
      label: "Created By:",
      value: integrationByTeamData?.teamDetail?.team_creator[0]?.name,
    },
    {
      label: "Device Condition:",
      value:
        integrationByTeamData?.device_condition === "Excellent"
          ? "Excellent"
          : integrationByTeamData?.device_condition === "Fair"
          ? "Fair"
          : integrationByTeamData?.device_condition === "Good"
          ? "Good"
          : "",
      valueColor: "text-[#2E8016]",
    },
  ].filter(({ value }) => value && value !== "-"); // Remove empty
  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleEditCancel();
      }
    };
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);
  const handleEditSaveClick = useCallback(() => {
    const selectedId = getValues("reporting_manager_id");
    const prevId =
      integrationByTeamData?.teamDetail?.active_manager[0]?._id || "";

    // If nothing selected → just close
    if (!selectedId) {
      handleEditCancel();
      return;
    }

    // If same as before → just close
    if (selectedId === prevId) {
      handleEditCancel();
      return;
    }

    // Only call API if value actually changed
    if (id && selectedId !== prevId) {
      updateTeamMutate(
        {
          id,
          teamData: { userId: selectedId } as unknown as Team,
        },
        {
          onSuccess: () => {
            setIsEditing(false); // close immediately on success
          },
          onError: () => {
            // optional: keep open if error, or close anyway
            setIsEditing(false);
          },
        }
      );
    }
  }, [
    getValues,
    integrationByTeamData?.teamDetail?.active_manager,
    id,
    updateTeamMutate,
    reset,
  ]);

  const handleEditCancel = useCallback(() => {
    reset({
      reporting_manager: null,
      reporting_manager_id: "",
    });
    setIsEditing(false);
  }, [reset]);

  return (
    <>
      <div className="bg-white rounded-[10px] w-full border overflow-hidden border-[rgba(0, 0, 0, 0.10)] mt-4 flex h-[80vh]">
        {/* Left Side */}
        {userStatus === "pending" ? (
          <DeviceDetailViewSkeltonLeft teamView={true} />
        ) : (
          <>
            <div className="w-[40%] min-h-0 h-full border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto hide-scrollbar">
              <div className="p-6 min-h-full">
                {/* Name, serial no, image, status */}
                <div className="flex gap-3 items-center">
                  {/* Image */}
                  <GetAvatar
                    name={integrationByTeamData?.teamDetail?.title}
                    size={60}
                    isDeviceAvatar
                  />
                  {/* Name, serial no */}
                  <div className="flex-col gap-1 w-full">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="flex flex-col">
                        <h1 className="font-gilroySemiBold text-lg line-clamp-1">
                          {integrationByTeamData?.teamDetail?.title
                            ? integrationByTeamData.teamDetail.title
                                .charAt(0)
                                .toUpperCase() +
                              integrationByTeamData.teamDetail.title.slice(1)
                            : ""}
                        </h1>
                        <h3 className="capitalize text-[15px] text-[#999999] font-gilroyMedium">
                          {integrationByTeamData?.teamDetail?.team_code}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-400 font-gilroyMedium text-sm"></p>
                  </div>
                </div>

                <div className="flex flex-col py-5 gap-3 text-nowrap">
                  {integrationByTeamData?.totalTeamSubscriptionCost > 0 && (
                    <div className="flex flex-col  text-nowrap">
                      {integrationByTeamData?.totalTeamSubscriptionCost && (
                        <div className="flex gap-1 items-center">
                          <HugeiconsIcon
                            icon={Wallet04Icon}
                            className="text-[#a09f9f] size-[19px]"
                          />
                          <p className=" font-gilroyMedium text-black/55 text-sm ">
                            Monthly Subscription Cost:
                          </p>

                          <p className="text-sm text-[#0D9B00] font-gilroyMedium ">
                            ₹
                            {integrationByTeamData?.totalTeamSubscriptionCostUserLevel?.toFixed(
                              2
                            ) || "-"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {integrationByTeamData?.teamDetail?.active_manager[0]
                    ?.name && (
                    <div className="flex gap-1 items-center">
                      <HugeiconsIcon
                        icon={User03Icon}
                        className="text-[#a09f9f] size-[19px]"
                      />
                      <p className=" font-gilroyMedium text-black/55 text-sm ">
                        Reporting Manager :
                      </p>
                      {!isEditing ? (
                        <>
                          <Link
                            href={`/people/${integrationByTeamData?.teamDetail?.userId}`}
                          >
                            <p className="text-sm flex gap-2 items-center justify-center font-gilroyMedium">
                              {integrationByTeamData?.teamDetail
                                ?.active_manager[0]?.name || "-"}
                            </p>
                          </Link>
                          <HugeiconsIcon
                            icon={PencilEdit01Icon}
                            className="size-[14px] text-[#0051FF] cursor-pointer"
                            onClick={() => {
                              setIsEditing(true);
                            }}
                          />
                        </>
                      ) : (
                        <div
                          ref={wrapperRef}
                          className="flex items-center gap-2"
                        >
                          <Controller
                            name="reporting_manager"
                            control={control}
                            render={({ field }) => (
                              <AsyncSelect<User>
                                width={"180px"}
                                fetcher={fetchUsers}
                                queryKey="fetch-users"
                                preload
                                renderOption={(user) => (
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                      <div className="font-gilroyMedium">
                                        {user?.first_name}
                                      </div>
                                      <div className="text-xs font-gilroyRegular text-muted-foreground">
                                        {user?.email}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                filterFn={(user, query) =>
                                  user?.first_name
                                    ?.toLowerCase()
                                    ?.includes(query?.toLowerCase()) ||
                                  user?.email
                                    ?.toLowerCase()
                                    ?.includes(query?.toLowerCase())
                                }
                                getOptionValue={(user) => user?.email}
                                getDisplayValue={(user) => (
                                  <div className="flex items-center gap-2 text-left w-full">
                                    <div className="flex flex-col leading-tight">
                                      <div className="font-gilroyMedium">
                                        {user?.first_name || "Select user"}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                notFound={
                                  <div className="py-6 text-center font-gilroyMedium text-sm">
                                    No users found
                                  </div>
                                }
                                label="User"
                                placeholder={
                                  integrationByTeamData?.teamDetail
                                    ?.active_manager[0]?.name
                                }
                                value={field.value || null}
                                onChange={(selected: User | null) => {
                                  field.onChange(selected);
                                  setValue(
                                    "reporting_manager_id",
                                    selected?._id || ""
                                  );
                                }}
                                className="text-[13px] p-0"
                                triggerClassName="text-[13px] w-80 hover:bg-transparent hover:text-black text-black px-1 py-0.5 h-[25px] rounded"
                              />
                            )}
                          />

                          {/* Only Save button (Cancel removed) */}
                          <Button
                            onClick={handleSubmit(handleEditSaveClick)}
                            className="p-0.5 px-1 rounded-[5px] bg-[#008910] text-white hover:bg-[#008910]/30  h-6 w-fit text-xs"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {teamDetails?.length > 0 && (
                  <Dropdown
                    title="Team Details"
                    onFirst={firstVisibleSection === "team_details"}
                    headerClassName="bg-[#F6F6F6]  text-sm"
                  >
                    <div className="space-y-3 ">
                      {teamDetails?.map(
                        ({ label, value, valueColor = "" }, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-3"
                          >
                            <div className="flex items-start gap-2 min-w-[120px]">
                              <span className="text-[#a09f9f] font-gilroyMedium text-sm">
                                {label}
                              </span>
                            </div>
                            <p
                              className={`text-sm font-gilroyMedium ${valueColor}`}
                            >
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </Dropdown>
                )}

                {/* Installed software */}
                {integrationByTeamData?.subscriptionSummary?.length > 0 ? (
                  <Dropdown
                    title="Subscription Used"
                    onFirst={firstVisibleSection === "subscription_used"}
                    headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                  >
                    <div className="flex flex-col h-60 hide-scrollbar overflow-y-auto pb-4">
                      {(integrationByTeamData?.subscriptionSummary || [])
                        .slice(0, showAllSoftwares ? undefined : 3)
                        .map((software: any, index: number) => (
                          <Link
                            key={index}
                            href={`/integrations/installed/${software?.platform}`}
                          >
                            <div className="space-y-3 mt-3 mb-1 border hover:border-black border-[#E5E5E5] rounded-[5px] px-3 py-2">
                              <div className="flex font-gilroyMedium justify-between items-center">
                                <div className="flex gap-1.5">
                                  <img
                                    src={software?.image || "-"}
                                    className="size-10 rounded-md"
                                  />
                                  <div className="flex flex-col">
                                    <h2 className="text-[15px] line-clamp-1">
                                      {software?.platform || "-"}
                                    </h2>
                                    <h2 className="text-[13px] text-[#808080] line-clamp-1">
                                      {software?.userCount}
                                      {software?.userCount > 0
                                        ? " Seats"
                                        : " Seat"}
                                    </h2>
                                  </div>
                                </div>
                                <span className="border w-32 text-center text-xs py-1 border-[#2E8016] text-[#2E8016] font-gilroySemiBold rounded-[3px]">
                                  {(software?.orgBased === false &&
                                    software?.perSeat === false) ||
                                  software?.isOneTime ? (
                                    <p>Central</p>
                                  ) : (
                                    <span>
                                      ₹
                                      {Array.isArray(software?.price)
                                        ? formatNumber(
                                            parseInt(software?.price || "0")
                                          )
                                        : formatNumber(software?.price ?? 0)}
                                      /month
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}

                      {integrationByTeamData?.subscriptionSummary?.length >
                        3 && (
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              setShowAllSoftwares(!showAllSoftwares)
                            }
                            className="mt-2 text-[#025CE5] font-gilroySemiBold text-xs underline"
                          >
                            {showAllSoftwares ? "Show Less" : "Show All"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Dropdown>
                ) : null}
              </div>
            </div>
          </>
        )}

        {/* Right Side */}
        {timeLineStatus === "pending" ? (
          <div className="flex flex-col m-7 gap-5">
            <TabSkelton />
            <TimelineSkelton />
          </div>
        ) : (
          <div className="w-[60%] overflow-y-auto">
            <h1 className="font-gilroySemiBold text-lg px-6 pt-6 pb-3">
              Overview
            </h1>
            <TabBar
              status={userStatus}
              tabs={tabs}
              defaultActiveTab="members"
              className="mb-6"
              tabClassName="px-3 text-sm"
              activeTabClassName="font-gilroySemiBold"
            />
          </div>
        )}
      </div>
    </>
  );
};
export default NewTeamView;
