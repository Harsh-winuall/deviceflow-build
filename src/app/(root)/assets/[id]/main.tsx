"use client";
import { ActionBar } from "@/components/action-bar/action-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { CombinedContainer } from "@/components/container/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { getDeviceById } from "@/server/deviceActions";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import CreateIssue from "../_components/addDevices/_components/create-issue";
import { DeleteAsset } from "./_components/delete-asset";
import EditAsset from "./_components/edit-asset";
import NewDeviceView from "./_components/new-device-view";
import ReassignAsset from "./_components/reassign-asset";
import { UnassignAsset } from "./_components/unassign-asset";
import { AssignAsset } from "../_components/assign-asset";
import CreateDeviceDialog from "../_components/addDevices/_components/add-device-form";
import { AssignSoftwareDialog } from "./_components/assign-software-dialog";
import { UploadDocuments } from "./_components/upload-documents";
import { MarkAsEndOfLife } from "../_components/end-of-life-dialog";
import { RestoreDevice } from "../_components/restore-assets";
import { RestoreEndOfLifeDevice } from "../_components/addDevices/_components/restoring-end-of-life";
import { HoverDropdownMenu } from "@/components/action-bar/hover-dropdown-menu";

export default function SingleDevice({ params: id }: { params: string }) {
  const { data: newData, status } = useQuery({
    queryKey: ["fetch-single-device", id],
    queryFn: () => getDeviceById(id),
  });
  // console.log(newData);
  return (
    <CombinedContainer>
      <ActionBar showBackBtn>
        <div className="flex gap-2">
          <div className="flex  items-center rounded-md border py-[7px] px-4 gap-1 ">
            {newData?.serial_no ? (
              <div className=" text-[#7F7F7F] text-nowrap text-sm font-gilroySemiBold">
                Serial Number:{" "}
                <span className="text-black">{newData?.serial_no ?? ""}</span>
              </div>
            ) : (
              <div className=" text-[#7F7F7F] capitalize text-nowrap text-sm font-gilroySemiBold">
                Device Type:{" "}
                <span className="text-black">{newData?.device_type ?? ""}</span>
              </div>
            )}
          </div>
        </div>
        {newData?.end_life && (
          <RestoreEndOfLifeDevice
            id={id}
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
          </RestoreEndOfLifeDevice>
        )}
        {newData?.deleted_at === null && !newData?.end_life && (
          <div className="flex gap-5 ">
            <div className="flex gap-2">
              {newData?.userId ? (
                <UnassignAsset id={id ?? ""}>
                  <div className={buttonVariants({ variant: "outlineTwo" })}>
                    Unassign
                  </div>
                </UnassignAsset>
              ) : null}

              <AssignSoftwareDialog id={id ?? ""}>
                <div className={buttonVariants({ variant: "outlineTwo" })}>
                  Assign Software
                </div>
              </AssignSoftwareDialog>
              <CreateIssue>
                <div className={buttonVariants({ variant: "outlineTwo" })}>
                  Report an Issue
                </div>
              </CreateIssue>
              <HoverDropdownMenu>
                <UploadDocuments id={newData?._id}>
                  <DropdownMenuItem
                    className="w-full px-4 py-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Upload Documents
                  </DropdownMenuItem>
                </UploadDocuments>

                {newData?.userId ? (
                  <ReassignAsset deviceData={newData}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2 "
                      onSelect={(e) => e.preventDefault()}
                    >
                      Reassign Asset
                    </DropdownMenuItem>
                  </ReassignAsset>
                ) : (
                  <AssignAsset device={newData}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Assign Asset
                    </DropdownMenuItem>
                  </AssignAsset>
                )}

                <CreateDeviceDialog editDevice={newData} isEdit={true}>
                  <DropdownMenuItem
                    className="w-full px-4 py-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Edit Asset
                  </DropdownMenuItem>
                </CreateDeviceDialog>
                <MarkAsEndOfLife id={newData?._id}>
                  <DropdownMenuItem
                    className="w-full px-4 py-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Mark as End of Life
                  </DropdownMenuItem>
                </MarkAsEndOfLife>

                {newData?.deleted_at === null && (
                  <DeleteAsset id={id ?? ""}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <span className="text-red-500">Delete Asset</span>
                    </DropdownMenuItem>
                  </DeleteAsset>
                )}
              </HoverDropdownMenu>
              {/* <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="rounded-[5px] border size-9 flex justify-center items-center cursor-pointer">
                    <HugeiconsIcon icon={MoreVerticalIcon} className="size-6" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-gilroyMedium flex flex-col w-44 mt-1 mr-14 xl:mr-16">
                  <UploadDocuments id={newData?._id}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Upload Documents
                    </DropdownMenuItem>
                  </UploadDocuments>

                  {newData?.userId ? (
                    <ReassignAsset deviceData={newData}>
                      <DropdownMenuItem
                        className="w-full px-4 py-2 "
                        onSelect={(e) => e.preventDefault()}
                      >
                        Reassign Asset
                      </DropdownMenuItem>
                    </ReassignAsset>
                  ) : (
                    <AssignAsset device={newData}>
                      <DropdownMenuItem
                        className="w-full px-4 py-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Assign Asset
                      </DropdownMenuItem>
                    </AssignAsset>
                  )}

                  <CreateDeviceDialog editDevice={newData} isEdit={true}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Edit Asset
                    </DropdownMenuItem>
                  </CreateDeviceDialog>
                  <MarkAsEndOfLife id={newData?._id}>
                    <DropdownMenuItem
                      className="w-full px-4 py-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Mark as End of Life
                    </DropdownMenuItem>
                  </MarkAsEndOfLife>

                  {newData?.deleted_at === null && (
                    <DeleteAsset id={id ?? ""}>
                      <DropdownMenuItem
                        className="w-full px-4 py-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <span className="text-red-500">Delete Asset</span>
                      </DropdownMenuItem>
                    </DeleteAsset>
                  )}
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        )}
      </ActionBar>

      <NewDeviceView data={newData} status={status} />
    </CombinedContainer>
  );
}
