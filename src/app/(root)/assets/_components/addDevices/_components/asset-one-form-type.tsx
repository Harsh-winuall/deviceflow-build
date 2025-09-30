import React, { useState } from "react";
import { Keyboard, Laptop2, Monitor, Smartphone } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CpuIcon, Key01Icon } from "@hugeicons/core-free-icons";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AsyncSelect } from "@/components/ui/async-select";
import { fetchUsers, User } from "@/server/userActions";
import { Device, fetchAllSoftware, fetchDevices } from "@/server/deviceActions";
import { assetFormOneType } from "./utils/validation";

function AssetOneFormType({
  assetFormOne,
  assetOneFormSubmit,
  isEdit = false,
  licenseDeviceType,
}: {
  assetFormOne: UseFormReturn<{
    device_name?: string;
    device_type?: string;
    assigning_to?: string;
    assigning_to_id?: string;
    attach_asset_to?: string;
    attach_asset_to_id?: string;
  }>;
  assetOneFormSubmit: (values: assetFormOneType) => void;
  isEdit?: boolean;
  licenseDeviceType?: boolean;
}) {
  React.useEffect(() => {
    if (licenseDeviceType) {
      assetFormOne.setValue("device_type", "license");
    }
  }, [licenseDeviceType, assetFormOne]);
  const deviceList = [
    { id: "laptop", label: "Laptop", logo: <Laptop2 className="size-5" /> },
    {
      id: "keyboard",
      label: "Keyboard/Mouse",
      logo: <Keyboard className="size-5" />,
    },
    { id: "mobile", label: "Mobile", logo: <Smartphone className="size-5" /> },
    { id: "monitor", label: "Monitor", logo: <Monitor className="size-5" /> },
    {
      id: "license",
      label: "License Key",
      logo: <HugeiconsIcon icon={Key01Icon} className="size-5" />,
    },
    {
      id: "others",
      label: "Others",
      logo: <HugeiconsIcon icon={CpuIcon} className="size-5" />,
    },
  ];
  const selectedDevice = assetFormOne.watch("device_type");

  return (
    <Form {...assetFormOne} key={"asset-form-one"}>
      <form
        onSubmit={assetFormOne.handleSubmit(assetOneFormSubmit)}
        id="asset-form-one"
        className="flex flex-col w-full"
      >
        <FormField
          control={assetFormOne.control}
          name="device_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  {deviceList.map((device) => {
                    const isSelected = selectedDevice === device.id;
                    return (
                      <div key={device.id}>
                        <Input
                          type="radio"
                          id={device.id}
                          value={device.id}
                          checked={isSelected}
                          disabled={isEdit || licenseDeviceType}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          className="sr-only"
                        />
                        <label
                          htmlFor={device.id}
                          className={`cursor-pointer border rounded-md px-4 py-3 flex items-center gap-2 transition-colors
                            ${
                              isSelected
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-gray-300 text-black"
                            }`}
                        >
                          <span
                            className={`${
                              isSelected ? "text-blue-600" : "text-black"
                            }`}
                          >
                            {device.logo}
                          </span>
                          <span className="font-gilroyMedium text-sm">
                            {device.label}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedDevice !== "license" && (
          <FormField
            name="device_name"
            control={assetFormOne.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter"
                    type="text"
                    className="md:text-[13px] placeholder:text-sm font-gilroyMedium"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {selectedDevice !== "license" && (
          <FormField
            control={assetFormOne.control}
            name="assigning_to"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Assigning To (Optional)</FormLabel>
                <FormControl>
                  <AsyncSelect<User>
                    fetcher={fetchUsers}
                    queryKey="fetch-users"
                    preload
                    renderOption={(user) => (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="font-gilroyMedium">
                            {user?.first_name}
                          </div>
                          <div className="text-xs font-gilroyRegular text-muted-foreground">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    )}
                    filterFn={(user, query) =>
                      user?.email
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase()) ||
                      user?.first_name
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase())
                    }
                    getOptionValue={(user) => user?.email}
                    getDisplayValue={(user) => (
                      <div className="flex items-center gap-2 text-left w-full">
                        <div className="flex flex-col leading-tight">
                          <div className="font-gilroyMedium">
                            {field?.value}
                          </div>
                        </div>
                      </div>
                    )}
                    notFound={
                      <div className="py-6 text-center font-gilroyMedium text-sm">
                        No users found
                      </div>
                    }
                    label="Assigning To (Optional)"
                    placeholder="Choose"
                    value={field.value || null}
                    onChange={(selected: User | null) => {
                      field.onChange(selected?.email);
                      assetFormOne.setValue("assigning_to", selected?.email);
                      assetFormOne.setValue("assigning_to_id", selected?._id);
                    }}
                    className="text-[13px]"
                    triggerClassName="text-[13px]"
                    width="100%"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {["keyboard", "monitor", "others", "license"].includes(
          selectedDevice
        ) && (
          <FormField
            control={assetFormOne.control}
            name="attach_asset_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attach Asset to (Optional)</FormLabel>
                <FormControl>
                  <AsyncSelect<Device>
                    fetcher={fetchDevices}
                    preload
                    renderOption={(asset) => (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="font-gilroyMedium">
                            {asset?.custom_model}
                          </div>
                          <div className="text-xs font-gilroyRegular text-muted-foreground">
                            {asset?.serial_no}
                          </div>
                        </div>
                      </div>
                    )}
                    filterFn={(device, query) =>
                      device?.custom_model
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase()) ||
                      device?.device_name
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase())
                    }
                    getOptionValue={(asset) => asset?.custom_model}
                    getDisplayValue={() => (
                      <div className="flex items-center gap-2 text-left w-full">
                        <div className="flex flex-col leading-tight">
                          <div className="font-gilroyMedium">
                            {field?.value}
                          </div>
                        </div>
                      </div>
                    )}
                    notFound={
                      <div className="py-6 text-center font-gilroyMedium text-sm">
                        No Assets found
                      </div>
                    }
                    label="Assets"
                    placeholder="Choose"
                    value={field.value || null}
                    onChange={(selected: Device) => {
                      field.onChange(selected?.custom_model);

                      assetFormOne.setValue(
                        "attach_asset_to",
                        selected?.custom_model
                      );
                      assetFormOne.setValue(
                        "attach_asset_to_id",
                        selected?._id
                      );
                    }}
                    className="text-[13px]"
                    triggerClassName="text-[13px]"
                    width="100%"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}

export default AssetOneFormType;
