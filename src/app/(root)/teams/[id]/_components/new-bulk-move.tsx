"use client";

import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import { fetchTeams, Team } from "@/server/teamActions";
import { bulkMoveUsers } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GetAvatar } from "@/components/get-avatar";
import { AsyncSelect } from "@/components/ui/async-select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateTeam from "../../_components/create-team";
import { Plus } from "lucide-react";

export default function BulkMove({
  children,
  selectedIds,
  setSelectedIds,
}: {
  children: React.ReactNode;
  selectedIds: string[];
  setSelectedIds: (state: any) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [team, setTeam] = useState<Team>();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setTeam({});
  }, [open]);

  const handleBulkMove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!team?._id) {
      setError("Team required");
      return;
    }

    setLoading(true);
    try {
      await bulkMoveUsers({ newTeamId: team._id, userIds: selectedIds });
      setOpen(false);
      toast.success("Moved member to team !");
      setSelectedIds([]);
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["fetch-team-by-id"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["get-users-by-team-id"],
        exact: false,
        refetchType: "all",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to move member to team !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-4 rounded-[10px]">
        <div className="flex  justify-center w-full h-full items-start">
          <div className="flex flex-col w-full">
            <span className="font-gilroySemiBold text-lg text-start">
              Bulk Move Members
            </span>

            <form
              onSubmit={handleBulkMove}
              className="w-full flex flex-col gap-7 justify-start relative h-full"
            >
              <div className="flex flex-col gap-2 pt-3">
                <AsyncSelect<Team>
                  fetcher={fetchTeams}
                  queryKey="fetch-teams"
                  preload
                  // fixInputClear={false}
                  renderOption={(team) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">{team?.title}</div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {team?.description}
                        </div>
                      </div>
                    </div>
                  )}
                  filterFn={(team, query) =>
                    team?.title
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    team?.description
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(team) => team?._id}
                  getDisplayValue={() => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">
                          {team?.title ?? ""}
                        </div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <CreateTeam>
                      <div className="w-full flex justify-center items-center p-2">
                        <div className="py-2 px-6 hover:bg-gray-50 cursor-pointer border border-gray-200 rounded-[5px] text-black flex justify-center items-center text-center font-gilroyMedium text-sm">
                          <Plus className="size-4" />
                          Create Team
                        </div>
                      </div>
                    </CreateTeam>
                  }
                  label="Team"
                  placeholder="Search Teams"
                  value={team?.title || "null"}
                  onChange={(selected) =>
                    setTeam({
                      _id: selected?._id,
                      title: selected?.title,
                      description: selected?.description,
                      image: selected?.image,
                    })
                  }
                  width="100%"
                />
                {error.length > 0 && (
                  <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-2  w-full mt-4">
                <Button
                  className={buttonVariants({
                    variant: "outlineTwo",
                    className: "w-1/2",
                  })}
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <LoadingButton
                  loading={loading}
                  variant="primary"
                  className="w-1/2"
                  type="submit"
                >
                  Move
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
