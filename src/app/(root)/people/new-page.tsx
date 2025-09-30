"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { buttonVariants } from "@/components/buttons/Button";
import { FilterOptions, MoreFilters } from "@/components/filters/more-filters";
import { Pagination, PaginationSkeleton } from "@/components/pagination";

import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { Button } from "@/components/buttons/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterPeople } from "@/server/newFilterActions";
import type {
  FilterPeopleArgs,
  FilterSelection,
} from "@/server/types/newFilterTypes";
import { bulkDeleteUsers } from "@/server/userActions";
import { ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import BulkMove from "../teams/[id]/_components/new-bulk-move";
import InvitePeople from "./[id]/_components/invite-people";
import { DeleteModal } from "./_components/deleteUserModal";
import UserMain from "./_components/user-main";
import { useDebounce } from "@/hooks/use-debounce";

export const NewPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "active-users",
  });
  const [rawSearch, setRawSearch] = useQueryState("searchQuery", {
    defaultValue: "",
  });
  const [sortBy, setSortBy] = useState<"Ascending" | "Descending">("Ascending");

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  const [filters, setFilters] = useState<FilterSelection>({});
  const [cachedFilterOptions, setCachedFilterOptions] = useState<FilterOptions>(
    {}
  );

  const searchTerm = useDeferredValue(rawSearch);
  const debouncedInput = useDebounce(searchTerm, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tupleFilters = useMemo(
    () =>
      Object?.entries(filters)?.flatMap(([k, vals]) =>
        vals?.map((v) => [k, "Equals", v])
      ),
    [filters]
  );

  const { data, status } = useQuery({
    queryKey: [
      "fetch-people",
      {
        tab: activeTab,
        search: debouncedInput,
        page,
        pageLimit,
        filters: tupleFilters,
        sortOption: sortBy,
      },
    ],
    queryFn: () =>
      filterPeople({
        type: activeTab.replace("-users", "") as FilterPeopleArgs["type"],
        searchQuery: debouncedInput,
        filters: tupleFilters,
        page,
        pageLimit,
        sortOption: sortBy,
      }),
    refetchOnWindowFocus: false,
  });

  // console.log(data)

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

  const [deleteOpen, setDeleteOpen] = useState(false);

  const bulkDeleteMutation = useMutation({
    mutationFn: ({ selectedIds }: { selectedIds: string[] }) => {
      const deleteType = "soft";
      return bulkDeleteUsers(selectedIds, deleteType);
    },
    onSuccess: () => {
      setDeleteOpen(false);
      toast.success(`Users deactivated successfully!`);
      setSelectedIds([]);

      queryClient.invalidateQueries({
        queryKey: ["fetch-people"],
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete Users: ${error}`);
    },
  });

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error(`No user selected for deletion`);
      return;
    }

    bulkDeleteMutation.mutate({ selectedIds });
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  const onSortChange = (direction: "Ascending" | "Descending") => {
    setPage(1);
    setSortBy(direction);
  };

  return (
    <section className="w-full h-fit relative  overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(tab) => {
          setSelectedIds([]);
          setRawSearch("");
          setPage(1);
          setPageLimit(20);
          setFilters({});
          setActiveTab(tab);
        }}
        defaultValue="active-users"
        className="w-full"
        key={`${activeTab}-users-peopleasdf`}
      >
        <ActionBar key={`${activeTab}people-action-bar`}>
          <div className="flex gap-2">
            <Select
              value={activeTab}
              onValueChange={(tab) => {
                setSelectedIds([]);
                setRawSearch("");
                setPage(1);
                setPageLimit(20);
                setFilters({});
                setActiveTab(tab);
              }}
              defaultValue="active-users"
            >
              <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-lg">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem
                  value="active-users"
                  className="w-full py-2.5 rounded-lg"
                >
                  Active People
                </SelectItem>
                <SelectItem
                  value="inactive-users"
                  className="w-full py-2.5 rounded-lg"
                >
                  Inactive People
                </SelectItem>
              </SelectContent>
            </Select>{" "}
            <MoreFilters
              key={`${activeTab}people`}
              filterOptions={cachedFilterOptions}
              loading={status === "pending"}
              onFilterChange={handleFilterChange}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outlineTwo"
                  size="sm"
                  className="font-gilroyMedium text-sm py-[19px]"
                >
                  <HugeiconsIcon icon={ArrowUpDownIcon} className="size-4" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] font-gilroyMedium"
              >
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={onSortChange}
                >
                  <DropdownMenuRadioItem value="Ascending">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Descending">
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <ActionSearchBar
              value={rawSearch || ""}
              onChange={(e) => setRawSearch(e.target.value)}
              placeholder="Search People..."
            />
            {activeTab === "active-users" && (
              <InvitePeople>
                <div className={buttonVariants({ variant: "primary" })}>
                  Invite People
                </div>
              </InvitePeople>
            )}
            {selectedIds.length > 0 && activeTab !== "inactive-users" && (
              <>
                <DeleteModal
                  handleBulkAction={handleBulkDelete}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  type="Delete"
                  key={activeTab}
                >
                  <div className={buttonVariants({ variant: "primary" })}>
                    Delete
                  </div>
                </DeleteModal>

                <BulkMove
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                >
                  <div className={buttonVariants({ variant: "primary" })}>
                    Bulk Move
                  </div>
                </BulkMove>
              </>
            )}
          </div>
        </ActionBar>
        <TabsContent value="active-users" key={"active-users-people8"}>
          <UserMain
            peopleText="Active People"
            key={"Active People people active"}
            data={data}
            status={status}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            handleSelectionChange={handleSelectionChange}
          />
        </TabsContent>
        <TabsContent value="inactive-users">
          <UserMain
            key={"Inactive People"}
            status={status}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            handleSelectionChange={handleSelectionChange}
            peopleText="Inactive People"
            data={data}
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
          key={`${activeTab}people-pagination`}
          total={data?.total || 0}
          items={data?.users || []}
          totalPages={data?.total_pages || 1}
          onPageChange={setPage}
          onPageLimitChange={(l) => {
            setPageLimit(l);
            setPage(1);
          }}
          className="mt-4"
        />
      )}
    </section>
  );
};
