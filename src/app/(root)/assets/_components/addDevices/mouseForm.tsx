"use client";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import React, { useRef, useState } from "react";
import { FormErrors, KeyboardDetailsInterface } from "./_components/types";
import { Icons } from "@/components/icons";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/components/utils/upload";
import UploadImageIcon from "@/icons/UploadImageIcon";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";

interface KeyboardDetailsProps {
  data: KeyboardDetailsInterface;
  setData: (data: Partial<KeyboardDetailsInterface>) => void;
  errors: FormErrors;
}

const MouseForm: React.FC<KeyboardDetailsProps> = ({
  data,
  setData,
  errors,
}) => {
  const [formData, setFormData] = useState<KeyboardDetailsInterface>(data);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [displayFile, setDisplayFile] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    }, 100); // Simulates progress every 100ms
  };

  // Handle input changes for text and date fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidSize = file.size <= 1024 * 1024 * 5; // Max 5MB size
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ].includes(file.type);

      if (isValidSize && isValidType) {
        setIsUploading(true);
        simulateProgress();
        try {
          const res = await getImageUrl({ file });
          setDisplayFile(URL.createObjectURL(file));
          setInvoiceFile(res?.fileUrl);
        } catch (error) {
          toast.error("Some Error while uploading the File");
        } finally {
          setIsUploading(false); // Stop showing the progress bar
          setProgress(0);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          invoiceFile: "Only PDF files under 5MB are allowed.",
        }));
      }
    }
  };

  const handleRemoveFile = () => {
    setDisplayFile("");
    setInvoiceFile(null);
  };

  // const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <div className="w-full">
      <div className="font-gilroyMedium  text-base">Mouse Details</div>

      <div className="flex flex-col gap-5 mt-4">
        <FormField
          label="Model Name"
          id="model"
          name="model"
          type="text"
          value={formData?.model}
          onChange={handleChange}
          error={errors?.model}
          placeholder="eg: Mouse, etc"
        />

        <FormField
          label="Brand"
          id="brand"
          name="brand"
          type="text"
          value={formData?.brand}
          onChange={handleChange}
          error={errors?.brand}
          placeholder="eg: Brand..., etc"
        />

        <div className="flex flex-col gap-2">
          <FormField
            label="Serial Number"
            id="serialNumber"
            name="serialNumber"
            type="text"
            value={formData?.serialNumber}
            onChange={handleChange}
            error={errors?.serialNumber}
            placeholder="eg: EDIFYXXXX, etc"
          />
        </div>

        <div className="flex-1">
          <SelectDropdown
            options={[
              { label: "Good", value: "Good" },
              { label: "Excellent", value: "Excellent" },
              { label: "Fair", value: "Fair" },
            ]}
            onSelect={(data) => {
              const updatedFormData = {
                ...formData,
                device_condition: data?.value,
              };
              setFormData(updatedFormData);
              setData(updatedFormData);
            }}
            label="Condition"
            error={errors?.device_condition}
            value={`${formData?.device_condition ?? ""}`}
            placeholder="eg: Best, etc"
            className="rounded-md  text-black border border-[#5F5F5F]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-5">
        <label className="font-gilroyMedium text-black text-base">
          Upload device invoice
        </label>
        {isUploading ? (
          <div className="w-full h-24 flex flex-col items-center justify-center gap-2">
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
        ) : invoiceFile ? (
          <div className="bg-[#E9F3FF] rounded-md border-dashed  border p-3 border-[#52ABFF]">
            <div className="relative size-12  rounded-md ">
              <iframe
                src={displayFile}
                width="100%"
                height="100%"
                title="Invoice Preview"
                className="object-cover rounded-md"
                onLoad={(e) => {
                  const iframe = e.currentTarget;
                  // Ensure it's viewable content
                  if (
                    !iframe.contentDocument ||
                    iframe.contentDocument.title === ""
                  ) {
                  }
                }}
              />
              <button
                type="button"
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1"
                onClick={handleRemoveFile}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center bg-[#E9F3FF] rounded-md border-dashed h-20 w-full border p-3 border-[#52ABFF]"
            onClick={() => fileRef?.current?.click()}
          >
            <div className="flex flex-col justify-center items-center">
              <UploadImageIcon className="size-5" />
              <div className="flex gap-1 font-gilroySemiBold">
                {" "}
                <span className="text-[#0EA5E9] text-[10px]">
                  Click to upload
                </span>
                <span className="text-[10px]">or drag and drop</span>
              </div>
              <p className="text-xs font-gilroyMedium text-neutral-400 text-[9px]">
                JPG, JPEG, PNG less than 1MB
              </p>
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {errors?.invoiceFile && (
          <p className="text-destructive text-sm">{errors?.invoiceFile}</p>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center gap-4 mt-8">
        <div className="flex-1">
          <FormField
            label="Purchase Date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData?.purchaseDate}
            type="date"
            onChange={handleChange}
            error={errors?.purchaseDate}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div className="flex-1">
          <FormField
            label="Warranty Period"
            id="warrantyExpiryDate"
            name="warrantyExpiryDate"
            value={formData?.warrantyExpiryDate}
            type="date"
            onChange={handleChange}
            error={errors?.warrantyExpiryDate}
            placeholder="Select your birthdate"
          />
        </div>
      </div>
    </div>
  );
};

export default MouseForm;
