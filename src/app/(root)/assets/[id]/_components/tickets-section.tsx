import { buttonVariants } from "@/components/buttons/Button";
import { Table } from "@/components/wind/Table";
import Link from "next/link";

const TicketsTable = ({ data }: { data: any[] }) => {
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
    <div className="mx-5 h-[60dvh] hide-scrollbar overflow-auto ">
      <Table
        data={data}
        selectedIds={[]}
        setSelectedIds={() => {}}
        columns={[
          {
            title: "Ticket ID",
            render: (record) => (
              <div className="font-gilroySemiBold text-sm text-black truncate">
                {record?.code}
              </div>
            ),
          },
          {
            title: "Severity",
            render: (record) => {
              const severity = record?.severity?.toLowerCase();
              if (severity === "critical") {
                return (
                  <h1 className="px-2 w-fit py-1 font-gilroyMedium flex text-xs rounded-full bg-alert-foreground text-failure">
                    Critical
                  </h1>
                );
              } else if (severity === "medium") {
                return (
                  <h1 className="px-2 w-fit py-1 font-gilroyMedium flex text-xs rounded-full bg-[#FFFACB] text-[#FF8000]">
                    Medium
                  </h1>
                );
              } else if (severity === "low") {
                return (
                  <h1 className="px-2 py-1 w-fit font-gilroyMedium flex text-xs rounded-full bg-success-foreground text-success-second">
                    Low
                  </h1>
                );
              } else {
                return <h1>-</h1>;
              }
            },
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
            title: "State",
            render: (record) => (
              <div className="w-full flex justify-start">
                {record?.status?.toLowerCase() === "closed" ? (
                  <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-alert-foreground text-failure">
                    Closed
                  </h1>
                ) : record?.status?.toLowerCase() === "open" ? (
                  <h1 className="px-2 py-1 justify-center items-center font-gilroyMedium flex text-xs rounded-full bg-success-foreground text-success-second">
                    Open
                  </h1>
                ) : (
                  <h1>-</h1>
                )}
              </div>
            ),
          },

          {
            title: "",
            render: (record) => (
              <Link
                href={`/tickets/${record._id}`}
                className={buttonVariants({ variant: "outlineTwo" })}
                style={{ cursor: "pointer" }}
              >
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default TicketsTable;
