"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { FilterOptions, MoreFilters } from "@/components/filters/more-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterTeams } from "@/server/newFilterActions";
import {
  type FilterSelection,
  type FilterTeamsArgs,
} from "@/server/types/newFilterTypes";
import { useQueryState } from "nuqs";
import InvitePeople from "../people/[id]/_components/invite-people";
import CreateTeam from "./_components/create-team";
import TeamsMain from "./_components/teams-main";
import { useDebounce } from "@/hooks/use-debounce";

export const NewPageTeams = () => {
  // const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "active-teams",
  });

  const [rawSearch, setRawSearch] = useQueryState("searchQuery", {
    defaultValue: "",
  });
  const [filters, setFilters] = useState<FilterSelection>({});
  const [cachedFilterOptions, setCachedFilterOptions] = useState<FilterOptions>(
    {}
  );

  const tupleFilters = useMemo(
    () =>
      Object.entries(filters).flatMap(([k, vals]) =>
        vals.map((v) => [k, "Equals", v])
      ),
    [filters]
  );

  const searchTerm = useDeferredValue(rawSearch);
  const debouncedInput = useDebounce(searchTerm, 300);
  const { data, status } = useQuery({
    queryKey: [
      "teams",
      {
        tab: activeTab,
        search: debouncedInput,
        filters: tupleFilters,
      },
    ],
    queryFn: () =>
      filterTeams({
        type: activeTab.replace("-teams", "") as FilterTeamsArgs["type"],
        searchQuery: debouncedInput,
        filters: tupleFilters,
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
    setFilters(newFilter);
  };

  return (
    <section className="w-full h-fit relative  overflow-y-auto hide-scrollbar">
      <Tabs
        value={activeTab}
        onValueChange={(tab) => {
          setRawSearch("");
          setFilters({});
          setActiveTab(tab);
        }}
        defaultValue="active-teams"
        className="w-full"
      >
        <ActionBar>
          <div className="flex gap-2">
            <Select
              value={activeTab}
              onValueChange={(tab) => {
                setRawSearch("");
                setFilters({});
                setActiveTab(tab);
              }}
              defaultValue="active-teams"
            >
              <SelectTrigger className="w-fit h-9 font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-[5px]">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem
                  value="active-teams"
                  className="w-full py-2.5 rounded-lg"
                >
                  Active Teams
                </SelectItem>
                <SelectItem
                  value="inactive-teams"
                  className="w-full py-2.5 rounded-lg"
                >
                  Inactive Teams
                </SelectItem>
              </SelectContent>
            </Select>
            <MoreFilters
              key={`${activeTab}teams-more`}
              filterOptions={cachedFilterOptions}
              onFilterChange={handleFilterChange}
              loading={status === "pending"}
              isRadio
            />
          </div>

          <div className="flex gap-2 items-center">
            <ActionSearchBar
              type="text"
              value={rawSearch || ""}
              onChange={(e) => setRawSearch(e.target.value)}
              placeholder="Search Teams..."
            />
            {activeTab === "active-teams" && (
              <>
                <InvitePeople>
                  <div className={buttonVariants({ variant: "outlineTwo" })}>
                    <div className=" group-hover:text-white  text-nowrap text-sm font-gilroyMedium">
                      Invite People
                    </div>
                  </div>
                </InvitePeople>

                <CreateTeam>
                  <div className={buttonVariants({ variant: "outlineTwo" })}>
                    <span className="text-sm  whitespace-nowrap group-hover:text-white font-gilroyMedium">
                      Create Team
                    </span>
                  </div>
                </CreateTeam>
              </>
            )}
          </div>
        </ActionBar>
        <TabsContent value="active-teams">
          <TeamsMain teams={data} status={status} value="active-teams" />
        </TabsContent>
        <TabsContent value="inactive-teams">
          <TeamsMain teams={data} status={status} value="inactive-teams" />
        </TabsContent>
      </Tabs>
    </section>
  );
};
