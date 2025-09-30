"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Upload as UploadIcon } from "lucide-react";
import { getImageUrl } from "@/components/utils/upload";
import { updateInvoice, uploadInvoice } from "@/server/integrationActions";
import { useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileEmpty02Icon } from "@hugeicons/core-free-icons";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";

interface FormData {
  invoiceNumber: string;
  invoiceAmount: number | string;
  invoiceDate: Date | null;
  invoiceUrl: string | null;
  integrationId: string;
  integrationPlatform: string;
  // description?: string;
}

interface YearOption {
  label: string;
  value: string;
}

interface MonthOption {
  label: string;
  value: string;
}

interface IntegrationOption {
  label: string;
  value: string;
}

const UploadInvoiceForm = ({
  closeBtn,
  initStartDate,
  intData,
  availableIntegrations = [],
  isEdit,
}: {
  closeBtn?: () => void;
  initStartDate?: string;
  intData: any;
  availableIntegrations?: any[];
  isEdit?: boolean;
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentYear = new Date().getFullYear();

  // console.log(intData);

  // Initialize form data with integration details from props
  const [formData, setFormData] = useState<FormData>({
    invoiceNumber: "",
    invoiceAmount: 0,
    invoiceDate: null,
    invoiceUrl: null,
    integrationId: intData?._id || "",
    integrationPlatform: intData?.platform || "",
    // description: intData?.description || "",
  });

  useEffect(() => {
    if (intData) {
      const invoiceDateStr =
        intData?.invoiceDate ?? intData.invoices?.[0]?.invoiceDate;

      let year = currentYear.toString();
      let month = "";

      if (invoiceDateStr) {
        const date = new Date(invoiceDateStr);
        year = date.getFullYear().toString();
        month = date.getMonth().toString(); // 0-11
      }

      setFormData((prev) => ({
        ...prev,
        integrationId: intData?._id,
        integrationPlatform: intData?.platform,
        invoiceUrl: intData?.invoiceUrl ?? intData.invoices[0]?.invoiceUrl,
        invoiceAmount:
          intData?.invoiceAmount ?? intData.invoices[0]?.invoiceAmount,
        invoiceNumber:
          intData?.invoiceNumber ?? intData.invoices[0]?.invoiceNumber,
        invoiceDate: invoiceDateStr ? new Date(invoiceDateStr) : null,
      }));

      // Pre-fill year and month dropdowns
      if (invoiceDateStr) {
        setSelectedYear(year);
        setSelectedMonth(month);
      }
    }
  }, [intData]);

  const [errors, setErrors] = useState({
    invoiceNumber: "",
    invoiceAmount: "",
    invoiceDate: "",
    file: "",
    integration: "",
  });

  const parseInitialDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear().toString(),
      month: date.getMonth().toString(),
    };
  };

  // Date selection state
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    parseInitialDate(initStartDate).month || ""
  );

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

  const formatDate = (year: string, month: string): Date => {
    const monthNumber = parseInt(month) + 1;
    const monthString =
      monthNumber < 10 ? `0${monthNumber}` : monthNumber.toString();
    return new Date(`${year}-${monthString}-01`);
  };

  // Update invoice date when year or month changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const date = formatDate(selectedYear, selectedMonth);
      setFormData((prev) => ({
        ...prev,
        invoiceDate: date,
      }));
    }
  }, [selectedYear, selectedMonth]);

  const handleIntegrationSelect = (option: IntegrationOption) => {
    setFormData((prev) => ({
      ...prev,
      integrationId: option.value,
      integrationPlatform: option.label,
    }));
    setErrors((prev) => ({ ...prev, integration: "" }));
  };

  const handleYearSelect = (option: YearOption) => {
    setSelectedYear(option.value);
    setErrors((prev) => ({ ...prev, invoiceDate: "" }));
  };

  const handleMonthSelect = (option: MonthOption) => {
    setSelectedMonth(option.value);
    setErrors((prev) => ({ ...prev, invoiceDate: "" }));
  };

  const getMonthLabel = (value: string) => {
    const month = months.find((m) => m.value === value);
    return month ? month.label : "";
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ].includes(file.type);

    if (!isValidSize || !isValidType) {
      toast.error(
        "Invalid file. Only JPG, JPEG, PNG, or PDF files under 5MB are allowed."
      );
      return;
    }

    setIsUploading(true);
    simulateProgress();

    try {
      const result = await getImageUrl({ file });
      setFormData((prev) => ({
        ...prev,
        invoiceUrl: result.fileUrl,
      }));
      setErrors((prev) => ({ ...prev, file: "" }));
    } catch (error) {
      // console.error(error);
      toast.error("File failed to upload");
      setErrors((prev) => ({
        ...prev,
        file: "Failed to upload file. Please try again.",
      }));
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceUrl: null,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      invoiceNumber: "",
      invoiceAmount: "",
      invoiceDate: "",
      file: "",
      integration: "",
    };

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
      isValid = false;
    }

    if (!formData.invoiceAmount || Number(formData.invoiceAmount) <= 0) {
      newErrors.invoiceAmount = "Valid invoice amount is required";
      isValid = false;
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";
      isValid = false;
    }

    if (!formData.invoiceUrl) {
      newErrors.file = "A file is required";
      isValid = false;
    }

    if (!formData.integrationId) {
      newErrors.integration = "Integration is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const id = intData?.platform ? intData?.invoices[0]?._id : intData?._id;

    // console.log(id)

    setIsLoading(true);
    try {
      // Prepare the payload matching the API structure
      const payload = {
        integrationId: formData.integrationId,
        integrationPlatform: formData.integrationPlatform,
        // description: formData.description,
        invoiceNumber: formData.invoiceNumber,
        invoiceAmount: Number(formData.invoiceAmount),
        invoiceUrl: formData.invoiceUrl,
        invoiceDate: formData.invoiceDate?.toISOString().split("T")[0], // Format as YYYY-MM-DD
      };

      // console.log(payload);
      if (isEdit) {
        // console.log("Editing")
        await updateInvoice(id, payload);
      } else {
        const response = await uploadInvoice(payload);
      }

      queryClient.invalidateQueries({
        queryKey: ["fetch-invoices"],
      });

      toast.success("Invoice uploaded successfully");

      // Reset form
      setFormData({
        invoiceNumber: "",
        invoiceAmount: 0,
        invoiceDate: null,
        invoiceUrl: null,
        integrationId: intData?.integrationId || "",
        integrationPlatform: intData?.platform || "",
        // description: intData?.description || "",
      });

      if (closeBtn) closeBtn();
    } catch (error) {
      toast.error("Failed to upload invoice");
      // console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      invoiceNumber: "",
      invoiceAmount: 0,
      invoiceDate: null,
      invoiceUrl: null,
      integrationId: intData?.integrationId || "",
      integrationPlatform: intData?.platform || "",
      // description: intData?.description || "",
    });
    setErrors({
      invoiceNumber: "",
      invoiceAmount: "",
      invoiceDate: "",
      file: "",
      integration: "",
    });
    if (closeBtn) closeBtn();
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-lg font-gilroySemiBold">
        {isEdit ? "Edit Invoice" : "Upload Invoice"}
      </h2>

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-gilroyMedium text-black">
          Integration <span className="text-red-500">*</span>
        </label>
        <SelectDropdown
          value={formData.integrationPlatform}
          options={availableIntegrations}
          onSelect={handleIntegrationSelect}
          label=""
          disabled={intData && true}
          seperator={false}
          placeholder="Select integration"
        />
        {errors.integration && (
          <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
            {errors.integration}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 gap-1 flex flex-col">
          <label className="block text-sm font-gilroyMedium text-black">
            Year <span className="text-red-500">*</span>
          </label>
          <SelectDropdown
            value={selectedYear}
            options={years}
            onSelect={handleYearSelect}
            label=""
            placeholder="Select year"
          />
        </div>
        <div className="flex-1 gap-1 flex flex-col">
          <label className="block text-sm font-gilroyMedium text-black">
            Month <span className="text-red-500">*</span>
          </label>
          <SelectDropdown
            value={getMonthLabel(selectedMonth)}
            options={months}
            onSelect={handleMonthSelect}
            label=""
            className="placeholder:text-gray-500 placeholder:font-gilroyMedium"
            placeholder="Choose month"
          />
          {errors.invoiceDate && (
            <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
              {errors.invoiceDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-gilroyMedium text-black">
          Invoice Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.invoiceNumber}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }));
            setErrors((prev) => ({ ...prev, invoiceNumber: "" }));
          }}
          className="w-full px-3 py-2 border font-gilroyMedium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder:font-gilroyMedium placeholder:text-sm"
          placeholder="Enter invoice number"
        />
        {errors.invoiceNumber && (
          <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
            {errors.invoiceNumber}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-gilroyMedium text-black">
          Invoice Amount (₹) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.invoiceAmount}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, invoiceAmount: e.target.value }));
            setErrors((prev) => ({ ...prev, invoiceAmount: "" }));
          }}
          className="w-full px-3 py-2 border font-gilroyMedium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder:font-gilroyMedium placeholder:text-sm"
          placeholder="Enter invoice amount"
          min="0"
          step="0.01"
        />
        {errors.invoiceAmount && (
          <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
            {errors.invoiceAmount}
          </p>
        )}
      </div>

      {/* <div className="flex flex-col gap-1">
        <label className="block text-sm font-gilroyMedium text-black">
          Description (Optional)
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
          }}
          className="w-full px-3 py-2 border font-gilroyMedium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder:font-gilroyMedium placeholder:text-sm"
          placeholder="Enter description"
          rows={3}
        />
      </div> */}

      <div className="flex flex-col gap-1.5 w-full">
        <label className="font-gilroyMedium text-black text-base">
          Upload File <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          <div
            className="flex flex-wrap gap-2 items-center justify-start bg-[#E9F3FF] rounded-md border-dashed min-h-16 w-full border-[1px] px-2 py-1 border-[#52ABFF] cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <div className="w-3/4 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-black rounded-full"
                    style={{
                      width: `${progress}%`,
                      transition: "width 0.1s linear",
                    }}
                  ></div>
                </div>
                <span className="text-sm text-blue-500 font-gilroySemiBold">
                  {progress}%
                </span>
              </div>
            ) : formData.invoiceUrl ? (
              <div className="relative w-full h-16 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group">
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <HugeiconsIcon icon={FileEmpty02Icon} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-center">
                      {formData.invoiceUrl.split("/").pop().substring(0, 30)}..
                    </p>
                    <p className="text-xs text-gray-500">Invoice File</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="text-white size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full mx-auto">
                <div className="font-gilroySemiBold text-sm gap-1 flex items-center">
                  <span className="text-[#0EA5E9]">Click to upload</span>
                  <span className="text-[#525252]">or drag and drop</span>
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  JPG, JPEG, PNG, PDF less than 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
          accept="image/jpeg, image/png, image/jpg, application/pdf"
        />
        {errors.file && (
          <p className="text-destructive text-xs">{errors.file}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outlineTwo"
          className="w-full"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <LoadingButton
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
        >
          {isEdit ? "Update" : "Upload"}
        </LoadingButton>
      </div>
    </div>
  );
};

export default UploadInvoiceForm;
