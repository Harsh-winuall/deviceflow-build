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
  fetcher: (query?: string) => Promise<T[]>;
  /** Preload all options on mount */
  preload?: boolean;
  /** Optional filter function to apply on fetched data */
  filterFn?: (option: T, query: string) => boolean;
  /** Render each option row */
  renderItem: (option: T) => React.ReactNode;
  /** Render selected items in trigger */
  renderSelectedItem: (values: T[]) => React.ReactNode;
  /** Controlled selected values (array of values) */
  value: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
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
}: AsyncMultiSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounced = useDebounce(searchTerm, preload ? 0 : 300);

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
        setOptions(
          originalOptions.filter((opt) =>
            filterFn ? filterFn(opt, debounced) : true
          )
        );
      } else {
        setOptions(originalOptions);
      }
    }
  }, [debounced, preload, filterFn, originalOptions]);

  const loadOptions = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher(query);
      if (preload) {
        if (!originalOptions.length) {
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

  const toggleValue = (val: string) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(next);
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
              "text-[#CCCCCC] hover:text-[#818EA1] font-gilroyRegular text-sm",
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          {/* {selectedOption ? getDisplayValue(selectedOption) : placeholder} */}
          {value.length > 0
            ? renderSelectedItem(
                options.filter((opt) => value.includes(opt.value))
              )
            : placeholder}
          {/* <ChevronsUpDown className="opacity-50" size={10} /> */}
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
              // className="pl-8 border-none focus:ring-0"
              className="focus-visible:ring-0 rounded-b-none border-none font-gilroyMedium pl-8 w-full flex-1"
            />
            {loading && options.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-destructive text-center font-gilroyMedium">
                {error}
              </div>
            )}
            {loading &&
              options.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !error &&
              options.length === 0 &&
              (notFound || (
                <CommandEmpty className="font-gilroyMedium">
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}

            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => toggleValue(opt.value)}
                  aria-selected={value.includes(opt.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {renderItem(opt)}
                </CommandItem>
              ))}
            </CommandGroup>
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
