"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import PaginatedList from "./paginated-list";
import { Button } from "@/components/buttons/Button";

export default function Main({
  data,
  status: isPending,
  handleNewWorkflow,
}: {
  data: any;
  status: boolean;
  handleNewWorkflow: () => void;
}) {
  if (isPending) {
    return (
      <>
        <WorkflowsGridSkeleton />
      </>
    );
  }
  return (
    <>
      {data?.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-10">
          <div className="flex relative font-gilroySemiBold flex-col   justify-center items-center ">
            <Image
              src="/media/no_data/workflow.svg"
              width={450}
              height={450}
              alt="No Teams"
            />

            <Button
              disabled={isPending}
              variant="primary"
              type="button"
              className="w-44 absolute bottom-0 rounded-[5px]"
              onClick={handleNewWorkflow}
            >
              Create Workflow
            </Button>
          </div>
        </div>
      ) : (
        <PaginatedList data={data} />
      )}
    </>
  );
}

function WorkflowsGridSkeleton() {
  return (
    <div className="py-2 w-full">
      <div className="flex gap-x-4 gap-y-4 flex-wrap w-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="border border-[rgba(171,171,171,0.19)] bg-[#FCFCFC] backdrop-blur-[14.1px]
            rounded-lg max-lg:w-[calc(50%-16px)] max-2xl:w-[calc(33.33%-16px)] p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="-mt-1 flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
