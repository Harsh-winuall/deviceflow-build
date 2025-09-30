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
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { laptopFormOneType } from "./utils/validation";

function LaptopFormOne({
  laptopFormOne,
  laptopFormOneSubmit,
}: {
  laptopFormOne: UseFormReturn<{
    os?: string;
    os_other?: string;
    brand?: string;
    model_name?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    condition?: string;
  }>;
  laptopFormOneSubmit: (values: laptopFormOneType) => void;
}) {
  const [selectOs, setSelectOs] = useState("");

  const operatingSystems = [
    { id: "macos", name: "MacOS", icon: <AppleIcon /> },
    { id: "windows", name: "Windows", icon: <WindowsIcon /> },
    { id: "others", name: "Others", icon: <UbuntuIcon /> },
  ];
  // Watch the OS field value to sync with local state
  const osValue = laptopFormOne.watch("os");

  // Sync selectOs with form value when form is populated (for edit mode)
  useEffect(() => {
    if (osValue) {
      // Check if the OS value matches one of our predefined options
      const matchingOs = operatingSystems.find(
        (os) =>
          os.name.toLowerCase() === osValue.toLowerCase() ||
          os.id === osValue.toLowerCase()
      );

      if (matchingOs) {
        setSelectOs(matchingOs.id);
      } else {
        // If it doesn't match predefined options, it's a custom OS
        setSelectOs("others");
      }
    }
  }, [osValue]);
  return (
    <Form {...laptopFormOne} key="laptop-form-one">
      <form
        onSubmit={laptopFormOne.handleSubmit(laptopFormOneSubmit)}
        id="laptop-form-one"
        className="w-full flex flex-col "
      >
        {/* OS Selection */}
        <FormField
          control={laptopFormOne.control}
          name="os"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select OS</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-3">
                  {operatingSystems.map((os) => {
                    const isSelected = selectOs === os.id;
                    return (
                      <div key={os.id}>
                        <Input
                          type="radio"
                          id={os.id}
                          value={os.id}
                          checked={isSelected}
                          onChange={(e) => {
                            setSelectOs(e.target.value);
                            // Set the actual OS name as the field value
                            field.onChange(os.name);
                          }}
                          className="sr-only"
                        />
                        <label
                          htmlFor={os.id}
                          className={`cursor-pointer border rounded-md h-12 flex items-center justify-center gap-2 transition-colors ${
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

        {/* Other OS Input */}
        {selectOs === "others" && (
          <FormField
            control={laptopFormOne.control}
            name="os"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OS</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter"
                    className="md:text-[13px] placeholder:text-sm"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={laptopFormOne.control}
          name="model_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter"
                  className="md:text-[13px] placeholder:text-sm"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2.5">
          <FormLabel className="font-gilroyMedium  text-sm">Brand</FormLabel>
          <FormField
            control={laptopFormOne.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "flex justify-between font-gilroyMedium",
                        !field.value
                          ? "text-[#CCCCCC] text-[13px]"
                          : "text-black"
                      )}
                    >
                      <SelectValue
                        placeholder="Choose"
                        className={"text-[#CCCCCC]"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="font-gilroyMedium">
                    {["Lenovo", "Macbook", "HP", "Acer", "Asus", "Dell"].map(
                      (option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between w-full items-center gap-2.5 mt-3">
          <div className="flex flex-col gap-2.5 w-full ">
            <FormLabel className="font-gilroyMedium  text-sm">
              Processor
            </FormLabel>
            <FormField
              control={laptopFormOne.control}
              name="processor"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "flex justify-between font-gilroyMedium",
                          !field.value
                            ? "text-[#CCCCCC] text-[13px]"
                            : "text-black"
                        )}
                      >
                        <SelectValue
                          placeholder="Choose"
                          className={"text-[#CCCCCC]"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium">
                      {[
                        "AMD Ryzen",
                        "AMD Athlon",
                        "Intel Core",
                        "Qualcomm Snapdragon X ",
                        "Apple Silicon",
                        "M1 Apple",
                        "M2 Apple",
                      ].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <FormLabel className="font-gilroyMedium  text-sm">Ram</FormLabel>
            <FormField
              control={laptopFormOne.control}
              name="ram"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "flex justify-between font-gilroyMedium",
                          !field.value
                            ? "text-[#CCCCCC] text-[13px]"
                            : "text-black"
                        )}
                      >
                        <SelectValue
                          placeholder="Choose"
                          className={"text-[#CCCCCC]"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium">
                      {["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"].map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-between w-full items-center gap-2.5 mt-3">
          <div className="flex flex-col gap-2.5 w-full ">
            <FormLabel className="font-gilroyMedium  text-sm">
              Storage
            </FormLabel>
            <FormField
              control={laptopFormOne.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "flex justify-between font-gilroyMedium",
                          !field.value
                            ? "text-[#CCCCCC] text-[13px]"
                            : "text-black"
                        )}
                      >
                        <SelectValue
                          placeholder="Choose"
                          className={"text-[#CCCCCC]"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium">
                      {[
                        "128GB",
                        "256GB",
                        "512GB",
                        "1TB",
                        "2TB",
                        "4TB",
                        // ...(field?.value ? field.value : ""),
                      ].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <FormLabel className="font-gilroyMedium  text-sm">
              Condition
            </FormLabel>
            <FormField
              control={laptopFormOne.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "flex justify-between font-gilroyMedium",
                          !field.value
                            ? "text-[#CCCCCC] text-[13px]"
                            : "text-black"
                        )}
                      >
                        <SelectValue
                          placeholder="Choose"
                          className={"text-[#CCCCCC]"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium">
                      {["Excellent", "Fair", "Good"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default LaptopFormOne;
