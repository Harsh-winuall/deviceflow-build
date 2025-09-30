"use client";

import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/wind/Table";
import {
  IntegrationUsers,
  mapIntegrationUsers,
  UserByIntegration,
} from "@/server/integrationActions";
import { User } from "@/server/userActions";
import { ArrowLeft01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import AllIntegrationsDisplay from "./all-integration-display";

interface UserByIntegrationsProps {
  data?:
    | IntegrationUsers["allUsers"]
    | IntegrationUsers["missingIntegrationUsers"];
  selectedPlatform?: string;
  status?: "error" | "success" | "pending";
  unmappedData?: IntegrationUsers["usersUnmapped"];
}

const SeatsSection: React.FC<UserByIntegrationsProps> = ({
  data,
  selectedPlatform,
  status,
  unmappedData,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  return (
    <div className="flex flex-col ">
      <div
        className="flex gap-2 items-center mb-2 cursor-pointer hover:underline"
        onClick={() => router.back()}
      >
        <div className="rounded-full bg-gray-100 p-1 flex justify-center items-center">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="text-black size-5" />
        </div>
        <span className="text-gray-500 font-gilroyMedium text-base">
          Installed
        </span>
      </div>

      <div>
        <div className="rounded-lg border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h1 className="text-base pl-6 font-gilroyMedium capitalize">
              {(() => {
                if (selectedPlatform === "totalseats") return <>Total Seats</>;
                if (selectedPlatform === "unmapped") return <>Unmapped Seats</>;
              })()}
            </h1>
          </div>

          {/* {status === "pending" ? (
            <div>
              <DeviceFlowLoader />
            </div>
          ) : null} */}

          {/* {data?.length ? ( */}
          <div className="flex flex-col gap-2">
            <Table
              data={data}
              selectedIds={selectedIds}
              isLoading={status === "pending"}
              setSelectedIds={setSelectedIds}
              // checkboxSelection={{
              //   uniqueField: "_id",
              //   onSelectionChange: setSelectedIds,
              // }}
              columns={[
                {
                  title: "Name",
                  render: (record: UserByIntegration) => (
                    <div className="w-28 flex items-center gap-2">
                      <GetAvatar
                        name={record?.first_name ?? record?.name ?? "Guest"}
                        size={30}
                      />

                      <div className="relative group">
                        <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                          {(() => {
                            const name =
                              record?.first_name ?? record?.name ?? "Guest";
                            const displayName =
                              name.length > 12
                                ? `${name.slice(0, 12)}...`
                                : name;
                            return displayName;
                          })()}
                        </div>
                        <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                          {record?.first_name ?? record?.name ?? "Guest"}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  title: "Role",
                  render: (record) => <div>{record?.designation ?? "-"}</div>,
                },
                {
                  title: "Reporting Manager",
                  render: (record) => (
                    <div>{record?.reporting_manager ?? "-"}</div>
                  ),
                },
                {
                  title: "Team",
                  render: (record) => <div>{record?.teamName ?? "-"}</div>,
                },
                {
                  title: "Joining Date",
                  render: (record) => {
                    const rawDate = record?.onboarding_date;
                    const diagDate = rawDate ? new Date(rawDate) : null;
                    const isValidDate = diagDate && !isNaN(diagDate.getTime());

                    const formattedDiag = isValidDate
                      ? diagDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    return <div>{formattedDiag}</div>;
                  },
                },
                {
                  title: "Integrations",
                  render: (record: UserByIntegration) => {
                    const filteredIntegrations = (
                      record?.integrations ?? []
                    ).filter((i) => i.platform !== selectedPlatform);

                    if (filteredIntegrations.length === 0) {
                      return <span className="text-gray-400">-</span>;
                    }

                    const firstThree = filteredIntegrations?.slice(0, 3);
                    const extraCount = filteredIntegrations.length - 3;

                    return (
                      <AllIntegrationsDisplay
                        data={record as unknown as User}
                        allIntegrations={filteredIntegrations}
                        showArrow={false}
                      >
                        <div className="flex items-center gap-2 -space-x-5">
                          {firstThree?.map((i, index) => (
                            <div
                              key={index}
                              className="flex justify-center items-center p-1.5 bg-white rounded-full border"
                            >
                              <img
                                src={i?.image ?? ""}
                                width={16}
                                height={16}
                                className=" object-contain "
                                alt="Integration"
                              />
                            </div>
                          ))}

                          {extraCount > 0 && (
                            <span className="text-sm text-gray-500 font-gilroySemiBold">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </AllIntegrationsDisplay>
                    );
                  },
                },
                {
                  title: "",
                  render: (record) =>
                    selectedPlatform === "unmapped" ? (
                      <MapGuestUser
                        data={record}
                        allUsers={unmappedData}
                        // integrations={record?.integrations}
                      >
                        <div className={buttonVariants({ variant: "outline" })}>
                          Map User
                        </div>
                      </MapGuestUser>
                    ) : null,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SeatsSection };

const MapGuestUser = ({
  children,
  data,
  allUsers,
}: {
  children: React.ReactNode;
  data: User;
  allUsers?: IntegrationUsers["usersUnmapped"];
  // integrations?: UserByIntegration["integrations"];
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const mutation = useMutation({
    mutationFn: mapIntegrationUsers,
    mutationKey: ["map-integration-single-user"],
    onSuccess: async () => {
      const queriesToInvalidate = [
        { queryKey: ["get-integration-by-id"], exact: false },
        { queryKey: ["fetch-people"], exact: false },
        { queryKey: ["user-by-integrations", "all-data"], exact: true },
        { queryKey: ["all-integrations", "discover"], exact: true },
        { queryKey: ["all-integrations"], exact: false },
      ];

      await Promise.all(
        queriesToInvalidate.map(({ queryKey, exact }) =>
          queryClient.invalidateQueries({ queryKey, exact, refetchType: "all" })
        )
      );

      toast.success("User mapped successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to map user");
    },
  });

  const userIntegration = data?.integrations;

  const getUsers = async (query: string = ""): Promise<User[]> => {
    try {
      const unfiltered = allUsers ?? [];

      // Extract all integration IDs from the current user's integrations
      const integrationIds = (userIntegration ?? []).map((i) => i.id);

      // Filter users who do NOT already have the same integration
      const filtered = unfiltered.filter((user) => {
        // If the user is missing one of the integrationIds, they are valid
        const missingIds = (user.missingIntegration ?? []).map((m) => m.id);
        return integrationIds.some((id) => missingIds.includes(id));
      });

      const searchStr = query.toLowerCase();

      const res = filtered?.filter((user) => {
        const matchesSearch =
          user?.first_name?.toLowerCase().includes(searchStr) ||
          user?.email?.toLowerCase().includes(searchStr) ||
          (user?.name && user?.name.toLowerCase().includes(searchStr)) ||
          (user?.last_name &&
            user?.last_name.toLowerCase().includes(searchStr));

        return matchesSearch;
      });

      return res;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  };

  const updateMappingSelection = (user: User | null) => {
    setSelectedUser(user);
  };

  const clearAll = () => {
    setSelectedUser(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Map User</DialogTitle>
        </DialogHeader>

        <div className="w-full space-y-4 px-2 my-3 h-full max-h-[40vh] overflow-y-auto">
          {/* {JSON.stringify(data)} */}
          <div className="flex items-center justify-between gap-x-5">
            <Input
              value={
                data?.name ??
                data?.first_name ??
                data?.last_name ??
                data?.email ??
                ""
              }
              defaultValue={
                data?.name ??
                data?.first_name ??
                data?.last_name ??
                data?.email ??
                ""
              }
              className="rounded-md border border-gray-200 w-[9.5rem]"
              placeholder="Enter value"
              readOnly
            />
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="text-gray-900 size-5"
            />

            <div className="flex flex-col gap-2">
              <AsyncSelect<User>
                fetcher={getUsers}
                queryKey="fetch-users"
                fixInputClear={false}
                renderOption={(user) => (
                  <div className="flex items-center gap-2">
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
                getOptionValue={(user) => user?.email}
                getDisplayValue={() => (
                  <div className="flex items-center gap-2 text-left w-fit">
                    <div className="flex flex-col leading-tight">
                      <div className="font-gilroyMedium truncate min-w-0 w-[6.2rem]">
                        {selectedUser?.email ?? ""}
                      </div>
                    </div>
                  </div>
                )}
                notFound={
                  <div className="py-6 text-center font-gilroyMedium text-sm">
                    No users found
                  </div>
                }
                label="User"
                placeholder="Map to"
                value={selectedUser?.email || "null"}
                onChange={(selected: User | null) =>
                  updateMappingSelection(selected)
                }
                width="10rem"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="w-full flex gap-2 justify-center items-center">
          <DialogClose asChild>
            <Button
              variant="outlineTwo"
              type="button"
              className="w-1/2"
              onClick={clearAll}
            >
              Close
            </Button>
          </DialogClose>
          <LoadingButton
            variant="primary"
            type="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending}
            className="w-1/2"
            onClick={() =>
              mutation.mutate({
                payload: [
                  {
                    userId: selectedUser?._id,
                    userIntegrationId: data?._id,
                    integrationId: userIntegration?.[0]?.id,
                  },
                ],
              })
            }
          >
            Confirm
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
