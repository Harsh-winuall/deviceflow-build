"use client";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import React from "react";

import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { downloadReportsAssets } from "@/server/deviceActions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FormErrors {
  startDate: string;
  endDate: string;
  filterType: string;
  general?: string; // Added for general error messages
}

interface YearOption {
  label: string;
  value: string;
}

interface MonthOption {
  label: string;
  value: string;
}

export const DownloadAssetReport = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Fixed: Initialize with "all" value instead of "All assets" label
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>("all");

  const currentYear = new Date().getFullYear();

  const parseInitialDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear().toString(),
      month: date.getMonth().toString(),
    };
  };

  const years: YearOption[] = Array.from({ length: 11 }, (_, i) => ({
    label: (currentYear - 5 + i).toString(),
    value: (currentYear - 5 + i).toString(),
  }));

  const months: MonthOption[] = [
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

  const autoStartDate = new Date().toISOString();
  const [showRange, setShowRange] = useState(false);
  const [startYear, setStartYear] = useState<string>(currentYear.toString());
  const [startMonth, setStartMonth] = useState<string>(
    parseInitialDate(autoStartDate).month || ""
  );
  const [endYear, setEndYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    startDate: "",
    endDate: "",
    filterType: "",
    general: "",
  });

  const formatDate = (year: string, month: string): string => {
    const monthNumber = parseInt(month) + 1;
    const monthString =
      monthNumber < 10 ? `0${monthNumber}` : monthNumber.toString();
    return `${year}-${monthString}-01`;
  };

  const handleStartYearSelect = (option: YearOption) => {
    setStartYear(option.value);
    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }));
  };

  const currentStartDate = formatDate(startYear, startMonth);
  const currentEndDate = formatDate(endYear, endMonth);

  const getMonthLabel = (value: string) => {
    const month = months.find((m) => m.value === value);
    return month ? month.label : "";
  };

  const handleStartMonthSelect = (option: MonthOption) => {
    setStartMonth(option.value);
    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }));
  };

  const handleEndYearSelect = (option: YearOption) => {
    setEndYear(option.value);
    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const handleEndMonthSelect = (option: MonthOption) => {
    setEndMonth(option.value);
    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const startDate = startMonth ? formatDate(startYear, startMonth) : "";
  const endDate = endMonth ? formatDate(endYear, endMonth) : "";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      startDate: "",
      endDate: "",
      filterType: "",
      general: "",
    };

    let isValid = true;

    if (!startMonth) {
      newErrors.startDate = "Start month is required";
      isValid = false;
    }

    if (showRange) {
      if (!endMonth) {
        newErrors.endDate = "End month is required";
        isValid = false;
      } else if (
        startDate &&
        endDate &&
        new Date(endDate) < new Date(startDate)
      ) {
        newErrors.endDate = "End date must be after start date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const assets = [
    { label: "All assets", value: "all" },
    { label: "Assigned assets", value: "assigned" },
    { label: "Unassinged assets", value: "unassigned" },
    { label: "Inactive assets", value: "inactive" },
  ];

  // Helper function to get current asset label for display
  const getCurrentAssetLabel = () => {
    const currentAsset = assets.find(
      (asset) => asset.value === selectedAssetFilter
    );
    return currentAsset ? currentAsset.label : "All assets";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const payload: any = {
        startDate: new Date(currentStartDate).toISOString(),
        filterType: selectedAssetFilter, // This will now be the value, not the label
      };

      if (showRange && currentEndDate) {
        payload.endDate = new Date(currentEndDate).toISOString();
      }

      const response = await downloadReportsAssets(payload);

      if (response?.fileUrl) {
        const link = document.createElement("a");
        link.href = response.fileUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Success: Close dialog and show toast
        setOpen(false);
        toast.success("Asset report download successfully");

        // Reset form state
        setShowRange(false);
        setSelectedAssetFilter("all");
        setStartMonth(parseInitialDate(autoStartDate).month || "");
        setEndMonth("");
        setEndYear("");
        setErrors({ startDate: "", endDate: "", filterType: "", general: "" });
      } else {
        // Handle case where response doesn't have fileUrl
        setErrors((prev) => ({
          ...prev,
          general: "Download failed: Invalid response from server",
        }));
      }
    } catch (error: any) {
      // Handle errors without closing dialog
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to download asset report";

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));

      // Optional: Also show toast for user feedback
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setOpen(false);
    setErrors({
      startDate: "",
      endDate: "",
      filterType: "",
      general: "",
    });
    setShowRange(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="rounded-xl bg-white p-4 shadow-lg w-96 ">
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Download Asset
          </DialogTitle>

          <div className="flex flex-col gap-[18px]">
            {/* General error message at the top */}
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-gilroyMedium text-black">
                Choose Asset
              </label>
              <SelectDropdown
                value={getCurrentAssetLabel()} // Show label but store value
                onSelect={(selected) => setSelectedAssetFilter(selected.value)}
                options={assets}
                label=""
                placeholder="Choose"
              />
              {errors.filterType && (
                <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                  {errors.filterType}
                </p>
              )}
            </div>

            {!showRange ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex-1 gap-1 flex flex-col">
                    <label className="block text-sm font-gilroyMedium text-black">
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
                    <label className="block text-sm font-gilroyMedium text-black">
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
                {errors.startDate && (
                  <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                    {errors.startDate}
                  </p>
                )}

                <button
                  onClick={() => setShowRange(true)}
                  className="flex items-center gap-2 text-sm text-[#007AFF] font-gilroyMedium"
                  type="button"
                >
                  <span className="text-base">+</span>
                  Add range
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 gap-1 flex flex-col">
                      <label className="block text-sm font-gilroyMedium text-black">
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
                      <label className="block text-sm font-gilroyMedium text-black">
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
                  {errors.startDate && (
                    <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 gap-1 flex flex-col">
                      <label className="block text-sm font-gilroyMedium text-black">
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
                      <label className="block text-sm font-gilroyMedium text-black">
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
                  {errors.endDate && (
                    <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex w-full items-center justify-between">
            <Button
              onClick={handleCancel}
              variant="outlineTwo"
              className="w-full "
              type="button"
            >
              Cancel
            </Button>

            <LoadingButton
              variant="primary"
              className="w-full"
              onClick={handleSubmit}
              loading={isLoading}
              type="button"
            >
              Download Zip
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
