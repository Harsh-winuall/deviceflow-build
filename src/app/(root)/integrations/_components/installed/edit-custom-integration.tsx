"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getImageUrl } from "@/components/utils/upload";
import {
  categoryAdd,
  customIntegrationEdit,
  CustomIntegrationType,
} from "@/server/customIntegrationActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileEmpty02Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    platform: z.string().min(1, "Label is Required"),
    logo: z.string(),
    price: z.string().min(1, "Pricing is Required"),
    // perSeat: z.boolean().optional(),
    // accessLevel: z.string().min(1, "Pricing Model is Required"),
    // cycle: z.string().min(1, "Billing Cycle is Required"),
    category: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // if (data.accessLevel === "user" && !data.perSeat) {
    //   ctx.addIssue({
    //     path: ["perSeat"],
    //     code: z.ZodIssueCode.custom,
    //     message: "Please select if it's Per Seat or Not",
    //   });
    // }
  });

const cycleMap: Record<string, number> = {
  Monthly: 1,
  Quaterly: 3,
  "Half-Yearly": 6,
  Yearly: 12,
};

const reverseCycleMap: Record<number, string> = {
  1: "Monthly",
  3: "Quaterly",
  6: "Half-Yearly",
  12: "Yearly",
};

const orgLevelOptions = [
  "One-Time",
  "Monthly",
  "Quaterly",
  "Half-Yearly",
  "Yearly",
];

const userLevelOptions = ["Monthly", "Quaterly", "Half-Yearly", "Yearly"];

type IntegrationForm = z.infer<typeof schema>;

