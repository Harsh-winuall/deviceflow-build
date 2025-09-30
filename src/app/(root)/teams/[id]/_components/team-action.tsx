import { buttonVariants } from "@/components/buttons/Button";
import { Team } from "@/server/teamActions";
import AddTeamMember from "./add-team-member";
import { DeleteTeam } from "./delete-team";
import InvitePeopleTeam from "./invite-people-team";
import BulkMove from "./new-bulk-move";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverDropdownMenu } from "@/components/action-bar/hover-dropdown-menu";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAllIntegration,
  fetchAllIntegrationByTeamId,
} from "@/server/deviceActions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import EditTeam from "./edit-team";
import CreateTeam from "../../_components/create-team";

interface TeamActionsProps {
  team: Team;
  selectedIds: string[];
  setSelectedIds: (state: any) => void;
  cycle: string;
  id?: string;
  setCycle: (cycle: string) => void;
  integration: string;
  setIntegration: (inte: string) => void;
}

const TeamActions: React.FC<TeamActionsProps> = ({
  team,
  id,
  selectedIds,
  setSelectedIds,
  cycle,
  setCycle,
  integration,
  setIntegration,
}) => {
  const { data: integrations } = useQuery({
    queryKey: ["integrations-for-teams", id],
    queryFn: () => fetchAllIntegrationByTeamId({ teamId: id }),
  });

  /** */
  return (
    <div className="flex gap-2 w-full justify-between font-gilroyMedium ">
      {/* <div className="flex  items-center py-1.5 gap-1  pl-3 pr-3 text-[#7F7F7F] border border-gray-400 rounded-full hover:text-black hover:border-black transition-all duration-300">
        <Search size={20} className="text-[#7F7F7F]" />{" "}
        <input
          className="bg-transparent text-base  font-gilroyMedium whitespace-nowrap focus:outline-none"
          placeholder="Search teams"
        />
      </div> */}
      <div className="flex items-center gap-2">
        {/* Billing Cycle */}

        {/* <Select value={cycle} onValueChange={setCycle} defaultValue="">
          <SelectTrigger className="w-fit text-sm h-[35px] text-black font-gilroyMedium flex bg-white border border-[#E5E5E5] rounded-md">
            <SelectValue placeholder="Billing Cycle" className="text-sm" />
          </SelectTrigger>
          <SelectContent className="font-gilroyMedium">
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quaterly">Quarterly</SelectItem>
            <SelectItem value="half-yearly">Half Yearly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select> */}
        {/* Integrations Category*/}
        {/* Integrations Category*/}
        {integrations?.length > 0 && (
          <Select
            value={integration}
            onValueChange={(val) => {
              if (val === "clear") {
                setIntegration(""); // reset filter
              } else {
                setIntegration(val);
              }
            }}
          >
            <SelectTrigger className="w-fit data-[placeholder]:text-black text-sm h-[35px] text-black font-gilroyMedium flex bg-white border border-[#E5E5E5] rounded-md">
              <SelectValue
                placeholder="All Integration"
                className="text-sm text-black"
              />
            </SelectTrigger>
            <SelectContent className="font-gilroyMedium">
              {/* Show clear option only when filter is applied */}
              {integration && (
                <SelectItem value="clear" className="text-red-500">
                  Clear Filter
                </SelectItem>
              )}

              {integrations?.map((int) => (
                <SelectItem key={int?._id} value={`${int?._id}`}>
                  {int?.platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex gap-2">
        {team?.deleted_at ? (
          <></>
        ) : (
          <>
            <AddTeamMember teamData={team}>
              <div className={buttonVariants({ variant: "outlineTwo" })}>
                <div className=" group-hover:text-black text-nowrap text-sm font-gilroyMedium">
                  Add Members
                </div>
              </div>
            </AddTeamMember>
          </>
        )}
        {/* <pre>{JSON.stringify(team, null, 2)}</pre> */}
        <CreateTeam editTeam={team} isEdit={true}>
          <div className={buttonVariants({ variant: "outlineTwo" })}>
            <div className=" group-hover:text-black text-nowrap text-sm font-gilroyMedium">
              Edit
            </div>
          </div>
        </CreateTeam>

        {selectedIds.length > 0 && (
          <BulkMove selectedIds={selectedIds} setSelectedIds={setSelectedIds}>
            <div className={buttonVariants({ variant: "outlineTwo" })}>
              <div className="  text-nowrap text-sm font-gilroyMedium">
                Bulk Move
              </div>
            </div>
          </BulkMove>
        )}
        <HoverDropdownMenu>
          <div className="flex flex-col gap-2">
            {" "}
            <DeleteTeam id={team?.teamDetail?._id ?? ""}>
              <button
                role="menuitem"
                className="w-full text-sm text-left px-4 py-2 rounded-[5px] font-gilroyMedium hover:bg-gray-50"
              >
                Delete
              </button>
            </DeleteTeam>
            <InvitePeopleTeam id={team?.teamDetail?._id ?? ""}>
              <button
                role="menuitem"
                className="w-full text-sm text-left px-4 py-2 rounded-[5px] font-gilroyMedium hover:bg-gray-50"
              >
                Invite Members
              </button>
            </InvitePeopleTeam>
          </div>
        </HoverDropdownMenu>
      </div>
    </div>
  );
};

export default TeamActions;
