import { Button } from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import Spinner from "@/components/Spinner";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  categories,
  CategoryDropdown,
} from "@/components/ui/category-subcategory-dropdown";
import { Label } from "@/components/ui/label";
import { AsyncMultiSelectCombobox } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { getImageUrl } from "@/components/utils/upload";
import UploadImageIcon from "@/icons/UploadImageIcon";
import { cn } from "@/lib/utils";
import { Device, getDevicesByUserId } from "@/server/deviceActions";
import {
  aiChatAction,
  createTicket,
  fetchUsersTeams,
} from "@/server/ticketActions";
import { User03Icon, UserGroup03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { cache, useRef, useState } from "react";
import { toast } from "sonner";

const RaiseTicketForm = ({ closeBtn }: { closeBtn: (state: any) => void }) => {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    device: { name: "", value: "" },
    description: "",
    images: [] as string[],
  });
  const [asset, setAsset] = useState<Device>();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const fileIssueImages = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [errors, setErrors] = useState({
    category: "",
    subcategory: "",
    device: "",
    description: "",
    tags: "",
    images: "",
  });

  const validateForm = () => {
    const newErrors = {
      category: formData.category ? "" : "Issue Category is required",
      description: formData.description ? "" : "Issue description is required",
      // device: formData?.device?.value ? "" : "Device is required",
      tags: selectedUsers.length !== 0 ? "" : "Please give a Mention",
      // images: formData.images.length > 1 ? "" : "Atleast upload 2 images",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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
    }, 100); // Simulates progress eivery 100ms
  };

  const fetchUserOptions = cache(
    async (
      query?: string
    ): Promise<{
      users?: any[];
      teams?: any[];
    }> => {
      const data = await fetchUsersTeams(query || "");
      return {
        users: data?.users?.map((u: any) => ({
          ...u,
          label: u?.email,
          value: u?._id,
          first_name: u?.first_name,
        })),
        teams: data?.teams?.map((t: any) => ({
          ...t,
          label: t?.title,
          value: t?._id,
          title: t?.title,
        })),
      };
    }
  );

  const handleIssueImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Validate each file
    const validFiles = Array.from(files).filter((file) => {
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      return isValidSize && isValidType;
    });

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files were invalid. Only JPG, JPEG, or PNG files under 1MB are allowed."
      );
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    simulateProgress();

    try {
      // Upload all valid files
      const uploadPromises = validFiles.map((file) => getImageUrl({ file }));
      const results = await Promise.all(uploadPromises);

      // Add all new URLs to the images array
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...results.map((res) => res.fileUrl)],
      }));

      // console.log(formData.images);

      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    } catch (error) {
      // console.log(error);
      toast.error("Some images failed to upload");
      setErrors((prev) => ({
        ...prev,
        images: "Failed to upload some images. Please try again.",
      }));
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const aiMutation = useMutation({
    mutationFn: aiChatAction,
  });
  const handleSubmit = async () => {
    if (validateForm()) {
      const payload = {
        category: formData.category,
        subCategory: formData.subcategory,
        deviceId: formData.device.value,
        description: formData.description,
        images: formData.images,
        assignedTo: selectedUsers,
      };

      setLoading(true);

      let prompt = "";

      // Check if deviceId exists → asset is linked
      if (payload.deviceId) {
        // Filter only non-empty asset fields
        const filteredAsset = Object.entries(asset || {}).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              acc[key] = value;
            } else if (typeof value === "string" && value.trim() !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        prompt = JSON.stringify(
          {
            assetDetails: filteredAsset,
            issueDescription: formData.description,
          },
          null,
          2
        );
      } else {
        // No asset → just use the description
        prompt = JSON.stringify(
          {
            issueDescription: formData.description,
          },
          null,
          2
        );
      }
      try {
        const response = await createTicket(payload);
        aiMutation.mutate({
          ticketId: response?._id,
          prompt,
        });

        queryClient.invalidateQueries({
          queryKey: ["fetch-ticket-by-id"],
          exact: false,
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: ["fetch-all-tickets"],
          exact: false,
          refetchType: "all",
        });

        router.push(`/tickets/${response?._id}`);
        // console.log(payload)

        toast.success("Raised Ticket Successfully");
        // closeBtn(false);
      } catch (error) {
        toast.error("Something went wrong ", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex relative flex-col justify-start items-start pb-1 px-3 space-y-5 max-h-fit h-full overflow-y-auto">
        <h1 className="font-gilroySemiBold w-full text-lg">Raise a Ticket</h1>

        <div className=" w-full ">
          <div className="z-20">
            <Label
              htmlFor="category"
              className=" start-1 top-0 
            z-10 block -translate-y-1/2 bg-background mt-2 text-base font-gilroyMedium  text-black group-has-[:disabled]:opacity-50"
            >
              Category*
            </Label>

            <CategoryDropdown
              categories={categories}
              selectedCategory={formData.category}
              selectedSubcategory={formData.subcategory}
              onSelectCategory={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value,
                  subcategory: "", // Reset subcategory when changing category
                }))
              }
              onSelectSubcategory={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategory: value,
                }))
              }
              error={errors.category}
            />
            {/* {errors.category && (
              <p className="mt-2 text-sm text-destructive">{errors.category}</p>
            )} */}
          </div>
        </div>

        <div className="flex flex-col  w-full">
          <Label
            htmlFor="choose-device"
            className=" start-1 top-0 
            z-10 block -translate-y-1/2 bg-background mt-2 text-base font-gilroyMedium  text-black group-has-[:disabled]:opacity-50"
          >
            Choose device (If applicable)
          </Label>
          <AsyncSelect<Device>
            fetcher={getDevicesByUserId}
            queryKey="fetch-devices"
            preload
            // fixInputClear={false}
            renderOption={(device) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-gilroyMedium">
                    {device?.custom_model}
                  </div>
                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                    {device?.device_name}
                  </div>
                </div>
              </div>
            )}
            filterFn={(device, query) =>
              device?.custom_model
                ?.toLowerCase()
                ?.includes(query?.toLowerCase()) ||
              device?.device_name?.toLowerCase()?.includes(query?.toLowerCase())
            }
            getOptionValue={(device) => device?.custom_model}
            getDisplayValue={() => (
              <div className="flex items-center gap-2 text-left w-full">
                <div className="flex flex-col leading-tight">
                  <div className="font-gilroyMedium">
                    {formData?.device.name ?? ""}
                  </div>
                </div>
              </div>
            )}
            notFound={
              <div className="py-6 text-center font-gilroyMedium text-sm">
                No devices found
              </div>
            }
            label="Choose device"
            placeholder="Choose Device"
            value={formData?.device?.name || "null"}
            onChange={(selected) => {
              setFormData((prev) => ({
                ...prev,
                device: {
                  name: selected?.custom_model,
                  value: selected?._id,
                },
              }));
              setAsset({
                custom_model: selected?.custom_model,
                processor: selected?.processor,
                ram: selected?.ram,
                storage: selected?.storage,
                os: selected?.os,
                device_condition: selected?.device_condition,
                brand: selected?.brand,
              });
            }}
            width="100%"
          />
          {errors.device && (
            <p className="text-destructive/80 text-sm ml-1 mt-2 font-gilroyMedium">
              {errors.device}
            </p>
          )}
        </div>

        <div className="group relative w-full mt-2">
          <Label
            htmlFor="issue-description"
            className=" start-1 top-0 z-10 block -translate-y-1/2 bg-background mt-2 text-base font-gilroyMedium  text-black group-has-[:disabled]:opacity-50"
          >
            What's the issue?*
          </Label>
          <Textarea
            id="issue-description"
            placeholder="Brief about the issue"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={formData?.description ?? ""}
            className={cn(
              errors.description
                ? "border-destructive/80 "
                : "rounded-md border border-[#E5E5E5] h-24 font-gilroyMedium placeholder:text-sm placeholder:font-gilroyMedium placeholder:text-gray-400 py-2 px-3"
            )}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-destructive">
              {errors.description}
            </p>
          )}
        </div>


        <div className="flex flex-col gap-1.5 w-full">
          <label className="font-gilroyMedium mb-1.5 text-black text-base">
            Tag*
          </label>
          <AsyncMultiSelectCombobox<any>
            fetcher={fetchUserOptions}
            preload={false} // Changed to false since we're using search
            // type="object"
            // Updated filter function to handle both users and teams
            // filterFn={(opt, q) => {
            //   // For users
            //   if (opt.first_name) {
            //     return (
            //       opt?.first_name?.toLowerCase()?.includes(q?.toLowerCase()) ||
            //       opt?.email?.toLowerCase()?.includes(q?.toLowerCase())
            //     );
            //   }
            //   // For teams
            //   if (opt.title) {
            //     return opt?.title?.toLowerCase()?.includes(q?.toLowerCase());
            //   }
            //   return false;
            // }}
            // Updated renderItem to handle both users and teams
            renderItem={(opt) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-gilroyMedium">
                    {opt?.first_name || opt?.title}
                  </div>
                  {opt?.email && (
                    <div className="text-xs font-gilroyRegular text-muted-foreground">
                      {opt?.email}
                    </div>
                  )}
                </div>
              </div>
            )}
            // Updated renderSelectedItem to handle both user and team objects
            renderSelectedItem={(opts) => {
              const firstThree = opts?.slice(0, 3) ?? [];
              const remaining = opts?.length > 3 ? opts.length - 3 : 0;
              return (
                <div className="flex flex-wrap items-center gap-1">
                  {firstThree?.map((o) => (
                    <span
                      key={o?.userId || o?.teamId}
                      className="inline-flex items-center px-2 py-1 text-sm bg-[#EEF7FF] text-[#025CE5] font-gilroyMedium rounded-md"
                    >
                      {o?.teamId ? (
                        <HugeiconsIcon
                          icon={UserGroup03Icon}
                          className="text-[#025CE5] size-4"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={User03Icon}
                          className="text-[#025CE5] size-4"
                        />
                      )}
                      {o?.first_name || o?.title}
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
            value={selectedUsers}
            onChange={setSelectedUsers}
            label="Members and Teams"
            placeholder="Search for members or teams…"
            notFound={
              <div className="py-6 text-center font-gilroyMedium text-sm">
                No members or teams found
              </div>
            }
            width="100%"
            clearable
          />
          {errors?.tags ? (
            <p className="text-sm text-destructive ">{errors.tags} </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="font-gilroyMedium text-black text-base">
            Upload Images
          </label>
          <div className="flex flex-wrap gap-4">
            {/* Add new upload button */}
            <div
              className="flex gap-2 items-center justify-start bg-[#E9F3FF] rounded-2xl border-dashed h-24 w-full border-2 px-2 py-6 border-[#52ABFF] cursor-pointer"
              onClick={() => fileIssueImages?.current?.click()}
            >
              {isUploading ? (
                <div className="w-full h-24 flex flex-col items-center justify-center gap-2">
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
              ) : (
                formData.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group"
                  >
                    <img
                      src={imageUrl}
                      alt={`issue-image-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white size-4" />
                    </button>
                  </div>
                ))
              )}

              {formData.images.length === 0 && !isUploading && (
                <div className="flex flex-col justify-center items-center w-full mx-auto">
                  <UploadImageIcon className="text-blue-500 w-6 h-6" />
                  <span className="text-[#0EA5E9]">Click to upload</span>
                  <p className="text-xs text-neutral-400">
                    JPG, JPEG, PNG less than 1MB
                  </p>
                </div>
              )}
              {formData.images.length > 0 && !isUploading && (
                <div className="w-24 h-[75px] bg-gray-100 flex justify-center items-center rounded-xl border border-dashed border-gray-600">
                  <div className="bg-gray-400 text-white text-3xl rounded-full flex items-center justify-center w-8 h-8">
                    <Plus className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileIssueImages}
            style={{ display: "none" }}
            onChange={handleIssueImages}
            multiple
            accept="image/jpeg, image/png, image/jpg"
          />
          {errors.images && (
            <p className="text-destructive text-sm">{errors.images}</p>
          )}
        </div>

        <div className="flex bottom-0 gap-2 w-full">
          <Button
            type="button"
            className="rounded-md w-1/2 text-base font-gilroyMedium border border-[#E5E5E5]"
            onClick={() => closeBtn(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            className="rounded-md w-1/2 text-base font-gilroyMedium bg-black text-white "
            onClick={handleSubmit}
          >
            {loading ? <Spinner size="sm" /> : <>Submit</>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RaiseTicketForm;
