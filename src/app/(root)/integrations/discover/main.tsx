"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { allIntegrationsAvailable } from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import { DiscoverSection } from "../_components/discover/discover-section";
import { TotalSpends } from "../_components/total-spends";
import { getDashboardSubscriptions } from "@/server/dashboard";

export default function DiscoverPage() {
  const { data, status } = useQuery({
    queryKey: ["all-integrations", "discover"],
    queryFn: async () => {
      return allIntegrationsAvailable();
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: subscriptionData} = useQuery<any>(
      {
        queryKey: ["get-total-subscriptions-data"],
        queryFn: getDashboardSubscriptions,
      }
    );
  return (
    <>
      {status === "pending" ? (
        <SpendsSectionSkeleton />
      ) : (
        <section className="w-full h-fit relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar">
          <TotalSpends totalPrice={subscriptionData?.totalSpends}/>
          <DiscoverSection data={data} status={status} />
        </section>
      )}
    </>
  );
}

export function SpendsSectionSkeleton() {
  return (
    <section className="w-full h-fit relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar">
      <div className="rounded-md border p-3 flex justify-between w-full mb-3.5">
        <div className="flex flex-col justify-start gap-y-5 pt-2">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex justify-end gap-3 flex-none w-[76%]">
          <Skeleton className="max-w-52 w-full h-32" />
          <Skeleton className="max-w-52 w-full h-32" />
          <Skeleton className="max-w-52 w-full h-32" />
          <Skeleton className="max-w-52 w-full h-32" />
        </div>
      </div>

      <div className="flex flex-col gap-5 w-full h-[60vh]">
        <section className="flex justify-between h-full">
          <div className="rounded-md p-4 max-w-[20%] w-full h-fit bg-[#f8f8f8] flex flex-col items-start gap-3">
            <Skeleton className="h-6 w-24 ml-3" />
            <div className="w-full flex flex-col items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 py-4 pl-8 ml-5 h-full overflow-y-auto hide-scrollbar w-full">
            <section className="w-full flex flex-col items-start gap-3">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-3 xl:grid xl:justify-items-center xl:gap-5 xl:grid-cols-3 w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 max-w-[18rem] w-full" />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </section>
  );
}
