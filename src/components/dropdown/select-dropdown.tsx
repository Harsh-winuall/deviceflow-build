"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import DropdownArrowUp from "@/icons/DropdownArrowUp";

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  value: string;
  options: Option[];
  onSelect: (data: Option) => void;
  label: string;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  seperator?: boolean;
};

export const SelectDropdown = ({
  value,
  options,
  seperator,
  onSelect,
  placeholder = "Select",
  label,
  error,
  className,
  disabled = false,
}: SelectInputProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | Option>(value);
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
            handleSelect(selectedOption);
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
    setSelectedOption(option);
    setIsDropdownOpen(false);
    onSelect(option);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <label
          htmlFor={label}
          className="absolute start-4 top-0 block  -translate-y-1/2 bg-background font-gilroyMedium px-1 text-sm  text-foreground"
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
          {selectedOption && typeof selectedOption !== "string" ? (
            selectedOption.label
          ) : selectedOption ? (
            selectedOption
          ) : (
            <span className="text-gray-400 text-sm font-gilroyMedium">
              {placeholder}
            </span>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
            {seperator && <div className="h-7 w-[1.5px] bg-[#DCDCDC]" />}
            <DropdownArrowUp
              className={cn(
                "size-[10px] ml-4 mr-3.5 ",
                isDropdownOpen ? "" : "transform -scale-y-100"
              )}
            />
          </div>
        </div>
        {isDropdownOpen && (
          <div className="absolute z-50 rounded-md w-full mt-2 bg-white border border-[#D5D5D5]  max-h-52 overflow-y-auto">
            {options?.length ? (
              options?.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={cn(
                    "pl-2 py-2 text-gray-700 text-sm hover:rounded-md font-gilroyMedium m-0.5 hover:text-gray-800 border-b border-[#F3F3F3] cursor-pointer hover:bg-[#EEEEEE] rounded-br-none rounded-bl-none",
                    highlightedIndex === index
                      ? "bg-[#EEEEEE] text-gray-800 rounded-md m-0.5 border-spacing-y-1.5"
                      : ""
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 font-gilroyMedium">
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
