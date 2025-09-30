"use client";
import { buttonVariants } from "@/components/buttons/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/wind/Table";
import React, { Suspense } from "react";
import { InvoiceDownload } from "./invoice-download-sheet";
import { UploadInvoiceSheet } from "./upload-invoice-sheet";
import { useDownloadInvoice } from "@/hooks/useDownloadActions";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Edit04Icon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { downloadAttachmentsAsZip, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AltIntegration } from "../../_components/icons";

const InvoicesTable = ({
  invoices,
  loading,
  startDate,
  endDate,
  setSelectedIds,
  status,
  selectedIds,
  handleSelectionChange,
  invoicesAmount,
}: {
  invoices: any;
  loading: boolean;
  status: any;
  startDate: Date | string | null;
  endDate: Date | string | null;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  handleSelectionChange: (ids: string[]) => void;
  invoicesAmount: number;
}) => {
  // console.log(selectedIds);
  const router = useRouter();

  const handleSingleDownload = async (url: string | undefined) => {
    if (!url) {
      // console.error("No URL provided for download.");
      return;
    }

    // console.log(url);

    try {
      const response = await fetch(url, {
        mode: "cors",
        // headers: {
        //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZmOTRmMWMzOGQyZjFhZDE5YmNhOWIiLCJvcmdJZCI6IjY3OGExYTEwOTU5Y2Y3MmFiM2I2NjA2OCIsInJvbGUiOjMsImlhdCI6MTc0ODg2ODMyNywiZXhwIjoxNzUxNDYwMzI3fQ.Gyz2E67KcyMwCc-NIEBMqRvcw4aQROgEbiIhhZ_Px2g`,
        // },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;

      // Optional: extract file name
      const filename = url.split("/").pop() || "download";
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement("a");
      link.href = url;

      const filename = url.split("/").pop() || "download";

      link.download = filename; // Suggest filename to browser
      link.target = "_blank"; // Opens in new tab (in case browser blocks auto-download)

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewInvoice = (invoiceUrl: string) => {
    if (!invoiceUrl) {
      toast.error("No invoice URL provided.");
      return;
    }

    try {
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
      //   toast.success("Invoice opened in a new tab!");
    } catch (error) {
      // console.error("Failed to open invoice:", error);
      toast.error("Failed to open invoice.");
    }
  };

  if (status !== "pending" && (!invoices || invoices.length === 0)) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center pt-2 pb-4">
        <img
          src="/media/no_data/no-invoice.svg"
          alt="No-Invoice Image"
          width={500}
          height={500}
        />
      </div>
    );
  }

  // console.log(invoices);

  return (
    <>
      <div className="rounded-lg border border-gray-200  bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
        {" "}
        <div className="flex justify-between items-center">
          <h1 className="text-base pl-6 font-gilroyMedium">Invoices</h1>

          <div className="text-[#888] text-sm font-gilroyMedium flex items-center gap-2 pr-6">
            Total:{" "}
            <span className="text-[#101828] text-lg font-gilroySemiBold">
              ₹{formatNumber(invoicesAmount)}
            </span>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col gap-2">
            <Table
              data={invoices}
              selectedIds={[]}
              isLoading={status === "pending"}
              setSelectedIds={setSelectedIds}
              // checkboxSelection={{
              //   uniqueField: "integrationId",
              //   onSelectionChange: handleSelectionChange,
              // }}
              columns={[
                {
                  title: "Integrations",
                  render: (record: any) => {
                    if (record?.platform) {
                      return (
                        <div
                          className="flex gap-3 text-sm items-center text-black font-gilroyMedium cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/integrations/installed/${record?.platform}`
                            );
                          }}
                        >
                          {record.companyLogo ? (
                            <img
                              src={record?.companyLogo}
                              className="size-8 rounded-md"
                            />
                          ) : (
                            <AltIntegration className="size-8" />
                          )}
                          <div>{record?.platform}</div>
                        </div>
                      );
                    }
                  },
                },
                {
                  title: "Invoice number",
                  render: (record, _, isExpanded) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      return (
                        <div className="flex flex-col text-sm gap-1 text-black font-gilroyMedium">
                          {record?.invoices?.length} invoices
                        </div>
                      );
                    }

                    if (record?.invoices?.length === 1) {
                      return (
                        <div className="text-black text-sm font-gilroyMedium">
                          {record?.invoices?.[0]?.invoiceNumber ?? "-"}
                        </div>
                      );
                    }
                    if (!isExpanded && record?.invoices?.length > 1) {
                      return (
                        <div className="flex flex-col text-sm gap-1 text-black font-gilroyMedium">
                          {record?.invoices?.length} invoices
                        </div>
                      );
                    }

                    return (
                      <div className="text-gray-500 text-sm font-gilroyMedium">
                        {record?.invoices?.[0]?.invoiceNumber ??
                          record?.invoiceNumber ??
                          "-"}
                      </div>
                    );
                  },
                },
                {
                  title: "Billing Date",
                  render: (record) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      // Extract all valid dates from invoices
                      const validDates = record.invoices
                        .map((invoice) => new Date(invoice.invoiceDate))
                        .filter((date) => !isNaN(date.getTime()))
                        .sort((a, b) => a.getTime() - b.getTime());

                      if (validDates.length === 0) return <div>-</div>;

                      // Format the earliest and latest dates
                      const formatDate = (date: Date) => {
                        return date
                          .toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                          .replace(" ", "'");
                      };

                      const earliestDate = formatDate(validDates[0]);
                      const latestDate = formatDate(
                        validDates[validDates.length - 1]
                      );

                      // Only show range if dates are different
                      if (earliestDate === latestDate) {
                        return <div className="text-sm">{earliestDate}</div>;
                      }

                      return (
                        <div className="text-sm">{`${earliestDate} - ${latestDate}`}</div>
                      );
                    }

                    // Handle single invoice case
                    const invoiceDate =
                      record?.invoices?.[0]?.invoiceDate || record?.invoiceDate;
                    if (!invoiceDate) return <div>-</div>;

                    const date = new Date(invoiceDate);
                    if (isNaN(date.getTime())) return <div>-</div>;

                    const formattedDate = date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return <div className="text-sm">{formattedDate}</div>;
                  },
                },

                {
                  title: "Uploaded By",
                  render: (record) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      // Get all unique uploaders
                      const uploaders = [
                        ...new Set(
                          record?.invoices
                            .map((invoice) => invoice?.uploaded_by)
                            .filter(Boolean)
                        ),
                      ];

                      if (uploaders?.length === 0) {
                        return <div>-</div>;
                      }

                      // For collapsed view with multiple uploaders
                      return (
                        <div className="flex items-center">
                          <span className="text-sm">
                            {String(uploaders[0])}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            {uploaders?.length > 1 &&
                              `+${uploaders?.length - 1} more`}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div className="text-sm">
                        {record?.invoices?.[0]?.uploaded_by ??
                          record?.uploaded_by ??
                          "-"}
                      </div>
                    );
                  },
                },

                {
                  title: "Invoice Amount",
                  render: (record, _, isExpanded) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      const totalAmount = record.invoices.reduce(
                        (sum, invoice) => {
                          return sum + (invoice?.invoiceAmount || 0);
                        },
                        0
                      );
                      return (
                        <div className="font-gilroyMedium text-sm">
                          ₹{formatNumber(totalAmount)}
                        </div>
                      );
                    }

                    // For single invoice or expanded view, show individual amount
                    return (
                      <div className="font-gilroyMedium text-sm">
                        {record?.invoiceAmount
                          ? `₹${formatNumber(record?.invoiceAmount)}`
                          : record?.invoices?.[0]?.invoiceAmount
                          ? `₹${formatNumber(
                              record?.invoices?.[0]?.invoiceAmount
                            )}`
                          : "-"}
                      </div>
                    );
                  },
                },

                {
                  title: "",
                  render: (
                    record,
                    _,
                    isExpanded,
                    { setExpandedRows, rowId }
                  ) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      return (
                        <div className="w-full flex justify-center items-center">
                          <div
                            className={buttonVariants({
                              variant: "outlineTwo",
                              className: "w-fit",
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRows((prev) => {
                                const newSet = new Set(prev);
                                if (newSet.has(rowId)) {
                                  newSet.delete(rowId);
                                } else {
                                  newSet.add(rowId);
                                }
                                return newSet;
                              });
                            }}
                          >
                            {/* {isExpanded ? "View Less" : "View More"} */}
                            {isExpanded ? (
                              <p className="flex items-center gap-1 font-gilroyMedium px-0.5">
                                View Less{" "}
                                <HugeiconsIcon
                                  icon={ArrowUp01Icon}
                                  className="text-[#B3B3B3]"
                                />
                              </p>
                            ) : (
                              <p className="flex items-center gap-1 font-gilroyMedium">
                                View More{" "}
                                <HugeiconsIcon
                                  icon={ArrowDown01Icon}
                                  className="text-[#B3B3B3]"
                                />
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    } else if (record?.invoices?.length === 1) {
                      return (
                        <div className="w-full flex justify-center items-center">
                          {!record?.invoices?.[0]?.invoiceUrl ? (
                            <UploadInvoiceSheet
                              record={record}
                              startDate={startDate}
                            >
                              <div
                                className={`${buttonVariants({
                                  variant: "outlineTwo",
                                  className: "w-fit",
                                })} px-6`}
                              >
                                <HugeiconsIcon icon={Upload02Icon} /> Upload
                              </div>
                            </UploadInvoiceSheet>
                          ) : (
                            <div
                              className={`${buttonVariants({
                                variant: "outlineTwo",
                                className: "w-fit",
                              })} px-5`}
                              onClick={() =>
                                viewInvoice(record?.invoices?.[0]?.invoiceUrl)
                              }
                            >
                              View Invoice
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-full flex justify-center items-center">
                          {!record?.invoiceUrl ? (
                            <UploadInvoiceSheet
                              record={record}
                              startDate={startDate}
                            >
                              <div
                                className={`${buttonVariants({
                                  variant: "outlineTwo",
                                  className: "w-fit",
                                })} px-6`}
                              >
                                <HugeiconsIcon icon={Upload02Icon} /> Upload
                              </div>
                            </UploadInvoiceSheet>
                          ) : (
                            <div
                              className={`${buttonVariants({
                                variant: "outlineTwo",
                                className: "w-fit",
                              })} px-5`}
                              onClick={() => viewInvoice(record?.invoiceUrl)}
                            >
                              View Invoice
                            </div>
                          )}
                        </div>
                      );
                    }
                  },
                },
                {
                  title: "",
                  render: (record) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      return (
                        <div className="w-full flex justify-center items-center">
                          <div
                            className={buttonVariants({
                              variant: "outlineTwo",
                              className: "w-fit",
                            })}
                            onClick={async () => {
                              // console.log(record?.invoice_url)
                              const invoiceUrls: string[] = record?.invoices
                                .filter((invoice) => invoice?.invoiceUrl)
                                .map((invoice) => invoice?.invoiceUrl);

                              // console.log(invoiceUrls);

                              if (invoiceUrls?.length > 0) {
                                await downloadAttachmentsAsZip(invoiceUrls);
                              }
                            }}
                          >
                            Download All
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="w-full flex justify-center items-center">
                        <div
                          className={`${buttonVariants({
                            variant: "outlineTwo",
                            className: "w-fit",
                          })} px-6`}
                          onClick={() =>
                            // console.log(record?.invoice_url)
                            handleSingleDownload(
                              record?.invoices?.length === 1
                                ? record?.invoices?.[0]?.invoiceUrl
                                : record?.invoiceUrl
                            )
                          }
                        >
                          Download
                        </div>
                      </div>
                    );
                  },
                },
                {
                  title: "",
                  render: (record) => {
                    if (record?.platform && record?.invoices?.length > 1) {
                      return (
                        <div className="w-full flex justify-center items-center"></div>
                      );
                    }
                    return (
                      <div className="w-full flex justify-center items-center pr-4 cursor-pointer">
                        {record?.invoiceDate ? (
                          <UploadInvoiceSheet
                            isEdit={true}
                            record={record}
                            startDate={startDate}
                          >
                            <HugeiconsIcon
                              icon={Edit04Icon}
                              className="size-4 text-blue-500"
                            />
                          </UploadInvoiceSheet>
                        ) : record?.invoices?.[0]?.invoiceDate ? (
                          <UploadInvoiceSheet
                            isEdit={true}
                            record={record}
                            startDate={startDate}
                          >
                            <HugeiconsIcon
                              icon={Edit04Icon}
                              className="size-4 text-blue-500"
                            />
                          </UploadInvoiceSheet>
                        ) : null}
                      </div>
                    );
                  },
                },
              ]}
              collapsible={{
                nestedDataField: "invoices",
                expandColumnIndex: 1, // This should match the column index you want the expand icon to appear in
                renderNestedData: (invoice, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 w-full gap-4 p-4"
                  >
                    <div className="flex gap-3 items-center text-black font-gilroyMedium">
                      <img src={invoice?.companyLogo} className="size-8" />
                      <div>{invoice?.platform}</div>
                    </div>
                    <div className="text-black font-gilroyMedium">
                      {invoice?.invoiceNumber ?? "-"}
                    </div>
                    <div>
                      {invoice.invoiceDate
                        ? new Date(invoice?.invoiceDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </div>
                    <div>{invoice?.uploaded_by ?? "-"}</div>
                    <div className="font-gilroyMedium text-sm">
                      ₹{invoice?.invoiceAmount ?? "-"}
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default InvoicesTable;
