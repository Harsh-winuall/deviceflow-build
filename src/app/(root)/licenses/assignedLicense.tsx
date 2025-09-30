import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/wind/Table";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import CreateDevice from "../assets/_components/addDevices/_components/create-device";
import CreateDeviceDialog from "../assets/_components/addDevices/_components/add-device-form";
import { Button } from "@/components/ui/button";

function AssignedLicenses({
  data,
  licenseText = "All Licenses",
  status,
}: {
  data: any;
  status?: string;
  licenseText?: string;
}) {
  const router = useRouter();

  return (
    <>
      <>
        {data?.length === 0 ? (
          <div className="flex flex-col gap-6 justify-center items-center py-10">
            {/* <assetsIcons.no_assets_display /> */}
            <Image
              src="/media/no_data/no_license.svg"
              alt="No-License Logo"
              width={500}
              height={500}
            />
            {licenseText === "Inactive Licenses" ? (
              <></>
            ) : (
              <CreateDeviceDialog licenseDeviceType={true}>
                <Button>Add License</Button>
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
                    {licenseText}
                  </h1>
                  <Badge className="bg-[#F9F5FF] text-[#6941C6]">
                    {data?.length} Licenses
                  </Badge>
                </div>
              )}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="flex flex-col gap-2">
                <Table
                  data={data}
                  selectedIds={[]}
                  isLoading={status === "pending"}
                  setSelectedIds={() => {}}
                  columns={[
                    {
                      title: "License Name",
                      render: (data: any) => (
                        <div
                          className="justify-start flex items-center gap-2 cursor-pointer"
                          onClick={() => router.push(`/licenses/${data?._id}`)}
                          onMouseEnter={() =>
                            router.prefetch(`/licenses/${data?._id}`)
                          }
                        >
                          <GetAvatar
                            name={data?.licenseName ?? ""}
                            isDeviceAvatar
                            size={30}
                          />

                          <div className="relative group">
                            <div className="font-gilroyMedium text-sm truncate max-w-[150px]">
                              {data?.licenseName?.length! > 12
                                ? `${data?.licenseName!.slice(0, 12)}...`
                                : data?.licenseName}
                            </div>
                            <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-xs rounded shadow-lg border group-hover:block">
                              {data?.licenseName ?? "-"}
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Added On",
                      render: (data: any) => (
                        <div className="font-gilroyMedium text-sm">
                          {formatDate(data?.added_on)}
                        </div>
                      ),
                    },
                    {
                      title: "No of Licenses",
                      render: (data: any) => (
                        <div className="font-gilroyMedium text-sm">
                          {data?.licenseCount}
                        </div>
                      ),
                    },
                    {
                      title: "Price",
                      render: (data: any) => (
                        <div className="font-gilroyMedium text-sm">
                          {data?.price}
                        </div>
                      ),
                    },
                    {
                      title: "",
                      render: (data: any) => (
                        <div className="flex gap-5 -ml-2">
                          <Link
                            href={`/licenses/${data?._id}`}
                            onMouseEnter={() =>
                              router.prefetch(`/licenses/${data?._id}`)
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
                      ),
                    },
                  ]}
                />
              </div>
            </Suspense>
          </div>
        )}
      </>
    </>
  );
}

export default AssignedLicenses;
