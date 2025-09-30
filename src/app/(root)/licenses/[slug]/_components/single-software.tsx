import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  TabSkelton,
  TimelineSkelton,
} from "@/app/(root)/(userRoutes)/_components/profile-main-skeleton";
import { formatDate } from "@/app/(root)/people/[id]/_components/user-timeline-table";
import { GetAvatar } from "@/components/get-avatar";
import TabBar from "@/components/TabBar/tabbar";

import Dropdown from "@/app/(root)/assets/[id]/_components/accordian";
import DeviceDetailLeftSkelton from "@/app/(root)/assets/[id]/_components/device-detail-view-skelton-left";
import { LicenseData } from "@/server/licenseActions";
import LicenseTable from "./license-table";
import { cycleDisplayMap } from "@/lib/utils";

const SingleSoftwareScreen = ({
  data,
  status,
}: {
  data: LicenseData;
  status: string;
}) => {
  const tabs = [
    {
      id: "license_key",
      label: "License Key",
      content: <LicenseTable data={data?.licenses ?? []} />,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-[10px] w-full border overflow-hidden border-[rgba(0, 0, 0, 0.10)]  mt-4 flex h-[100vh]">
        {/* Left Side */}
        {status === "pending" ? (
          <DeviceDetailLeftSkelton />
        ) : (
          <>
            {/* {JSON.stringify(data)} */}
            <div className="w-[40%] h-full hide-scrollbar border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
              <div className="p-6">
                {/* Name, serial no, image, status */}
                <div className="flex gap-3 items-start">
                  {/* Image */}
                  <GetAvatar
                    name={data?.platform || "-"}
                    size={60}
                    isDeviceAvatar
                  />
                  {/* Name, serial no */}
                  <div className="flex-col gap-1">
                    <div className="flex gap-3 items-center">
                      <div className="flex flex-col gap-0.5">
                        <h1 className="font-gilroySemiBold text-lg line-clamp-1">
                          {data?.platform || "-"}
                        </h1>
                        {/* <h3 className="capitalize text-sm text-[#999999] font-gilroyMedium">
                          {data?.}
                        </h3> */}
                      </div>

                      {/* {data?.createdAt === null ? (
                        <span className="rounded-full text-center  font-gilroyMedium h-fit  bg-[#ECFDF3] text-[#027A48] py-1 px-2 text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full text-center  font-gilroyMedium h-fit  bg-[#FFEFEF] text-[#FF0000] py-0.5 px-2 text-xs">
                          Inactive
                        </span>
                      )} */}
                      {/* {data?.createdAt ? (
                        <span className="text-xs font-gilroyMedium h-fit   flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                          Permanant
                        </span>
                      ) : (
                        <span className="text-xs font-gilroyMedium h-fit    flex justify-center items-center rounded-full px-2 py-1 bg-[#F9F5FF] text-[#6941C6]">
                          Temporary
                        </span>
                      )} */}
                    </div>
                    <p className="text-gray-400 font-gilroyMedium text-sm"></p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 my-5">
                  {/* {data?.platform && (
                    <div className="flex gap-5 items-center text-nowrap">
                      <div className="flex gap-1 items-center">
                        <HugeiconsIcon
                          icon={User03Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <p className=" font-gilroyMedium text-sm ">
                          Assigned to:
                        </p>
                      </div>
                    </div>
                  )} */}
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

                {/* Software Profile */}

                <Dropdown
                  title="License Details"
                  onFirst={true}
                  headerClassName="bg-[#F6F6F6] mt-4 text-sm"
                >
                  <div className="space-y-3 mt-3">
                    {[
                      {
                        label: "License Name:",
                        value: data?.platform?.trim() || "",
                      },
                      {
                        label: "Billing Cycle:",
                        value: cycleDisplayMap[data?.billingCycle] ?? "",
                      },

                      {
                        label: "Price:",
                        value: `₹${data?.price}` || "",
                      },
                      {
                        label: "Purchased On:",
                        value: data?.integratedAt
                          ? formatDate(data.integratedAt)
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
                      {
                        label: "No. of license:",
                        value: data?.total_license,
                      },
                      {
                        label: "Used License:",
                        value: data?.used_license,
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
              License
            </h1>
            <TabBar
              status={status}
              tabs={tabs}
              defaultActiveTab="license_key"
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
