"use client";
import { CombinedContainer } from "@/components/container/container";

import { ActionBar } from "@/components/action-bar/action-bar";
import { getUsersByTeamId } from "@/server/userActions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewTeamView from "./_components/new-team-view";
import TeamActions from "./_components/team-action";

interface TeamPageProps {
  params: { id: string };
}

export default function TeamPage({ params }: TeamPageProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };
  const [cycle, setCycle] = useState("monthly");
  const [integration, setIntegration] = useState("");
  const { data, status: userStatus } = useQuery({
    queryKey: ["get-users-by-team-id", params.id, cycle, integration],
    queryFn: () => getUsersByTeamId(params.id, 1, cycle, integration),
  });

  return (
    <CombinedContainer title="Teams">
      <ActionBar showBackBtn>
        <div className="text-[#7F7F7F] flex w-full text-nowrap text-sm font-gilroySemiBold">
          <TeamActions
            id={params.id}
            team={data}
            cycle={cycle}
            setCycle={setCycle}
            integration={integration}
            setIntegration={setIntegration}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </div>
      </ActionBar>

      <NewTeamView
        userStatus={userStatus}
        id={params?.id}
        integrationByTeamData={data}
        integration={integration}
        cycle={cycle}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        handleSelectionChange={handleSelectionChange}
      />
    </CombinedContainer>
  );
}
