"use client";
import React, { useState } from "react";
import { DevicePage1 as DevicePage1, FormErrors } from "./_components/types";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import AndroidIcon from "@/icons/AndroidIcon";
import AppleIcon from "@/icons/AppleIcon";

interface BasicDetailsProps {
  data: DevicePage1;
  setData: (data: Partial<DevicePage1>) => void;
  errors: FormErrors;
  deviceType: string;
}

const MobileForm: React.FC<BasicDetailsProps> = ({
  data,
  setData,
  errors,
  deviceType,
}) => {
  const [selectedOS, setSelectedOS] = useState<string | null>(data?.os || "");
  const [formData, setFormData] = useState<DevicePage1>(data);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e?.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
    setData(updatedFormData); // Set the data after updating formData to avoid outdated values
  };

  // Handle OS selection
  const handleSelectOS = (os: string) => {
    const updatedFormData = {
      ...formData,
      os: os,
    };
    setSelectedOS(os);
    setFormData(updatedFormData);
    setData(updatedFormData); // Ensure you setData after updating formData
  };

  const operatingSystems = [
    {
      id: "android",
      name: "Android",
      description: "Android 13, Android 14, Android 15",
      icon: <AndroidIcon className="-ml-1 size-7 p-0 " />,
    },
    {
      id: "apple",
      name: "Apple",
      description: "ios 10, ios 12, ios 13",
      icon: <AppleIcon className="-ml-0.5 mb-1 size-6" />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <h1 className=" text-base font-gilroyMedium mb-3">Select OS</h1>

      <div
        className={`flex justify-between items-center flex-wrap gap-4 w-full ${
          !errors?.os && "mb-5"
        }`}
      >
        {deviceType === "mobile" &&
          operatingSystems?.map((os, index) => (
            <div
              key={os?.id}
              className={`flex-grow ${
                index < 2 ? "w-[calc(50%-8px)]" : "w-[calc(50%-8px)]"
              } px-4 py-2 flex items-start border rounded-md cursor-pointer ${
                selectedOS === os.id ? "border-black" : "border-[#D5D5D5]"
              }`}
              onClick={() => handleSelectOS(os?.id)}
            >
              <input
                type="radio"
                id={os?.id}
                checked={selectedOS === os?.id}
                onChange={() => handleSelectOS(os?.id)}
                className="mr-3 h-4 w-4 mt-1 accent-black sr-only"
              />
              <label htmlFor={os?.id} className="flex flex-col">
                <p className="flex items-center font-gilroyMedium gap-2 text-sm">
                  {os?.icon}
                  {os?.name}
                </p>
                <span className="text-[10px] text-[#C8C8C8] font-gilroyMedium">
                  {os?.description}
                </span>
              </label>
            </div>
          ))}
      </div>

      {errors?.os && (
        <p className="text-red-500 text-xs font-gilroyMedium mb-8">
          {errors?.os}
        </p>
      )}

      <div className="flex flex-col gap-5">
        <div className="">
          <SelectDropdown
            options={[
              { label: "Realme", value: "Realme" },
              { label: "Apple", value: "Apple" },
              { label: "Samsung", value: "Samsung" },
              { label: "OnePlus", value: "OnePlus" },
              { label: "Xiaomi", value: "Xiaomi" },
              { label: "Others", value: "Others" },
            ]}
            onSelect={(data) => {
              const updatedFormData = {
                ...formData,
                brand: data?.value,
              };
              setFormData(updatedFormData);
              setData(updatedFormData);
            }}
            label="Brand"
            error={errors?.brand}
            value={`${formData?.brand ?? ""}`}
            placeholder="eg: Realme, etc"
            className=" rounded-md   text-black border border-[#5F5F5F]"
          />
        </div>

        <div>
          <FormField
            label="Device Name"
            id="custom_model"
            name="custom_model"
            type="text"
            value={formData?.custom_model!}
            onChange={handleChange}
            error={errors?.custom_model}
            placeholder="eg: Realme 16s, etc"
            className="outline-[#5F5F5F] border"
          />
        </div>

        <div>
          <FormField
            label="Model Name"
            id="model"
            name="model"
            type="text"
            value={formData?.model!}
            onChange={handleChange}
            error={errors?.model}
            placeholder="eg: X14D, etc"
          />
        </div>

        <div className="flex gap-4">
          <div className="z-20 flex-1">
            <SelectDropdown
              options={[
                { label: "Apple A14 Bionic", value: "Apple A14 Bionic" },
                {
                  label: "Qualcomm Snapdragon ",
                  value: "Qualcomm Snapdragon ",
                },
                {
                  label: "MediaTek ",
                  value: "MediaTek ",
                },
                { label: "Exynos ", value: "Exynos " },
                { label: "Others", value: "Others" },
              ]}
              onSelect={(data) => {
                const updatedFormData = {
                  ...formData,
                  processor: data?.value,
                };
                setFormData(updatedFormData);
                setData(updatedFormData);
              }}
              label="Processor"
              error={errors?.processor}
              value={`${formData?.processor ?? ""}`}
              placeholder="eg: MediaTek, etc"
              className="rounded-md  text-black border border-[#5F5F5F]"
            />
          </div>
          <div className="flex-1">
            <SelectDropdown
              options={[
                { label: "4GB", value: "4GB" },
                { label: "6GB", value: "6GB" },
                { label: "8GB", value: "8GB" },
                { label: "12GB", value: "12GB" },
                { label: "16GB", value: "16GB" },
              ]}
              onSelect={(data) => {
                const updatedFormData = {
                  ...formData,
                  ram: data?.value,
                };
                setFormData(updatedFormData);
                setData(updatedFormData);
              }}
              label="RAM"
              error={errors?.ram}
              value={formData?.ram ?? ""}
              className="rounded-md  text-black border border-[#5F5F5F]"
              placeholder="eg: 8GB, etc"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <SelectDropdown
              options={[
                { label: "64GB", value: "64GB" },
                { label: "128GB", value: "128GB" },
                { label: "256GB", value: "256GB" },
                { label: "512GB", value: "512GB" },
                { label: "1TB", value: "1TB" },
              ]}
              onSelect={(data) => {
                const updatedFormData = {
                  ...formData,
                  storage: [data?.value],
                };
                setFormData(updatedFormData);
                setData(updatedFormData);
              }}
              label="Storage"
              error={errors?.storage}
              value={`${formData?.storage ?? ""}`}
              placeholder="eg: 256GB, etc"
              className="rounded-md  text-black border border-[#5F5F5F]"
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
      </div>
    </div>
  );
};

export default MobileForm;
