"use client";
import ExcelJS from "exceljs";
import { Icons } from "@/app/(root)/people/icons";
import { useAlert } from "@/hooks/useAlert";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { checkForDuplicates, parseCSV } from "./CSVHelper";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon } from "@hugeicons/core-free-icons";
import { useQueryClient } from "@tanstack/react-query";
import ExtraSeatConfirmationDialog from "../settings/extra-seat-dialog";
import { getSeatsValidity } from "@/server/settingActions";

type dataProps = {
  closeBtn: () => void;
  requiredKeys: string[];
  bulkApi: (formData: any) => Promise<any>;
  sampleData: Record<string, string | number>;
  getBulkResponse?: (data: any) => void;
  integrationId?: string;
  type?: string;
};
function BulkUpload({
  closeBtn,
  requiredKeys,
  bulkApi,
  sampleData,
  getBulkResponse,
  integrationId,
  type,
}: dataProps) {
  const [csvError, setCsvError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [extraSeatData, setExtraSeatData] = useState<any>(null);
  const [extraSeatDialogOpen, setExtraSeatDialogOpen] = useState(false);
  const [seatCount, setSeatCount] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const validateCSV = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText)
          throw new Error("The file is empty or not formatted correctly.");

        const { headers, data } = parseCSV(csvText);

        const missingKeys = requiredKeys.filter(
          (key) => !headers.includes(key)
        );
        if (missingKeys.length)
          throw new Error(`Missing fields: ${missingKeys.join(", ")}`);

        const emptyRows = data.filter((row) =>
          requiredKeys.some((key) => !row[key])
        );
        if (emptyRows.length)
          throw new Error(
            "Some fields are left empty. Please fill all the fields"
          );

        const duplicateCheck = checkForDuplicates(data);
        if (duplicateCheck.hasDuplicates)
          throw new Error(
            `Duplicate records found. Row(s): ${duplicateCheck.duplicateRows.join(
              ", "
            )}`
          );

        setCsvError(null);

        if (type === "user") {
          const response = await getSeatsValidity(data.length);
          console.log(response, "response from seat api");
          if (response.valid !== true) {
            setSeatCount(
              response?.currentValidUsers + data.length - response?.maxSeats
            );
            setExtraSeatData(response);
            setExtraSeatDialogOpen(true);
            return;
          }
        }

        handleBulkUpload(file);
      } catch (err: any) {
        setCsvError(err.message || "Error parsing the file.");
      } finally {
        setLoading(false); // Always reset the loading state
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
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = integrationId
        ? await bulkApi({ formData, integrationId })
        : await bulkApi(formData);

      console.log(response, "response");
      if (response.message) {
        setExtraSeatData(response);
        setExtraSeatDialogOpen(true);
        return;
      }

      if (type === "user" || type === "device") {
        null;
      } else {
        !integrationId && getBulkResponse(response);
      }

      if (response?.userIds?.length === 0) {
        toast.error("These users does not exists!");
        return;
      }

      if (response?.skippedSerialNumbers) {
        if (response?.skippedSerialNumbers?.length === 0) {
          // ✅ All uploaded successfully
          showAlert({
            title: "WOHOOO!! 🎉",
            description: "Bulk Upload successfully!",
            isFailure: false,
            key: "create-team-success",
          });
        } else if (response?.device?.length === 0) {
          // ❌ No device uploaded
          showAlert({
            title: "All Serial Numbers Exist!",
            description: `Skipped: ${response?.skippedSerialNumbers?.join(
              ", "
            )}`,
            isFailure: true,
            key: "create-team-failure",
          });
        } else {
          // ⚠️ Partial success
          showAlert({
            title: "Few Devices Uploaded!",
            description: `Skipped Serial Numbers: ${response?.skippedSerialNumbers?.join(
              ", "
            )}`,
            isFailure: false,
            key: "create-team-partial",
          });
        }
      }

      if (integrationId) {
        queryClient.invalidateQueries({
          queryKey: ["user-by-integrations"],
          exact: false,
          refetchType: "all",
          type: "all",
        });
      }

      if (type === "user") {
        queryClient.invalidateQueries({ queryKey: ["fetch-people"] });
      }

      router.refresh();
      closeBtn();
    } catch (error: any) {
      if (error.message.includes("E11000 duplicate key error")) {
        const match = error.message.match(
          /index: (\w+)_1 dup key: \{ (\w+): "(.*?)"/
        );
        if (match) {
          setCsvError(
            `Duplicate entry detected: ${match[2]} with value "${match[3]}" already exists.`
          );
        } else {
          toast.error(
            "A duplicate entry error occurred. Please check your data."
          );
        }
      }
      toast.error("Error occurred during bulk upload !");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const downloadSampleCSV = () => {
  //   const csvContent = requiredKeys.join(",");

  //   const blob = new Blob([csvContent], { type: "text/csv" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "sample.csv";
  //   link.click();
  // };

  const downloadSampleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Data");

    // Headers
    const headers = Object.keys(sampleData);
    worksheet.addRow(headers);

    // Sample Row
    worksheet.addRow(Object.values(sampleData));

    // Helper function: get Excel column letter (A, B, C...)
    const getColumnLetter = (colNumber: number) => {
      let temp = "";
      let num = colNumber;
      while (num > 0) {
        let rem = (num - 1) % 26;
        temp = String.fromCharCode(65 + rem) + temp;
        num = Math.floor((num - 1) / 26);
      }
      return temp;
    };

    // Find indexes for purchase & warranty dates
    const purchaseColIndex = headers.indexOf("device_purchase_date") + 1;
    const warrantyColIndex = headers.indexOf("warranty_expiary_date") + 1;

    const purchaseColLetter = getColumnLetter(purchaseColIndex);
    const warrantyColLetter = getColumnLetter(warrantyColIndex);

    headers.forEach((header, index) => {
      const col = index + 1; // 1-based index
      if (header === "device_type") {
        worksheet.getColumn(col).eachCell((cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.dataValidation = {
              type: "list",
              allowBlank: false,
              formulae: ['"laptop,keyboard,mobile,license,others"'],
            };
          }
        });
      }

      if (header === "os") {
        worksheet.getColumn(col).eachCell((cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.dataValidation = {
              type: "list",
              allowBlank: false,
              formulae: ['"macos,windows,others"'],
            };
          }
        });
      }

      if (header === "device_condition") {
        worksheet.getColumn(col).eachCell((cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.dataValidation = {
              type: "list",
              allowBlank: false,
              formulae: ['"Excellent,Good,Fair"'],
            };
          }
        });
      }

      if (header === "device_purchase_date") {
        worksheet.getColumn(col).eachCell((cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.numFmt = "dd/mm/yyyy";
            cell.dataValidation = {
              type: "date",
              operator: "lessThanOrEqual",
              formulae: ["TODAY()"], // ✅ must not be future
              showErrorMessage: true,
              errorTitle: "Invalid Date",
              error:
                "Purchase date cannot be in the future (must be <= TODAY).",
            };
          }
        });
      }

      if (header === "warranty_expiary_date") {
        worksheet.getColumn(col).eachCell((cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.numFmt = "dd/mm/yyyy";
            cell.dataValidation = {
              type: "custom",
              // ✅ dynamically reference correct columns
              formulae: [
                `${warrantyColLetter}${rowNumber}>${purchaseColLetter}${rowNumber}`,
              ],
              showErrorMessage: true,
              errorTitle: "Invalid Warranty Date",
              error: "Warranty expiry date must be greater than purchase date.",
            };
          }
        });
      }
    });

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Trigger download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_bulk_upload.xlsx";
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
          <div className="w-full flex flex-col gap-2">
            <div className="rounded-md p-2 flex justify-between items-center border border-gray-200">
              <div className="flex gap-2 items-center">
                <HugeiconsIcon
                  icon={File01Icon}
                  className="text-blue-600 size-9"
                />
                <div className="flex flex-col ">
                  <h1 className="text-[15px] font-gilroySemiBold">
                    Upload CSV
                  </h1>
                  <p
                    className="text-[#007aff] text-[12px] cursor-pointer font-gilroyMedium hover:underline"
                    onClick={downloadSampleExcel}
                  >
                    Download sample CSV
                  </p>
                </div>
              </div>

              <button
                disabled={loading}
                type="button"
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
                  setFile(e.target.files[0]);
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

        <ExtraSeatConfirmationDialog
          setOpen={setExtraSeatDialogOpen}
          data={extraSeatData}
          open={extraSeatDialogOpen}
          seatCount={seatCount}
          followingFn={() => {
            handleBulkUpload(file);
          }}
        ></ExtraSeatConfirmationDialog>
      </div>
    </>
  );
}

export default BulkUpload;
