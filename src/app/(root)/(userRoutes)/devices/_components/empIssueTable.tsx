"use client";
import React, { useState } from "react";
import { Table } from "@/components/wind/Table";
import { getAllResponse, Issues } from "@/server/issueActions";
import { useRouter } from "next/navigation";
import Pagination from "@/app/(root)/teams/_components/pagination";
import { issueIcons } from "@/app/(root)/issues/icons";
import { ChevronRight } from "lucide-react";
const ITEMS_PER_PAGE = 5;

function EmpIssueTable({ data }: { data: getAllResponse }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div>
      {data?.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-4">
          <issueIcons.no_issues_icon />
        </div>
      ) : (
        <div className="rounded-[10px] mt-2 border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
          {" "}
          <div className=" flex gap-3 w-fit">
            <h1 className="2xl:text-xl text-lg pl-6 font-gilroySemiBold">
              Ticket Raised
            </h1>
            <h1 className="text-xs font-gilroyMedium  flex justify-center items-center rounded-full px-2 bg-[#F9F5FF] text-[#6941C6]">
              {data?.length} Tickets
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <Table
              data={data}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              columns={[
                {
                  title: "Ticket ID",
                  render: (data: Issues) => (
                    <div
                      className="cursor-pointer w-fit h-fit"
                      onClick={() =>
                        router.push(`/devices/issues/${data?._id}`)
                      }
                    >
                      {data?.code}
                    </div>
                  ),
                  // dataIndex: "_id",
                },
                {
                  title: "Device",
                  render: (data: Issues) => (
                    <div
                      className="w-full flex justify-start items-center gap-1 cursor-pointer"
                      onClick={() => router.push(`/devices/${data?._id}`)}
                    >
                      <img
                        src={
                          data?.deviceDetails?.image ??
                          "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                        }
                        alt="Device Logo"
                        className="border size-10 rounded-full object-contain"
                      />
                      <div>{data?.deviceDetails?.custom_model ?? "-"}</div>
                    </div>
                  ),
                },
                {
                  title: "Serial Number",
                  render: (data: Issues) => (
                    <div className="w-full flex justify-start items-center gap-1">
                      <div>{data?.deviceDetails?.serial_no ?? "-"}</div>
                    </div>
                  ),
                },
                // {
                //   title: "Raised by",
                //   render: (data: Issues) => (
                //     <div className="w-full flex justify-start items-center gap-1">
                //       <div>
                //         {data?.openedByDetails?.first_name ?? "-"}
                //       </div>
                //     </div>
                //   ),
                // },
                {
                  title: "Ticket Type",
                  dataIndex: "category",
                },
                {
                  title: "Severity",
                  render: (data: Issues) =>
                    data?.severity === "Critical" ? (
                      <div className="font-gilroySemiBold flex items-center justify-center py-1 px-2 w-fit  text-xs text-[#FF0000] bg-[#FED9D9] rounded-full">
                        Critical
                      </div>
                    ) : data?.severity === "Low" ? (
                      <div className="font-gilroySemiBold flex items-center justify-center py-1 px-2 w-fit  text-xs text-[#027A48] bg-[#ECFDF3] rounded-full">
                        Low
                      </div>
                    ) : (
                      <div className="font-gilroySemiBold flex items-center justify-center py-1 px-2 w-fit  text-xs bg-[#FFFACB] text-[#FF8000] rounded-full">
                        Medium
                      </div>
                    ),
                },
                {
                  title: "Ticket Status",
                  render: (data: Issues) =>
                    data?.closedAt ? (
                      <div className="font-gilroySemiBold flex items-center justify-center py-1 px-2 w-fit  text-xs text-[#FF0000] bg-[#FED9D9] rounded-full">
                        Closed
                      </div>
                    ) : (
                      <div className="font-gilroySemiBold flex items-center justify-center py-1 px-2 w-fit  text-xs text-[#027A48] bg-[#ECFDF3] rounded-full">
                        Open
                      </div>
                    ),
                },
                {
                  title: "",
                  render: (data: Issues) => (
                    <div
                      className="cursor-pointer mx-6"
                      onClick={() =>
                        router.push(`/devices/issues/${data?._id}`)
                      }
                    >
                      <ChevronRight className="text-[#82898e]" />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmpIssueTable;
