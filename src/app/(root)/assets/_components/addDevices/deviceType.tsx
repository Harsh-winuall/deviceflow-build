"use client";

import BulkUpload from "@/components/bulk-upload";
import { AsyncSelect } from "@/components/ui/async-select";
import { bulkUploadDevices } from "@/server/deviceActions";
import { fetchUsers, User } from "@/server/userActions";
import { Keyboard, Laptop2, Monitor, Mouse, Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormData } from "./_components/types";

type DeviceTypeProps = {
  data: string;
  setData: (newData: string) => void;
  error?: string;
  closeBtn: () => void;
  isEditForm?: boolean;
  setTotalSteps: (steps: number) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  userName?: string;
};

const DeviceType = ({
  data,
  setData,
  error,
  closeBtn,
  setTotalSteps,
  isEditForm,
  formData: { userId },
  setFormData,
  userName,
}: DeviceTypeProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(
    data ?? ""
  );
  const [user, setUser] = useState<User>({ _id: userId, email: userName });

  useEffect(() => {
    setSelectedDevice(data ?? "");
    const count = deviceList.filter((val) => val.id === data);
    setTotalSteps(count?.[0]?.steps);
    setData(data);
    if (user._id) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [data, user._id]);

  const handleSelect = (device: string) => {
    if (isEditForm) return; // Prevent selection in edit form.
    setSelectedDevice(device);
    setData(device);
  };

  const deviceList = [
    {
      id: "laptop",
      label: "Laptop",
      logo: <Laptop2 className="size-5" />,
      steps: 2,
    },
    {
      id: "keyboard",
      label: "Keyboard",
      logo: <Keyboard className="size-5" />,
      steps: 1,
    },
    {
      id: "mobile",
      label: "Mobile",
      logo: <Smartphone className="size-5" />,
      steps: 2,
    },
    {
      id: "mouse",
      label: "Mouse",
      logo: <Mouse className="size-5" />,
      steps: 1,
    },
    {
      id: "monitor",
      label: "Monitor",
      logo: <Monitor className="size-5" />,
      steps: 1,
    },
  ];

  return (
    <div className="w-full">
      {!isEditForm ? (
        <>
          <div className="flex">
            <BulkUpload
              sampleData={{
                model: "XXXX",
                device_name: "YYYYY",
                serial_no: "XXXX1234",
                device_purchase_date: "09/12/2023",
                ram: "16GB",
                processor: "Intel Core i5",
                storage: "256GB",
                warranty_expiary_date: "21/11/2024",
                os: "Windows",
                price: 12000,
                device_type: "Laptop",
                brand: "HP",
                device_condition: "Fair",
              }}
              closeBtn={closeBtn}
              requiredKeys={["device_name", "serial_no"]}
              bulkApi={bulkUploadDevices}
              type="device"
            />
          </div>
          <div className="flex items-center justify-center mt-3">
            <div className="border-t border-gray-400 w-7"></div>
            <span className="mx-2 font-gilroySemiBold text-sm text-gray-400">
              OR
            </span>
            <div className="border-t border-[#B1B1B1] w-7"></div>
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="font-gilroyMedium text-base">Device Type</div>
        <div className="grid grid-cols-2 gap-5 mb-4">
          {deviceList.map((device, index) => (
            <div
              key={device.id}
              className={`${
                index === deviceList.length - 1 && deviceList.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              } flex items-center border rounded-md p-2 text-lg ${
                isEditForm ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                selectedDevice === device.id
                  ? "border-black"
                  : "border-[#D5D5D5]"
              }`}
              onClick={() => {
                if (!isEditForm) {
                  setTotalSteps(device.steps);
                  handleSelect(device.id);
                }
              }}
            >
              <input
                type="radio"
                id={device.id}
                name="device"
                checked={selectedDevice === device.id}
                disabled={isEditForm} // Disable input when in edit mode.
                onChange={() => {
                  if (!isEditForm) {
                    setTotalSteps(device.steps);
                    handleSelect(device.id);
                  }
                }}
                className="sr-only"
              />
              <label
                htmlFor={device.id}
                className={` ${
                  selectedDevice === device.id ? "text-black" : "text-gray-600"
                } ${
                  isEditForm ? "cursor-not-allowed" : "cursor-pointer"
                } flex justify-center items-center gap-3 py-1.5 px-2`}
              >
                <span className="text-black">{device.logo}</span>
                <span className="text-black font-gilroyMedium text-sm">
                  {device.label}
                </span>
              </label>
            </div>
          ))}
          {error && (
            <p className="text-red-500 text-xs font-gilroyMedium transition-all duration-300">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-gilroyMedium text-base">Device Assign to</div>

        <div className="w-full pt-2">
          <AsyncSelect<User>
            fetcher={fetchUsers}
            queryKey="fetch-users"
            preload
            renderOption={(user) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-gilroyMedium">{user?.first_name}</div>
                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
            )}
            filterFn={(user, query) =>
              user?.first_name?.toLowerCase()?.includes(query?.toLowerCase()) ||
              user?.email?.toLowerCase()?.includes(query?.toLowerCase())
            }
            getOptionValue={(user) => user?.email}
            getDisplayValue={(displayUser) => (
              <div className="flex items-center gap-2 text-left w-full">
                <div className="flex flex-col leading-tight">
                  <div className="font-gilroyMedium">
                    {userName === displayUser?.email
                      ? displayUser?.email
                      : user?.email ?? ""}
                  </div>
                </div>
              </div>
            )}
            notFound={
              <div className="py-6 text-center font-gilroyMedium text-sm">
                No users found
              </div>
            }
            label="User"
            placeholder="Assigning to"
            value={user?.email || "null"}
            onChange={(selected: User | null) => {
              setUser({
                email: selected?.email,
                _id: selected?._id,
                first_name: selected?.first_name,
              });
            }}
            width="100%"
            triggerClassName="border border-[#5F5F5F]"
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceType;
