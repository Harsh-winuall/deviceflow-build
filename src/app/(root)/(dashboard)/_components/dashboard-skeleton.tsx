import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="w-full p-4">
      <div className="pt-0 w-full">
        <Skeleton className="h-6 w-40 rounded mb-3" />
        <div className="flex w-full gap-3">
          <div className="w-[50%] bg-white rounded-md border border-black/10 flex flex-col justify-start px-3 py-5 lg:p-7">
            <Skeleton className="h-12 w-3/4 rounded mb-4" />
            <div className="border-t mt-4 border-gray-200 border-dashed"></div>
            <div className="flex gap-2 items-center mt-5">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
            <Skeleton className="w-full mt-5 h-[10px] flex rounded-full overflow-hidden" />
            <div className="flex gap-2 items-center justify-between mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2 flex-col w-1/3">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[50%]">
            <div className="w-full bg-white rounded-[10px] border border-black/10 flex flex-col justify-start px-3 py-5 lg:p-7">
              <div className="flex gap-2 items-center mb-4">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <div className="flex gap-2 justify-between w-full">
                <Skeleton className="size-40 w-60 flex justify-center items-center rounded-full" />
                <div className="flex gap-2 w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col mt-3 gap-4 w-full">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex gap-2 w-full items-center">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-4 w-16 rounded" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full h-[70px] bg-white rounded-[10px] border border-black/10 flex p-3">
              <div className="flex items-center gap-4 w-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <Skeleton className="size-3 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
              <Skeleton className="w-24 h-8 rounded ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-0 w-full mt-4">
        <Skeleton className="h-6 w-40 rounded mb-3" />
        <div className="flex flex-row justify-between items-stretch mb-7 gap-3 w-full">
          <div className="w-[calc(35%-12px)] flex flex-col gap-3">
            <div className="flex-1 min-w-[250px] max-w-full rounded-[10px] border border-solid bg-white pb-[13px] px-5 pt-[13px]">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full flex flex-col gap-2 mb-4">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-[calc(35%-12px)]">
            <div className="flex w-full items-start rounded-[10px] border border-solid border-gray-200 bg-white px-4 pt-2 pb-4">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-5 w-32 rounded-full ml-auto" />
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col border p-2 rounded-md items-start gap-2 w-1/3"
                    >
                      <Skeleton className="size-14 rounded" />
                      <Skeleton className="h-5 w-10 rounded" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[calc(35%-12px)]">
            <div className="font-gilroy flex flex-col gap-4 rounded-[10px] border border-solid border-gray-200 bg-white px-5 pb-9 pt-3.5">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="w-full h-[37px] rounded-lg overflow-hidden" />
              <div className="flex gap-5 justify-start items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-2 flex-col">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
