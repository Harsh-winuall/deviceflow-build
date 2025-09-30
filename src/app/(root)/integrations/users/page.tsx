"use client";

import { getUsersOfIntegration } from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { SeatsSection } from "../_components/installed/seats-section";

const Page = () => {
  const searchParams = useSearchParams();

  const { data, status } = useQuery({
    queryKey: ["user-by-integrations", "all-data"],
    queryFn: () => getUsersOfIntegration({}),
    // staleTime: 1000 * 60 * 5,

    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });

  const currentTab = searchParams.get("tab");
  const seats =
    currentTab === "totalseats"
      ? data?.allUsers
      : currentTab === "unmapped"
      ? data?.missingIntegrationUsers
      : [];

  const cost =
    currentTab === "totalseats"
      ? data?.totalTeamSubscriptionCost
      : currentTab === "unmapped"
      ? data?.unmappedUsersCost
      : 0;

  // console.log(data);
  return (
    <div>
      <SeatsSection
        status={status}
        data={seats}
        unmappedData={data?.usersUnmapped}
        selectedPlatform={currentTab}
        cost={cost}
      />
    </div>
  );
};

export default Page;
