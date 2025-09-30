import React from "react";

function DeviceDetailLeftSkelton({ teamView }: { teamView?: boolean }) {
  return (
    <div className="w-[40%] h-full border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto animate-pulse">
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-3 items-center">
          <div className="rounded-full bg-gray-300 h-[60px] w-[60px]" />
          <div className="flex flex-col gap-1 flex-1">
            <div className="h-5 w-40 bg-gray-300 rounded" />
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="flex gap-2 mt-2">
              <div className="h-6 w-14 rounded-full bg-gray-300" />
              <div className="h-6 w-20 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>

        {/* Assigned Info & Warranty */}
        <div className="flex flex-col gap-4 my-5">
          <div className="flex gap-3 items-center">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>
          <div className="flex gap-3 items-center">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Open issues alert */}
        {!teamView && (
          <div className="bg-muted px-2 py-3 gap-2 flex items-center rounded-[5px]">
            <div className="h-4 w-4 bg-gray-300 rounded-full" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
        )}

        {/* Dropdown Sections */}
        {Array(3)
          .fill(null)
          .map((_, sectionIndex) => (
            <div key={sectionIndex} className="mt-6">
              <div className="h-6 w-32 bg-gray-300 rounded mb-3" />
              <div className="space-y-2 mt-2">
                {Array(3)
                  .fill(null)
                  .map((_, idx) => (
                    <div key={idx} className="flex items-start gap-2 pl-3">
                      <div className="min-w-[140px] h-4 bg-gray-300 rounded" />
                      <div className="h-4 w-40 bg-gray-300 rounded" />
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DeviceDetailLeftSkelton;
