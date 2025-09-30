import { Device, StoreDevice } from "@/server/deviceActions";

import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/wind/Table";
import { FilterAssetsResponse } from "@/server/types/newFilterTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { AssignAsset } from "./assign-asset";
import { RestoreDevice } from "./restore-assets";
import { cn } from "@/lib/utils";
import CreateDeviceDialog from "./addDevices/_components/add-device-form";
import { Button } from "@/components/ui/button";

function AssignedAssets({
  data,
  assetsText = "All Assets",
  status,
  selectedIds,
  setSelectedIds,
  handleSelectionChange,
}: {
  data: FilterAssetsResponse;
  status?: string;
  assetsText?: string;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
  handleSelectionChange?: (selected: string[]) => void;
}) {
  const router = useRouter();

  return (
    <>
      <>
        {data?.devices?.length === 0 ? (
          <div className="flex flex-col gap-6 justify-center items-center py-10">
            {/* <assetsIcons.no_assets_display /> */}
            <Image
              src="/media/no_data/assets.svg"
              alt="No-Assets Logo"
              width={500}
              height={500}
            />
            {assetsText === "Inactive Assets" ? (
              <></>
            ) : (
              <CreateDeviceDialog>
                <Button className="w-fit">Add Device</Button>
              </CreateDeviceDialog>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200  bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
            {" "}
            <div className="flex justify-between items-center">
              {status === "pending" ? (
                <div className="flex gap-3 ml-4">
                  <Skeleton className="text-base pl-6 h-6 w-32" />
                  <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full   h-6 w-16" />
                  <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full  h-6 w-20" />
                  <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full   h-6 w-24" />
                </div>
              ) : (
                <div className=" flex gap-3 w-fit">
                  <h1 className="text-base pl-6 font-gilroyMedium">
                    {assetsText}
                  </h1>
                  <Badge className="bg-[#F9F5FF] text-[#6941C6]">
                    {data?.total} Assets
                  </Badge>
                </div>
              )}

              {/* {selectedIds.length > 0 && (
                <DeleteModal
                  handleBulkDelete={handleBulkDelete}
                  open={open}
                  setOpen={setOpen}
                >
                  <button
                    // onClick={handleBulkDelete}
                    className="bg-black flex items-center gap-2 text-white px-3 py-1 font-gilroySemiBold w-fit mr-8 rounded-full"
                  >
                    Delete
                  </button>
                </DeleteModal>
                // {selectedIds.length} Users
              )} */}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="flex flex-col gap-2">
                <Table
                  data={data?.devices}
                  selectedIds={selectedIds}
                  isLoading={status === "pending"}
                  setSelectedIds={setSelectedIds}
                  {...(assetsText !== "Inactive Assets"
                    ? {
                        checkboxSelection: {
                          uniqueField: "_id",
                          onSelectionChange: handleSelectionChange,
                        },
                      }
                    : {})}
                  columns={(() => {
                    const baseColumns = [
                      {
                        title: "Device",
                        render: (data: Device) => (
                          <div
                            className="justify-start flex items-center gap-2 cursor-pointer"
                            onClick={() => router.push(`/assets/${data?._id}`)}
                            onMouseEnter={() =>
                              router.prefetch(`/assets/${data?._id}`)
                            }
                          >
                            <GetAvatar
                              name={data?.device_name ?? data?.custom_model}
                              isDeviceAvatar
                              size={30}
                            />

                            <div className="relative group">
                              <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                                {data?.device_name?.length! > 12
                                  ? `${data?.device_name!.slice(0, 12)}...`
                                  : data?.device_name ?? data?.custom_model}
                              </div>
                              <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                {data?.device_name ?? data?.custom_model}
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        title:
                          assetsText === "Assigned Assets" ? "Assigned to" : "",
                        render: (record) =>
                          assetsText === "Assigned Assets" ? (
                            <>
                              <div className="relative group">
                                <div className=" text-sm truncate max-w-[150px]">
                                  {record?.userName?.length! > 24
                                    ? `${record?.userName!.slice(0, 24)}...`
                                    : record?.userName}
                                </div>
                                {record?.userName?.length > 12 && (
                                  <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                    {record?.userName ?? "-"}
                                  </div>
                                )}
                              </div>
                              {/* <span>{record?.userName ?? "-"}</span> */}
                            </>
                          ) : null,
                      },
                      {
                        title: "Serial Number",
                        render: (record) => (
                          <>
                            <div className="relative group">
                              <div className="text-sm truncate max-w-[150px]">
                                {record?.serial_no?.length! > 12
                                  ? `${record?.serial_no!.slice(0, 12)}...`
                                  : record?.serial_no}
                              </div>
                              {record?.serial_no?.length > 12 && (
                                <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                  {record?.serial_no ?? "-"}
                                </div>
                              )}
                            </div>
                            {/* <span>{record?.serial_no ?? "-"}</span> */}
                          </>
                        ),
                      },
                      {
                        title: assetsText === "Assigned Assets" ? "Team" : "",
                        render: (record: StoreDevice) =>
                          assetsText === "Assigned Assets" ? (
                            <span>{record?.teams ?? "-"}</span>
                          ) : null,
                      },

                      {
                        title:
                          assetsText !== "Assigned Assets"
                            ? "Purchased on"
                            : "",
                        render: (record) => {
                          if (assetsText !== "Assigned Assets") {
                            const onboardingDate = record?.device_purchase_date;
                            if (!onboardingDate) return <div>-</div>;
                            const date = new Date(onboardingDate);
                            if (isNaN(date.getTime())) return <div>-</div>;
                            return (
                              <div>
                                {date.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            );
                          }
                          return null;
                        },
                      },
                      {
                        title: "Asset Health",
                        render: (record: Device) => {
                          let color = "";
                          switch (record?.device_condition) {
                            case "Excellent":
                              color = "text-[#027A48] text-xs bg-[#ECFDF3]";
                              break;
                            case "Fair":
                              color = "text-[#F00] text-xs bg-[#FFE0E0]";
                              break;
                            default:
                              color = "text-[#FF8000] text-xs bg-[#FFFACB]";
                          }
                          return record?.device_condition ? (
                            <Badge className={`${color}`}>
                              {record?.device_condition}
                            </Badge>
                          ) : (
                            "-"
                          );
                        },
                      },
                      {
                        title:
                          assetsText !== "Assigned Assets"
                            ? "Warranty Status"
                            : "",
                        render: (record) => {
                          const isWarrantyActive = record?.warranty_expiary_date
                            ? new Date(record.warranty_expiary_date) >
                              new Date()
                            : false;
                          return (
                            <Badge
                              className={cn(
                                isWarrantyActive
                                  ? "text-[#027A48] bg-[#ECFDF3]"
                                  : "text-[#F00] bg-[#FFE0E0]"
                              )}
                            >
                              {isWarrantyActive ? "Active" : "Inactive"}
                            </Badge>
                          );
                        },
                      },
                      // {
                      //    title: "Acknowledgement",
                      //   render: (record) => {
                      //     const isWarrantyActive = record?.warranty_expiary_date
                      //       ? new Date(record.warranty_expiary_date) >
                      //         new Date()
                      //       : false;
                      //     return (
                      //       <span
                      //         className={`${
                      //           isWarrantyActive
                      //             ? "text-[#027A48] text-xs bg-[#ECFDF3]"
                      //             : "text-[#F00] text-xs bg-[#FFE0E0]"
                      //         } px-3 py-1.5 w-fit flex justify-center items-center rounded-full`}
                      //       >
                      //         {isWarrantyActive ? "Active" : "Inactive"}
                      //       </span>
                      //     );
                      //   },
                      // }
                    ];

                    // Filter columns with empty titles and return them
                    return baseColumns
                      .filter((column) => column.title.trim() !== "")
                      .concat({
                        title: "",
                        render: (record: Device) => {
                          if (assetsText === "Unassigned Assets") {
                            return (
                              <div className="flex gap-5 -ml-2">
                                {/* <SoftDeleteAsset
                                  id={record?._id ?? "error"}
                                  onRefresh={onRefresh}
                                >
                                  <DeleteTableIcon className="size-6" />
                                </SoftDeleteAsset> */}
                                <AssignAsset
                                  device={record}
                                  // onRefresh={onRefresh}
                                >
                                  <div
                                    className={buttonVariants({
                                      variant: "outlineTwo",
                                      className: "w-full",
                                    })}
                                  >
                                    Assign
                                  </div>
                                </AssignAsset>
                              </div>
                            );
                          } else if (assetsText === "Assigned Assets") {
                            return (
                              <div className="flex gap-5 -ml-2 items-center">
                                <Link
                                  href={`/assets/${record?._id}`}
                                  onMouseEnter={() =>
                                    router.prefetch(`/assets/${record?._id}`)
                                  }
                                >
                                  <div
                                    className={buttonVariants({
                                      variant: "outlineTwo",
                                      className: "w-full",
                                    })}
                                  >
                                    Manage
                                  </div>
                                </Link>
                              </div>
                            );
                          } else if (assetsText === "Inactive Assets") {
                            return (
                              <div className="flex gap-5 -ml-2">
                                {/* <PermanentAssetsDelete
                                  id={record?._id!}
                                  onRefresh={onRefresh}
                                >
                                  <DeleteTableIcon className="size-6" />
                                </PermanentAssetsDelete> */}
                                <RestoreDevice
                                  id={record?._id!}
                                  // onRefresh={onRefresh}
                                >
                                  <div
                                    className={buttonVariants({
                                      variant: "outlineTwo",
                                      className: "w-full",
                                    })}
                                  >
                                    Restore
                                  </div>
                                </RestoreDevice>
                              </div>
                            );
                          }
                        },
                      });
                  })()}
                />
              </div>
            </Suspense>
          </div>
        )}
      </>
    </>
  );
}

export default AssignedAssets;
