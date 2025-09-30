"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import DropdownArrowUp from "@/icons/DropdownArrowUp";
import { AltIntegration } from "@/app/(root)/integrations/_components/icons";

type Option = {
  label: string;
  value: string;
  icon?: string;
};

type MultipleSelectDropdownProps = {
  value: string[];
  options: Option[];
  onSelect: (data: string[]) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
};

export const MultipleSelectDropdown = ({
  value = [],
  options,
  onSelect,
  placeholder = "Select",
  label,
  error,
  className,
  disabled = false,
  loading = false,
}: MultipleSelectDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            toggleOption(selectedOption.value);
          }
          break;
        case "Escape":
          setIsDropdownOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen, options, highlightedIndex, selectedValues]);

  const toggleOption = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    onSelect(newSelectedValues);
  };

  const getSelectedLabels = () => {
    if (loading) {
      return [...Array(1)].map((_, index) => (
        <div
          key={index}
          className="h-1 w-full bg-gray-200 animate-pulse rounded-md mb-1"
        ></div>
      ));
    }
    if (selectedValues.length === 0) return placeholder;
    else if (selectedValues.length === options.length)
      return "All Integrations";
    return options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label)
      .join(", ");
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <label
          htmlFor={label}
          className="absolute start-4 top-0 block -translate-y-1/2 bg-background font-gilroyMedium px-1 text-sm text-foreground"
        >
          {label.length !== 0 && `${label}*`}
        </label>
        <div
          id={label}
          className={cn(
            "pr-10 px-4 py-2 text-black text-sm font-gilroyMedium h-10 flex border-input items-center border rounded-md",
            "bg-white h-10",
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "cursor-pointer",
            className
          )}
          onClick={() => {
            if (!disabled) setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <span className={cn(selectedValues.length === 0 && "text-gray-400")}>
            {getSelectedLabels()}
          </span>
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
            {/* <div className="h-7 w-[1.5px] bg-[#DCDCDC]" /> */}
            <DropdownArrowUp
              className={cn(
                "size-[10px] ml-4 mr-3.5",
                isDropdownOpen ? "" : "transform -scale-y-100"
              )}
            />
          </div>
        </div>
        {isDropdownOpen && (
          <div className="absolute z-50 p-1.5 flex flex-col gap-1 rounded-md w-full mt-2 bg-white border border-[#D5D5D5] max-h-52 overflow-y-auto">
            {loading ? (
              // Skeleton loaders
              <>
                {[...Array(1)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-full bg-gray-200 animate-pulse rounded-md mb-1"
                  ></div>
                ))}
              </>
            ) : options?.length ? (
              options?.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={cn(
                    "flex items-center pl-2 py-2 text-black text-sm hover:rounded-sm font-gilroyMedium m-0.5 hover:text-gray-800  cursor-pointer hover:bg-[#EEEEEE] rounded-br-none rounded-bl-none",
                    highlightedIndex === index
                      ? "bg-[#EEEEEE] text-black rounded-md m-0.5 border-spacing-y-1.5"
                      : ""
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option.value);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-primary font-gilroyMedium text-sm "
                  />
                  <div className="flex items-center gap-3 ml-2">
                    {option?.icon ? (
                      <img src={option?.icon} className="size-7" />
                    ) : (
                      <AltIntegration className="size-8" />
                    )}
                    {option.label}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 font-gilroyMedium text-sm">
                No options available
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
          {error}
        </p>
      )}
    </>
  );
};
