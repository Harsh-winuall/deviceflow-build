"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../inputs/Input";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import DropdownArrowUp from "@/icons/DropdownArrowUp";

export type Option = {
  _id: string;
  email: string;
  first_name?: string;
  userName: string;
  title?: string;
  city?: string;
  address?: string;
  device_name?: string;
  serial_no?: string;
};

type SelectInputProps = {
  value: string;
  optionValue: { firstV: string; secondV?: string };
  fetchOptions: (query: string) => Promise<Option[]>;
  initialOptions: () => Promise<Option[]>;
  onSelect: (data: Option) => void;
  label: string;
  className?: string;
  placeholder?: string;
};

export const SelectInput = ({
  value,
  optionValue,
  fetchOptions,
  initialOptions,
  onSelect,
  label,
  className,
  placeholder,
}: SelectInputProps) => {
  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setQuery(value); // Sync input with parent value on updates
  }, [value]);

  // Debounce query updates
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch options based on debounced query
  useEffect(() => {
    if (!isDropdownOpen) return; // Don't call API when dropdown is closed

    const fetchData = async () => {
      try {
        if (debouncedQuery) {
          const apiData = await fetchOptions(debouncedQuery);
          setOptions([...apiData]);
        } else {
          const apiData = await initialOptions();
          setOptions([...apiData]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [debouncedQuery, fetchOptions, initialOptions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to the highlighted option
  const scrollToOption = (index: number) => {
    optionRefs.current[index]?.scrollIntoView({ block: "nearest" });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen || options.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev === null || prev === options.length - 1 ? 0 : prev + 1
          );
          scrollToOption(highlightedIndex === null ? 0 : highlightedIndex + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev === null || prev === 0 ? options.length - 1 : prev - 1
          );
          scrollToOption(
            highlightedIndex === null
              ? options.length - 1
              : highlightedIndex - 1
          );
          break;
        case "Enter":
          if (highlightedIndex !== null) {
            const selectedOption = options[highlightedIndex];
            if (selectedOption._id) {
              handleSelect(selectedOption);
            }
          }
          break;
        case "Escape":
          setIsDropdownOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen, options, highlightedIndex]);

  const handleSelect = (option: Option) => {
    setQuery(option.email);
    setIsDropdownOpen(false);
    onSelect(option);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
    if (!options.length) {
      initialOptions().then(setOptions).catch(console.error);
    }
  };

  return (
    <>
      <div className="group relative z-40" ref={dropdownRef}>
        <label
          htmlFor={label}
          className="absolute start-4 top-0 z-10 block -translate-y-1/2 bg-background px-1 text-sm font-gilroyMedium text-foreground"
        >
          {label}
        </label>
        <div className="">
          <Input
            id={label}
            className={cn("pr-10 cursor-pointer dropdownButton", className)} // Add padding-right to avoid overlapping the icon
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
              setHighlightedIndex(null);
            }}
            onFocus={handleFocus}
            placeholder={placeholder ?? "Search or select"}
            type="text"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
            <div className="h-7 w-[1.5px] bg-[#DCDCDC]" />
            <DropdownArrowUp
              className={cn(
                "size-3 ml-4 mr-3.5 text-gray-500",
                isDropdownOpen ? "" : "transform -scale-y-100"
              )}
            />
          </div>
        </div>
        {isDropdownOpen ? (
          options.length ? (
            <div className="absolute dropdown-list rounded-md hide-scrollbar z-30 w-full mt-2 bg-white border border-primary  max-h-52 overflow-y-auto">
              {options?.map((option, index) => (
                <div
                  key={option?._id}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={cn(
                    "px-4 py-3 font-gilroyRegular text-gray-700 z-20 hover:rounded-lg m-0.5 hover:text-gray-800 border-b border-[#F3F3F3] cursor-pointer hover:bg-[#EEEEEE] rounded-br-none rounded-bl-none",
                    highlightedIndex === index
                      ? "bg-[#EEEEEE] text-gray-800 rounded-lg m-0.5 border-spacing-y-1.5"
                      : ""
                  )}
                  onClick={() => {
                    if (option?._id) {
                      handleSelect(option);
                    }
                  }}
                >
                  {option[optionValue?.firstV!]}
                  <br />
                  <span className="font-gilroyRegular text-sm">
                    {/* {option?.email ?? ""} */}
                    {option[optionValue?.secondV]}
                  </span>
                </div>
              ))}
            </div>
          ) : null
        ) : null}
      </div>
    </>
  );
};
