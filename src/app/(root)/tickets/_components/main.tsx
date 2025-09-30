"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { FilterOptions, MoreFilters } from "@/components/filters/more-filters";
import { Pagination, PaginationSkeleton } from "@/components/pagination";
import { filterTickets } from "@/server/newFilterActions";
import {
  FilterSelection,
  FilterTicketsArgs,
} from "@/server/types/newFilterTypes";
import { useQueryState } from "nuqs";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import RaiseTicket from "./raise-ticket.dialog";
import TicketsDataTable from "./tickets-data.table";
import { useSession } from "@/lib/providers/session-provider";

function Main({ isAdmin = false }: { isAdmin: boolean }) {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "open",
  });
  const { session } = useSession();
  const [rawSearch, setRawSearch] = useQueryState("searchQuery", {
    defaultValue: "",
  });
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [filters, setFilters] = useState<FilterSelection>({});
  const [cachedFilterOptions, setCachedFilterOptions] = useState<FilterOptions>(
    {}
  );

  const searchTerm = useDeferredValue(rawSearch);

  const tupleFilters = useMemo(
    () =>
      Object?.entries(filters).flatMap(([k, vals]) =>
        vals.map((v) => [k, "Equals", v])
      ),
    [filters]
  );

  const { data, status } = useQuery({
    queryKey: [
      "fetch-all-tickets",
      {
        tab: activeTab,
        search: searchTerm,
        page,
        pageLimit,
        filters: tupleFilters,
      },
    ],
    queryFn: () =>
      filterTickets({
        type: activeTab as FilterTicketsArgs["type"],
        searchQuery: searchTerm,
        filters: tupleFilters,
        page,
        pageLimit,
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (
      status === "success" &&
      data?.filterOptions &&
      Object.keys(cachedFilterOptions).length === 0
    ) {
      setCachedFilterOptions(data.filterOptions);
    }
  }, [status, data, cachedFilterOptions]);

  const handleFilterChange = (newFilter: FilterSelection) => {
    setPage(1); // reset to first page
    setFilters(newFilter);
  };

  // console.log(data)

  return (
    <section className="w-full h-fit relative overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(tab) => {
          setRawSearch("");
          setPage(1);
          setPageLimit(20);
          setFilters({});
          setActiveTab(tab);
        }}
        defaultValue="open"
        className="w-full"
      >
        <ActionBar>
          <div className="flex gap-2">
            <Select
              value={activeTab}
              onValueChange={(tab) => {
                setRawSearch("");
                setPage(1);
                setPageLimit(20);
                setFilters({});
                setActiveTab(tab);
              }}
              defaultValue="open"
            >
              <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] ">
                <SelectValue placeholder="Tickets" />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem value="open" className="w-full py-2.5 rounded-lg">
                  Open Tickets
                </SelectItem>
                <SelectItem value="closed" className="w-full py-2.5 rounded-lg">
                  Closed Tickets
                </SelectItem>
              </SelectContent>
            </Select>
            {session?.user?.user?.role !== 1 && data?.tickets?.length !== 0 && (
              <MoreFilters
                filterOptions={cachedFilterOptions}
                loading={status === "pending"}
                key={activeTab}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              <ActionSearchBar
                placeholder="Search Tickets..."
                value={rawSearch}
                onChange={(e) => {
                  setRawSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <RaiseTicket>
              <div
                className={buttonVariants({
                  variant: "primary",
                  className: "w-full",
                })}
              >
                Raise a Ticket
              </div>
            </RaiseTicket>
          </div>
        </ActionBar>
        <TabsContent value="open">
          <TicketsDataTable
            isAdmin={isAdmin}
            data={data}
            status={status}
            issuesText="open"
            countIssues={data}
          />
        </TabsContent>
        <TabsContent value="closed">
          <TicketsDataTable
            isAdmin={isAdmin}
            data={data}
            status={status}
            issuesText="close"
            countIssues={data}
          />
        </TabsContent>
      </Tabs>
      {status === "pending" ? (
        <>
          <PaginationSkeleton className="mt-3" />
        </>
      ) : (
        <Pagination
          page={page}
          pageLimit={pageLimit}
          total={data?.total || 0}
          totalPages={data?.total_pages || 1}
          items={data?.tickets || []}
          onPageChange={setPage}
          onPageLimitChange={(l) => {
            setPageLimit(l);
            // setPage(1);
          }}
          className="mt-3"
        />
      )}
    </section>
  );
}

export default Main;
