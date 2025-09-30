"use client";

import { CombinedContainer } from "@/components/container/container";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkflowSkeleton = () => {
  return (
    <CombinedContainer className="w-full">
      <section className="w-full h-full">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between p-4 border rounded-t-[10px] bg-white">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-48 rounded-md" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          <div className="flex gap-2.5">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>

        {/* Dot Grid Canvas */}
        <div className="border-b border-l border-r rounded-[10px] rounded-t-none h-[75vh] relative overflow-hidden bg-white">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "center",
            }}
          />

          {/* Workflow Nodes Centered */}
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2 flex items-center">
            {/* Start Node */}
            <Skeleton className="h-10 w-20 rounded-md" />

            <Skeleton className="h-1 w-20 " />

            {/* First Sequence */}
            <div className="flex items-center space-x-6">
              <Skeleton className="h-28 w-56 rounded-[12px]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full ml-4" />
          </div>
        </div>
      </section>
    </CombinedContainer>
  );
};
