"use client";
import { LoadingButton } from "@/components/buttons/Button";
import {
  AsyncMultiSelectCombobox,
  BaseOption,
} from "@/components/ui/async-multi-select-combobox";
import { AsyncSelect } from "@/components/ui/async-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTeam, Team, updateTeam } from "@/server/teamActions";
import { bulkMoveUsers, fetchUsers, User } from "@/server/userActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { User03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { cache, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import CreateUserDialog from "../../people/_components/add-user-form/create-user.dialog";
import { usePathname, useSearchParams } from "next/navigation";

export const teamSchema = z.object({
  team_name: z.string().min(1, "Team name is missing"),
  reporting_manager: z.string().optional(),
  reporting_manager_id: z.string().optional(),
});

export type teamFormType = z.infer<typeof teamSchema>;

export default function CreateTeam({
  children,
  editTeam = null,
  isEdit = false,
}: {
  children: React.ReactNode;
  isEdit?: boolean;
  editTeam?: any;
}) {
  const [open, setOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const teamForm = useForm<teamFormType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: "",
      reporting_manager: undefined,
      reporting_manager_id: undefined,
    },
  });
  const urlTeam = usePathname();

  React.useEffect(() => {
    if (isEdit && editTeam && open) {
      // Populate form fields with existing team data

      if (urlTeam === "/teams") {
        teamForm.setValue("team_name", editTeam?.title || "");
        teamForm.setValue(
          "reporting_manager",
          editTeam?.active_manager?.[0]?.email || ""
        );
        teamForm.setValue(
          "reporting_manager_id",
          editTeam?.active_manager?.[0]?._id || ""
        );
      } else {
        teamForm.setValue("team_name", editTeam?.teamDetail?.title || "");
        teamForm.setValue(
          "reporting_manager",
          editTeam?.teamDetail?.active_manager?.[0]?.email || ""
        );
        teamForm.setValue(
          "reporting_manager_id",
          editTeam?.teamDetail?.active_manager?.[0]?._id || ""
        );
      }

      // Set selected members if available
      const memberEmails =
        editTeam?.members?.map((member: any) => member._id) || [];
      setSelectedEmails(memberEmails);
    }
  }, [isEdit, editTeam, open, teamForm, urlTeam]);

  // Create team mutation
  const teamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: (teamData) => {
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
      queryClient.invalidateQueries({
        queryKey: ["team-timeline"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["async-select", "fetch-teams"],
        exact: false,
        refetchType: "all",
      });
      // After creating team, move users to the team if members are selected
      if (selectedEmails.length > 0 && teamData?._id) {
        bulkMoveUsersMutation.mutate(
          {
            newTeamId: teamData._id,
            userIds: selectedEmails,
          },
          {
            onSuccess: () => {
              setOpen(false);
              teamForm.reset();
              setSelectedEmails([]);
              toast.success("Team created successfully");
            },
          }
        );
      } else {
        // No members to add, just close the dialog
        setOpen(false);
        teamForm.reset();
        setSelectedEmails([]);
        toast.success("Team created successfully");
      }
    },
    onError: (error) => {
      console.error("Team creation error:", error);
      toast.error("Failed to create team");
    },
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: (input: { id: string; teamData: Team }) =>
      updateTeam(input.id, input.teamData),
    onSuccess: (teamData, variables) => {
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
      queryClient.invalidateQueries({
        queryKey: ["team-timeline"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["async-select", "fetch-teams"],
        exact: false,
        refetchType: "all",
      });
      // After updating team, move users to the team if members are selected
      if (selectedEmails.length > 0) {
        // console.log("Moving users to updated team:", {
        //   newTeamId: variables.id,
        //   userIds: selectedEmails,
        // });

        bulkMoveUsersMutation.mutate({
          newTeamId: variables.id,
          userIds: selectedEmails,
        });
      } else {
        // No members to update, just close the dialog
        setOpen(false);
        teamForm.reset();
        setSelectedEmails([]);
        toast.success("Team updated successfully");
      }
    },
    onError: (error) => {
      console.error("Team update error:", error);
      toast.error("Failed to update team");
    },
  });

  // Bulk move users mutation
  const bulkMoveUsersMutation = useMutation({
    mutationFn: bulkMoveUsers,
    onSuccess: () => {
      setOpen(false);
      teamForm.reset();
      setSelectedEmails([]);
      toast.success(
        isEdit
          ? "Team and members updated successfully"
          : "Team created and members added successfully"
      );
    },
    onError: (error) => {
      console.error("Bulk move users error:", error);
      toast.error("Team created but failed to add members");
    },
  });

  const teamFormSubmit = (values: teamFormType) => {
    const teamPayload: any = {
      title: values.team_name,
    };

    if (values.reporting_manager_id && values.reporting_manager) {
      teamPayload.userId = values.reporting_manager_id;
    }

    if (isEdit) {
      updateTeamMutation.mutate({

        id: editTeam?._id ? editTeam?._id : editTeam?.teamDetail?._id,

        teamData: teamPayload,
      });
    } else {
      teamMutation.mutate(teamPayload);
    }
  };

  type UserOption = BaseOption & User;

  const fetchUserOptions = cache(async (): Promise<UserOption[]> => {
    const users = await fetchUsers();
    return users?.map((u) => ({
      ...u,
      label: u?.email,
      value: u?._id,
    }));
  });

  const isLoading =
    teamMutation.isPending ||
    updateTeamMutation.isPending ||
    bulkMoveUsersMutation.isPending;

  return (
    <div className="flex justify-center items-center gap-8 ">
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-3.5"
          >
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className=" px-4 pt-4 text-lg">
                {isEdit ? "Edit Team" : "Create Team"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4  w-full overflow-y-auto hide-scrollbar">
              <Form {...teamForm} key={"team-form"}>
                <form
                  onSubmit={teamForm.handleSubmit(teamFormSubmit)}
                  id="team-form"
                  className="flex flex-col w-full -mt-2"
                >
                  <FormField
                    name="team_name"
                    control={teamForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isEdit}
                            placeholder="Enter"
                            type="text"
                            className="md:text-[13px] placeholder:text-[#CCCCCC] placeholder:font-gilroyRegular placeholder:text-sm font-gilroyMedium"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamForm.control}
                    name="reporting_manager"
                    render={({ field }) => (
                      <FormItem className="-mt-2">
                        <FormLabel>Reporting Manager</FormLabel>
                        <FormControl>
                          <AsyncSelect<User>
                            fetcher={fetchUsers}
                            queryKey="fetch-users"
                            preload
                            renderOption={(user) => (
                              <div className="flex items-center gap-2 ">
                                <div className="flex flex-col">
                                  <div className="font-gilroyMedium">
                                    {user?.first_name}
                                  </div>
                                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                                    {user?.email}
                                  </div>
                                </div>
                              </div>
                            )}
                            filterFn={(user, query) =>
                              user?.first_name
                                ?.toLowerCase()
                                ?.includes(query?.toLowerCase()) ||
                              user?.email
                                ?.toLowerCase()
                                ?.includes(query?.toLowerCase())
                            }
                            getOptionValue={(user) => user?.email}
                            getDisplayValue={(user) => (
                              <div className="flex items-center gap-2 text-left w-full">
                                <div className="flex flex-col leading-tight">
                                  <div className="font-gilroyMedium">
                                    {field?.value}
                                  </div>
                                </div>
                              </div>
                            )}
                            notFound={
                              <CreateUserDialog>
                                <div className="w-full flex justify-center items-center p-2">
                                  <div className="py-2 px-6 hover:bg-gray-50 cursor-pointer border border-gray-200 rounded-[5px] text-black flex justify-center items-center text-center font-gilroyMedium text-sm">
                                    <Plus className="size-4" />
                                    Create User
                                  </div>
                                </div>
                              </CreateUserDialog>
                            }
                            label="User"
                            placeholder="Add Reporting Manager"
                            value={field.value || null}
                            onChange={(selected: User | null) => {
                              field.onChange(selected?.email);
                              teamForm.setValue(
                                "reporting_manager_id",
                                selected?._id
                              );
                            }}
                            className="text-[13px] "
                            triggerClassName="text-[13px]"
                            width="100%"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isEdit && (
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
                          const remaining =
                            opts?.length > 3 ? opts.length - 3 : 0;
                          return (
                            <div className="flex flex-wrap items-center gap-1">
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
                                <span className="font-gilroyMedium text-xs">
                                  + {remaining} More
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
                            No users found
                          </div>
                        }
                        width="100%"
                        clearable
                      />
                    </div>
                  )}
                </form>
              </Form>
            </div>
            <DialogFooter
              className={`${
                isEdit ? "pt-0 -mt-2" : "pt-3"
              } px-4  pb-4 justify-end`}
            >
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                  teamForm.reset();
                  setSelectedEmails([]);
                }}
                variant="outline"
                className="w-full rounded-[5px]  hover:bg-white hover:border hover:border-black"
                disabled={isLoading}
              >
                Cancel
              </Button>

              <LoadingButton
                form="team-form"
                className="rounded-[5px]"
                type="submit"
                variant="primary"
                loading={isLoading}
              >
                {isEdit ? "Update" : "Submit"}
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
