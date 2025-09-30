import { cn } from "@/lib/utils";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="flex w-full gap-6 mt-2 font-gilroyRegular">
      {/* Left Side - 40% */}
      <div className="w-[40%] h-full hide-scrollbar border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
        <div className="p-6 flex flex-col gap-4 mb-6 animate-pulse">
          {/* Header skeleton */}
          <div className="flex gap-3 items-center">
            <div className="w-[60px] h-[60px] bg-gray-200 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-200 rounded-full ml-auto" />
          </div>

          {/* Joined date & employment type */}
          <div className="flex gap-3">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-48 bg-gray-200 rounded" />

          {/* Subscriptions */}
          <div>
            <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="border border-muted p-3 rounded-md flex justify-between items-center mb-2"
              >
                <div className="flex gap-2 items-center">
                  <div className="size-10 rounded bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-10 w-[325px] bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-[325px] bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-[325px] bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </div>

      {/* Right Side - 60% */}
      <div className="w-[60%] flex flex-col gap-6">
        <TabSkelton />
        <TimelineSkelton />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
export const TabSkelton = () => {
  return (
    <div className="animate-pulse">
      {/* Tab headers */}
      <div className="relative">
        <div className="flex border-b border-[rgba(0, 0, 0, 0.10)]">
          <div className="flex mx-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="px-2 mr-4 pt-2 flex items-center gap-2"
              >
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export const TimelineSkelton = () => {
  return (
    <ul className="grid [&>li]:grid-cols-[0_min-content_1fr]">
      {Array.from({ length: 6 }).map((_, idx) => (
        <li key={idx} className="grid items-center gap-x-2 animate-pulse">
          <div className="col-start-2 col-end-3 row-start-1 row-end-1 flex size-8 items-center justify-center rounded-full bg-gray-200" />
          <div className="col-start-2 col-end-3 row-start-2 row-end-2 mx-auto h-16 w-0.5 bg-gray-200 rounded-full" />
          <div className="col-start-1 col-end-2 ml-auto text-right row-start-1 row-end-1">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="col-start-1 col-end-2 ml-16 text-right row-start-2 row-end-2">
            <div className="h-14 w-[330px] bg-gray-200/50 rounded mt-1" />
          </div>
        </li>
      ))}
    </ul>
  );
};
