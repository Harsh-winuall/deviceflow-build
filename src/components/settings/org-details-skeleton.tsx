import React from "react";

function OrgDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-5 animate-pulse">
      {/* Logo Skeleton */}
      <div className="flex justify-between items-center w-full">
        <div className="rounded-full bg-gray-200 size-16" />
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-gray-200 rounded-md" />
          <div className="w-20 h-8 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-1">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="h-9 bg-gray-200 rounded-md w-full" />
          </div>
        ))}

        {/* OTP Section Skeleton (Optional Display) */}
        <div className="rounded-md bg-[#FAFAFA] p-3 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="size-4 bg-gray-200 rounded-full" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-32 bg-gray-200 rounded ml-6" />
            <div className="h-3 w-40 bg-gray-200 rounded ml-6 mt-2" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-md" />
              ))}
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Save Button */}
        <div className="ml-auto mt-4 w-28 h-9 bg-gray-400 rounded-md" />
      </div>
    </div>
  );
}

export default OrgDetailsSkeleton;
