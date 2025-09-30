"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { buttonVariants } from "../buttons/Button";

// type MutationData = {
//   filterOptions?: FilterSelection;
//   [key: string]: any; // Allow for other potential properties
// };

type FilterSelection = {
  [key: string]: (string | boolean)[];
};

export type FilterOptions = {
  [key: string]: (string | boolean)[];
};
/**
 * MoreFilters dropdown now purely driven by parent props.
 * - filterOptions: options to render
 * - loading: whether options are loading
 * - onFilterChange: callback with current selection
 * - isRadio: render as radio instead of checkboxes
 */
export const MoreFilters = ({
  filterOptions,
  loading: isPending,
  onFilterChange,
  isRadio = false,
}: {
  filterOptions: FilterOptions;
  loading: boolean;
  onFilterChange: (f: FilterSelection) => void;
  /**
   * To render radio button instead of checkbox, default is checkbox
   */
  isRadio?: boolean;
}) => {
  // const mutation = useMutation({ mutationFn: filterAssets });
  // const { data: opts, status, mutate } = useMutation({ mutationFn });
  const [selectedFilters, setSelectedFilters] = useState<FilterSelection>({});

  const loading = useMemo(() => {
    return Object?.keys(filterOptions)?.length === 0 && isPending;
  }, [filterOptions, isPending]);
  // console.log(opts, "mutationData");

  // const [selectedFilters, setSelectedFilters] = useState<FilterSelection>({});

  // const areFiltersSelected = useMemo(() => {
  //   return Object.values(selectedFilters).some(
  //     (values) => values && values.length > 0
  //   );
  // }, [selectedFilters]);
  const areFiltersSelected = useMemo(
    () => Object?.values(selectedFilters)?.some((vals) => vals?.length > 0),
    [selectedFilters]
  );

  const toggleValue = (category: string, value: string | boolean) => {
    setSelectedFilters((prev) => {
      let updated: (string | boolean)[];
      if (isRadio) {
        updated = [value]; // replace selection
      } else {
        const current = prev[category] ?? [];
        const isSelected = current.includes(value);
        updated = isSelected
          ? current.filter((v) => v !== value)
          : [...current, value];
      }

      const newState = { ...prev, [category]: updated };
      onFilterChange(newState);
      return newState;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const renderRadio = (
    category: string,
    value: string | boolean,
    label: string
  ) => {
    const checked = selectedFilters[category]?.[0] === value;

    return (
      <div
        key={String(value)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-[5px] cursor-pointer"
        onClick={() => toggleValue(category, value)}
      >
        <Radio checked={checked} />
        <span className="text-sm">{label}</span>
      </div>
    );
  };

  const renderCheckboxItem = (
    category: string,
    value: string | boolean,
    label: string
  ) => {
    const checked = selectedFilters[category]?.includes(value) || false;

    return (
      <div
        key={String(value)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-[5px] cursor-pointer"
        onClick={() => toggleValue(category, value)}
      >
        <Checkbox checked={checked} />
        <span className="text-sm capitalize">
          {label?.includes("_") ? label?.split("_").join(" ") : label}
        </span>
      </div>
    );
  };
  // const filterOptions: FilterSelection = opts?.filterOptions ?? {};

  const renderSkeleton = () => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <DropdownMenuSub key={i}>
            <DropdownMenuSubTrigger className="px-3 py-2">
              <Skeleton className="h-4 w-24" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-2 px-3 py-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <div
          aria-label="Filters"
          className={buttonVariants({
            className:
              "rounded-[5px] cursor-pointer text-sm bg-white h-9 text-black border-[#DEDEDE]  w-fit font-gilroyMedium border hover:border-black",
          })}
        >
          More Filters
        </div>
        {areFiltersSelected && (
          <div className="absolute p-0.5 bg-red-100 rounded-full -top-0.5 -right-0.5">
            <div className="size-1.5 rounded-full bg-red-500 " />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 font-gilroyMedium">
        <div className="flex w-full justify-between font-gilroyMedium text-sm  text-muted-foreground">
          <span className="px-3 py-2">Filters</span>

          {areFiltersSelected && (
            <span
              className="px-3 py-2 cursor-pointer hover:underline"
              onClick={clearAllFilters}
            >
              Clear all
            </span>
          )}
        </div>
        {/* {JSON.stringify(filterOptions?.warrantyStatus)} */}

        {loading
          ? renderSkeleton()
          : Object?.entries(filterOptions)?.map(([key, values]) => {
              if (key === "warranty_status") return null;

              return (
                <DropdownMenuSub key={key}>
                  <DropdownMenuSubTrigger className="capitalize px-3 py-2">
                    {key?.includes("_") ? key?.split("_").join(" ") : key}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="max-h-64 overflow-auto">
                    {values.map((value: string | boolean) =>
                      isRadio
                        ? renderRadio(key, value, String(value))
                        : renderCheckboxItem(key, value, String(value))
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            })}

        {!loading && filterOptions?.warranty_status && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="capitalize px-3 py-2">
              Warranty
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {filterOptions?.warranty_status?.map((status: boolean) =>
                renderCheckboxItem(
                  "warranty_status",
                  status,
                  status ? "Under Warranty" : "Out of Warranty"
                )
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Radio = ({ checked }: { checked: boolean }) => (
  <div
    className={`size-4 rounded-full border-2 ${
      checked ? "border-neutral-500" : "border-neutral-400"
    } flex items-center justify-center`}
  >
    {checked && <div className="size-2 bg-neutral-500 rounded-full" />}
  </div>
);
