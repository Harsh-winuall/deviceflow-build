"use client";
import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { useQueryState } from "nuqs";
import React, { useDeferredValue, useEffect, useState } from "react";
import InvoicesTable from "./invoices-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInvoices } from "@/server/integrationActions";
import { InvoiceDownload } from "./invoice-download-sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Upload02Icon } from "@hugeicons/core-free-icons";
import { DataSelectSheet } from "./date-select-sheet";
import { MultipleSelectDropdown } from "@/components/dropdown/multi-select-dropdown";
import {
  RadioSelect,
  RadioSelectContent,
  RadioSelectGroup,
  RadioSelectItem,
  RadioSelectTrigger,
  RadioSelectValue,
} from "@/components/ui/select-radio";
import { UploadInvoiceSheet } from "./upload-invoice-sheet";
import { useDebounce } from "@/hooks/use-debounce";

const InvoicesMain = () => {
  const [rawSearch, setRawSearch] = useQueryState("searchQuery", {
    defaultValue: "",
  });
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const searchTerm = useDeferredValue(rawSearch);
  const debouncedInput = useDebounce(searchTerm, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Format date as YYYY-MM-01 (always first day of month)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}-01`;
  };

  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  // Financial year calculation (April 1 to March 31)
  const getFinancialYearDates = (yearOffset = 0) => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    let fyStartYear, fyEndYear;

    if (currentMonth >= 3) {
      // April or later
      fyStartYear = currentYear + yearOffset;
      fyEndYear = currentYear + 1 + yearOffset;
    } else {
      // January-March
      fyStartYear = currentYear - 1 + yearOffset;
      fyEndYear = currentYear + yearOffset;
    }

    return {
      start: new Date(fyStartYear, 3, 1), // April 1
      end: new Date(fyEndYear, 2, 31), // March 31
    };
  };

  const currentFY = getFinancialYearDates();
  const previousFY = getFinancialYearDates(-1);

  // Initialize dates with first day of month format
  const [startDate, setStartDate] = useState<string>(formatDate(today));
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  // Radio options with date ranges
  const dateOptions = [
    {
      value: "currentMonth",
      label: "Current Month",
      getDates: () => ({
        start: formatDate(currentMonthStart),
        end: formatDate(today),
      }),
    },
    {
      value: "lastMonth",
      label: "Last Month",
      getDates: () => ({
        start: formatDate(lastMonthStart),
        end: formatDate(
          new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            new Date(today.getFullYear(), today.getMonth(), 0).getDate()
          )
        ),
      }),
    },
    {
      value: "last6Months",
      label: "Last 6 Months",
      getDates: () => ({
        start: formatDate(sixMonthsAgo),
        end: formatDate(today),
      }),
    },
    {
      value: "currentFY",
      label: `Current FY (${currentFY.start.getFullYear()}-${currentFY.end
        .getFullYear()
        .toString()
        .slice(2)})`,
      getDates: () => ({
        start: formatDate(currentFY.start),
        end: formatDate(currentFY.end),
      }),
    },
    {
      value: "previousFY",
      label: `Previous FY (${previousFY.start.getFullYear()}-${previousFY.end
        .getFullYear()
        .toString()
        .slice(2)})`,
      getDates: () => ({
        start: formatDate(previousFY.start),
        end: formatDate(previousFY.end),
      }),
    },
  ];

  const [selectedDateOption, setSelectedDateOption] = useState<string | null>(
    "currentMonth"
  );

  const handleDateOptionChange = (value: string) => {
    const option = dateOptions.find((opt) => opt.value === value);
    if (option) {
      const { start, end } = option.getDates();
      setStartDate(start);
      setEndDate(end);
      setSelectedDateOption(value);
      setPage(1); // Reset to first page when date range changes
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );

  const { data, status } = useQuery({
    queryKey: [
      "fetch-invoices",
      {
        searchQuery: debouncedInput,
        integrationIds: selectedIntegrations,
        page,
        pageLimit,
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      fetchInvoices({
        searchQuery: debouncedInput,
        integrationIds: selectedIntegrations,
        page,
        pageLimit: 10000000000,
        startDate,
        endDate,
      }),
    refetchOnWindowFocus: false,
  });

  // console.log(data);

  // console.log(selectedIntegrations);

  const availableIntegrations: any[] =
    data?.availableIntegrations?.reduce(
      (unique: Array<{ icon: string; label: string; value: string }>, item) => {
        if (!unique.some((entry) => entry.value === item?._id)) {
          unique.push({
            icon: item?.companyLogo,
            label: item?.platformName,
            value: item?._id,
          });
        }
        return unique;
      },
      []
    ) || [];

  const [errors, setErrors] = useState<{ integrations: string }>({
    integrations: "",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawSearch(e.target.value);
    setPage(1);
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  const transformedIntegrations = () => {
    const integrationsWithInvoices = data?.integrations || [];

    const filteredAvailableIntegrations =
      selectedIntegrations.length > 0
        ? data?.availableIntegrations?.filter((availInt) =>
            selectedIntegrations.includes(availInt._id)
          ) || []
        : data?.availableIntegrations || [];

    // Find available integrations that don't have invoices in the results
    const availableIntegrationsWithoutInvoices =
      filteredAvailableIntegrations.filter(
        (availInt) =>
          !integrationsWithInvoices.some((int) => int._id === availInt._id)
      );

    // Convert available integrations without invoices to the same format but with empty invoices
    const emptyInvoiceIntegrations = availableIntegrationsWithoutInvoices.map(
      (availInt) => ({
        ...availInt,
        platform: availInt.platformName,
        invoices: [
          {
            _id: availInt._id,
            invoiceUrl: "",
            invoiceNumber: "",
            invoiceDate: "",
            uploaded_by: "",
            invoiceAmount: 0,
          },
        ],
      })
    );

    const allIntegrations = [
      ...integrationsWithInvoices,
      ...emptyInvoiceIntegrations,
    ];

    // Apply client-side search filtering if there's a search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return allIntegrations.filter((integration) => {
        // Check if platform name matches
        if (integration.platform?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Check if any invoice matches (for integrations with actual invoices)
        if (
          integration.invoices?.some((invoice) => {
            return (
              invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
              invoice.uploaded_by?.toLowerCase().includes(searchLower)
            );
          })
        ) {
          return true;
        }

        return false;
      });
    }

    return allIntegrations;
  };

  return (
    <section className="w-full h-fit space-y-4 relative overflow-hidden">
      <ActionBar key={`diagnostics-action-bar`}>
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <MultipleSelectDropdown
              loading={status === "pending"}
              label=""
              value={selectedIntegrations}
              options={availableIntegrations}
              onSelect={(values) => {
                setSelectedIntegrations(values);
                setErrors((prev) => ({ ...prev, integrations: "" }));
              }}
              placeholder={
                availableIntegrations.length === 0
                  ? "No integrations "
                  : "Choose integrations"
              }
              disabled={availableIntegrations.length === 0}
              className="w-[190px]"
            />

            <RadioSelect
              value={selectedDateOption || ""}
              onValueChange={handleDateOptionChange}
            >
              <RadioSelectTrigger className="w-fit font-gilroyMedium">
                <RadioSelectValue placeholder="Quick Filters" />
              </RadioSelectTrigger>
              <RadioSelectContent className="font-gilroyMedium">
                <RadioSelectGroup>
                  {dateOptions.map((option) => (
                    <RadioSelectItem
                      key={option.value}
                      value={option.value}
                      selected={selectedDateOption === option.value}
                      className="hover:bg-white/0"
                    >
                      {option.label}
                    </RadioSelectItem>
                  ))}
                </RadioSelectGroup>
              </RadioSelectContent>
            </RadioSelect>

            <DataSelectSheet
              startDate={startDate}
              endDate={endDate}
              onDatesChange={(newStartDate, newEndDate) => {
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                // Reset to first page when date range changes
                setPage(1);
                // Update the selected date option to 'custom' or similar if you have that option
                setSelectedDateOption("");
              }}
            >
              <div
                className={`border border-[#E5E5E5] rounded-[5px] flex gap-3 px-4 py-[19px] items-center flex-nowrap ${buttonVariants(
                  {
                    variant: "outlineTwo",
                  }
                )}`}
              >
                <span className="text-sm font-gilroyMedium text-nowrap">
                  Filter Date
                </span>
                <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
              </div>
            </DataSelectSheet>
          </div>

          <div className="flex items-center gap-2">
            <ActionSearchBar
              placeholder="Search invoices"
              value={rawSearch ?? ""}
              onChange={handleSearchChange}
              className="placeholder:text-[#E5E5E5]"
            />
            {/* <InvoiceDownload
              startDate={startDate}
              endDate={endDate}
              items={data?.integrations || []}
              availableIntegrations={availableIntegrations}
            >
              <div
                // onClick={handleDownloadAll}
                className={buttonVariants({
                  variant: "outlineTwo",
                  className: "w-full",
                })}
              >
                Download Zip
              </div>
            </InvoiceDownload> */}

            <UploadInvoiceSheet
              availableIntegrations={availableIntegrations}
              startDate={startDate}
            >
              <div
                // onClick={handleDownloadAll}
                className={buttonVariants({
                  variant: "primary",
                  className: "w-full",
                })}
              >
                <HugeiconsIcon icon={Upload02Icon} /> Upload
              </div>
            </UploadInvoiceSheet>
          </div>
        </div>
      </ActionBar>

      {/* {JSON.stringify(data)} */}

      <InvoicesTable
        invoices={transformedIntegrations() || []}
        invoicesAmount={data?.totalInvoiceAmount}
        loading={isLoading}
        startDate={startDate}
        endDate={endDate}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        handleSelectionChange={handleSelectionChange}
        status={status}
      />

      {/* {status === "pending" ? (
        <PaginationSkeleton className="mt-3" />
      ) : (
        <Pagination
          page={page}
          pageLimit={pageLimit}
          total={data?.total || 0}
          totalPages={data?.total_pages || 1}
          items={data?.integrations || []}
          onPageChange={setPage}
          onPageLimitChange={(l) => {
            setPageLimit(l);
            setPage(1);
          }}
          className="mt-4"
        />
      )} */}
    </section>
  );
};

export default InvoicesMain;
