"use client";
import { useState } from "react";
import { Table } from "@/components/wind/Table";
import { IssueResponse, Issues } from "@/server/issueActions";
import { useRouter } from "next/navigation";
import { issueIcons } from "../icons";
import TicketsClosedHeader from "./tickets-closed.header";
import { IssueStatusChange } from "./issue-status-change";
import { closedIssues } from "@/server/filterActions";
import Pagination from "@/app/(root)/teams/_components/pagination";

export default function ClosedIssueTable({
  data,
  setIssues,
  onRefresh,
}: {
  data: IssueResponse | null;
  setIssues: React.Dispatch<React.SetStateAction<IssueResponse | null>>;
  onRefresh?: () => Promise<void>;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await closedIssues({ page });
      setIssues(res);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to Fetch Issues");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[33px] border border-[#C3C3C34F] p-3 bg-white/80 backdrop-blur-[22.8px]  flex flex-col gap-5">
        {!isLoading && data?.issues?.length === 0 ? (
          <div className="flex flex-col gap-6 justify-center items-center py-10">
            <issueIcons.no_issues_icon />
          </div>
        ) : (
          <div className="rounded-[21px] border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col ">
            <TicketsClosedHeader data={data} />
            <Table
              data={data?.issues ?? []}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              isLoading={isLoading}
              checkboxSelection={{
                uniqueField: "_id",
                //logic yet to be done
                onSelectionChange: handleSelectionChange,
              }}
              columns={[
                {
                  title: "Device",
                  render: (data: Issues) => (
                    <div
                      className="w-full flex justify-start items-center gap-2 cursor-pointer"
                      onClick={() => router.push(`/tickets/${data?._id}`)}
                    >
                      <img
                        src={
                          data?.deviceDetails?.image?.[0]?.url ??
                          "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                        }
                        alt="Device Logo"
                        className=" size-10 rounded-full"
                      />
                      <div>{data?.deviceDetails?.custom_model ?? "-"}</div>
                    </div>
                  ),
                },

                {
                  title: "Serial number",
                  render: (data: Issues) => (
                    <div className="w-full flex justify-start items-center gap-1">
                      <div>{data?.deviceDetails?.serial_no ?? "-"}</div>
                    </div>
                  ),
                },
                {
                  title: "Issued Id",
                  render: (record: Issues) => (
                    <div>{record?.issueId ?? "-"}</div>
                  ),
                },

                {
                  title: "Raised by",
                  render: (record) => <div>{record?.userName ?? "-"}</div>,
                },
                {
                  title: "Closed on",
                  render: (data: Issues) => {
                    const updateIssue = data?.updatedAt!;

                    // Check if updateIssue is null, undefined, or empty
                    if (!updateIssue) {
                      return <div>-</div>; // Return "-" for null, undefined, or empty value
                    }

                    const date = new Date(updateIssue);

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
                  title: "Issue type",
                  render: (record) => <div>{record?.title ?? "-"}</div>,
                },
                {
                  title: "Closed by",
                  render: (record) => <div>{record?.status ?? "-"}</div>,
                },

                {
                  title: "Actions",
                  render: (record: Issues) => (
                    <IssueStatusChange
                      id={record?._id!}
                      issueData={record}
                      reOpen={true}
                      onRefresh={onRefresh}
                    >
                      <div className="rounded-full text-white bg-black font-gilroySemiBold text-sm py-1.5 px-5">
                        Reopen
                      </div>
                    </IssueStatusChange>
                  ),
                },
              ]}
            />
            {/* Pagination Control */}
            <div className="mt-2">
              <Pagination
                current_page={currentPage}
                total_pages={data?.total_pages!}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
