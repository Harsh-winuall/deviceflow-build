import {
  AddCircleIcon,
  Alert01Icon,
  Calendar03Icon,
  Call02Icon,
  Mail01Icon,
  ShieldEnergyIcon,
  StarAward02Icon,
  Tag01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  TabSkelton,
  TimelineSkelton,
} from "@/app/(root)/(userRoutes)/_components/profile-main-skeleton";
import { formatDate } from "@/app/(root)/people/[id]/_components/user-timeline-table";
import { GetAvatar } from "@/components/get-avatar";
import TabBar from "@/components/TabBar/tabbar";
import { Badge } from "@/components/ui/badge";
import MultipleSelector from "@/components/ui/multiple-selector";
import { assetActivityLog } from "@/server/activityActions";
import {
  addAssetsTags,
  Device,
  removeAssetsTags,
} from "@/server/deviceActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import AllSoftwareDisplay from "./all-software-display";
import DeviceDetailViewSkeltonLeft from "./device-detail-view-skelton-left";
import LicenseVerificationKey from "./license-key-verification";
import QCSection from "./qc-section";
import TicketsTable from "./tickets-section";
import { TimelineDemo } from "./timeline-section";
import Dropdown from "./accordian";
import { cycleDisplayMap, getFileNameFromUrl } from "@/lib/utils";

