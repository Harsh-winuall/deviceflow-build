import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DeviceGridSkeleton = () => {
  return (
    <>
      <div className="w-full h-full mt-1 flex justify-center items-center mb-6 hide-scrollbar">
        <div className="flex w-full h-[96%] items-start gap-4">
          <div className="w-[58%] flex justify-between gap-4">
            {/* Device Info Skeleton */}
            <div className="rounded-lg w-[52%] h-full border border-[#C3C3C34F] bg-white px-6 py-4 2xl:p-7 flex flex-col gap-3">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-[1px] bg-gray-200 w-full" />
              {/* Render multiple rows for device fields */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
            </div>

            {/* Assigned Info Skeleton (only visible if assigned) */}
            <div className="rounded-lg w-[52%] h-full border border-[#C3C3C34F] bg-white px-6 py-4 2xl:p-7 flex flex-col gap-3">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-[1px] bg-gray-200 w-full" />
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
            </div>
          </div>

          {/* Optional Second Column: Device Status Card Skeleton */}
          <div className="w-[38%] h-full flex flex-col gap-4">
            <div className="px-6 py-4 w-full border border-[#C3C3C34F] bg-white rounded-lg 2xl:p-7 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-32" />
                  ))}
              </div>
            </div>
            {/* Store Banner Card Skeleton */}
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
};