function EditingCustomIntegration({
  data,
  category,
  children,
  platformData,
  platform,
  customCategories,
  customCategoryId,
}: {
  data: any;
  category?: string;
  children?: React.ReactNode;
  platformData?: any;
  platform?: string;
  customCategories?: any[];
  customCategoryId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const integrationImage = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const form = useForm<IntegrationForm>({
    defaultValues: {
      platform: data?.platform || platform || "",
      logo: data?.logo || platformData?.companyLogo || "",
      price: data?.price ? platformData?.price?.price.toString() : "",
      // accessLevel: data?.orgBased ? "organisation" : "user",
      // cycle: data?.isOneTime ? "One-Time" : reverseCycleMap[data?.cycle] || "",
      // perSeat: data?.perSeat,
      category: data?.customCategoryId || customCategoryId || "",
    },
    resolver: zodResolver(schema),
  });

  // console.log(data)

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
    }, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ].includes(file.type);

    if (!isValidSize || !isValidType) {
      toast.error(
        "Invalid file. Only JPG, JPEG, PNG, or PDF files under 5MB are allowed."
      );
      return;
    }

    setIsUploading(true);
    simulateProgress();

    try {
      const result = await getImageUrl({ file });
      form.setValue("logo", result.fileUrl);
    } catch (error) {
      // console.error(error);
      toast.error("File failed to upload");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveFile = () => {
    // setFormData((prev) => ({
    //   ...prev,
    //   invoiceUrl: null,
    // }));
    // form.reset({ logo: "" });
    form.setValue("logo", "");
  };
  const updateCustomIntegartionMutation = useMutation({
    mutationFn: (data: { id: string; payload: CustomIntegrationType }) =>
      customIntegrationEdit(data),
    onSuccess: () => {
      toast.success("Integration Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["all-integrations", "installed"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-by-integrations"],
        refetchType: "all",
      });

      setOpen(false);
      form.reset({
        platform: data?.platform || "",
        logo: data?.logo || "",
        price: data?.price ? data?.price?.toString() : "",
        // accessLevel: data?.orgBased ? "organisation" : "user",
        // cycle: data?.isOneTime
        //   ? "One-Time"
        //   : reverseCycleMap[data?.cycle] || "",
        // perSeat: data?.perSeat,
        category: data?.customCategoryId || customCategoryId || "",
      });
    },
    onError: () => {
      toast.error("Failed to update integration");
    },
  });

  const handleSubmit = (formData: IntegrationForm) => {
    setLoading(true);
    // console.log(formData)
    try {
      const intData = {
        id: platformData?._id,
        payload: {
          platform: formData.platform,
          customCategoryId: formData.category,
          logo: formData.logo,
          price: parseInt(formData.price), // Ensure it's a number
          // ...(formData.accessLevel === "organisation" && {
          //   isOrgBased: true,
          //   perSeat: false,
          // }),
          // ...(formData.accessLevel === "user" && {
          //   isOrgBased: false,
          //   perSeat: true,
          // }),
          // ...(formData.cycle === "One-Time"
          //   ? { isOneTime: true }
          //   : { cycle: cycleMap[formData.cycle] }),
        },
      };
      // console.log(intData);
      updateCustomIntegartionMutation.mutate(intData);
      setOpen(false);
      router.replace(`/integrations/installed/${intData?.payload?.platform}`);
    } catch (error) {
      toast.error("Failed to update integration");
    } finally {
      setLoading(false);
    }
  };

  // const accessLevel = form.watch("accessLevel");

  // Reset billing cycle when access level changes
  // useEffect(() => {
  //   form.resetField("cycle");
  // }, [accessLevel]);

  // console.log("data", data);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        // form.reset();
        form.reset({
          platform: data?.platform || "",
          logo: data?.logo || "",
          price: data?.price ? data?.price.toString() : "",
          category: data?.customCategoryId || customCategoryId || "",
          // accessLevel: data?.orgBased ? "organisation" : "user",
          // cycle: data?.isOneTime
          //   ? "One-Time"
          //   : reverseCycleMap[data?.cycle] || "",
          // perSeat: data?.perSeat,
        });
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-lg max-w-md p-4 min-h-[35vh]">
        <DialogTitle className="text-start">Edit</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Integration Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  {!isNewCategory ? (
                    <Select
                      onValueChange={(val) => {
                        if (val === "new-category") {
                          setIsNewCategory(true);
                        } else {
                          field.onChange(val);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="font-gilroyMedium md:text-[13px] justify-between">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-gilroyMedium md:text-[13px]">
                        <div className="max-h-40 overflow-y-auto">
                          {customCategories?.map((cat: any) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.title}
                            </SelectItem>
                          ))}
                        </div>
                        <SelectItem
                          value="new-category"
                          className="text-blue-600 mt-2 border-t border-gray-100"
                        >
                          + Add New Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Enter new category"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1"
                        onClick={async () => {
                          try {
                            const res = await categoryAdd({
                              category: newCategoryName,
                            });

                            queryClient.invalidateQueries({
                              queryKey: ["custom-categories"],
                              exact: false,
                              refetchType: "all",
                            });

                            // console.log(res);

                            form.setValue("category", res?._id); // set returned id
                            toast.success("Category created");
                            setIsNewCategory(false);
                            setNewCategoryName("");
                          } catch (err) {
                            toast.error("Failed to create category");
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outlineTwo"
                        onClick={() => {
                          setIsNewCategory(false);
                          setNewCategoryName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Upload Logo<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <>
                      <div className="flex flex-wrap gap-4">
                        <div
                          className="flex flex-wrap gap-2 items-center justify-start bg-[#E9F3FF] rounded-md border-dashed h-20 w-full border-[1px] px-2 py-2 border-[#52ABFF] cursor-pointer"
                          onClick={() => integrationImage.current?.click()}
                        >
                          {isUploading ? (
                            <div className="w-full  flex flex-col items-center justify-center gap-2">
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
                          ) : field?.value ? (
                            <div className="relative w-full h-16 -mt-0.5 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group">
                              <div className="flex items-center justify-center gap-2 py-2">
                                <div className="bg-blue-500 text-white p-2 rounded-full">
                                  <HugeiconsIcon icon={FileEmpty02Icon} />
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-sm font-medium text-center">
                                    {field.value
                                      .split("/")
                                      .pop()
                                      .substring(0, 30)}
                                    ..
                                  </p>
                                  <p className="text-xs text-gray-500">Logo</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile();
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="text-white size-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center items-center w-full mx-auto">
                              <div className="font-gilroySemiBold text-sm gap-1 flex items-center">
                                <span className="text-[#0EA5E9]">
                                  Click to upload
                                </span>
                                <span className="text-[#525252]">
                                  or drag and drop
                                </span>
                              </div>
                              <p className="text-[10px] text-[#A3A3A3]">
                                JPG, JPEG, PNG, PDF less than 5MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <input
                        type="file"
                        ref={integrationImage}
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                        accept="image/jpeg, image/png, image/jpg, application/pdf"
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center">
                      Pricing Model<span className="text-red-500">*</span>{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-pointer" asChild>
                            <HugeiconsIcon
                              icon={HelpCircleIcon}
                              size={12}
                              color="#808491"
                              strokeWidth={1.5}
                              className="ml-1"
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="text-white bg-[#242424] w-52"
                          >
                            <p className="flex flex-col gap-2 font-gilroyMedium text-[9px]">
                              <span>
                                <span className="font-gilroySemiBold">
                                  Central-level:
                                </span>{" "}
                                Pay a fixed amount, regardless of how many users
                                are added.
                              </span>
                              <span>
                                <span className="font-gilroySemiBold">
                                  User-level:
                                </span>{" "}
                                Pay per user or per seat you assign to this
                                integration.
                              </span>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      {/* Organisation Level */}
            {/* <label
                        className={`flex-1 border rounded-[5px] p-3 cursor-pointer  text-xs font-gilroyMedium ${
                          field.value === "organisation"
                            ? "border-[#025CE5] outline outline-[#CCDEFA]"
                            : "border-black/10"
                        }`}
                      >
                        <input
                          type="radio"
                          value="organisation"
                          checked={field.value === "organisation"}
                          onChange={() => field.onChange("organisation")}
                          className="hidden"
                        />
                        Central Level
                      </label>

                      {/* User Level */}
            {/* <label
                        className={`flex-1 border rounded-[5px] p-3 cursor-pointer  text-xs font-gilroyMedium ${
                          field.value === "user"
                            ? "border-[#025CE5] outline outline-[#CCDEFA]"
                            : "border-black/10"
                        }`}
                      >
                        <input
                          type="radio"
                          value="user"
                          checked={field.value === "user"}
                          onChange={() => field.onChange("user")}
                          className="hidden"
                        />
                        User Level
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="invisible" />
                </FormItem> */}
            {/* )}
            /> */}

            <div className="flex items-center gap-4">
              {/* <div className="flex-1">
                <FormField
                  control={form.control}
                  name="cycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Billing Cycle<span className="text-red-500">*</span>
                      </FormLabel>
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
                          {form.getValues("accessLevel") === "organisation"
                            ? orgLevelOptions.map((cycle, index) => (
                                <SelectItem
                                  key={index}
                                  value={cycle}
                                  className="md:text-[13px]"
                                >
                                  {cycle}
                                </SelectItem>
                              ))
                            : userLevelOptions.map((cycle, index) => (
                                <SelectItem
                                  key={index}
                                  value={cycle}
                                  className="md:text-[13px]"
                                >
                                  {cycle}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />
              </div> */}

              <div className="flex-1 ">
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Price<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter amount"
                          type="text"
                          className="md:text-[13px] placeholder:text-sm placeholder:text-black/20 font-gilroyMedium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-1/2 text-[13px]"
                  variant="outlineTwo"
                >
                  Cancel
                </Button>
              </DialogClose>
              <LoadingButton
                type="submit"
                variant="primary"
                className="w-1/2 text-[13px]"
                loading={loading}
                disabled={loading}
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditingCustomIntegration;
