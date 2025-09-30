"use client";
import { buttonVariants } from "@/components/buttons/Button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/wind/Table";
import { User03Icon, UserGroup03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import TicketsClosedHeader from "./tickets-closed.header";
import TicketsOpenHeader from "./tickets-open.header";
import { FilterTicketsResponse } from "@/server/types/newFilterTypes";

interface TicketsTableDisplayProps {
  data: FilterTicketsResponse;
  countIssues?: any;
  setIssues?: (data: any) => void;
  onRefresh?: () => Promise<void>;
  issuesText?: string;
  status?: string;
  isAdmin: boolean;
}

function TicketsDataTable({
  data,
  issuesText,
  status,
  isAdmin,
}: TicketsTableDisplayProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      {status !== "pending" && data?.tickets.length === 0 ? (
        <div className="flex  font-gilroySemiBold flex-col  gap-6 justify-center items-center py-10">
          <img src="/media/no_data/issue.svg" alt="No-Issue Logo" />
        </div>
      ) : (
        <div className="rounded-lg border  bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
          {status === "pending" ? (
            <div className="flex gap-3 ml-4">
              <Skeleton className="text-base pl-6 h-6 w-32" />
              <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full   h-6 w-16" />
              <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full  h-6 w-20" />
              <Skeleton className="px-2 justify-center items-center font-gilroyMedium flex text-xs rounded-full   h-6 w-24" />
            </div>
          ) : (
            <>
              {issuesText?.toLowerCase().includes("open") ? (
                <TicketsOpenHeader countIssues={data} />
              ) : (
                <TicketsClosedHeader data={data} />
              )}
            </>
          )}

          <div className="flex flex-col">
            <Table
              data={data?.tickets ?? []}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              isLoading={status === "pending"}
              columns={[
                {
                  title: "Ticket Id",
                  render: (record) => (
                    <Link
                      href={`/tickets/${record?._id}`}
                      className="text-black"
                    >
                      {record?.code ?? "-"}
                    </Link>
                  ),
                },
                {
                  title: "Ticket Severity",
                  render: (data) => (
                    <div className="w-full flex justify-start">
                      <div>
                        {data?.severity === "Critical" ? (
                          <Badge className="bg-alert-foreground text-failure">
                            Critical
                          </Badge>
                        ) : data?.severity === "Medium" ? (
                          <Badge className="bg-[#FFFACB] text-[#FF8000]">
                            Medium
                          </Badge>
                        ) : data?.severity === "Low" ? (
                          <Badge className="bg-success-foreground text-success-second">
                            Low
                          </Badge>
                        ) : (
                          <div>-</div>
                        )}
                      </div>
                    </div>
                  ),
                },

                ...(isAdmin
                  ? [
                      {
                        title: "Opened by",
                        render: (record) => (
                          <div>
                            {record?.openedByDetails?.first_name ?? "-"}
                          </div>
                        ),
                      },
                    ]
                  : []),

                {
                  title: issuesText?.toLowerCase().includes("open")
                    ? "Raised on"
                    : "Closed on",
                  render: (record) => {
                    if (issuesText?.toLowerCase().includes("open")) {
                      const onboardingDate = record?.openedOn;

                      if (!onboardingDate) {
                        return <div>-</div>;
                      }

                      const date = new Date(onboardingDate);

                      if (isNaN(date.getTime())) {
                        return <div>-</div>;
                      }

                      const formattedDateTime = date.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return <div>{formattedDateTime}</div>;
                    } else {
                      const updateIssue = record?.closedAt;

                      if (!updateIssue) {
                        return <div>-</div>;
                      }

                      const date = new Date(updateIssue);

                      if (isNaN(date.getTime())) {
                        return <div>-</div>;
                      }

                      const formattedDateTime = date.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return <div>{formattedDateTime}</div>;
                    }
                  },
                },
                {
                  title: "Assigned To",
                  render: (record) => {
                    const opts = record?.assignedTo || [];
                    const first = opts.slice(0, 1);
                    const remaining = opts.length > 1 ? opts.length - 1 : 0;

                    return (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {opts?.length === 0 && (
                          <span className="text-center">-</span>
                        )}
                        {first.map((o) => (
                          <span
                            key={o?.userId || o?.teamId}
                            className="inline-flex text-[13px] items-center px-2 py-1 gap-1 bg-[#EEF7FF] text-[#025CE5] font-gilroyMedium rounded-md"
                          >
                            {o?.teamId ? (
                              <HugeiconsIcon
                                icon={UserGroup03Icon}
                                className="text-[#025CE5] size-4"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={User03Icon}
                                className="text-[#025CE5] size-4"
                              />
                            )}
                            {o?.first_name || o?.title}
                          </span>
                        ))}
                        {remaining > 0 && (
                          <span className="font-gilroyMedium text-xs">
                            +{remaining} More
                          </span>
                        )}
                      </div>
                    );
                  },
                },
                {
                  title: "Ticket type",
                  render: (record) => <div>{record?.category ?? "-"}</div>,
                },
                {
                  title: "",
                  render: (record) => (
                    <Link
                      href={`/tickets/${record?._id}`}
                      className={`${buttonVariants({
                        variant: "outlineTwo",
                      })} text-[13px]`}
                    >
                      View
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TicketsDataTable;
