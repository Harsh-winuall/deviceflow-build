import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AndroidIcon from "@/icons/AndroidIcon";
import AppleIcon from "@/icons/AppleIcon";
import { mobileFormType } from "./utils/validation";

function MobileForm({
  mobileForm,
  mobileFormSubmit,
}: {
  mobileForm: UseFormReturn<
    {
      os?: string;
      brand?: string;
      model_name?: string;
      processor?: string;
      ram?: string;
      storage?: string;
      condition?: string;
    },
    any,
    {
      os?: string;
      brand?: string;
      model_name?: string;
      processor?: string;
      ram?: string;
      storage?: string;
      condition?: string;
    }
  >;

  mobileFormSubmit: (values: mobileFormType) => void;
}) {
  const [selectOs, setSelectOs] = useState(mobileForm?.getValues("os") ?? "");
  const operatingSystems = [
    { id: "android", name: "Android", icon: <AndroidIcon /> },
    { id: "ios", name: "ios", icon: <AppleIcon /> },
  ];
  const mobileProcessors = [
    { label: "Apple A17 Pro", value: "apple_a17_pro" },
    { label: "Apple A16 Bionic", value: "apple_a16_bionic" },
    { label: "Apple A15 Bionic", value: "apple_a15_bionic" },
    { label: "Qualcomm Snapdragon 8 Gen 3", value: "snapdragon_8_gen_3" },
    { label: "Qualcomm Snapdragon 8 Gen 2", value: "snapdragon_8_gen_2" },
    { label: "Qualcomm Snapdragon 8+ Gen 1", value: "snapdragon_8_plus_gen_1" },
    { label: "Qualcomm Snapdragon 7 Gen 2", value: "snapdragon_7_gen_2" },
    {
      label: "MediaTek Dimensity 9200+",
      value: "mediatek_dimensity_9200_plus",
    },
    { label: "MediaTek Dimensity 9200", value: "mediatek_dimensity_9200" },
    { label: "MediaTek Dimensity 9000", value: "mediatek_dimensity_9000" },
    { label: "Samsung Exynos 2200", value: "exynos_2200" },
    { label: "Samsung Exynos 2100", value: "exynos_2100" },
    { label: "Google Tensor G3", value: "google_tensor_g3" },
    { label: "Google Tensor G2", value: "google_tensor_g2" },
    { label: "Kirin 9000S", value: "kirin_9000s" },
  ];
  return (
    <Form {...mobileForm} key={"mobile-form"}>
      <form
        onSubmit={mobileForm.handleSubmit(mobileFormSubmit)}
        id="mobile-form"
        className="flex flex-col w-full"
      >
        <div className="flex flex-col">
          <FormField
            control={mobileForm.control}
            name="os"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select OS</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    {operatingSystems.map((os) => {
                      const isSelected = selectOs === os.id;
                      return (
                        <div key={os.id} className="flex-1">
                          <Input
                            type="radio"
                            id={os.id}
                            value={os?.id}
                            checked={isSelected}
                            onChange={(e) => {
                              setSelectOs(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            className="sr-only"
                          />
                          <label
                            htmlFor={os.id}
                            className={`cursor-pointer border rounded-md h-12 flex items-center justify-center gap-2 transition-colors
                            ${
                              isSelected
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-gray-300 text-black"
                            }`}
                          >
                            <span>{os.icon}</span>
                            <span className="font-gilroyMedium text-sm">
                              {os.name}
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

          <FormField
            control={mobileForm.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
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
                    {["Apple", "Realme", "Redmi", "Google Pixel", "Others"].map(
                      (value) => (
                        <SelectItem value={value} className="md:text-[13px]">
                          {value}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="model_name"
            control={mobileForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
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

          <div className="flex items-center gap-4 mt-5">
            <div className="flex-1">
              <FormField
                control={mobileForm.control}
                name="processor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processor</FormLabel>
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
                        {mobileProcessors.map(({ label, value }) => (
                          <SelectItem value={value} className="md:text-[13px]">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={mobileForm.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM</FormLabel>
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
                        {["4GB", "8GB", "16GB", "32GB", "64GB", "Others"].map(
                          (value) => (
                            <SelectItem
                              value={value}
                              className="md:text-[13px]"
                            >
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={mobileForm.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (Optional)</FormLabel>
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
                        {["64GB", "128GB", "256GB", "512GB", "Others"].map(
                          (value) => (
                            <SelectItem
                              value={value}
                              className="md:text-[13px]"
                            >
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={mobileForm.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition (Optional)</FormLabel>
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
                        {["Excellent", "Good", "Fair"].map((value) => (
                          <SelectItem value={value} className="md:text-[13px]">
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default MobileForm;
