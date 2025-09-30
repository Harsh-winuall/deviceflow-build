import ReportPreview from "@/app/(root)/diagnostic/_components/report-preview";
import { formatDate } from "@/app/(root)/people/[id]/_components/user-timeline-table";
import { buttonVariants } from "@/components/buttons/Button";
import { Table } from "@/components/wind/Table";
import React from "react";

const QCSection = ({ data }: { data: any }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center text-gray-500 p-4">
        <img
          src="/media/no-qc-report.webp"
          alt=""
          className="h-[450px] w-[380px]"
        />
      </div>
    );
  }
  return (
    <div className="mx-5 h-[60dvh] hide-scrollbar overflow-auto">
      <Table
        data={data ?? []}
        //   isLoading={isLoading}
        selectedIds={[]}
        setSelectedIds={(setSelectedIds) => {}}
        //   checkboxSelection={{
        //     uniqueField: "_id",
        //     onSelectionChange: setSelectedIds,
        //   }}
        columns={[
          {
            title: "S.No.",
            render: (record) => (
              <div className="font-gilroySemiBold text-sm text-black truncate">
                {record?.serial_no}
              </div>
            ),
          },
          {
            title: "Date",
            render: (record) => (
              <div>
                {formatDate(record?.date).split(",").slice(0, 2).join(",")}
              </div>
            ),
          },
          {
            title: "Scanned By",
            render: (record) => <div>{record?.scannedBy}</div>,
          },
          {
            title: "Score",
            render: (record) => <div>{record?.score ?? "-"}</div>,
          },
          {
            title: "Condition",
            render: (record) => {
              let color =
                record?.condition === "Excellent"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : record.condition === "Old"
                  ? "text-[#F00] bg-[#FFE0E0]"
                  : "text-[#FF8000] bg-[#FFFACB]";
              return record?.condition ? (
                <span className={`${color} px-3 py-1.5 rounded-full`}>
                  {record?.condition}
                </span>
              ) : (
                "-"
              );
            },
          },
          {
            title: "",
            render: (record) => (
              <ReportPreview id={record?._id}>
                <div
                  className={buttonVariants({ variant: "outlineTwo" })}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  View
                  {/* )} */}
                </div>
              </ReportPreview>
            ),
          },
        ]}
      />
    </div>
  );
};

export default QCSection;
