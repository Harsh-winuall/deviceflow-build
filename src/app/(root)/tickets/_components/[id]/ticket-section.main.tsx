import { GetAvatar } from "@/components/get-avatar";
import { addTags, removeTags, TicketData } from "@/server/ticketActions";
import {
  AddCircleIcon,
  Call02Icon,
  Mail01Icon,
  StarAward02Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import ChatInterface from "./chat-interface";
import Link from "next/link";
import ChatInterface from "./chat-interface/chat-interface";
import Dropdown from "@/app/(root)/assets/[id]/_components/accordian";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Badge } from "@/components/ui/badge";

const TicketSection = ({
  data,
  isAdmin = false,
}: {
  data: TicketData;
  isAdmin: boolean;
}) => {
  const [tags, setTags] = useState<
    { label: string; value: string; _id: string; tag: string }[]
  >([]);
  const [showTags, setShowTags] = useState(false);
  const queryClient = useQueryClient();

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
    mutationFn: addTags,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to add tag !");
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: removeTags,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to remove tag !");
    },
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-white rounded-[10px] w-full border border-[rgba(0, 0, 0, 0.10)]  mt-3 flex h-[90vh] overflow-y-hidden">
      {/* Left Side */}
      <div className="w-[40%] h-full border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
        <div className="px-6">
          <div className="flex gap-2 items-center">
            <div className="mt-6 font-gilroySemiBold text-lg">
              {data?.subCategory ?? data?.category}
            </div>

            <div className="flex gap-2 mt-6">
              <p
                className={`px-2 h-fit py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full ${
                  data?.closedAt
                    ? "bg-alert-foreground text-failure"
                    : "bg-[#ECFDF3] text-[#027A48]"
                }`}
              >
                {data ? (data?.closedAt ? "Closed" : "Open") : "-"}
              </p>

              {data?.severity && (
                <p
                  className={`px-2 h-fit py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full ${
                    data?.severity === "Medium"
                      ? "bg-[#FFFACB] text-[#FF8000]"
                      : data?.severity === "Low"
                      ? "bg-[#ECFDF3] text-[#027A48]"
                      : "bg-alert-foreground text-failure"
                  }`}
                >
                  {data?.severity ?? "-"}
                </p>
              )}
            </div>
          </div>
          {/* Name, serial no, image, status */}
          {data?.deviceDetails && (
            <Link
              href={`/assets/${data?.deviceDetails?._id}`}
              className="border-[#E5E5E5] hover:border-black border mt-2 p-2 flex justify-between items-center rounded-md w-[18rem]"
            >
              <div className="flex gap-2 items-center">
                <GetAvatar
                  name={data?.deviceDetails?.custom_model ?? "-"}
                  size={40}
                  isDeviceAvatar
                />
                <div className=" flex flex-col gap-1">
                  <h1 className="text-sm font-gilroyMedium">
                    {data?.deviceDetails?.custom_model ?? "-"}
                  </h1>
                  <h3 className="text-[#808080] text-xs font-gilroyMedium">
                    {[
                      data?.deviceDetails?.serial_no ?? "-",
                      data?.deviceDetails?.ram,
                      data?.deviceDetails?.storage?.[0],
                    ]
                      .filter(Boolean) // removes null, undefined, ""
                      .join(" | ")}
                  </h3>
                </div>
              </div>
            </Link>
          )}

          {/* Opened on and Closed on Section */}

          <div className="flex text-sm font-gilroyMedium flex-col gap-6 my-6 relative pl-4">
            {data?.openedOn && (
              <p>Opened on {formatDate(data?.openedOn) ?? "-"}</p>
            )}
            {data?.closedAt ? (
              <p>Closed on {formatDate(data?.closedAt) ?? "-"}</p>
            ) : (
              <p className="text-gray-500">Ongoing</p>
            )}

            {/* Circles */}
            {data?.openedOn && (
              <div className="border border-[#E6E6E6] size-[10px] bg-[#FB0000] absolute top-1 left-0 rounded-full"></div>
            )}
            {data?.closedAt ? (
              <div className="border border-[#E6E6E6] size-[10px] bg-[#008910] absolute bottom-1 left-0 rounded-full"></div>
            ) : (
              <div className="border border-[#E6E6E6] size-[10px] bg-gray-400 absolute bottom-1 left-0 rounded-full"></div>
            )}

            {/* Vertical Line */}

            {
              <div className="h-9 border-dashed border border-[#E6E6E6] absolute left-1 top-3.5"></div>
            }
          </div>

          <div className="w-full">
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
                            ticketId: data?._id,
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
                          tags.filter(Boolean).map((tag) => [tag.value, tag])
                        ).values()
                      );

                      addTagMutation.mutate(
                        {
                          tags: uniqueTags.map((tag) => tag.value),
                          ticketId: data?._id,
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

          {/* Raised By Information */}
          <Dropdown
            title="Raised By"
            onFirst={true}
            headerClassName="bg-[#F6F6F6] mt-6"
          >
            <div className="space-y-3 px-2">
              <div className="flex items-center gap-12">
                <p className="flex items-center justify-between gap-2">
                  <HugeiconsIcon
                    icon={User03Icon}
                    className="text-[#a09f9f] size-5"
                  />
                  <span className="text-[#a09f9f] font-gilroyMedium text-sm leading-[18.652px]">
                    Name:
                  </span>
                </p>
                <p className="text-sm font-gilroyMedium underline leading-[18.652px] pl-3">
                  {data?.openedByDetails?.first_name}
                </p>
              </div>
              <div className="flex items-center gap-12">
                <p className="flex items-center justify-between gap-2">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="text-[#a09f9f] size-5"
                  />
                  <span className="text-[#a09f9f] font-gilroyMedium text-sm leading-[18.652px]">
                    Email:
                  </span>
                </p>
                <p className="text-sm text-[#025CE5] font-gilroyMedium leading-[18.652px] pl-3.5">
                  {data?.openedByDetails?.email ?? "-"}
                </p>
              </div>
              <div className="flex items-center gap-12">
                <p className="flex items-center justify-between gap-2">
                  <HugeiconsIcon
                    icon={Call02Icon}
                    className="text-[#a09f9f] size-5"
                  />
                  <span className="text-[#a09f9f] font-gilroyMedium text-sm leading-[18.652px]">
                    Phone:
                  </span>
                </p>
                <p className="text-sm text-[#000] font-gilroyMedium leading-[18.652px] pl-2">
                  +91 {data?.openedByDetails?.phone ?? "-"}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <p className="flex items-center justify-between gap-2">
                  <HugeiconsIcon
                    icon={StarAward02Icon}
                    className="text-[#a09f9f] size-5"
                  />
                  <span className="text-[#a09f9f] font-gilroyMedium text-sm leading-[18.652px]">
                    Designation:
                  </span>
                </p>
                <p className="text-sm text-[#000] font-gilroyMedium leading-[18.652px]">
                  {data?.openedByDetails?.designation ?? "-"}
                </p>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-[60%] lg:h-[66dvh] 2xl:h-[66dvh]">
        <ChatInterface data={data} />
      </div>
    </div>
  );
};

export default TicketSection;
