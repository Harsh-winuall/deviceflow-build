import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

/**
 * Base option interface for multi-select with async support
 */
export interface BaseOption {
  label: string;
  value: string;
}

/**
 * Props for AsyncMultiSelectCombobox
 */
export interface AsyncMultiSelectProps<T extends BaseOption> {
  /** Async fetcher function, receives debounced query */
  fetcher: (query: string) => Promise<{
    users?: T[];
    teams?: T[];
  }>;
  /** Preload all options on mount */
  preload?: boolean;
  /** Optional filter function to apply on fetched data */
  filterFn?: (option: T, query: string) => boolean;
  /** Render each option row */
  renderItem: (option: T) => React.ReactNode;
  /** Render selected items in trigger */
  renderSelectedItem: (values: T[]) => React.ReactNode;
  /** Controlled selected values (array of values) */
  value:
    | string[]
    | {
        userId?: string;
        teamId?: string;
        first_name?: string;
        email?: string;
        title?: string;
      }[];
  /** Callback when selection changes */
  onChange: (values: any[]) => void;
  /** Label for the field */
  label: string;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Custom not found UI */
  notFound?: React.ReactNode;
  /** Custom loading skeleton UI */
  loadingSkeleton?: React.ReactNode;
  /** Custom no results message text */
  noResultsMessage?: string;
  /** Allow clear all button */
  clearable?: boolean;
  /** Trigger button width */
  width?: string | number;
  /** Additional className for popover content */
  className?: string;
  /** Additional className for trigger button */
  triggerClassName?: string;
  disabled?: boolean;
  //   type?: string;
}

/**
 * Async multi-select combobox component
 */
export function AsyncMultiSelectCombobox<T extends BaseOption>({
  fetcher,
  preload = false,
  filterFn,
  renderItem,
  renderSelectedItem,
  value,
  onChange,
  label,
  placeholder = "Select...",
  notFound,
  loadingSkeleton,
  noResultsMessage,
  clearable = true,
  width = "200px",
  className,
  disabled = false,
  triggerClassName,
}: //   type,
AsyncMultiSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{
    users?: T[];
    teams?: T[];
  }>({});
  const [originalOptions, setOriginalOptions] = useState<{
    users?: T[];
    teams?: T[];
  }>({});
  const [selected, setSelected] = useState<{
    users?: T[];
    teams?: T[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounced = useDebounce(searchTerm, preload ? 0 : 300);

  // console.log(debounced);

  // Initial mount effect
  useEffect(() => {
    setMounted(true);
    if (preload) {
      loadOptions("");
    } else {
      loadOptions("");
    }
  }, []);

  // Fetch or filter on search
  useEffect(() => {
    if (!preload) {
      loadOptions(debounced);
    } else {
      if (debounced) {
        const filteredUsers = originalOptions.users?.filter((opt) =>
          filterFn ? filterFn(opt, debounced) : true
        );
        const filteredTeams = originalOptions.teams?.filter((opt) =>
          filterFn ? filterFn(opt, debounced) : true
        );
        setOptions({
          users: filteredUsers,
          teams: filteredTeams,
        });
      } else {
        setOptions(originalOptions);
      }
    }
  }, [debounced, preload, filterFn, originalOptions]);

  const loadOptions = async (query: string) => {
    setLoading(true);
    setError(null);
    // console.log(query);
    try {
      const data = await fetcher(query);
      if (preload) {
        if (!originalOptions.users?.length && !originalOptions.teams?.length) {
          setOriginalOptions(data);
        }
      }
      setOptions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch options");
    } finally {
      setLoading(false);
    }
  };

  const toggleValue = (opt: any, category: "users" | "teams") => {
    // if (type === "object") {
    const isUser = category === "users";
    const idKey = isUser ? "userId" : "teamId";
    const valueKey = isUser ? "value" : "value";

    const next = value.some((v) => v[idKey] === opt[valueKey])
      ? value.filter((v) => v[idKey] !== opt[valueKey])
      : [
          ...value,
          isUser
            ? {
                first_name: opt.first_name,
                email: opt.label,
                userId: opt.value,
              }
            : { title: opt.title, teamId: opt.value },
        ];
    onChange(next);
    // } else {
    //   const next = value.includes(opt.value)
    //     ? value.filter((v) => v !== opt.value)
    //     : [...value, opt.value];
    //   onChange(next);
    // }
  };

  const isSelected = (opt: any, category: "users" | "teams") => {
    // if (type === "object") {
    const idKey = category === "users" ? "userId" : "teamId";
    return value.some((v) => v[idKey] === opt.value);
    // }
    // return value.includes(opt.value);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-gilroyMedium",
            disabled && "opacity-50 cursor-not-allowed",
            !value.length &&
              "text-[#818EA1] hover:text-[#818EA1] font-gilroyRegular text-sm",
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          {value.length > 0
            ? // ? type !== "object"
              //   ? renderSelectedItem(
              //       value
              //         .map((val) =>
              //           [
              //             ...(originalOptions.users || []),
              //             ...(originalOptions.teams || []),
              //             ...(options.users || []),
              //             ...(options.teams || []),
              //           ].find((opt) => opt.value === val)
              //         )
              //         .filter(Boolean)
              //     )
              //   :
              // @ts-ignore
              renderSelectedItem(value.filter(Boolean))
            : placeholder}
          <span className="flex items-center gap-2">
            {clearable && value.length > 0 && (
              <button
                onClick={clearAll}
                aria-label="Clear all"
                className="focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronsUpDown className="opacity-50" size={16} />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <div className="relative border-b w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${label.toLowerCase()}`}
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none font-gilroyMedium pl-8 w-full flex-1"
            />
            {loading && (options.users?.length || options.teams?.length) && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {searchTerm === "" ? (
              <div className="p-4 text-gray-300 text-center font-gilroyMedium">
                {/* Search any Team or User */}
              </div>
            ) : (
              error && (
                <div className="p-4 text-destructive text-center font-gilroyMedium">
                  {error}
                </div>
              )
            )}

            {loading &&
              !options.users?.length &&
              !options.teams?.length &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !error &&
              !options.users?.length &&
              !options.teams?.length &&
              searchTerm !== "" &&
              (notFound || (
                <CommandEmpty className="font-gilroyMedium">
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}

            {options.users?.length ? (
              <CommandGroup
                heading={label === "Channels" ? "Channels" : "Users"}
              >
                {options.users.map((opt) => (
                  <CommandItem
                    key={`user-${opt.value}`}
                    value={opt.label}
                    onSelect={() => toggleValue(opt, "users")}
                    aria-selected={isSelected(opt, "users")}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(opt, "users") ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderItem(opt)}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {options.teams?.length ? (
              <CommandGroup heading="Teams">
                {options.teams.map((opt) => (
                  <CommandItem
                    key={`team-${opt.value}`}
                    value={opt.label}
                    onSelect={() => toggleValue(opt, "teams")}
                    aria-selected={isSelected(opt, "teams")}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(opt, "teams") ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderItem(opt)}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Default loading skeleton for command list
 */
function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-3 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
