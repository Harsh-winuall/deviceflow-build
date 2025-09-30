"use client";

import { FilterOptions, MoreFilters } from "@/components/filters/more-filters";
import { Pagination, PaginationSkeleton } from "@/components/pagination";

import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { buttonVariants } from "@/components/buttons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { bulkAssetsUnassign, bulkDeleteAssets } from "@/server/deviceActions";
import { filterAssets } from "@/server/newFilterActions";
import type {
  FilterAssetsArgs,
  FilterSelection,
} from "@/server/types/newFilterTypes";

import { Button } from "@/components/buttons/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { ArrowUpDownIcon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DeleteModal } from "../people/_components/deleteUserModal";
import CreateDevice from "./_components/addDevices/_components/create-device";
import AssignedAssets from "./_components/assigned-assets";
import BulkAssignAssets from "./_components/bulk-assign-dialog";
import CreateDeviceDialog from "./_components/addDevices/_components/add-device-form";
import { DownloadAssetReport } from "./_components/download-report";
import { HoverDropdownMenu } from "@/components/action-bar/hover-dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";

function NewPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "assigned-assets",
  });
  const [rawSearch, setRawSearch] = useQueryState("searchQuery", {
    defaultValue: "",
  });
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [filters, setFilters] = useState<FilterSelection>({});
  const [cachedFilterOptions, setCachedFilterOptions] = useState<FilterOptions>(
    {}
  );
  const [sortBy, setSortBy] = useState<"Ascending" | "Descending">("Ascending");

  const searchTerm = useDeferredValue(rawSearch);
  const debounseSearch = useDebounce(searchTerm, 300);
  const tupleFilters = useMemo(
    () =>
      Object.entries(filters).flatMap(([k, vals]) =>
        vals.map((v) => [k, "Equals", v])
      ),
    [filters]
  );

  const { data, status } = useQuery({
    queryKey: [
      "fetch-assets",
      {
        tab: activeTab,
        search: debounseSearch,
        page,
        pageLimit,
        filters: tupleFilters,
        sortOption: sortBy,
      },
    ],
    queryFn: () =>
      filterAssets({
        type: activeTab.replace("-assets", "") as FilterAssetsArgs["type"],
        searchQuery: debounseSearch,
        filters: tupleFilters,
        page,
        pageLimit,
        sortOption: sortBy,
      }),
    refetchOnWindowFocus: false,
  });
  // console.log(data, "Filter");
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
  const [unassignOpen, setUnassignOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // --

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => {
      const deleteType = "soft";
      return bulkDeleteAssets(ids, deleteType);
    },
    onSuccess: (_res, ids) => {
      toast.success(`Assets deactivated successfully!`);
      setSelectedIds([]);
      setDeleteOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete Assets: ${error.message || error}`);
    },
  });

  /**
   * Checkboxes Bulk logic
   */
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error(`No Asset selected for deletion`);
      return;
    }

    deleteMutation.mutate(selectedIds);
  };

  const unassignMutation = useMutation({
    mutationFn: (ids: string[]) => bulkAssetsUnassign(ids),
    onSuccess: (res) => {
      toast.success("Assets Unassigned successfully!");
      setSelectedIds([]);
      setUnassignOpen(false);

      // invalidate just this queryKey so it refetches
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
      });
    },
    onError: (err) => {
      toast.error(`Failed to Unassign Assets: ${err}`);
    },
  });

  const handleBulkUnassign = () => {
    if (selectedIds.length === 0) {
      toast.error(`No Asset selected for deletion`);
      return;
    }

    unassignMutation.mutate(selectedIds);
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
        defaultValue="assigned-assets"
        className="w-full"
      >
        <ActionBar>
          <div className="flex gap-2 justify-center items-center">
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
              defaultValue="assigned-assets"
            >
              <SelectTrigger className="w-fit font-gilroyMedium flex bg-white h-[37px] border border-[#DEDEDE] rounded-md">
                <SelectValue placeholder="People" />
              </SelectTrigger>

              <SelectContent className="font-gilroyMedium">
                <SelectItem
                  value="assigned-assets"
                  className="w-full py-2.5 rounded-[5px]"
                >
                  Assigned Assets
                </SelectItem>
                <SelectItem
                  value="unassigned-assets"
                  className="w-full py-2.5 rounded-[5px]"
                >
                  Unassigned Assets
                </SelectItem>
                <SelectItem
                  value="inactive-assets"
                  className="w-full py-2.5 rounded-[5px]"
                >
                  Inactive Assets
                </SelectItem>
              </SelectContent>
            </Select>
            <MoreFilters
              filterOptions={cachedFilterOptions}
              loading={status === "pending"}
              key={activeTab}
              // mutationFn={filterAssets}
              onFilterChange={handleFilterChange}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outlineTwo"
                  size="sm"
                  className="font-gilroyMedium  text-sm h-[37px]"
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

          <div className="flex gap-2 items-center justify-center">
            <ActionSearchBar
              placeholder="Search Assets..."
              value={rawSearch ?? ""}
              onChange={(e) => {
                setRawSearch(e.target.value);
                setPage(1);
              }}
            />

            {selectedIds.length > 0 && (
              <>
                <DeleteModal
                  handleBulkAction={handleBulkDelete}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  type="Delete"
                  key={activeTab}
                >
                  <div className={buttonVariants({ variant: "outlineTwo" })}>
                    <span className="text-sm  whitespace-nowrap group-hover:text-white font-gilroyMedium">
                      Delete
                    </span>
                  </div>
                </DeleteModal>

                {activeTab === "assigned-assets" && (
                  <DeleteModal
                    handleBulkAction={handleBulkUnassign}
                    open={unassignOpen}
                    setOpen={setUnassignOpen}
                    type="Unassign"
                  >
                    <div className={buttonVariants({ variant: "outlineTwo" })}>
                      <div className="  text-nowrap text-sm font-gilroyMedium">
                        Bulk Unassign
                      </div>
                    </div>
                  </DeleteModal>
                )}
              </>
            )}
            {activeTab !== "inactive-assets" && (
              <HoverDropdownMenu>
                <CreateDeviceDialog>
                  <button
                    role="menuitem"
                    className="w-full text-[13px] text-left px-4 py-2 font-gilroyMedium hover:bg-gray-50"
                  >
                    Add Device
                  </button>
                </CreateDeviceDialog>
                <BulkAssignAssets>
                  <button
                    role="menuitem"
                    className="w-full text-[13px] text-left px-4 py-2 font-gilroyMedium hover:bg-gray-50"
                  >
                    Bulk Assign
                  </button>
                </BulkAssignAssets>
                <DownloadAssetReport>
                  <button
                    role="menuitem"
                    className="w-full text-[13px] text-left px-4 py-2 font-gilroyMedium hover:bg-gray-50"
                  >
                    Export
                  </button>
                </DownloadAssetReport>
              </HoverDropdownMenu>
            )}
          </div>
        </ActionBar>
        <TabsContent value="assigned-assets">
          <AssignedAssets
            key={"Assigned Assets"}
            assetsText="Assigned Assets"
            data={data}
            status={status}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            handleSelectionChange={handleSelectionChange}
          />
        </TabsContent>
        <TabsContent value="unassigned-assets">
          <AssignedAssets
            key={"Unassigned Assets"}
            data={data}
            status={status}
            assetsText="Unassigned Assets"
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            handleSelectionChange={handleSelectionChange}
          />{" "}
        </TabsContent>
        <TabsContent value="inactive-assets">
          <AssignedAssets
            data={data}
            key={"Inactive Assets"}
            status={status}
            assetsText="Inactive Assets"
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            handleSelectionChange={handleSelectionChange}
          />{" "}
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
          items={data?.devices || []}
          onPageChange={setPage}
          onPageLimitChange={(l) => {
            setPageLimit(l);
            setPage(1);
          }}
          className="mt-3"
        />
      )}
    </section>
  );
}

export default NewPage;
