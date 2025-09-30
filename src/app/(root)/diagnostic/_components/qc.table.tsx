import { Table } from "@/components/wind/Table";
import { Suspense } from "react";

import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  downloadReport,
  getAISummaryReport,
  QcReportResponse,
} from "@/server/checkMateActions";
import { useMutation } from "@tanstack/react-query";
import AISummaryModal from "./AiSummaryModal";
import { DiagonisticIcons } from "./icons";
import ReportPreview from "./report-preview";

export default function QcTable({
  data,
  isAdmin,
  isError,
  qcTableText = "Total Reports",
  selectedIds,
  setSelectedIds,
  status,
}: {
  data: QcReportResponse | null;
  isAdmin: boolean;
  isError: boolean;
  status: string;
  qcTableText?: string;
  onRefresh?: () => Promise<void>;
  selectedIds?: string[];
  setSelectedIds: (state: any) => void;
}) {
  const qcReportMutation = useMutation({
    mutationFn: downloadReport,
    onSuccess: () => {},
    onError: () => {},
  });

  const handleDownloadReport = async (recordData: any) => {
    // console.log(recordData);
    qcReportMutation?.mutate({ userId: recordData?._id });
  };

  const aiSummaryMutation = useMutation({
    mutationFn: getAISummaryReport,
    onSuccess: () => {},
    onError: () => {},
  });

  const handleAISummaryReport = async (data) => {
    qcReportMutation.mutate({ userId: data?._id });
    aiSummaryMutation.mutate(qcReportMutation?.data);
  };

  return (
    <>
      <div>
        {(status !== "pending" && data?.data?.length === 0) || isError ? (
          <div className="rounded-lg border border-gray-200  bg-white backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
            <div className="flex justify-center items-center h-[68vh]">
              <DiagonisticIcons.no_scan_display />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-200  bg-white backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className=" flex gap-3 w-fit">
                  <h1 className="text-base font-gilroyMedium pl-6">
                    {qcTableText}
                  </h1>
                  {data?.totalRecords !== 0 ? (
                    <Badge className="bg-[#F9F5FF] text-[#6941C6]">
                      {data?.totalRecords} Reports
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Suspense>
                <div className="flex flex-col h-full w-full">
                  <Table
                    key={qcTableText}
                    data={data?.data}
                    selectedIds={selectedIds}
                    isLoading={status === "pending"}
                    setSelectedIds={setSelectedIds}
                    columns={[
                      // {
                      //   title: "Serial No",
                      //   render: () => (
                      //     <div className="pl-5">{data?.data?.length ?? "-"}</div>
                      //   ),
                      // },

                      ...(isAdmin
                        ? [
                            {
                              title: "User Name",
                              render: (record) => (
                                <div className="w-28 flex items-center gap-2">
                                  <GetAvatar
                                    name={record?.name ?? ""}
                                    size={30}
                                  />

                                  <div className="relative group">
                                    <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                                      {record?.name?.length! > 9
                                        ? `${record?.name?.slice(0, 9)}...`
                                        : record?.name}
                                    </div>
                                    <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                      {record?.name ?? "-"}
                                    </div>
                                  </div>
                                </div>
                              ),
                            },
                          ]
                        : []),
                      {
                        title: "Device Name",
                        render: (record) => (
                          <div className="w-28 flex items-center gap-2">
                            {/* {JSON.stringify(record)} */}
                            {/* <GetAvatar name={record?.custom_model ?? "-"} /> */}
                            {/* Here we need custom_model field from backend */}

                            <div className="relative group">
                              <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
                                {record?.device_name?.length! > 9
                                  ? `${record?.device_name?.slice(0, 9)}...`
                                  : record?.device_name}
                              </div>
                              <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
                                {record?.device_name ?? "-"}
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Asset Health",
                        render: (record) => {
                          let color =
                            record?.assets_health === "Excellent"
                              ? "text-[#027A48] bg-[#ECFDF3]"
                              : record.assets_health === "Fair"
                              ? "text-[#F00] bg-[#FFE0E0]"
                              : "text-[#FF8000] bg-[#FFFACB]";
                          return record?.assets_health ? (
                            <Badge className={cn("truncate", color)}>
                              {record?.assets_health}
                            </Badge>
                          ) : (
                            "-"
                          );
                        },
                      },
                      {
                        title: "Warranty Status",
                        render: (record) => {
                          const warrantyDate = record?.warranty_status
                            ? new Date(record?.warranty_status)
                            : null;
                          const isActive = warrantyDate
                            ? warrantyDate > new Date()
                            : false;
                          return (
                            <Badge
                              className={cn(
                                "truncate",
                                isActive
                                  ? "text-[#027A48] bg-[#ECFDF3]"
                                  : "text-[#F00] bg-[#FFE0E0]"
                              )}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </Badge>
                          );
                        },
                      },
                      {
                        title: "Serial Number",
                        render: (record) => <div>{record?.serial_no}</div>,
                      },
                      {
                        title: "Diagnosed On",
                        render: (record) => {
                          const diagDate = record?.diagnosed_on
                            ? new Date(record?.diagnosed_on)
                            : null;
                          const formattedDiag = diagDate
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
                        title: "",
                        render: (record) => (
                          <ReportPreview
                            data={qcReportMutation?.data}
                            isPending={qcReportMutation?.isPending}
                          >
                            <div
                              className={buttonVariants({
                                variant: "outlineTwo",
                                className: "cursor-pointer",
                              })}
                              onClick={() => handleDownloadReport(record)}
                            >
                              View Report
                            </div>
                          </ReportPreview>
                        ),
                      },
                      {
                        title: "",
                        render: (record) => (
                          <AISummaryModal data={aiSummaryMutation?.data}>
                            <div
                              className={buttonVariants({
                                variant: "outlineTwo",
                                className: "cursor-pointer",
                              })}
                              onClick={() => handleAISummaryReport(record)}
                            >
                              AI Summary
                            </div>
                          </AISummaryModal>
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
