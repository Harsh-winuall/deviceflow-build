import { Table } from "@/components/wind/Table";
import { User, UserResponse } from "@/server/userActions";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

import { GetAvatar } from "@/components/get-avatar";
import AllIntegrationsDisplay from "../../integrations/_components/installed/all-integration-display";
import CreateUserDialog from "./add-user-form/create-user.dialog";
import { RestoreUser } from "./restore-user";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/buttons/Button";
import { AltIntegration } from "@/app/(root)/integrations/_components/icons";

export default function UserMain({
  data,
  peopleText = "Total People",
  selectedIds,
  setSelectedIds,
  handleSelectionChange,
  status,
}: {
  data: UserResponse | null;
  status: string;
  peopleText?: string;
  onRefresh?: () => Promise<void>;
  selectedIds?: string[];
  setSelectedIds: (state: any) => void;
  handleSelectionChange?: (selected: string[]) => void;
}) {
  const router = useRouter();

  return (
    <>
      <div>
        {status !== "pending" && data?.users?.length === 0 ? (
          <div className="flex flex-col gap-6 justify-center items-center py-8">
            <div className="flex  font-gilroySemiBold flex-col   justify-center items-center ">
              <img src="/media/no_data/people.svg" alt="No-People Logo" />
            </div>
            {peopleText === "Active People" && (
              <CreateUserDialog>
                <Button variant="primary" className="w-fit">
                  Add Member
                </Button>
              </CreateUserDialog>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-200  bg-white backdrop-blur-[22.8px] pt-5 pb-2 mt-4 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className=" flex gap-3 w-fit">
                  <h1 className="text-base font-gilroyMedium pl-6">
                    {peopleText}
                  </h1>
                  {/* <h1 className="text-xs font-gilroyMedium  flex justify-center items-center rounded-full px-2 bg-[#F9F5FF] text-[#6941C6]"> */}
                  <Badge className="bg-[#F9F5FF] text-[#6941C6] text-xs">
                    {data?.total} People
                  </Badge>
                  {/* </h1> */}
                </div>
              </div>
              <Suspense>
                <div className="flex flex-col h-full w-full">
                  <Table
                    key={peopleText}
                    data={data?.users ?? []}
                    selectedIds={selectedIds}
                    isLoading={status === "pending"}
                    setSelectedIds={setSelectedIds}
                    {...(peopleText === "Active People"
                      ? {
                          checkboxSelection: {
                            uniqueField: "_id",
                            onSelectionChange: handleSelectionChange,
                          },
                        }
                      : {})}
                    columns={[
                      {
                        title: "Name",
                        render: (user: User) => (
                          <div
                            className="w-28 justify-start flex items-center gap-2 cursor-pointer"
                            onClick={() => router.push(`/people/${user?._id}`)}
                          >
                            <GetAvatar
                              name={user?.first_name ?? ""}
                              size={30}
                            />

                            <div className="relative group">
                              <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                                {user?.first_name?.length! > 24
                                  ? `${user?.first_name!.slice(0, 24)}...`
                                  : user?.first_name}
                              </div>
                              <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                {user?.first_name ?? "-"}
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Employee ID",
                        render: (record: User) => (
                          <div className="text-center">
                            {record?.emp_id ?? "-"}
                          </div>
                        ),
                      },
                      {
                        title: "Role",
                        render: (record: User) => (
                          <div>{record?.designation ?? "-"}</div>
                        ),
                      },

                      {
                        title: "Joining Date",
                        render: (record) => {
                          const onboardingDate = record?.onboarding_date;

                          // Check if onboardingDate is null, undefined, or empty
                          if (!onboardingDate) {
                            return <div>-</div>; // Return "-" for null, undefined, or empty value
                          }

                          const date = new Date(onboardingDate);

                          // Check if the date is valid
                          if (isNaN(date.getTime())) {
                            return <div>-</div>; // Return "-" for invalid date
                          }

                          const formattedDate = date.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          );

                          return <div>{formattedDate}</div>;
                        },
                      },

                      {
                        title: "Reporting Manager",
                        render: (record: User) => (
                          <div className=" whitespace-nowrap flex text-sm font-gilroyMedium text-[#6C6C6C] gap-1">
                            <h1>
                              {record?.reporting_manager?.first_name ?? "-"}
                            </h1>
                            <h1>
                              {record?.reporting_manager?.last_name ?? ""}
                            </h1>
                          </div>
                        ),
                      },

                      {
                        title:
                          peopleText === "Active People" ? "Subscriptions" : "",
                        render: (record: User) => {
                          if (peopleText === "Active People") {
                            const integrations = record?.integrations?.filter(
                              (p) => p.platform
                            );

                            if (integrations.length === 0) {
                              return <span className="text-gray-400">-</span>;
                            }

                            const firstThree = integrations?.slice(0, 3);
                            const extraCount = integrations?.length - 3;

                            return (
                              <AllIntegrationsDisplay
                                key={`${record._id}-people`}
                                data={record}
                                allIntegrations={integrations}
                              >
                                {/* {JSON.stringify(firstThree)} */}
                                <div className="flex items-center gap-0">
                                  <div className="flex items-center gap-2 -space-x-5">
                                    {firstThree.map((i, index) => (
                                      <React.Fragment key={index}>
                                        {i?.image ? (
                                          <div className="flex justify-center items-center p-1.5 bg-white rounded-full border">
                                            <img
                                              src={i.image ?? ""}
                                              width={16}
                                              height={16}
                                              className=" object-contain "
                                              alt="Integration"
                                            />
                                          </div>
                                        ) : (
                                          <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1.5">
                                            <AltIntegration
                                              className={"size-4"}
                                            />
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                  {extraCount > 0 && (
                                    <span className="text-sm text-gray-500 font-gilroySemiBold">
                                      +{extraCount}
                                    </span>
                                  )}
                                </div>
                              </AllIntegrationsDisplay>
                            );
                          } else {
                            return <></>;
                          }
                        },
                      },
                      {
                        title: "Devices assigned",
                        render: (data) =>
                          data?.devices && data?.devices > 0 ? (
                            <Badge className="bg-[#ECFDF3] font-gilroyMedium text-[#027A48]">
                              {`${data?.devices} Assigned`}
                            </Badge>
                          ) : (
                            <div>-</div>
                          ),
                      },

                      {
                        title: "",
                        render: (data) =>
                          peopleText === "Active People" ? (
                            <div className="flex  items-center gap-5 -ml-2">
                              {/* <button
                        className="flex flex-col"
                        onClick={() => handleRemoveUser(data)}
                      >
                        <DeleteTableIcon className="size-6" />
                      </button> */}
                              {/* {data?.role !== 1 ? (
                                <div className="block size-6"></div>
                              ) : (
                                <DeleteUser id={data?._id}>
                                  <DeleteTableIcon className="size-6" />
                                </DeleteUser>
                              )} */}
                              <div
                                onClick={() => {
                                  router.push(`/people/${data?._id}`);
                                }}
                                className={`${buttonVariants({
                                  variant: "outlineTwo",
                                })} text-[13px]`}
                              >
                                View
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-5 -ml-2 justify-center items-center">
                              {/* <PermanentUserDelete
                                id={data?._id!}
                                onRefresh={onRefresh}
                              >
                                <DeleteTableIcon className="size-6" />
                              </PermanentUserDelete> */}

                              <RestoreUser id={data?._id!}>
                                <div
                                  className={buttonVariants({
                                    variant: "outlineTwo",
                                  })}
                                >
                                  Restore
                                </div>
                              </RestoreUser>
                            </div>
                          ),
                      },
                    ]}
                  />
                </div>
              </Suspense>
            </div>
          </>
        )}
      </div>
    </>
  );
}
