"use client";

import BulkUpload from "@/components/bulk-upload";
import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  AsyncMultiSelectCombobox,
  BaseOption,
} from "@/components/ui/async-multi-select-combobox";
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
  bulkUploadUsersIntegration,
  categoryAdd,
  customIntegrationAdd,
} from "@/server/customIntegrationActions";
import { fetchUsers, User } from "@/server/userActions";
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
    logo: z.string().min(1, "Logo is required"),
    billing_price: z
      .string()
      .min(1, "Pricing is Required")
      .regex(/^\d+$/, "Only numeric values are allowed"),
    userIds: z.array(z.string()).optional(), // make optional here
    perSeat: z.boolean().optional(),
    accessLevel: z.string().min(1, "Pricing Model is Required"),
    cycle: z.string().min(1, "Billing Cycle is Required"),
    description: z.string().min(1, "Description is Required"),
    category: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.accessLevel === "user" &&
      (!data.userIds || data.userIds.length === 0)
    ) {
      ctx.addIssue({
        path: ["userIds"],
        code: z.ZodIssueCode.custom,
        message: "At least one member is required",
      });
    }
  });

const orgLevelOptions = [
  "One-Time",
  "Monthly",
  "Quaterly",
  "Half-Yearly",
  "Yearly",
];

const userLevelOptions = ["Monthly", "Quaterly", "Half-Yearly", "Yearly"];

type IntegrationForm = z.infer<typeof schema>;

