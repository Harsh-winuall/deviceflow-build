import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface AsyncSelectProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string | any) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: T) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
  fixInputClear?: boolean;
  /** Query Key for cache */
  queryKey?: string;
}

export function AsyncSelect<T>({
  fetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  width = "200px",
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
  fixInputClear = true,
  queryKey = "",
}: AsyncSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  // const [options, setOptions] = useState<T[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);

  const {
    data: fetchedOptions = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<T[], Error>({
    queryKey: ["async-select", queryKey],
    // queryFn: () => fetcher(debouncedSearchTerm),
    queryFn: () =>
      filterFn
        ? fetcher() // fetch once without search term
        : fetcher(debouncedSearchTerm), // fetch with search term
    enabled: preload ? !mounted || !!debouncedSearchTerm : true,
    // staleTime: 5 * 60 * 1000, // optional caching
  });
  // console.log(fetchedOptions);

  const options = (() => {
    if (filterFn) {
      // Always keep original data for local filtering
      if (!originalOptions.length && fetchedOptions.length > 0) {
        setOriginalOptions(fetchedOptions);
      }
      return debouncedSearchTerm
        ? originalOptions.filter((option) =>
            filterFn(option, debouncedSearchTerm)
          )
        : originalOptions;
    }

    if (preload) {
      return debouncedSearchTerm
        ? originalOptions.filter((option) =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true
          )
        : originalOptions;
    }

    return fetchedOptions;
  })();

  useEffect(() => {
    setMounted(true);
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (value && options?.length > 0) {
      // console.log(value);
      const matched = options?.find((opt) => getOptionValue(opt) === value);
      if (matched) {
        setSelectedOption(matched);
      }
    } else {
      setSelectedOption(value);
    }
  }, [value, options, getOptionValue]);

  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const data = await fetcher(debouncedSearchTerm);
  //       if (fixInputClear) {
  //         if (!originalOptions.length) {
  //           setOriginalOptions(data);
  //         }
  //       } else {
  //         setOriginalOptions(data);
  //       }

  //       setOptions(data);

  //       if (value && !selectedOption) {
  //         const matched = data.find((opt) => getOptionValue(opt) === value);
  //         if (matched) {
  //           setSelectedOption(matched);
  //         }
  //       }
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "Failed to fetch options"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (!mounted) {
  //     fetchOptions();
  //   } else if (!preload && debouncedSearchTerm) {
  //     fetchOptions();
  //   } else if (preload) {
  //     if (debouncedSearchTerm) {
  //       setOptions(
  //         originalOptions.filter((option) =>
  //           filterFn ? filterFn(option, debouncedSearchTerm) : true
  //         )
  //       );
  //     } else {
  //       setOptions(originalOptions);
  //     }
  //   } else {
  //     fetchOptions();
  //   }
  // }, [fetcher, debouncedSearchTerm, mounted, preload, filterFn]);

  useEffect(() => {
    if (fetchedOptions.length > 0) {
      // if (fixInputClear && originalOptions.length === 0) {
      //   setOriginalOptions(fetchedOptions);
      // } else if (!fixInputClear) {
      //   setOriginalOptions(fetchedOptions);
      // }
      setOriginalOptions(fetchedOptions);
    }
  }, [fetchedOptions, preload, fixInputClear, originalOptions.length]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newValue =
        clearable && currentValue === selectedValue ? "" : currentValue;
      const newOption =
        options?.find((option) => getOptionValue(option) === newValue) || null;
      setSelectedValue(newValue);
      setSelectedOption(newOption);
      onChange(newOption!);
      setOpen(false);
    },
    [selectedValue, onChange, clearable, options, getOptionValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-gilroyMedium",
            disabled && "opacity-50 cursor-not-allowed",
            !selectedOption &&
              "text-[#CCCCCC] hover:text-[#818EA1] font-gilroyRegular text-sm",
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          {selectedOption ? getDisplayValue(selectedOption) : placeholder}
          <ChevronsUpDown className="opacity-50" size={10} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 ", className)}>
        <Command>
          <div className="relative border-b w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${label.toLowerCase()}`}
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none font-gilroyMedium pl-8 w-full flex-1"
            />
            {loading && options?.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {isError && (
              <div className="p-4 text-destructive text-center font-gilroyMedium">
                {error?.message || "Failed to fetch options"}
              </div>
            )}
            {loading &&
              options?.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !isError &&
              options?.length === 0 &&
              (notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}
            <CommandGroup>
              {options?.map((option, i) => (
                <CommandItem
                  key={`${getOptionValue(option)}-${i}`}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      "ml-auto h-3 w-3",
                      selectedValue === getOptionValue(option)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            {/* <div className="h-6 w-6 rounded-full animate-pulse bg-muted" /> */}
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
