"use client";

import PaginatedList from "./paginated-list";
import { RestoreTeam } from "./restore-team";
import { PermanentTeamDelete } from "./permanent-team";
import { TeamsResponse } from "@/server/teamActions";
import { teamIcons } from "../icons";
import CreateTeam from "./create-team";
import { Trash2 } from "lucide-react";
import RestoreIcon from "@/icons/RestoreIcon";

interface DeletedTeamsProps {
  teams: TeamsResponse | null;
  setTeams: React.Dispatch<React.SetStateAction<TeamsResponse | null>>;
  onRefresh: () => Promise<void>;
}

export default function DeletedTeams({ teams, setTeams, onRefresh }: DeletedTeamsProps) {
  return (
    <>
      {teams?.teams?.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-10">
          <teamIcons.no_team_display />
          <CreateTeam onRefresh={onRefresh}>
            <div className="py-1.5 px-8 text-sm rounded-full text-white font-gilroySemiBold bg-black">
              Add Team
            </div>
          </CreateTeam>
        </div>
      ) : (
        <PaginatedList
          key="deleted-teams"
          tab="inactive_teams"
          teams={teams!}
          setTeams={setTeams}
          renderButtons={(team) => (
            <div className="flex gap-4">
              <PermanentTeamDelete id={team?._id!} onRefresh={onRefresh}>
                <div className="group duration-300 flex-col hover:border-black transition-all ease-in-out size-11 border-gray-300 rounded-full justify-center items-center flex border">
                  <Trash2 className="size-5 cursor-pointer" />
                </div>
              </PermanentTeamDelete>

              <RestoreTeam id={team?._id!} onRefresh={onRefresh}>
                <div className="group duration-300 hover:border-black transition-all ease-in-out size-11 border-gray-300 rounded-full justify-center items-center flex border">
                  <RestoreIcon className="size-5 cursor-pointer" />
                </div>
              </RestoreTeam>
            </div>
          )}
        />
      )}
    </>
  );
}