function CustomIntegration({
  customCategories,
  children,
  isEdit,
}: {
  customCategories?: any;
  children?: React.ReactNode;
  isEdit?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // console.log(customCategories, "customCategories");

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const integrationImage = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const router = useRouter();

  const form = useForm<IntegrationForm>({
    defaultValues: {
      platform: "",
      logo: "",
      userIds: [],
      accessLevel: "",
      cycle: "",
      billing_price: "",
      description: "",
      category: "",
    },
    resolver: zodResolver(schema),
  });

  const selectedEmails = form.watch("userIds");

  type UserOption = BaseOption & User;

  const fetchUserOptions = async (): Promise<UserOption[]> => {
    const users = await fetchUsers();
    return users?.map((u) => ({
      ...u,
      label: u?.email,
      value: u?._id,
    }));
  };
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
  const addCustomIntegartionMutation = useMutation({
    mutationFn: customIntegrationAdd,
    onSuccess: () => {
      toast.success("Integration Added");

      queryClient.invalidateQueries({
        queryKey: ["all-integrations", "installed"],
        refetchType: "all",
        exact: false,
      });

      setOpen(false); // ✅ Only close if success
      form.reset();
      setPage(1);
      router.push("/integrations/installed");
    },
    onError: () => {
      toast.error("Failed to add Integration");
    },
  });

  const handleSubmit = (data) => {
    const payload = {
      description: data.description,
      logo: data.logo,
      platform: data.platform,
      ...(data.category && { customCategoryId: data?.category }),
      ...(data.accessLevel === "organisation" && data?.userIds.length > 0
        ? {
            isOrgBased: false,
            perSeat: false,
          }
        : {
            isOrgBased: true,
            perSeat: false,
          }),
      ...(data.accessLevel === "user" && {
        isOrgBased: false,
        perSeat: true,
      }),
      ...(data.cycle === "One-Time"
        ? { isOneTime: true }
        : { cycle: cycleMap[data.cycle] }),
      price: parseInt(data.billing_price),
      userIds: data.userIds,
    };

    // console.log(payload, "payload in frontend");

    // if (payload.accessLevel === "organisation") {
    //   delete payload.userIds;
    // }

    // console.log(payload);

    addCustomIntegartionMutation.mutate(payload, {
      onSuccess: () => {
        // Use the exact same query key structure
        // console.log("invalidting");
        // router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["async-select", "integrations-license"],
        });
        // router.refresh();

        // Also refetch immediately to ensure fresh data
        // queryClient.refetchQueries({
        //   queryKey: ["async-select", "integrations-license"],
        // });
      },
    });
  };

  const handleNext = () => {
    if (
      form.getValues("platform") === "" ||
      form.getValues("logo") === "" ||
      form.getValues("billing_price") === "" ||
      form.getValues("cycle") === "" ||
      form.getValues("accessLevel") === "" ||
      form.getValues("description") === ""
    ) {
      form.setError("platform", {
        type: "manual",
        message: "Platform name is required",
      });

      form.setError("accessLevel", {
        type: "manual",
        message: "Pricing Model is Required",
      });
      form.setError("logo", {
        type: "manual",
        message: "Logo is required",
      });
      form.setError("billing_price", {
        type: "manual",
        message: "Pricing is required",
      });
      form.setError("cycle", {
        type: "manual",
        message: "Billing Cycle is required",
      });
      return;
    }
    setPage(2);
  };

  const cycleMap: Record<string, number> = {
    Monthly: 1,
    Quaterly: 3,
    "Half-Yearly": 6,
    Yearly: 12,
  };

  const accessLevel = form.watch("accessLevel");

  // Reset billing cycle when access level changes
  useEffect(() => {
    if (accessLevel === "organisation") {
      if (!orgLevelOptions.includes(form.getValues("cycle"))) {
        form.setValue("cycle", ""); // clear only if invalid
      }
    } else if (accessLevel === "user") {
      if (!userLevelOptions.includes(form.getValues("cycle"))) {
        form.setValue("cycle", ""); // clear only if invalid
      }
    }
  }, [accessLevel, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset(); // reset only when closing
          setPage(1); // optional: go back to page 1 only on close
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-lg max-w-md p-4 min-h-[35vh]">
        <DialogTitle className="text-start mt-2">
          {isEdit ? "Edit" : "Custom Integration"}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {page === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>
                        Integration Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter" />
                      </FormControl>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category<span className="text-red-500">*</span>
                      </FormLabel>

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
                            <div className="max-h-60 overflow-y-auto">
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
                            className="flex-1"
                            variant="primary"
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
                              className="flex flex-wrap gap-2 items-center justify-start bg-[#E9F3FF] rounded-md border-dashed min-h-16 w-full border-[1px] px-2 py-2 border-[#52ABFF] cursor-pointer"
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
                                <div className="relative w-full h-20 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group">
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
                                      <p className="text-xs text-gray-500">
                                        Logo
                                      </p>
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
                                  <div className="font-gilroySemiBold text-xs gap-1 flex items-center">
                                    <span className="text-[#0EA5E9]">
                                      Click to upload
                                    </span>
                                    <span className="text-[#525252]">
                                      or drag and drop
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#A3A3A3]">
                                    JPG, JPEG, PNG less than 5MB
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
                            accept="image/jpeg, image/png, image/jpg"
                          />
                        </>
                      </FormControl>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center">
                          Pricing Model<span className="text-red-500">*</span>{" "}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                className="cursor-pointer"
                                asChild
                              >
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
                                    Pay a fixed amount, regardless of how many
                                    users are added.
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
                          <label
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
                          <label
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
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <div className="flex-1">
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
                  </div>

                  <div className="flex-1 ">
                    <FormField
                      name="billing_price"
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
              </>
            )}

            {page === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="userIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        {form.getValues("accessLevel") === "organisation" ? (
                          <p className="flex items-center">
                            Used by (Optional){" "}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  className="cursor-pointer"
                                  asChild
                                >
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
                                    Cost is not based on users. User details are
                                    shown only for reference.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </p>
                        ) : (
                          <p>
                            Add Members<span className="text-red-500">*</span>
                          </p>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2 pt-3">
                          <AsyncMultiSelectCombobox<UserOption>
                            fetcher={fetchUserOptions}
                            preload
                            filterFn={(opt, q) =>
                              opt?.first_name
                                ?.toLowerCase()
                                ?.includes(q?.toLowerCase()) ||
                              opt?.email
                                ?.toLowerCase()
                                ?.includes(q?.toLowerCase())
                            }
                            renderItem={(opt) => (
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <div className="font-gilroyMedium">
                                    {opt?.first_name}
                                  </div>
                                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                                    {opt?.email}
                                  </div>
                                </div>
                              </div>
                            )}
                            renderSelectedItem={(opts) => {
                              const firstThree = opts?.slice(0, 3) ?? [];
                              const remaining =
                                opts?.length > 3 ? opts.length - 3 : 0;
                              return (
                                <div className="flex flex-wrap items-center gap-1">
                                  {firstThree?.map((o) => (
                                    <span
                                      key={o?.value}
                                      className="inline-flex items-center px-2 py-1 text-xs bg-neutral-100 rounded"
                                    >
                                      {o?.first_name}
                                    </span>
                                  ))}
                                  {remaining > 0 && (
                                    <span className="font-gilroyMedium text-xs">
                                      + {remaining} More
                                    </span>
                                  )}
                                </div>
                              );
                            }}
                            value={selectedEmails}
                            onChange={(val) => {
                              // console.log(val);
                              form.setValue("userIds", val);
                            }}
                            label="Members"
                            placeholder="Select members"
                            notFound={
                              <div className="py-6 text-center font-gilroyMedium text-sm">
                                No users found
                              </div>
                            }
                            width="100%"
                            clearable
                          />
                          {error?.length ? (
                            <p className="text-xs text-destructive font-gilroyMedium">
                              {error}
                            </p>
                          ) : null}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full  mb-4 text-xs text-[#0000004D] flex gap-2 items-center justify-center font-gilroyMedium">
                  <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
                  OR
                  <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
                </div>

                <BulkUpload
                  bulkApi={bulkUploadUsersIntegration}
                  closeBtn={() => setOpen(true)}
                  requiredKeys={["email"]}
                  sampleData={{
                    email: "demo@exampledemo.com",
                  }}
                  getBulkResponse={(data) => {
                    // console.log(data);
                    form.setValue("userIds", data.userIds);
                  }}
                />
              </>
            )}
            <div className="flex gap-2 mt-3">
              {page === 1 ? (
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-1/2 text-[13px] rounded-md"
                    variant="outlineTwo"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              ) : (
                <Button
                  type="button"
                  variant="outlineTwo"
                  className="w-1/2 text-[13px] rounded-md"
                  onClick={() => setPage(1)}
                >
                  Back
                </Button>
              )}
              {page === 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  className="w-1/2 text-[13px] rounded-md"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <LoadingButton
                  type="submit"
                  variant="primary"
                  className="w-1/2 text-[13px] rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                >
                  {isEdit ? "Update" : "Done"}
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CustomIntegration;
