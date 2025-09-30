"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import {
  AsyncMultiSelectCombobox,
  BaseOption,
} from "@/components/ui/async-multi-select-combobox";
import { fetchNotInTeamPeople, Team } from "@/server/teamActions";
import { bulkMoveUsers, User } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { cache, useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

/**
 * Types and helper functions for Async Multi Select Combobox
 */
type UserOption = BaseOption & User;

const fetchUserOptions = cache(async (): Promise<UserOption[]> => {
  const users = await fetchNotInTeamPeople();

  return users?.map((u) => ({
    ...u,
    label: u?.email,
    value: u?._id,
  }));
});

export default function AddTeamMember({
  children,
  teamData,
}: {
  children: React.ReactNode;
  teamData: Team;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    setError("");
    setSelectedEmails([]);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedEmails?.length) {
      setError("Add atleast one user");
      return;
    }

    setLoading(true);
    try {
      // await bulkMoveUsers(user?._id ?? "", { teamId: teamData?._id });
      await bulkMoveUsers({
        newTeamId: teamData?.teamDetail?._id,
        userIds: selectedEmails,
      });

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
        queryKey: ["team-timeline"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["get-users-by-team-id"],
        exact: false,
        refetchType: "all",
      });
      setLoading(false);
      setOpen(false);

      toast.success("Added member to team !");
    } catch (error) {
      toast.error("Failed to add member to team !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-full rounded-[10px] p-4">
        <div className="flex justify-center w-full h-full items-start">
          <div className="flex flex-col w-[99%] gap-4 h-full justify-start items-center">
            <h1 className="font-gilroySemiBold text-lg text-start w-full">
              {"Add Employee"}
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-7 relative h-full"
            >
              <div className="flex flex-col gap-1.5 -mt-2">
                <div className="font-gilroyMedium text-[13px] ">
                  Select Members
                </div>
                <AsyncMultiSelectCombobox<UserOption>
                  fetcher={fetchUserOptions}
                  preload
                  // when preloaded, apply client‑side filtering too
                  filterFn={(opt, q) =>
                    opt?.first_name
                      ?.toLowerCase()
                      ?.includes(q?.toLowerCase()) ||
                    opt?.email?.toLowerCase()?.includes(q?.toLowerCase())
                  }
                  // how each option is rendered
                  renderItem={(opt) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">
                          {opt?.first_name}
                        </div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {opt?.email}
                        </div>
                      </div>
                    </div>
                  )}
                  // how the trigger shows selected items
                  renderSelectedItem={(opts) => {
                    const firstThree = opts?.slice(0, 3) ?? [];
                    const remaining = opts?.length > 3 ? opts.length - 3 : 0;
                    return (
                      <div className="flex  items-center relative gap-1">
                        {firstThree?.map((o) => (
                          <span
                            key={o?.value}
                            className="inline-flex gap-1.5 items-center px-2 text-[#025CE5] py-1 text-xs bg-[#EDF6FF] rounded"
                          >
                            <HugeiconsIcon
                              icon={User03Icon}
                              className=" size-2"
                            />
                            {o?.first_name}
                          </span>
                        ))}
                        {remaining > 0 && (
                          <span className="font-gilroyMedium absolute -right-6 text-xs">
                            + {remaining}
                          </span>
                        )}
                      </div>
                    );
                  }}
                  value={selectedEmails}
                  onChange={setSelectedEmails}
                  label="Members"
                  placeholder="Add team members…"
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      All Users are in the team
                    </div>
                  }
                  width="100%"
                  clearable
                />
              </div>
              <div className="flex gap-2  w-full ">
                <Button
                  type="button"
                  variant="outlineTwo"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <LoadingButton
                  loading={loading}
                  variant="primary"
                  type="submit"
                >
                  Add
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
