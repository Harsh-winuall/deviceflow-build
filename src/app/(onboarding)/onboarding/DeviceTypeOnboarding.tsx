"use client";

import { AsyncSelect } from "@/components/ui/async-select";
import { bulkUploadDevices } from "@/server/deviceActions";
import { fetchUsers, User } from "@/server/userActions";
import { Keyboard, Laptop2, Monitor, Mouse, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import BulkUpload from "./BulkUpload";

type DeviceTypeProps = {
  data: string;
  setData: (newData: string) => void;
  error?: string;
  setTotalSteps: (steps: number) => void;
  setSuccess: (succ: boolean) => void;
  setFormData?: any;
};

const DeviceTypeOnboarding = ({
  data,
  setData,
  error,
  setTotalSteps,
  setSuccess,
  setFormData,
}: DeviceTypeProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(
    data ?? ""
  );
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    setSelectedDevice(data ?? "");
    const count = deviceList.filter((val) => val.id === data);
    setTotalSteps(count?.[0]?.steps);
    setData(data);
  }, [data]);

  const handleSelect = (device: string) => {
    setSelectedDevice(device);
    setData(device);
  };

  const deviceList = [
    {
      id: "laptop",
      label: "Laptop",
      logo: <Laptop2 className="size-6 " />,
      steps: 2,
    },
    {
      id: "keyboard",
      label: "Keyboard",
      logo: <Keyboard className="size-6 " />,
      steps: 1,
    },
    {
      id: "mobile",
      label: "Mobile",
      logo: <Smartphone className="size-6 " />,
      steps: 2,
    },
    {
      id: "mouse",
      label: "Mouse",
      logo: <Mouse className="size-6 " />,
      steps: 1,
    },
    {
      id: "monitor",
      label: "Monitor",
      logo: <Monitor className="size-6 " />,
      steps: 1,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex">
        <BulkUpload
          setSuccess={setSuccess}
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
          // closeBtn={closeBtn}
          requiredKeys={[
            "model",
            "device_name",
            "serial_no",
            "device_purchase_date",
            "ram",
            "processor",
            "storage",
            "warranty_expiary_date",
            "os",
            "price",
            "device_type",
            "brand",
            "device_condition",
          ]}
          bulkApi={bulkUploadDevices}
        />
      </div>
      <div className="flex items-center justify-center mt-3.5 mb-1">
        <div className="border-t border-gray-400 w-6"></div>
        <span className="mx-4 font-gilroySemiBold  text-base text-gray-400">
          OR
        </span>
        <div className="border-t border-[#B1B1B1] w-6"></div>
      </div>

      <div className="flex flex-col gap-6 mb-2">
        <div className="font-gilroySemiBold text-2xl/3">Device Type</div>
        <div className="grid grid-cols-2 gap-5 mb-3">
          {deviceList?.map((device, index) => (
            <div
              key={device?.id}
              className={`${
                index === deviceList?.length - 1 && deviceList?.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              } flex items-center border-[2px] rounded-xl p-2 text-lg cursor-pointer ${
                selectedDevice === device.id
                  ? "border-black"
                  : "border-[#D5D5D5]"
              }`}
              onClick={() => {
                setTotalSteps(device?.steps);
                handleSelect(device?.id);
              }}
            >
              <input
                type="radio"
                id={device?.id}
                name="device"
                checked={selectedDevice === device.id}
                onChange={() => {
                  setTotalSteps(device?.steps);
                  handleSelect(device?.id);
                }}
                className="sr-only"
              />
              <label
                htmlFor={device?.id}
                className={`cursor-pointer ${
                  selectedDevice === device.id ? "text-black" : "text-gray-600"
                } flex justify-center items-center gap-3 py-1.5 px-2`}
              >
                <span className="text-black">{device?.logo}</span>
                <span className="text-black font-gilroyMedium text-lg">
                  {device?.label}
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

      <div className="flex flex-col mt-2 mb-1">
        <div className="font-gilroySemiBold text-lg">
          Device Assign to{" "}
          <span className="text-sm font-gilroyRegular text-neutral-400">
            (optional)
          </span>
        </div>

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
                    {user?.first_name === displayUser?.first_name
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
              setUser(selected);
              if (setFormData) {
                setFormData((prev: any) => ({
                  ...prev,
                  userId: selected?._id || null,
                }));
              }
            }}
            width="100%"
            triggerClassName="border border-[#5F5F5F]"
          />
          khkjohiu
        </div>
      </div>
    </div>
  );
};

export default DeviceTypeOnboarding;
