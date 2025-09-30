import {
  AddCircleIcon,
  Calendar03Icon,
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
import {
  addLicenseTags,
  removeAssetsTags,
  Software,
} from "@/server/deviceActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DeviceDetailLeftSkelton from "@/app/(root)/assets/[id]/_components/device-detail-view-skelton-left";
import LicenseVerificationKey from "@/app/(root)/assets/[id]/_components/license-key-verification";
import { TimelineDemo } from "@/app/(root)/assets/[id]/_components/timeline-section";
import Dropdown from "@/components/accordian";
import { Badge } from "@/components/ui/badge";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cycleDisplayMap } from "@/lib/utils";

const SingleSoftwareScreen = ({
  data,
  status,
}: {
  data: Software;
  status: string;
}) => {
  const queryClient = useQueryClient();

  const [tags, setTags] = useState<
    { label: string; value: string; _id: string; tag: string }[]
  >([]);
  const [showTags, setShowTags] = useState(false);

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
    mutationFn: addLicenseTags,
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

  const tabs = [
    {
      id: "timeline",
      label: "Activity log",
      content: <TimelineDemo data={data} />,
    },
  ];

  const sections = [
    {
      key: "device_details",
      show: true,
    },
    {
      key: "assigne_info",
      show: true,
    },
  ];

  const firstVisibleSection = sections.find((s) => s.show)?.key;

  return (
    <>
      <div className="bg-white rounded-[10px] w-full border overflow-hidden border-[rgba(0, 0, 0, 0.10)]  mt-4 flex h-[100vh]">
        {/* Left Side */}
        {status === "pending" ? (
          <DeviceDetailLeftSkelton />
        ) : (
          <>
            <div className="w-[40%] h-full hide-scrollbar border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
              <div className="p-6">
                {/* Name, serial no, image, status */}
                <div className="flex gap-3 items-start">
                  {/* Image */}
                  <GetAvatar
                    name={data?.licenseName || "-"}
                    size={60}
                    isDeviceAvatar
                  />
                  {/* Name, serial no */}
                  <div className="flex-col gap-1">
                    <div className="flex gap-3 items-start">
                      <div className="flex flex-col gap-0.5">
                        <h1 className="font-gilroySemiBold text-lg line-clamp-1">
                          {data?.licenseName || "-"}
                        </h1>
                        <h3 className="capitalize text-sm text-[#999999] font-gilroyMedium">
                          {data?.device_type}
                        </h3>
                      </div>

                      {data?.deviceDetails[0]?.deleted_at === null ? (
                        <span className="rounded-full text-center  font-gilroyMedium h-fit  bg-[#ECFDF3] text-[#027A48] py-1 px-2 text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full text-center  font-gilroyMedium h-fit  bg-[#FFEFEF] text-[#FF0000] py-1 px-2 text-xs">
                          Inactive
                        </span>
                      )}
                      {data?.deviceDetails[0]?.is_temp_assigned === false ? (
                        <span className="text-xs font-gilroyMedium h-fit   flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                          Permanant
                        </span>
                      ) : (
                        <span className="text-xs font-gilroyMedium h-fit    flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                          Temporary
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 font-gilroyMedium text-sm"></p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 my-5">
                  {data?.userDetails[0]?.first_name && (
                    <div className="flex gap-5 items-center text-nowrap">
                      <div className="flex gap-1 items-center">
                        <HugeiconsIcon
                          icon={User03Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <p className=" font-gilroyMedium text-sm ">
                          Assigned to:
                        </p>
                        <Link href={`/people/${data?.userDetails[0]?._id}`}>
                          <p className="text-sm font-gilroyMedium underline ">
                            {data?.userDetails[0]?.first_name || "-"}
                          </p>
                        </Link>
                      </div>
                    </div>
                  )}
                  {data?.createdAt && (
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
                    </div>
                  )}
                </div>

                <div className="w-full">
                  {showTags ? null : (
                    <div className="flex justify-start w-full gap-3 ">
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
                        className="flex gap-1 -ml-3  items-center text-[#025CE5] cursor-pointer font-gilroyMedium"
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
                                licenseId: data?._id,
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

                {/* Device Profile */}

                <Dropdown
                  title="Device Details"
                  onFirst={firstVisibleSection === "device_details"}
                  headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                >
                  <div className="space-y-3 mt-3">
                    {[
                      {
                        label: "License Name:",
                        value: data?.licenseName?.trim() || "",
                      },
                      {
                        label: "Key: ",
                        value: (
                          <>
                            <LicenseVerificationKey
                              className=" text-black"
                              licenseKey={data?.licenseKey}
                              id={data?._id}
                            ></LicenseVerificationKey>
                          </>
                        ),
                      },
                      {
                        label: "Billing Cycle:",
                        value: cycleDisplayMap[data?.billingCycle] || "",
                      },
                      {
                        label: "Price:",
                        value: `₹${data?.payable / 100}` || "",
                      },
                      {
                        label: "Purchased On:",
                        value: data?.createdAt
                          ? formatDate(data.createdAt)
                              .split(",")
                              .slice(0, 2)
                              .join(",")
                          : "",
                      },
                      {
                        label: "Valid till:",
                        value: data?.validity
                          ? formatDate(data.validity)
                              .split(",")
                              .slice(0, 2)
                              .join(",")
                          : "",
                      },
                    ]
                      .filter(({ value }) => value && value !== "-") // Only keep non-empty, meaningful values
                      .map(({ label, value }, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 pl-3"
                        >
                          <div className="flex items-start gap-2 min-w-[150px]">
                            <span className="text-[#a09f9f] font-gilroyMedium text-sm">
                              {label}
                            </span>
                          </div>
                          <p className={`text-sm font-gilroyMedium `}>
                            {value}
                          </p>
                        </div>
                      ))}
                  </div>
                </Dropdown>
                {/* {JSON.stringify(data)} */}
                {/* Assignee Information */}

                {data?.deviceDetails?.[0] && (
                  <Dropdown
                    title="Assignee Information"
                    onFirst={firstVisibleSection === "assigne_info"}
                    headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                  >
                    <div className="space-y-3 mt-3">
                      {[
                        {
                          label: "Device Name:",
                          value: data?.deviceDetails?.[0]?.custom_model || "",
                        },

                        {
                          label: "Serial No:",
                          value: data?.deviceDetails?.[0]?.serial_no || "",
                        },

                        {
                          label: "Assigned On:",
                          value: data?.assigned_on
                            ? formatDate(data?.assigned_on)
                                .split(",")
                                .slice(0, 2)
                                .join(",")
                            : "",
                        },
                      ]
                        .filter(({ value }) => value && value !== "-") // Only keep non-empty, meaningful values
                        .map(({ label, value }, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-3"
                          >
                            <div className="flex items-start gap-2 min-w-[150px]">
                              <span className="text-[#a09f9f] font-gilroyMedium text-sm">
                                {label}
                              </span>
                            </div>
                            <p className={`text-sm font-gilroyMedium `}>
                              {value}
                            </p>
                          </div>
                        ))}
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
          </>
        )}

        {/* Right Side */}
        {status === "pending" ? (
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
              status={status}
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
export default SingleSoftwareScreen;
