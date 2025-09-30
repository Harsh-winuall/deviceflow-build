"use client";
import { Icons } from "@/app/(root)/people/icons";
import {
  checkForDuplicates,
  parseCSV,
} from "@/components/bulk-upload/CSVHelper";
import { toast } from "sonner";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon } from "@hugeicons/core-free-icons";
type dataProps = {
  requiredKeys: string[];
  bulkApi: (formData: any) => Promise<any>;
  sampleData: Record<string, string | number>;
  setSuccess: any;
};
function BulkUpload({
  requiredKeys,
  bulkApi,
  setSuccess,
  sampleData,
}: dataProps) {
  const [loading, setLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateCSV = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) {
        setCsvError("The file is empty or not formatted correctly.");
        setLoading(false);
        return;
      }

      try {
        const { headers, data } = parseCSV(csvText);

        if (headers.length !== requiredKeys.length) {
          setCsvError(
            `Invalid number of fields. Expected ${requiredKeys.length} fields but got ${headers.length}.`
          );
          setLoading(false);
          return;
        }

        const missingKeys = requiredKeys.filter(
          (key) => !headers.includes(key)
        );
        if (missingKeys.length > 0) {
          setCsvError(`Missing fields: ${missingKeys.join(", ")}`);
          setLoading(false);
          return;
        }

        // Check for empty values in required fields
        const emptyRows = data.filter((row) => {
          return requiredKeys.some((key) => !row[key]);
        });

        if (emptyRows.length > 0) {
          setCsvError(`Some rows are empty`);
          setLoading(false);
          return;
        }

        const duplicateCheck = checkForDuplicates(data);
        if (duplicateCheck.hasDuplicates) {
          setCsvError(
            `Duplicate records found. Row(s): ${duplicateCheck.duplicateRows.join(
              ", "
            )}`
          );
          setLoading(false);
          return;
        }

        // Clear errors and proceed with uploading
        setCsvError(null);
        handleBulkUpload(file);
      } catch (err) {
        setCsvError("Error parsing the file. Please ensure it is a valid CSV.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setCsvError("Error reading the file.");
      setLoading(false);
    };

    reader.readAsText(file);

    // Reset file input value after parsing
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset value after file change
    }
  };

  const handleBulkUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await bulkApi(formData); // Call the API

      const employeeCount = localStorage.getItem("employee-count");
      if (employeeCount) {
        const empCountInt = parseInt(employeeCount);
        if (empCountInt >= 0) {
          localStorage.setItem("employee-count", `${empCountInt + 1}`);
        }
      }

      setSuccess(true);
      setLoading(false);
    } catch (error: any) {
      if (error.message.includes("E11000 duplicate key error")) {
        const duplicateField = error.message.match(
          /index: (\w+)_1 dup key: \{ (\w+): "(.*?)"/
        );
        if (duplicateField && duplicateField[3]) {
          toast.error(
            `Duplicate entry detected: ${duplicateField[1]} with value "${duplicateField[3]}" already exists.`
          );

          setCsvError(
            `Duplicate entry detected: ${duplicateField[1]} with value "${duplicateField[3]}" already exists.`
          );
        } else {
          toast.error(
            "A duplicate entry error occurred. Please check your data."
          );
        }
      } else {
        // Generic error handling
        toast.error(`${"An error occurred during bulk upload."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input click
    }
  };

  const downloadSampleCSV = () => {
    // Create the header row using required keys
    const csvHeader = requiredKeys.join(",");

    // Create a sample row by mapping keys to provided sample data or default empty values
    const csvRow = requiredKeys.map((key) => sampleData?.[key] || "").join(",");

    // Combine header and sample data rows
    const csvContent = `${csvHeader}\n${csvRow}`;

    // Create and trigger the download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample.csv";
    link.click();
  };
  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <img
              src="/media/bulk_Loader.gif"
              alt="Loading..."
              className="w-16 h-16"
            />
          </div>
        ) : (
          // <div className="w-full flex flex-col gap-4">
          //   <div className="font-gilroySemiBold 2xl:text-2xl text-xl text-black">
          //     Bulk Import
          //   </div>
          //   <div className="w-full flex justify-between gap-4">
          //     <button
          //       disabled={loading}
          //       className="flex-1 bg-black rounded-full text-white font-gilroySemiBold 2xl:text-lg text-base py-2 px-1"
          //       onClick={handleFileUploadClick}
          //     >
          //       Upload CSV
          //     </button>
          //     <button
          //       className="flex-1 border border-[#5F5F5F] rounded-full text-[#5F5F5F] font-gilroySemiBold 2xl:text-lg text-base py-2 px-1"
          //       onClick={downloadSampleCSV}
          //     >
          //       Download Sample CSV
          //     </button>
          //   </div>
          //   <input
          //     type="file"
          //     accept=".csv"
          //     ref={fileInputRef}
          //     onChange={(e) => {
          //       if (e.target.files && e.target.files.length > 0) {
          //         validateCSV(e.target.files[0]);
          //       }
          //     }}
          //     className="hidden"
          //   />
          // </div>

          <div className="w-full flex flex-col gap-2">
            <div className="font-gilroyMedium text-base text-black">
              Bulk Import
            </div>

            <div className="rounded-lg p-3  flex justify-between items-center border border-gray-200">
              <div className="flex gap-2">
                <HugeiconsIcon icon={File01Icon} className="text-blue-600 size-9"/>
                <div className="flex flex-col ">
                  <h1 className="text-base font-gilroySemiBold">Upload CSV</h1>
                  <p
                    className="text-[#007aff] text-xs cursor-pointer font-gilroyMedium hover:underline"
                    onClick={downloadSampleCSV}
                  >
                    Download sample CSV
                  </p>
                </div>
              </div>

              <button
                disabled={loading}
                className={` bg-black rounded-md text-white font-gilroyMedium  text-sm py-2 px-5 hover:bg-gray-800 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleFileUploadClick}
              >
                Upload
              </button>
            </div>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  validateCSV(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        )}

        {csvError && (
          <p className="text-red-500 text-xs font-gilroyMedium transition-all duration-300 mb-4">
            {csvError}
          </p>
        )}
      </div>
    </>
  );
}

export default BulkUpload;
