import { buttonVariants } from "@/components/buttons/Button";
import { Table } from "@/components/wind/Table";
import { useRouter } from "next/navigation";
import React from "react";

const UserTicketsTable = ({ data }) => {
  const router = useRouter();
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center text-gray-500 p-4">
        <img
          src="/media/no-issue-reported.svg"
          alt=""
          className="size-[450px]"
        />
      </div>
    );
  }
  return (
    <div className="mx-5 h-[60dvh] overflow-auto ">
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
            title: "Ticket ID",
            render: (record) => (
              <div className="font-gilroySemiBold text-sm text-black truncate cursor-pointer" onClick={()=>{ router.push(`/tickets/${record?._id}`)}}>
                {record?.code}
              </div>
            ),
          },
          {
            title: "State",
            render: (record) => (
              <div className="w-full flex justify-start">
                <div>
                  {record?.status === "Closed" ? (
                    <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-alert-foreground text-failure">
                      Closed
                    </h1>
                  ) : record?.status === "Open" ? (
                    <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-success-foreground text-success-second">
                      Open
                    </h1>
                  ) : (
                    <h1>-</h1>
                  )}
                </div>
              </div>
            ),
          },
          {
            title: "Category",
            render: (record) => <div>{record?.category}</div>,
          },
          {
            title: "Opened By",
            render: (record) => <div>{record?.OpenedBy}</div>,
          },
          {
            title: "Severity",
            render: (record) => (
              <div className="w-full flex justify-start">
                <div>
                  {record?.severity === "Critical" ? (
                    <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-alert-foreground text-failure">
                      Critical
                    </h1>
                  ) : record?.severity === "Medium" ? (
                    <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-[#FFFACB] text-[#FF8000]">
                      Medium
                    </h1>
                  ) : record?.severity === "Low" ? (
                    <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-success-foreground text-success-second">
                      Low
                    </h1>
                  ) : (
                    <h1>-</h1>
                  )}
                </div>
              </div>
            ),
          },
          {
            title: "",
            render: (record) => (
              <div
                className={buttonVariants({
                  variant: "outlineTwo",
                })}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push(`/tickets/${record._id}`);
                }}
              >
                View
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserTicketsTable;
