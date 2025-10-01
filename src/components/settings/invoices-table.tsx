import React from "react";
import { Table } from "../wind/Table";
import { formatDate } from "@/lib/utils";
import { Button } from "../buttons/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01FreeIcons,
  AlertDiamondIcon,
  CheckmarkBadge01Icon,
  Download01FreeIcons,
  Download01Icon,
} from "@hugeicons/core-free-icons";

const InvoicesComponent = ({ invoices }: { invoices: any }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <img
        src="/media/no_data/no_invoice.svg"
        alt="No Invoices"
        className="w-[70%] mt-2 mx-auto"
      />
    );
  }
  return (
    <div className="h-fit mb-8">
      <Table
        className="border xl:max-h-[40vh] h-fit lg:max-h-[80vh] rounded-md"
        data={invoices}
        // isLoading={status === "pending"}
        selectedIds={[]}
        setSelectedIds={() => {}}
        columns={[
          {
            title: "Date",
            render: (record: any) => (
              <div className="text-xs ">
                {record?.createdAt
                  ? new Date(record?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </div>
            ),
          },
          {
            title: "Invoice No.",
            render: (record: any) => (
              <div className="text-xs">
                {(record?.invoiceNo).substring(0, 15)}
              </div>
            ),
          },

          {
            title: "Type",
            render: (record: any) => (
              <div className="text-xs text-nowrap">
                {record?.type === "Regular Invoice" ? "Regular" : record?.type}
              </div>
            ),
          },

          // {
          //   title: "Status",
          //   render: (record: any) => (
          //     <div className="text-xs flex gap-0.5 items-center">
          //       {record?.status === "Paid" ? (
          //         <HugeiconsIcon
          //           icon={CheckmarkBadge01Icon}
          //           color="white"
          //           fill="#0d9b00"
          //           size={16}
          //         />
          //       ) : (
          //         <HugeiconsIcon
          //           icon={Alert01FreeIcons}
          //           color="white"
          //           size={16}
          //           fill="#ffb200"
          //         />
          //       )}
          //       {record?.status}
          //     </div>
          //   ),
          // },

          {
            title: "",
            render: (record: any) => (
              <>
                {record?.status === "Paid" && (
                  <Button
                    variant="outlineTwo"
                    size="xs"
                    className=" font-gilroyMedium  text-[#6C6C6C] py-0"
                    onClick={() => {}}
                    //   disabled={isPending}
                  >
                    <img
                      src="/media/download-icon.svg"
                      width={16}
                      height={16}
                      alt="download-icon"
                    />
                  </Button>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default InvoicesComponent;
