"use client";

import {
  fetchAllIntegration,
  getIntegrationByIdForLicense,
} from "@/server/deviceActions";

import CustomIntegration from "@/app/(root)/integrations/_components/custom-integration";
import { AsyncSelect } from "@/components/ui/async-select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { licenseFormType } from "./utils/validation";
import { useState } from "react";
const reverseCycleMap: Record<number, string> = {
  1: "1", // Monthly
  3: "3", // Quarterly
  6: "6", // Half-Yearly
  12: "12", // Yearly
};

const cycleDisplayMap: Record<string, string> = {
  "1": "Monthly",
  "3": "Quarterly",
  "6": "Half-Yearly",
  "12": "Annually",
};

function LicenseOneFormType({
  licenseForm,
  isEdit,
  setOpen,
  licenseFormSubmit,
}: {
  licenseForm: any;
  isEdit?: boolean;
  setOpen: (op: boolean) => void;
  licenseFormSubmit: (values: licenseFormType) => void;
}) {
  const [integrationData, setIntegrationData] = useState<any | null>(null);
  const [loadingIntegration, setLoadingIntegration] = useState(false);
  const handleIntegrationPrefetch = async (id: string) => {
    try {
      setLoadingIntegration(true);
      const data = await getIntegrationByIdForLicense({ id });
      setIntegrationData(data);

      // prefill form fields based on API response
      if (data?.platform) {
        licenseForm.setValue("license_name", data.platform);
        licenseForm.setValue("license_name_id", data._id);
      }
      if (data?.price?.price) {
        licenseForm.setValue("billing_price", data.price.price);
      }
      if (data?.cycle) {
        licenseForm.setValue("billing_cycle", reverseCycleMap[data.cycle]);
      }
      if (data?.orgBased !== undefined) {
        const pricingModel = data.orgBased
          ? "Organization Level"
          : "User Level";
        licenseForm.setValue("pricing_model", pricingModel);
      }
    } catch (err) {
      console.error("Failed to prefetch integration", err);
    } finally {
      setLoadingIntegration(false);
    }
  };
  return (
    <Form {...licenseForm} key={"license-form"}>
      <form
        onSubmit={licenseForm.handleSubmit(licenseFormSubmit)}
        id="license-form"
        className="flex flex-col w-full"
      >
        <div className="flex flex-col ">
          <FormField
            control={licenseForm.control}
            name="license_name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>License Name</FormLabel>
                <FormControl>
                  <AsyncSelect
                    queryKey={"integrations-license"}
                    fetcher={fetchAllIntegration}
                    preload
                    renderOption={(software) => (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="font-gilroyMedium">
                            {software?.platform}
                          </div>
                        </div>
                      </div>
                    )}
                    filterFn={(software, query) =>
                      software?.platform
                        ?.toLowerCase()
                        ?.includes(query?.toLowerCase())
                    }
                    getOptionValue={(software) => software?.platform}
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
                      <CustomIntegration>
                        <div className="w-full flex justify-center items-center p-2">
                          <div className="py-2 px-6 hover:bg-gray-50 cursor-pointer border border-gray-200 rounded-[5px] text-black flex justify-center items-center text-center font-gilroyMedium text-sm">
                            <Plus className="size-4" />
                            Create License
                          </div>
                        </div>
                      </CustomIntegration>
                    }
                    disabled={isEdit}
                    label="Choose"
                    placeholder="Choose"
                    value={field.value || null}
                    onChange={(selected) => {
                      field.onChange(selected?.platform);
                      licenseForm.setValue("license_name", selected?.platform);
                      licenseForm.setValue("license_name_id", selected?._id);

                      if (selected?._id) {
                        handleIntegrationPrefetch(selected._id);
                      }
                    }}
                    className="text-[13px] "
                    triggerClassName="text-[13px]"
                    width="100%"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="license_keys"
            control={licenseForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter License Key</FormLabel>
                <FormControl>
                  <Input
                    disabled={isEdit}
                    placeholder="Enter"
                    type="text"
                    className="md:text-[13px] placeholder:text-[#CCCCCC] placeholder:text-sm font-gilroyMedium"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={licenseForm.control}
          name="pricing_model"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Pricing Model</FormLabel>

              <div className="flex gap-4 w-full">
                {" "}
                <div className="flex gap-6 w-full">
                  <input
                    id="org-level"
                    type="radio"
                    disabled={
                      !!integrationData ||
                      isEdit ||
                      licenseForm?.getValues("pricing_model")
                    }
                    value="Organization Level"
                    checked={field.value === "Organization Level"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange("Organization Level");
                      }
                    }}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="org-level"
                    className="flex items-center gap-2 cursor-pointer flex-1 rounded-[5px] px-2.5 py-3.5 border 
               peer-checked:outline peer-checked:outline-2 peer-checked:outline-[#025CE5]"
                  >
                    <span className="text-sm font-gilroyMedium">
                      Organization Level
                    </span>
                  </label>
                </div>
                <div className="w-full">
                  <input
                    id="user-level"
                    type="radio"
                    value="User Level"
                    disabled={
                      !!integrationData ||
                      isEdit ||
                      licenseForm?.getValues("pricing_model")
                    }
                    checked={field.value === "User Level"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange("User Level");
                      }
                    }}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="user-level"
                    className="flex items-center gap-2 cursor-pointer flex-1 rounded-[5px] px-2.5 py-3.5 border 
               peer-checked:outline peer-checked:outline-2 peer-checked:outline-[#025CE5]"
                  >
                    <span className="text-sm font-gilroyMedium">
                      User Level
                    </span>
                  </label>
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <FormField
              control={licenseForm.control}
              name="billing_cycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    // disabled={!!integrationData}
                    disabled={
                      !!integrationData ||
                      isEdit ||
                      licenseForm?.getValues("billing_cycle")
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="font-gilroyMedium md:text-[13px] justify-between data-[placeholder]:text-[#CCCCCC]">
                        <SelectValue placeholder="Choose">
                          {field.value
                            ? cycleDisplayMap[field.value]
                            : "Choose"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="font-gilroyMedium md:text-[13px]">
                      <SelectItem value="3" className="md:text-[13px]">
                        Quarterly
                      </SelectItem>
                      <SelectItem value="1" className="md:text-[13px]">
                        Monthly
                      </SelectItem>
                      <SelectItem value="6" className="md:text-[13px]">
                        Half-Yearly
                      </SelectItem>
                      <SelectItem value="12" className="md:text-[13px]">
                        Annually
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 pb-[22px]">
            <FormField
              name="billing_price"
              control={licenseForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        !!integrationData ||
                        isEdit ||
                        licenseForm?.getValues("billing_price")
                      }
                      placeholder="Enter amount"
                      type="number"
                      className="md:text-[13px]  placeholder:text-sm font-gilroyMedium"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage />  */}
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-start  gap-4">
          <div className="w-full flex flex-col">
            <FormField
              control={licenseForm.control}
              name="purchased_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchased On (Optional)</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: "dd/MM/yyyy" }}
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      className="md:text-[13px]"
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex flex-col">
            <FormField
              control={licenseForm.control}
              name="valid_till"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Till (Optional)</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: "dd/MM/yyyy" }}
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      className="md:text-[13px]"
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default LicenseOneFormType;
