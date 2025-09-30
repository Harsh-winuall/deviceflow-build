"use client";
import {
  bulkDeleteAssets,
  Device,
  DeviceResponse,
} from "@/server/deviceActions";
import React, { Suspense, useState } from "react";
import Pagination from "../../teams/_components/pagination";
import { useRouter } from "next/navigation";
import { Table } from "@/components/wind/Table";
import { PermanentAssetsDelete } from "./permanent-assets-delete";
import { RestoreDevice } from "./restore-assets";
import { inActiveAssets } from "@/server/filterActions";
import CreateDevice from "./addDevices/_components/create-device";
import DeleteTableIcon from "@/icons/DeleteTableIcon";
import { toast } from "sonner";
import { DeleteModal } from "../../people/_components/deleteUserModal";
import { AssetsIcons } from "../icons";
import CreateDeviceDialog from "./addDevices/_components/add-device-form";

function InActiveAssets({
  data,
  setAssets,
  onRefresh,
}: {
  data: DeviceResponse | null;
  setAssets: React.Dispatch<React.SetStateAction<DeviceResponse | null>>;
  onRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error(`No Asset selected for deletion`);
      return;
    }

    // const confirmDelete = window.confirm(
    //   `Are you sure you want to delete ${selectedIds.length} users?`
    // );
    // if (!confirmDelete) return;

    try {
      const res = await bulkDeleteAssets(selectedIds, "permanent");

      if (res.status !== 200) throw new Error("Failed to delete Assets");

      toast.success("Assets deleted successfully!");
      setSelectedIds([]); // Clear selection after deletion
      await onRefresh(); // Refresh data after deletion
    } catch (error) {
      toast.error(`Failed to delete Assets : ${error}`);
    }
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true); // Set loading to true when changing pages
    try {
      const res = await inActiveAssets({ page });
      setAssets(res);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  return (
    <>
      <div className="rounded-[33px] border border-[#C3C3C34F] p-3 bg-white/80 backdrop-blur-[22.8px]  flex flex-col gap-5">
        {!isLoading && data?.devices.length !== 0 ? (
          <div className="flex flex-col gap-6 justify-center items-center py-4">
            <AssetsIcons.no_assets_display />
            <CreateDeviceDialog>
              <div className="py-1.5 px-8 text-sm rounded-full text-white font-gilroySemiBold bg-black">
                Add Device
              </div>
            </CreateDeviceDialog>
          </div>
        ) : (
          <div className="rounded-[21px] border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className=" flex gap-3 w-fit">
                <h1 className="text-xl font-gilroySemiBold pl-6">
                  Total Assets
                </h1>
                <h1 className="text-xs font-gilroyMedium  flex justify-center items-center rounded-full px-2 bg-[#F9F5FF] text-[#6941C6]">
                  {data?.total} Assets
                </h1>
              </div>

              {selectedIds.length > 0 && (
                <DeleteModal
                  handleBulkAction={handleBulkDelete}
                  open={open}
                  setOpen={setOpen}
                  type="Delete"
                >
                  <button
                    // onClick={handleBulkDelete}
                    className="bg-black flex items-center gap-2 text-white px-3 py-1 font-gilroySemiBold w-fit mr-8 rounded-full"
                  >
                    Delete
                  </button>
                </DeleteModal>
                // {selectedIds.length} Users
              )}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="flex flex-col gap-2">
                <Table
                  data={data?.devices ?? []}
                  selectedIds={selectedIds}
                  isLoading={isLoading}
                  setSelectedIds={setSelectedIds}
                  checkboxSelection={{
                    uniqueField: "_id",
                    onSelectionChange: handleSelectionChange,
                  }}
                  columns={[
                    {
                      title: "Device",
                      render: (data: Device) => (
                        <div className=" justify-start flex items-center gap-2 ">
                          <img
                            src={
                              data?.image?.[0]?.url ??
                              "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                            }
                            alt="Device Logo"
                            className="size-10 object-cover rounded-full"
                          />

                          <div className="text-[#101828] font-gilroySemiBold text-sm">
                            {data?.custom_model ?? "-"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Serial Number",
                      render: (record) => {
                        return <span>{record?.serial_no ?? "-"}</span>;
                      },
                    },
                    {
                      title: "Purchased  On",
                      render: (record) => {
                        const onboardingDate = record?.device_purchase_date;

                        // Check if onboardingDate is null, undefined, or empty
                        if (!onboardingDate) {
                          return <div>-</div>; // Return "-" for null, undefined, or empty value
                        }

                        const date = new Date(onboardingDate);

                        // Check if the date is valid
                        if (isNaN(date.getTime())) {
                          return <div>-</div>; // Return "-" for invalid date
                        }

                        const formattedDate = date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return <div>{formattedDate}</div>;
                      },
                    },
                    {
                      title: "Asset Condition",
                      render: (record: Device) => {
                        let color = "";
                        switch (record?.device_condition) {
                          case "Good":
                            color = "text-[#FF8000] bg-[#FFFACB] ";
                            break;
                          case "Best":
                            color = "text-[#027A48] bg-[#ECFDF3] ";
                            break;
                          case "New":
                            color = "text-[#027A48] bg-[#ECFDF3] ";
                            break;
                          case "Old":
                            color = "text-[#F00] bg-[#FFE0E0] ";
                            break;
                          default:
                            color = "text-[#FF8000] bg-[#FFFACB]";
                        }
                        return record?.device_condition ? (
                          <span
                            className={`${color} px-3 py-0.5 w-fit flex justify-center items-center rounded-full`}
                          >
                            {record?.device_condition}
                          </span>
                        ) : (
                          "-"
                        );
                      },
                    },
                    {
                      title: "Warranty Status",
                      render: (record) => {
                        // Check if the warranty is active based on expiry date
                        const isWarrantyActive = record?.warranty_expiary_date
                          ? new Date(record?.warranty_expiary_date) > new Date()
                          : false;

                        return (
                          <span
                            className={`${
                              isWarrantyActive
                                ? "text-[#027A48] px-3 py-0.5 w-fit flex justify-center items-center rounded-full bg-[#ECFDF3]"
                                : "text-[#F00] px-3 py-0.5 w-fit flex justify-center items-center rounded-full bg-[#FFE0E0]"
                            }`}
                          >
                            {isWarrantyActive ? "Active" : "Inactive"}
                          </span>
                        );
                      },
                    },
                    {
                      title: "",
                      render: (record: Device) => (
                        <div className="flex gap-5 -ml-2">
                          <PermanentAssetsDelete
                            id={record?._id!}
                            onRefresh={onRefresh}
                          >
                            <DeleteTableIcon className="size-6" />
                          </PermanentAssetsDelete>

                          <RestoreDevice
                            id={record?._id!}
                            onRefresh={onRefresh}
                          >
                            <div className="rounded-full text-white bg-black font-gilroySemiBold text-sm py-1.5 px-5">
                              Restore
                            </div>
                          </RestoreDevice>
                        </div>
                      ),
                    },
                  ]}
                />
                {/* Pagination Control */}
                <div className="mt-1">
                  <Pagination
                    current_page={currentPage}
                    total_pages={data?.total_pages!}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}

export default InActiveAssets;