const NewDeviceView = ({ data, status }: { data: Device; status: string }) => {
  const queryClient = useQueryClient();
  const [showAllSoftwares, setShowAllSoftwares] = useState(false);
  const { data: deviceTimeLineData, status: timeLineStatus } = useQuery({
    queryKey: ["device-timeline", data?._id],
    queryFn: () => assetActivityLog(data._id),
    enabled: !!data?._id,
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
  });

  // console.log(deviceTimeLineData);
  const [verified, setVerified] = useState(false);

  const [tags, setTags] = useState<
    { label: string; value: string; _id: string; tag: string }[]
  >([]);
  const [showTags, setShowTags] = useState(false);

  // console.log(data);

  useEffect(() => {
    const tagData = data?.tags || [];
    // Deduplicate by `tag` value
    const uniqueTagMap = new Map();
    tagData.forEach((tag) => {
      if (!uniqueTagMap.has(tag.tag)) {
        uniqueTagMap.set(tag.tag, {
          ...tag,
          label: tag.tag,
          value: tag.tag,
        });
      }
    });
    setTags(Array.from(uniqueTagMap.values()));
  }, [data]);

  const addTagMutation = useMutation({
    mutationFn: addAssetsTags,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to add tag !");
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: removeAssetsTags,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to remove tag !");
    },
  });

  const openTicketsCount =
    data?.tickets?.filter((ticket) => ticket?.status?.toLowerCase() === "open")
      .length ?? 0;

  const tabs = [
    {
      id: "timeline",
      label: "Activity log",
      content: <TimelineDemo data={deviceTimeLineData} />,
    },
    {
      id: "tickets",
      label: "Tickets",
      content: <TicketsTable data={data?.tickets ?? []} />,
      ...(openTicketsCount > 0 ? { number: openTicketsCount } : {}),
    },
    {
      id: "qc",
      label: "QC Reports",
      content: <QCSection data={data?.qcDetails ?? []} />,
    },
  ];

  const sections = [
    {
      key: "installed_software",
      show: true,
    },
    {
      key: "device_profile",
      show: true,
    },
    {
      key: "assigne_info",
      show: true,
    },
    {
      key: "device_details",
      show: true,
    },
  ];

  const firstVisibleSection = sections.find((s) => s.show)?.key;

  const openIssues =
    data?.tickets?.filter(
      (ticket) => ticket?.status?.toLowerCase() === "open"
    ) || [];

  const deviceProfileData = [
    {
      label: "Device Type:",
      value: data?.device_type?.trim() || "",
    },
    {
      label: "Temporary Date:",
      value: data?.duration
        ? formatDate(data.duration).split(",").slice(0, 2).join(",")
        : "",
    },
    {
      label: "Device Condition:",
      value:
        data?.device_condition === "Excellent"
          ? "Excellent"
          : data?.device_condition === "Fair"
          ? "Fair"
          : data?.device_condition === "Good"
          ? "Good"
          : "",
      valueColor: "text-[#2E8016]",
    },
  ].filter(({ value }) => value && value !== "-"); // Remove empty

  return (
    <>
      <div className="bg-white rounded-[10px] w-full border overflow-hidden border-[rgba(0, 0, 0, 0.10)]  mt-4 flex h-[80vh]">
        {/* Left Side */}
        {status === "pending" ? (
          <DeviceDetailViewSkeltonLeft />
        ) : (
          <>
            <div className="w-[40%] h-full hide-scrollbar border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
              <div className="p-6">
                {/* Name, serial no, image, status */}
                <div className="flex gap-3 items-center">
                  {/* Image */}
                  <GetAvatar
                    name={data?.device_name || data?.custom_model}
                    size={60}
                    isDeviceAvatar
                  />
                  {/* Name, serial no */}
                  <div className="flex-col gap-1 w-full">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h1 className="font-gilroySemiBold text-lg line-clamp-1">
                          {data?.device_name || data?.custom_model}
                        </h1>
                        <h3 className="capitalize text-sm text-gray-600 font-gilroyMedium">
                          {data?.serial_no ?? "-"}
                        </h3>
                      </div>
                      <div className="flex gap-3">
                        {data?.end_life ? null : data?.deleted_at === null ? (
                          <span className="rounded-full text-center -mt-6  font-gilroyMedium h-fit  bg-[#ECFDF3] text-[#027A48] py-1 px-2 text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full text-center -mt-6  font-gilroyMedium h-fit  bg-[#FFEFEF] text-[#FF0000] py-0.5 px-2 text-xs">
                            Inactive
                          </span>
                        )}
                        {data?.end_life ? null : data?.is_temp_assigned ===
                          false ? (
                          <span className="text-xs font-gilroyMedium h-fit -mt-6  flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                            Permanant
                          </span>
                        ) : (
                          <span className="text-xs font-gilroyMedium h-fit -mt-6  flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                            Temporary
                          </span>
                        )}
                      </div>

                      {data?.end_life && (
                        <span className="rounded-full text-center -mt-6  font-gilroyMedium h-fit  bg-[#FFEFEF] text-[#FF0000] py-0.5 px-2 text-xs">
                          End of Life
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 font-gilroyMedium text-sm"></p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 my-5">
                  <div className="flex gap-5 items-center text-nowrap">
                    <div className="flex gap-1 items-center">
                      <HugeiconsIcon
                        icon={User03Icon}
                        className="text-[#a09f9f] size-4"
                      />
                      <p className=" font-gilroyMedium text-sm ">
                        Assigned to:
                      </p>
                      <Link href={`/people/${data?.userId}`}>
                        <p className="text-sm font-gilroyMedium underline ">
                          {data?.userName || "-"}
                        </p>
                      </Link>
                    </div>
                    <div className="flex gap-1 items-center">
                      <HugeiconsIcon
                        icon={ShieldEnergyIcon}
                        className="text-[#a09f9f] size-4"
                      />
                      {data?.warranty_status ? (
                        <p className="text-[#2E8016] text-xs  font-gilroyMedium">
                          In Warranty
                        </p>
                      ) : (
                        <p className="rounded-full text-center   font-gilroyMedium h-fit   text-[#FF0000]  text-sm">
                          Out of Warranty
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="flex gap-1 items-center">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className="text-[#a09f9f] size-4"
                      />
                      {/* Here we need to add createdAt,  */}
                      <p className="text-sm font-gilroyMedium leading-5">
                        Added on{" "}
                        {formatDate(data?.createdAt)
                          .split(",")
                          .slice(0, 2)
                          .join(",") || "-"}
                      </p>
                    </div>

                    {data?.device_condition?.trim() !== "" ? (
                      <div className="flex gap-1 items-center">
                        <HugeiconsIcon
                          icon={Tag01Icon}
                          className="text-[#a09f9f] size-4"
                        />

                        {data?.device_condition?.toLowerCase() ===
                        "excellent" ? (
                          <p className="text-[#2E8016] text-sm font-gilroyMedium">
                            Excellent
                          </p>
                        ) : data?.device_condition?.toLowerCase() === "good" ? (
                          <p className="text-[#FFAE00] text-sm font-gilroyMedium">
                            Good
                          </p>
                        ) : data?.device_condition?.toLowerCase() === "fair" ? (
                          <p className="text-[#FF0000] text-sm font-gilroyMedium">
                            Fair
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                {openIssues?.length > 0 && (
                  <Link href={`/assets/${data?._id}?tab=tickets`}>
                    <div className="bg-[#FFEDED] cursor-pointer px-2 py-3 gap-2 flex items-center rounded-[5px]">
                      <HugeiconsIcon
                        icon={Alert01Icon}
                        className="text-[#FF0000] size-4"
                      />
                      <p className="text-[#FF0000] text-sm  font-gilroyMedium">
                        {openIssues.length} Open{" "}
                        {openIssues.length === 1 ? "issue" : "issues"}
                      </p>
                    </div>
                  </Link>
                )}

                <div className="w-full mt-2">
                  {showTags ? null : (
                    <div className="flex justify-start w-full gap-3">
                      <div className="w-fit flex flex-wrap gap-1.5">
                        {tags?.map((tag) => (
                          <Badge
                            key={tag.value}
                            className="text-[#025CE5] group relative bg-[#52ABFF1A] rounded text-[13px]"
                          >
                            {tag.value ?? tag.tag}
                            <button
                              type="button"
                              onClick={() => {
                                setTags((prev) =>
                                  prev.filter((t) => t._id !== tag._id)
                                );
                                removeTagMutation.mutate({
                                  tag_id: tag._id,
                                  deviceId: data?._id,
                                });
                              }}
                              className="absolute -top-1.5 -right-1.5 group-hover:visible invisible"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <button
                        className="flex gap-1 items-center text-[#025CE5] cursor-pointer font-gilroyMedium"
                        type="button"
                        onClick={() => {
                          setShowTags(true);
                        }}
                      >
                        <HugeiconsIcon
                          icon={AddCircleIcon}
                          className="text-[#025CE5] size-3.5"
                        />
                        <span className="text-[13px]">Tag</span>
                      </button>
                    </div>
                  )}
                  {showTags ? (
                    <div>
                      <MultipleSelector
                        placeholder="Add tag"
                        creatable
                        value={tags}
                        onChange={(newTags) => {
                          setTags((prevTags) => {
                            const tagMap = new Map();

                            newTags.forEach((tag) => {
                              const existing = prevTags.find(
                                (t) => t.value === tag.value
                              );
                              tagMap.set(tag.value, {
                                ...existing,
                                ...tag,
                                label: tag.label || tag.value,
                                value: tag.value,
                                tag: tag.value,
                              });
                            });

                            return Array.from(tagMap.values());
                          });
                        }}
                      />
                      <div className="flex w-full justify-end gap-2 mt-2">
                        <button
                          type="button"
                          className="rounded-md border border-[#E5E5E5] py-1 px-3 font-gilroyMedium text-xs"
                          onClick={() => {
                            setShowTags(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-[#008910] py-1 px-3 text-white font-gilroyRegular text-xs"
                          onClick={() => {
                            const uniqueTags = Array.from(
                              new Map(
                                tags
                                  .filter(Boolean)
                                  .map((tag) => [tag.value, tag])
                              ).values()
                            );

                            addTagMutation.mutate(
                              {
                                tags: uniqueTags.map((tag) => tag.value),
                                deviceId: data?._id,
                              },
                              {
                                onSuccess: () => {
                                  setShowTags(false);
                                },
                              }
                            );
                          }}
                          disabled={addTagMutation.isPending}
                        >
                          {addTagMutation.isPending ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Installed software */}
                {data?.software?.length > 0 ? (
                  <>
                    <Dropdown
                      title="Installed Softwares"
                      onFirst={firstVisibleSection === "installed_software"}
                      headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                    >
                      {(data?.software || [])
                        .slice(0, 3)
                        .map((software, index) => (
                          <Link
                            key={index}
                            href={`/assets/${data?._id}/${software?._id}`}
                          >
                            <div className="space-y-3 mt-3 mb-1 border hover:border-black border-[#E5E5E5] rounded-[5px] px-3 py-2">
                              <div className="flex font-gilroyMedium justify-between items-center">
                                <div className="flex gap-1.5">
                                  <GetAvatar
                                    className="size-10 rounded-md"
                                    name={software?.licenseName || "-"}
                                  />
                                  <div className="flex flex-col">
                                    <h2 className="text-[15px] line-clamp-1">
                                      {software?.licenseName || "-"}
                                    </h2>
                                    {/* {JSON.stringify(software)} */}
                                    <LicenseVerificationKey
                                      licenseKey={software?.licenseKey}
                                      id={software?._id}
                                    />
                                  </div>
                                </div>
                                <span className="border px-2 text-xs py-1 border-[#2E8016] text-[#2E8016] font-gilroySemiBold rounded-[3px]">
                                  ₹{software?.payable / 100}/
                                  {cycleDisplayMap[software?.billingCycle]}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}

                      {data?.software?.length > 3 && (
                        <AllSoftwareDisplay data={data}>
                          <button
                            onClick={() => setShowAllSoftwares(true)}
                            className="mt-2 text-[#025CE5] font-gilroySemiBold text-xs underline"
                          >
                            Show All
                          </button>
                        </AllSoftwareDisplay>
                      )}
                    </Dropdown>
                  </>
                ) : null}

                {/* Device Profile */}
                {deviceProfileData.length > 0 && (
                  <Dropdown
                    title="Device Profile"
                    onFirst={firstVisibleSection === "device_profile"}
                    headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                  >
                    <div className="space-y-3 mt-3">
                      {deviceProfileData.map(
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

                {/* Assignee Information */}
                {data?.userId !== null && (
                  <Dropdown
                    title="Assignee Information"
                    onFirst={firstVisibleSection === "assigne_info"}
                    headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                  >
                    <div className="space-y-3 mt-3">
                      {[
                        {
                          icon: User03Icon,
                          label: "Name:",
                          value: data?.userName?.trim() || "",
                          className: "underline",
                        },
                        {
                          icon: Mail01Icon,
                          label: "Email:",
                          value: data?.email?.trim() || "",
                          className: "text-[#025CE5]",
                        },
                        {
                          icon: Call02Icon,
                          label: "Phone:",
                          value: data?.phone?.trim() || "",
                        },
                        {
                          icon: StarAward02Icon,
                          label: "Designation:",
                          value: data?.designation?.trim() || "",
                        },
                      ]
                        .filter(({ value }) => value && value !== "-")
                        .map(({ icon, label, value, className = "" }, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 pl-3"
                          >
                            <div className="min-w-[160px] flex items-center gap-2 ">
                              <HugeiconsIcon
                                icon={icon}
                                className="text-[#a09f9f] size-4"
                              />
                              <span className="text-[#a09f9f] font-gilroyMedium text-sm ">
                                {label}
                              </span>
                            </div>
                            <p
                              className={`text-sm font-gilroyMedium text-black ${className}`}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                    </div>
                  </Dropdown>
                )}

                {/* Device Details */}

                <Dropdown
                  title="Device Details"
                  onFirst={firstVisibleSection === "device_details"}
                  headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                >
                  <div className="space-y-3 mt-3">
                    {[
                      {
                        label: "Model Name:",
                        value: data?.custom_model?.trim() || "",
                      },
                      {
                        label: "Serial Number:",
                        value: data?.serial_no?.trim() || "",
                      },
                      {
                        label: "Brand:",
                        value: data?.brand?.trim() || "",
                      },
                      {
                        label: "Processor:",
                        value: data?.processor?.trim() || "",
                      },
                      {
                        label: "OS:",
                        value: data?.os?.trim() || "",
                      },
                      {
                        label: "Storage:",
                        value:
                          Array.isArray(data?.storage) &&
                          data?.storage?.length > 0
                            ? data?.storage.join(", ")
                            : "",
                      },
                      {
                        label: "Purchased On:",
                        value: data?.device_purchase_date
                          ? formatDate(data.device_purchase_date)
                              .split(",")
                              .slice(0, 2)
                              .join(",")
                          : "",
                      },
                      {
                        label: "Warranty Expiry:",
                        value: data?.warranty_expiary_date
                          ? formatDate(data.warranty_expiary_date)
                              .split(",")
                              .slice(0, 2)
                              .join(",")
                          : "",
                      },

                      {
                        label: "Documents:",
                        value: data?.upload_docs,
                      },
                    ]
                      ?.filter(({ value }) => value && value !== "-")
                      ?.map(({ label, value }, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 pl-3"
                        >
                          <div className="min-w-[140px]">
                            <span className="text-[#a09f9f] font-gilroyMedium text-sm ">
                              {label}
                            </span>
                          </div>
                          {label !== "Documents:" ? (
                            <p className="text-[15px] font-gilroyMedium ">
                              {value}
                            </p>
                          ) : (
                            <div className="flex flex-col gap-2 text-[#025CE5] font-gilroyMedium text-sm">
                              {value?.map((fileUrl, index) => (
                                <a
                                  key={index}
                                  href={fileUrl}
                                  download
                                  className="flex gap-2 items-center text-left"
                                >
                                  {getFileNameFromUrl(fileUrl, 20)}{" "}
                                  <Download className="size-4 text-black" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </Dropdown>
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
              status={timeLineStatus}
              tabs={tabs}
              defaultActiveTab="timeline"
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
export default NewDeviceView;
