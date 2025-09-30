import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AppleIcon from "@/icons/AppleIcon";
import WindowsIcon from "@/icons/WindowsIcon";
import UbuntuIcon from "@/icons/UbuntuIcon";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { AsyncSelect } from "@/components/ui/async-select";
import { fetchUsers, User } from "@/server/userActions";
import { laptopFormTwoType } from "./utils/validation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllSoftware,
  getAllLocation,
  Software,
} from "@/server/deviceActions";
import { da } from "date-fns/locale";
import { Address } from "@/server/addressActions";
import { getAllLocations } from "@/server/settingActions";

function LaptopFormTwo({
  laptopFormTwo,
  assignTo,
  isEdit,
  laptopFormTwoSubmit,
}: {
  laptopFormTwo: UseFormReturn<
    {
      purchased_on?: Date;
      serial_no?: string;
      asset_type?: string;
      assigning_till?: Date;
      currently_with?: string;
      currently_with_id?: string;
      asset_physical_location?: string;
      asset_physical_location_id?: string;
      warranty_end_date?: Date;
      installed_software?: string;
      installed_software_id?: string;
    },
    any,
    {
      purchased_on?: Date;
      serial_no?: string;
      asset_type?: string;
      assigning_till?: Date;
      currently_with?: string;
      currently_with_id?: string;
      asset_physical_location?: string;
      asset_physical_location_id?: string;
      warranty_end_date?: Date;
      installed_software?: string;
      installed_software_id?: string;
    }
  >;

  assignTo: string;
  isEdit?: boolean;
  laptopFormTwoSubmit: (values: laptopFormTwoType) => void;
}) {
  const assetType = laptopFormTwo.watch("asset_type");
  const { data } = useQuery({
    queryKey: ["installed_software"],
    queryFn: () => fetchAllSoftware(),
  });

  return (
    <Form {...laptopFormTwo} key="laptop-form-two">
      <form
        onSubmit={laptopFormTwo.handleSubmit(laptopFormTwoSubmit)}
        id="laptop-form-two"
        className="w-full flex flex-col "
      >
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

        <FormField
          control={laptopFormTwo.control}
          name="serial_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter"
                  className="md:text-[13px] placeholder:text-sm"
                  type="text"
                  disabled={isEdit}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2.5">
          {" "}
          <div className="flex-1">
            <FormField
              control={laptopFormTwo.control}
              name="asset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="font-gilroyMedium md:text-[13px] justify-between">
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium md:text-[13px]">
                      <SelectItem value="Temporary" className="md:text-[13px]">
                        Temporary
                      </SelectItem>
                      <SelectItem value="Permanent" className="md:text-[13px]">
                        Permanent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {assetType === "Temporary" && (
            <div className="flex-1">
              <FormField
                control={laptopFormTwo.control}
                name="assigning_till"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigning Till </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        displayFormat={{ hour24: "dd/MM/yyyy" }}
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        className="md:text-[13px]"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2.5">
          {" "}
          <div className="flex-1">
            <FormField
              control={laptopFormTwo.control}
              name="purchased_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchased On </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: "dd/MM/yyyy" }}
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      className="md:text-[13px]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={laptopFormTwo.control}
              name="warranty_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty End Date </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: "dd/MM/yyyy" }}
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      className="md:text-[13px]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={laptopFormTwo.control}
          name="installed_software"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Installed Software (Optional)</FormLabel>
              <FormControl>
                <AsyncSelect<Software>
                  fetcher={fetchAllSoftware}
                  queryKey="fetch-all-software"
                  preload
                  renderOption={(software) => (
                    <div className="flex flex-col">
                      <div className="font-gilroyMedium">
                        {software?.licenseName}
                      </div>
                      <div className="text-xs font-gilroyRegular text-muted-foreground">
                        {software?.licenseKey}
                      </div>
                    </div>
                  )}
                  filterFn={(software, query) =>
                    software?.licenseKey
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    software?.licenseName
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(software) => software?.licenseName} // use unique _id instead
                  getDisplayValue={(software) => (
                    <div className="flex flex-col leading-tight">
                      <div className="font-gilroyMedium">{field?.value}</div>
                    </div>
                  )}
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      All Softwares are assigned
                    </div>
                  }
                  label="Choose"
                  placeholder="Choose"
                  value={field?.value ?? null} // now field.value is the whole object
                  onChange={(selected) => {
                    field.onChange(selected); // ✅ store object
                    laptopFormTwo.setValue(
                      "installed_software",
                      selected.licenseName
                    );
                    laptopFormTwo.setValue(
                      "installed_software_id",
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
        {!assignTo && (
          <FormField
            control={laptopFormTwo.control}
            name="currently_with"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Currently with (Optional)</FormLabel>
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
                      user?.first_name
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase()) ||
                      user?.email?.toLowerCase()?.includes(query?.toLowerCase())
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
                      laptopFormTwo.setValue("currently_with", selected?.email);
                      laptopFormTwo.setValue(
                        "currently_with_id",
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
        {!assignTo && (
          <FormField
            control={laptopFormTwo.control}
            name="asset_physical_location"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Asset Physical Location (Optional)</FormLabel>
                <FormControl>
                  <AsyncSelect<Address>
                    fetcher={getAllLocation}
                    queryKey="fetch-all-locations"
                    preload
                    renderOption={(location) => (
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">
                          {location?.location}
                        </div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {location?.address_type}
                        </div>
                      </div>
                    )}
                    filterFn={(location, query) =>
                      location?.location
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase()) ||
                      location?.address_type
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase())
                    }
                    getOptionValue={(location) => location?.location} // use unique _id instead
                    getDisplayValue={(location) => (
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">{field.value}</div>
                      </div>
                    )}
                    notFound={
                      <div className="py-6 text-center font-gilroyMedium text-sm">
                        No location found
                      </div>
                    }
                    label="Choose"
                    placeholder="Choose"
                    value={field.value || null} // now field.value is the whole object
                    onChange={(selected) => {
                      field.onChange(selected);
                      laptopFormTwo.setValue(
                        "asset_physical_location",
                        selected.location
                      );
                      laptopFormTwo.setValue(
                        "asset_physical_location_id",
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

export default LaptopFormTwo;
