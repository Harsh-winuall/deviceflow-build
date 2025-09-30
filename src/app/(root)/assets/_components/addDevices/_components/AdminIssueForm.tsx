"use client";

import React, { useRef, useState } from "react";

import { FormField } from "@/app/(root)/settings/_components/form-field";
import { RootState } from "@/app/store/store";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import IssueFormIcons from "@/icons/IssueFormIcons";
import UploadImageIcon from "@/icons/UploadImageIcon";
import { cn } from "@/lib/utils";
import { type Device } from "@/server/deviceActions";
import { createIssue } from "@/server/issueActions";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface IssueFormProps {
  device: Device;
  closeBtn: (value: boolean) => void;
}

export function AdminIssueForm({ device, closeBtn }: IssueFormProps) {
  const userData = useSelector((state: RootState) => state.auth.userData);

  const router = useRouter();

  const [next, setNext] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileIssueImages = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    images: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    priority: "",
    images: "",
  });

  const validateStepOne = () => {
    const newErrors = {
      title: formData.title ? "" : "Issue type is required",
      description: formData.description ? "" : "Issue description is required",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  const validateStepTwo = () => {
    const newErrors = {
      priority: formData.priority ? "" : "Priority is required",
      // images:
      //   formData.images.length > 0 ? "" : "At least one image is required",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  const handleIssueImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidSize = file.size <= 1024 * 1024; // 1MB
        const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
          file.type
        );
        return isValidSize && isValidType;
      });

      const imagePreviews = validFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file), // Generate a preview URL for each file
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imagePreviews],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const severityArray = [
    {
      icon: <IssueFormIcons.low_issue_icon className="size-10" />,
      title: "Low",
      desc: `Small glitch, doesn't slow us down can wait a bit!`,
    },
    {
      icon: <IssueFormIcons.medium_issue_icon className="size-10" />,
      title: "Medium",
      desc: `Noticeable issue, but nothing that'll break the flow fix soon!`,
    },
    {
      icon: <IssueFormIcons.high_issue_icon className="size-10" />,
      title: "Critical",
      desc: `Major issue, needs immediate attention—fix now!`,
    },
  ];

  const handlePriority = (priority: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: priority,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // @ts-ignore
    setErrors({});

    const isStepOneValid = validateStepOne();
    const isStepTwoValid = validateStepTwo();

    if (!isStepOneValid || !isStepTwoValid) {
      return;
    }

    const issue = {
      deviceId: device._id,
      serial_no: device.serial_no,
      priority: formData.priority,
      status: "Open",
      title: formData.title,
      description: formData.description,
      email: userData?.email,
      userId: userData?.userId,
    };

    setLoading(true);
    try {
      await createIssue(issue);
      setLoading(false);
      toast.success("Issue created successfully !");
      router.refresh();
      closeBtn(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to Raise an Issue!");
    } finally {
      setLoading(false);
    }

    setFormData({
      title: "",
      description: "",
      priority: "",
      images: [],
    });
  };

  return (
    <>
      <div className="flex justify-center w-full h-full items-start">
        <div className="flex flex-col w-[97%] gap-4 h-full justify-start items-center">
          <h1 className="font-gilroySemiBold text-xl w-full text-center">
            Report an issue
          </h1>

          <div className="h-[1px] bg-[#E7E7E7] w-full mb-1"></div>

          <div className="w-full bg-[#f5f5f5]  rounded-md p-3 flex items-center gap-4">
            <div className="py-4 px-2  object-contain border rounded-full ">
              <img
                src={
                  // device?.image?.[0]?.url ??
                  "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                }
                alt="Asset-1"
                className="w-16 h-10 "
              />
            </div>
            <div>
              <div className="font-gilroySemiBold text-base">
                {device?.custom_model ?? ""}
              </div>
              <div className="text-[#7C7C7C] font-gilroyMedium text-sm">
                {device?.ram ?? "N/A"}. {device?.storage ?? "N/A"} .{" "}
                {device?.serial_no ?? "N/A"}
              </div>
              <div className="bg-[#ECFDF3] flex justify-center items-center rounded-2xl px-2 py-0.5 text-xs font-gilroyMedium text-[#027A48] mt-1 max-w-16 w-fit">
                <div>{device?.device_type ?? "N/A"}</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col relative mt-1 h-full"
          >
            {next === 0 ? (
              <>
                <div className="w-full flex flex-col gap-6 h-full">
                  <div>
                    <FormField
                      label="Raised by"
                      id="raised_by"
                      value={userData?.firstName ?? ""}
                      disabled
                      type="text"
                      placeholder=""
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <FormField
                      label="Email"
                      id="email"
                      value={userData?.email ?? ""}
                      disabled
                      type="text"
                      placeholder=""
                    />
                    <FormField
                      label="Designation"
                      id="designation"
                      value={`${userData?.designation ?? "Frontend Developer"}`}
                      disabled
                      type="text"
                      placeholder=""
                    />
                  </div>
                  <div className=" w-full ">
                    <div className="z-20">
                      <SelectDropdown
                        options={[
                          { label: "Display Issue", value: "Display Issue" },
                          { label: "Battery Issue", value: "Battery Issue" },
                          {
                            label: "Perfomance Issue",
                            value: "Perfomance Issue",
                          },
                          { label: "Other", value: "Other" },
                        ]}
                        onSelect={(data) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: data?.value,
                          }))
                        }
                        label="Issue Type*"
                        value={formData?.title ?? "eg: Low"}
                        className={cn(
                          errors.title
                            ? "border-destructive/80 "
                            : "border-[#5F5F5F]",
                          "rounded-md border"
                        )}
                      />
                      {errors.title && (
                        <p className="mt-0.5 text-xs font-gilroySemiBold text-destructive">
                          {errors.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="group relative">
                      <Label
                        htmlFor="issue-description"
                        className="absolute start-4 top-0 z-10 block -translate-y-1/2 bg-background px-1 text-sm font-gilroyMedium  text-black group-has-[:disabled]:opacity-50"
                      >
                        Issue description*
                      </Label>
                      <Textarea
                        id="issue-description"
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
                            : "border-[#5F5F5F]",
                          "rounded-md border h-24"
                        )}
                      />
                      {errors.description && (
                        <p className="mt-0.5 text-xs font-gilroySemiBold text-destructive">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex absolute bottom-0 gap-2 w-full">
                  <Button
                    variant="outlineTwo"
                    className="w-full"
                    onClick={() => closeBtn(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      if (validateStepOne()) {
                        setNext(1);
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : next === 1 ? (
              <div className="w-full flex flex-col justify-between -mt-2 mb-4">
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 ">
                    <label className="font-gilroyMedium mb-1.5 text-black text-base">
                      How sever is the issue?
                    </label>
                    <div className="flex flex-col gap-4">
                      {severityArray.map((v) => (
                        <div
                          key={v.title}
                          className={cn(
                            "flex w-full h-[4rem] justify-start items-center rounded-md p-3 border  gap-2 cursor-pointer group",
                            formData.priority === v.title
                              ? "border-black  border-2"
                              : "border-[#6C6C6C]"
                          )}
                          onClick={() => handlePriority(v.title)}
                        >
                          <div className="w-[8%] justify-start items-center flex">
                            {v.icon ?? ""}
                          </div>
                          <div className=" flex flex-col justify-center gap-1">
                            <div className="font-gilroySemiBold text-sm text-black">
                              {v.title ?? ""}
                            </div>
                            <div className="font-gilroyMedium text-[#7C7C7C] text-xs">
                              {v.desc ?? ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.priority && (
                      <p className="text-destructive font-gilroySemiBold text-xs">
                        {errors.priority}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="font-gilroyMedium text-black text-base">
                      Upload Images
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {/* Render uploaded images with a preview */}

                      {/* Add new upload button */}
                      <div
                        className="flex gap-2 items-center justify-center bg-[#E9F3FF] rounded-md border-dashed h-20 w-full border p-3 border-[#52ABFF] cursor-pointer"
                        onClick={() => fileIssueImages?.current?.click()}
                      >
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative size-16 border border-dashed rounded-md overflow-hidden flex items-center justify-center bg-gray-100 group"
                          >
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-3.5  bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {formData.images.length === 0 ? (
                          <div className="flex flex-col justify-center items-center">
                            <UploadImageIcon className="size-5" />
                            <div className="flex gap-1 font-gilroySemiBold">
                              {" "}
                              <span className="text-[#0EA5E9] text-[10px]">
                                Click to upload
                              </span>
                              <span className="text-[10px]">
                                or drag and drop
                              </span>
                            </div>
                            <p className="text-xs font-gilroyMedium text-neutral-400 text-[9px]">
                              JPG, JPEG, PNG less than 1MB
                            </p>
                          </div>
                        ) : (
                          <div className="size-16 bg-gray-100 flex justify-center items-center rounded-xl border border-dashed border-gray-600">
                            <div className="bg-gray-400 text-white text-3xl rounded-full flex items-center justify-center size-4">
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
                    />
                    {errors.images && (
                      <p className="text-destructive text-sm">
                        {errors.images}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full absolute bottom-0">
                  <Button
                    variant="outlineTwo"
                    className="w-full"
                    onClick={() => setNext(0)}
                  >
                    Previous
                  </Button>
                  <LoadingButton
                    variant="primary"
                    className="w-full"
                    type="submit"
                    disabled={loading}
                    loading={loading}
                  >
                    Submit
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

{
  /* <div
                      className="flex flex-col items-center justify-center bg-[#E9F3FF] rounded-2xl border-dashed h-24 w-full border-2 p-6 border-[#52ABFF]"
                      onClick={() => fileIssueImages?.current?.click()}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <Icons.uploadImage className="size-5" />
                        <span className="text-[#0EA5E9]">Click to upload</span>
                        <p className="text-xs text-neutral-400">
                          JPG, JPEG, PNG less than 1MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileIssueImages}
                      style={{ display: "none" }}
                      onChange={handleIssueImages}
                      multiple
                    /> */
}
