// basicDetailsDevice.tsx

import React, { useState } from "react";
import { DevicePage1 as DevicePage1, FormErrors } from "./_components/types";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import AppleIcon from "@/icons/AppleIcon";
import WindowsIcon from "@/icons/WindowsIcon";
import UbuntuIcon from "@/icons/UbuntuIcon";

interface BasicDetailsProps {
  data: DevicePage1;
  setData: (data: Partial<DevicePage1>) => void;
  errors: FormErrors;
  deviceType: string;
}

const LaptopForm: React.FC<BasicDetailsProps> = ({
  data,
  setData,
  errors,
  deviceType,
}) => {
  const [selectedOS, setSelectedOS] = useState<string | null>(data?.os || "");
  const [formData, setFormData] = useState<DevicePage1>(data);
  useState<boolean>(false); // Trigger fetch on focus

  // Handle text inputs
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
      id: "macos",
      name: "MacOS",
      description: "High Sierra, Monterey, Ventura",
      icon: <AppleIcon />,
    },
    {
      id: "windows",
      name: "Windows",
      description: "Windows 8, Windows 10, Windows 11",
      icon: <WindowsIcon />,
    },
    {
      id: "others",
      name: "Others",
      description: "Linux, DOS, Chrome OS",
      icon: <UbuntuIcon />,
    },
  ];

  return (
    <div className="flex flex-col h-[70vh]  overflow-y-auto hide-scrollbar ">
      <h1 className=" text-base font-gilroyMedium mb-2">Select OS</h1>

      <div
        className={`flex text-xs font-gilroyMedium justify-between items-center flex-wrap gap-4 w-full ${
          !errors?.os && "mb-8"
        }`}
      >
        {deviceType === "laptop" &&
          operatingSystems?.map((os, index) => (
            <div
              key={os?.id}
              className={`flex-grow-0 flex-shrink-0 ${
                index < 2 ? "w-[calc(50%-8px)]" : "w-[calc(50%-8px)]"
              } px-4 py-3 flex items-start border rounded-md cursor-pointer ${
                selectedOS === os?.id ? "border-black " : "border-[#D5D5D5]"
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
                  <span className="-mt-1">{os?.icon}</span>
                  {os?.name}
                </p>
                <span
                  className={`text-[10px] font-gilroyMedium ${
                    selectedOS === os?.id ? "text-black" : "text-gray-400"
                  }`}
                >
                  {os?.description}
                </span>
              </label>
            </div>
          ))}
      </div>

      {errors?.os && (
        <p className="text-red-500 text-xs mt-0.5 font-gilroyMedium mb-4">
          {errors?.os}
        </p>
      )}

      <div className="flex flex-col gap-6">
        <div className="">
          <SelectDropdown
            options={[
              { label: "Lenovo", value: "Lenovo" },
              { label: "Apple", value: "Apple" },
              { label: "Dell", value: "Dell" },
              { label: "HP", value: "HP" },
              { label: "ASUS", value: "ASUS" },
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
            placeholder="eg: Lenovo, etc"
            className=" rounded-md   text-black border border-[#5F5F5F]"
          />
        </div>

        <div>
          <FormField
            label="Model Name"
            id="model"
            name="model"
            type="text"
            value={formData?.model ?? ""}
            onChange={handleChange}
            error={errors?.model}
            placeholder=" eg: X14D, etc"
          />
        </div>

        <div className="flex gap-4">
          <div className="z-20 flex-1">
            <SelectDropdown
              options={[
                { label: "Intel Core i3", value: "Intel Core i3" },
                { label: "Intel Core i5", value: "Intel Core i5" },
                { label: "Intel Core i7", value: "Intel Core i7" },
                { label: "AMD Ryzen 5", value: "AMD Ryzen 5" },
                { label: "Apple M1", value: "Apple M1" },
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
              placeholder="eg: Intel Core i3, etc"
              className="rounded-md  text-black border border-[#5F5F5F]"
            />
          </div>

          <div className="flex-1">
            <SelectDropdown
              options={[
                { label: "4GB", value: "4GB" },
                { label: "8GB", value: "8GB" },
                { label: "16GB", value: "16GB" },
                { label: "32GB", value: "32GB" },
                { label: "64GB", value: "64GB" },
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
                { label: "128GB", value: "128GB" },
                { label: "256GB", value: "256GB" },
                { label: "512GB", value: "512GB" },
                { label: "1TB", value: "1TB" },
                { label: "2TB", value: "2TB" },
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
              value={formData?.storage?.[0] ?? ""}
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

export default LaptopForm;
