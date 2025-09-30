"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { Button, LoadingButton } from "@/components/buttons/Button";

const SelectDatesForm = ({
  closeBtn,
  initialStartDate,
  initialEndDate,
  onDatesChange,
}: {
  closeBtn: () => void;
  initialStartDate: string;
  initialEndDate: string;
  onDatesChange: (start: string, end: string) => void;
}) => {
  // Generate year options (current year -5 to current year +5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => ({
    label: (currentYear - 5 + i).toString(),
    value: (currentYear - 5 + i).toString(),
  }));

  const months = [
    { label: "January", value: "0" },
    { label: "February", value: "1" },
    { label: "March", value: "2" },
    { label: "April", value: "3" },
    { label: "May", value: "4" },
    { label: "June", value: "5" },
    { label: "July", value: "6" },
    { label: "August", value: "7" },
    { label: "September", value: "8" },
    { label: "October", value: "9" },
    { label: "November", value: "10" },
    { label: "December", value: "11" },
  ];

  // Parse initial dates
  const parseInitialDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear().toString(),
      month: date.getMonth().toString(),
    };
  };

  const [showRange, setShowRange] = useState(false);
  const [startYear, setStartYear] = useState<string>(currentYear.toString());
  const [startMonth, setStartMonth] = useState<string>(parseInitialDate(initialStartDate).month || "");
  const [endYear, setEndYear] = useState<string>(currentYear.toString());
  const [endMonth, setEndMonth] = useState<string>("");

  useEffect(() => {
    if (initialStartDate) {
      const { year, month } = parseInitialDate(initialStartDate);
      setStartYear(year);
      setStartMonth(month);
    }
    if (initialEndDate) {
      const { year, month } = parseInitialDate(initialEndDate);
      setEndYear(year);
      setEndMonth(month);
      // setShowRange(true);
    }
  }, [initialStartDate, initialEndDate]);

  // Format date as YYYY-MM-01 (always first day of month)
  const formatDate = (year: string, month: string) => {
    const monthNumber = parseInt(month) + 1;
    const monthString = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    return `${year}-${monthString}-01`;
  };

  const handleStartYearSelect = (option: { label: string; value: string }) => {
    setStartYear(option.value);
  };

  const handleStartMonthSelect = (option: { label: string; value: string }) => {
    setStartMonth(option.value);
  };

  const handleEndYearSelect = (option: { label: string; value: string }) => {
    setEndYear(option.value);
  };

  const handleEndMonthSelect = (option: { label: string; value: string }) => {
    setEndMonth(option.value);
  };

  // Get the formatted dates
  // const startDate = formatDate(startYear, startMonth);
  // const endDate = formatDate(endYear, endMonth);

  const handleSubmit = () => {
    const startDate = formatDate(startYear, startMonth);
    const endDate = showRange 
      ? formatDate(endYear, endMonth)
      : formatDate(startYear, startMonth);
    
    onDatesChange(startDate, endDate);
    closeBtn();
  };
  const handleCancel = () => {
    // Handle cancel logic here
    setShowRange(false);
    setStartYear(currentYear.toString());
    setStartMonth("0");
    setEndYear(currentYear.toString());
    setEndMonth("0");
    if (closeBtn) closeBtn();
  };

  const getMonthLabel = (value: string) => {
    const month = months.find((m) => m.value === value);
    return month ? month.label : "";
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-lg font-gilroySemiBold">Choose dates</h2>

      {!showRange && (
        <div className="flex items-center gap-4">
          <div className="flex-1 gap-1 flex flex-col">
            <label
              htmlFor="startDate"
              className="block text-sm font-gilroyMedium text-black"
            >
              Year <span className="text-red-500">*</span>
            </label>
            <SelectDropdown
              value={startYear}
              options={years}
              onSelect={handleStartYearSelect}
              label=""
              placeholder="Select year"
            />
          </div>
          <div className="flex-1 gap-1 flex flex-col">
            <label
              htmlFor="startDate"
              className="block text-sm font-gilroyMedium text-black"
            >
              Month <span className="text-red-500">*</span>
            </label>
            <SelectDropdown
              value={getMonthLabel(startMonth)}
              options={months}
              onSelect={handleStartMonthSelect}
              label=""
              className="placeholder:text-gray-500 placeholder:font-gilroyMedium"
              placeholder="Choose"
            />
          </div>
        </div>
      )}

      {!showRange && (
        <button
          onClick={() => setShowRange(true)}
          className="flex items-center gap-2 text-sm text-[#007AFF] font-gilroyMedium"
        >
          {/* <Plus className="w-4 h-4" /> */}
          <span className="text-base">+</span>
          Add range
        </button>
      )}

      {showRange && (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <div className="flex-1 gap-1 flex flex-col">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-gilroyMedium text-black"
                >
                  Year (From) <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={startYear}
                  options={years}
                  onSelect={handleStartYearSelect}
                  label=""
                  placeholder="Select year"
                />
              </div>
              <div className="flex-1 gap-1 flex flex-col">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-gilroyMedium text-black"
                >
                  Month <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={getMonthLabel(startMonth)}
                  options={months}
                  onSelect={handleStartMonthSelect}
                  label=""
                  className="placeholder:text-gray-500 placeholder:font-gilroyMedium"
                  placeholder="Choose"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <div className="flex-1 gap-1 flex flex-col">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-gilroyMedium text-black"
                >
                  Year (To) <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={endYear}
                  options={years}
                  onSelect={handleEndYearSelect}
                  label=""
                  placeholder="Select year"
                />
              </div>
              <div className="flex-1 gap-1 flex flex-col">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-gilroyMedium text-black"
                >
                  Month <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={getMonthLabel(endMonth)}
                  options={months}
                  onSelect={handleEndMonthSelect}
                  label=""
                  className="placeholder:text-gray-500 placeholder:font-gilroyMedium"
                  placeholder="Choose"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outlineTwo"
          className="w-full"
          onClick={handleCancel}
          // disabled={isLoading}
        >
          Clear
        </Button>

        <LoadingButton
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          // disabled={isLoading}
          // loading={isLoading}
        >
          Apply
        </LoadingButton>
      </div>

      {/* Display the formatted dates (for debugging) */}
      {/* <div className="mt-4 p-2 bg-gray-50 rounded">
        <p className="text-sm font-gilroyMedium">
          Start Date: <span className="font-gilroySemiBold">{startDate}</span>
        </p>
        {showRange && (
          <p className="text-sm font-gilroyMedium">
            End Date: <span className="font-gilroySemiBold">{endDate}</span>
          </p>
        )}
      </div> */}
    </div>
  );
};

export default SelectDatesForm;
