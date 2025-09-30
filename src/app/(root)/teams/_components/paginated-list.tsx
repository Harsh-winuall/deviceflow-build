"use client";

import { Team, TeamsResponse } from "@/server/teamActions";
import { TeamCard } from "./team-card";

interface PaginatedListProps {
  teams: TeamsResponse;
  itemsPerPage?: number;
  renderButtons: (team: Team) => JSX.Element;
}

export default function PaginatedList({
  teams,
  renderButtons,
}: PaginatedListProps) {
  return (
    <div className=" py-2 w-full min-h-[70vh] max-h-[70vh] h-full ">
      <div className="flex gap-4 flex-wrap w-full ">
        {/* {JSON.stringify(teams?.)} */}
        {teams?.teams?.map(
          (team) =>
            team && (
              <TeamCard
                key={team?._id}
                {...team}
                buttons={renderButtons(team)}
              />
            )
        )}
      </div>
    </div>
  );
}
