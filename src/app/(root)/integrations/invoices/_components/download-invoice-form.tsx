import { Button, LoadingButton } from "@/components/buttons/Button";
import { MultipleSelectDropdown } from "@/components/dropdown/multi-select-dropdown";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { downloadAttachmentsAsZip } from "@/lib/utils";
import { downloadInvoice } from "@/server/integrationActions";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface IntegrationOption {
  icon: string;
  label: string;
  value: string;
}

interface DownloadInvoiceFormProps {
  closeBtn?: () => void;
  autoStartDate?: string;
  autoEndDate?: string;
  items: any[];
  availableIntegrations?: any[];
}

interface FormErrors {
  startDate: string;
  endDate: string;
  integrations: string;
}

interface YearOption {
  label: string;
  value: string;
}

interface MonthOption {
  label: string;
  value: string;
}

const DownloadInvoiceForm = ({
  closeBtn,
  autoStartDate,
  autoEndDate,
  items,
  availableIntegrations,
}: DownloadInvoiceFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );
  const currentYear = new Date().getFullYear();

  const parseInitialDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear().toString(),
      month: date.getMonth().toString(),
    };
  };

  // console.log(selectedIntegrations);

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

  const [showRange, setShowRange] = useState(false);
  const [startYear, setStartYear] = useState<string>(currentYear.toString());
  const [startMonth, setStartMonth] = useState<string>(
    parseInitialDate(autoStartDate).month || ""
  );
  const [endYear, setEndYear] = useState<string>(currentYear.toString());
  const [endMonth, setEndMonth] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    startDate: "",
    endDate: "",
    integrations: "",
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

  // Current form dates
  const currentStartDate = formatDate(startYear, startMonth);
  const currentEndDate = formatDate(endYear, endMonth);

  useEffect(() => {
    if (autoStartDate) {
      const newStart = parseInitialDate(autoStartDate);
      setStartYear(newStart.year);
      setStartMonth(newStart.month);

      // If we have an end date, use it and show range
      if (autoEndDate && autoEndDate !== autoStartDate) {
        const newEnd = parseInitialDate(autoEndDate);
        setEndYear(newEnd.year);
        setEndMonth(newEnd.month);
        // setShowRange(true);
      } else {
        // For single date mode, set end date same as start
        setEndYear(newStart.year);
        setEndMonth(newStart.month);
        // setShowRange(false);
      }
    }
  }, [autoStartDate, autoEndDate]);

  const getMonthLabel = (value: string) => {
    const month = months.find((m) => m.value === value);
    // console.log(month?.value);
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
      integrations: "",
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

    if (selectedIntegrations.length === 0) {
      newErrors.integrations = "At least one integration is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // console.log("Submitting form with values:", {
    //   startDate: currentStartDate,
    //   endDate: showRange ? currentEndDate : currentStartDate,
    //   selectedIntegrations,
    // });

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        startDate: currentStartDate,
        endDate: showRange ? currentEndDate : currentStartDate,
        integrationIds: selectedIntegrations,
      };

      const response = await downloadInvoice(payload);

      if (!response || response.length === 0) {
        toast.error("No invoices found for the selected criteria");
        return;
      }

      const invoiceUrls: string[] = response
        .filter((invoice) => invoice?.invoiceUrl)
        .map((invoice) => invoice.invoiceUrl);

      if (invoiceUrls.length > 0) {
        await downloadAttachmentsAsZip(invoiceUrls);
      }

      toast.success("Invoice download initiated successfully");
      closeBtn?.();
    } catch (error) {
      // console.error("Download error:", error);
      toast.error("Failed to download invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowRange(false);
    closeBtn?.();
  };

  // console.log(startDate, endDate);

  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-lg font-gilroySemiBold">Download Invoice</h2>

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-gilroyMedium text-black">
          Integrations <span className="text-red-500">*</span>
        </label>
        <MultipleSelectDropdown
          label=""
          value={selectedIntegrations}
          options={availableIntegrations}
          onSelect={(values) => {
            setSelectedIntegrations(values);
            setErrors((prev) => ({ ...prev, integrations: "" }));
          }}
          placeholder={
            availableIntegrations?.length === 0
              ? "No integrations available"
              : "Select integrations"
          }
          disabled={availableIntegrations?.length === 0}
        />
        {errors.integrations && (
          <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
            {errors.integrations}
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
              {errors.startDate && (
                <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                  {errors.startDate}
                </p>
              )}
            </div>
          </div>

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
                {errors.startDate && (
                  <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>
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
                {errors.endDate && (
                  <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                    {errors.endDate}
                  </p>
                )}
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
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>

        <LoadingButton
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
          type="button"
        >
          Download Zip
        </LoadingButton>
      </div>
    </div>
  );
};

export default DownloadInvoiceForm;
