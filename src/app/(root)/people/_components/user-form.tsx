"use client";

import BulkUpload from "@/components/bulk-upload";
import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { useAlert } from "@/hooks/useAlert";
import UploadImageIcon from "@/icons/UploadImageIcon";
import { cn } from "@/lib/utils";
import { fetchTeams, Team } from "@/server/teamActions";
import {
  bulkUploadUsers,
  createUser,
  CreateUserArgs,
  fetchUsers,
  updateUser,
  User,
} from "@/server/userActions";
import { toast } from "sonner";
// import { } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormField } from "../../settings/_components/form-field";
import { GsuiteDialog } from "@/components/bulk-upload/gsuite-bulk-upload.dialog";
import { AsyncSelect } from "@/components/ui/async-select";
import { Icons } from "../icons";
import { bulkUploadKeys, employments, genders } from "./helper/utils";
import { getImageUrl } from "@/components/utils/upload";
import Image from "next/image";

interface UserFormProps {
  closeBtn: (state: boolean) => void;
  isEditForm?: boolean;
  userData?: CreateUserArgs | User;
  setOpenGsuiteModal?: any;
  openGsuiteModal?: any;
}

export const UserForm = ({
  closeBtn,
  isEditForm,
  userData,
  setOpenGsuiteModal,
  openGsuiteModal,
}: UserFormProps) => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

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
    }, 100); // Simulates progress every 100ms
  };

  const [next, setNext] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstN: userData ? userData?.first_name : "",
    phone: userData ? userData?.phone : "",
    email: userData ? userData?.email : "",
    managementType: userData?.role
      ? userData?.role === 4
        ? "CEO"
        : userData.role === 3
        ? "Upper Management"
        : "Employee"
      : "",
    emp_id: userData ? userData?.emp_id : "",
    image: userData ? userData?.image : "",
    designation: userData ? userData?.designation : "",
    team: userData?.team[0]?._id
      ? // @ts-ignore
        { name: userData?.team[0]?.title, value: userData?.team[0]?._id }
      : { name: "", value: "" },
    reportM: userData?.reporting_manager
      ? {
          // @ts-ignore
          name: userData?.reporting_manager?.email,
          // @ts-ignore
          value: userData?.reporting_manager?._id,
        }
      : { name: "", value: "" },
    gender: userData ? userData?.gender : "",
    offerLetter: userData ? userData?.offerLetter : "",
    employment: userData ? userData?.employment_type : "",
    dob: userData ? userData?.date_of_birth : "",
    onboarding: userData ? userData?.onboarding_date : "",
  });

  const [errors, setErrors] = useState({
    firstN: "",
    phone: "",
    email: "",
    managementType: "",
    image: "",
    designation: "",
    team: "",
    reportM: "",
    gender: "",
    offerLetter: "",
    employment: "",
    dob: "",
    onboarding: "",
    emp_id: "",
  });

  const validateStepOne = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newErrors = {
      firstN: formData.firstN ? "" : "Name is required",
      // image: formData.image ? "" : "Image is required",
      // dob: formData.dob
      //   ? new Date(formData.dob) > today
      //     ? "Invalid DOB"
      //     : ""
      //   : "Date of birth is required",
      // gender: formData.gender ? "" : "Gender is required",
      email: formData.email
        ? emailRegex.test(formData.email)
          ? ""
          : "Invalid email format"
        : "Email is required",
      phone: formData.phone
        ? phoneRegex.test(formData.phone)
          ? ""
          : "Phone number must be 10 digits"
        : "Phone number is required",
    };

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  const validateStepTwo = () => {
    const newErrors = {
      // designation: formData.designation ? "" : "Designation is required",
      managementType: formData.managementType
        ? ""
        : "Management type is required",
      // team: formData.team.value ? "" : "Team is required",
      // reportM:
      //   formData.managementType === "Employee" && !formData.reportM.value
      //     ? "Reporting Manager is required"
      //     : "",
      // employment: formData.employment ? "" : "Employment type is required",
      // offerLetter: formData.offerLetter ? "" : "Offer Letter is required",
      // onboarding: formData.onboarding ? "" : "Onboarding date is required",
    };

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // @ts-ignore
    setErrors({});

    // Validation before submitting
    const isStepOneValid = validateStepOne();
    const isStepTwoValid = validateStepTwo();

    if (!isStepOneValid || !isStepTwoValid) {
      return;
    }

    const user = {
      first_name: formData.firstN,
      email: formData.email,
      phone: formData.phone,
      image: formData.image,
      designation: formData.designation,
      onboarding_date: formData.onboarding,
      // reporting_manager: formData.reportM.value,
      employment_type: formData.employment,
      // offerLetter: formData.offerLetter,
      date_of_birth: formData.dob,
      gender: formData.gender,
      emp_id: formData.emp_id,
    };

    if (formData.team.value && formData.team.value.length !== 0) {
      // @ts-ignore
      user.teamId = formData.team.value;
    }

    if (formData.reportM.value && formData.reportM.value.length !== 0) {
      // @ts-ignore
      user.reporting_manager = formData.reportM.value;
    }

    if (formData.managementType && formData.managementType.length !== 0) {
      let role = 1;
      if (formData.managementType === "CEO") {
        role = 4;
      } else if (formData.managementType === "Upper Management") {
        role = 3;
      } else if (formData.managementType === "Employee") {
        role = 1;
      }
      // @ts-ignore
      user.role = role;
    }

    try {
      if (isEditForm) {
        setLoading(true);
        try {
          await updateUser(userData?._id!, user);
          setLoading(false);
          toast.success("User update success !");
          queryClient.refetchQueries({
            queryKey: ["fetch-people", "active-users"],
            exact: false,
          });

          queryClient.invalidateQueries({
            queryKey: ["fetch-user-by-id"],
            exact: false,
            refetchType: "all",
          });

          queryClient.invalidateQueries({
            queryKey: ["user-timeline"],
            refetchType: "all",
            exact: false,
          });
          // onRefresh();
          // router.refresh();
          closeBtn(false);
        } catch (error: any) {
          showAlert({
            title: "Can't update user",
            description: "Phone no. or email is used already !",
            isFailure: true,
            key: "update-user-failure",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          const res = await createUser(user);
          setLoading(false);
          showAlert({
            title: "WOHOOO!! 🎉",
            description: "User created successfully !!",
            isFailure: false,
            key: "create-user-success",
          });
          router.push("/people");
          router.refresh();

          setFormData({
            firstN: "",
            phone: "",
            managementType: "",
            email: "",
            image: "",
            designation: "",
            team: { name: "", value: "" },
            reportM: { name: "", value: "" },
            gender: "",
            employment: "",
            offerLetter: "",
            dob: "",
            onboarding: "",
            emp_id: "",
          });
          closeBtn(false);
        } catch (error: any) {
          showAlert({
            title: "Can't create user",
            description: "Phone no. or email is used already !!",
            isFailure: true,
            key: "create-user-failure",
          });
        } finally {
          setLoading(false);
        }

        setLoading(false);
      }
    } catch (error) {
      notFound();
    }
  };

  const fileImageRef = useRef<HTMLInputElement | null>(null);
  // Handle file selection

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );

      if (isValidSize && isValidType) {
        setIsUploading(true);
        simulateProgress();
        try {
          const res = await getImageUrl({ file });

          setFormData((prev) => ({
            ...prev,
            image: res.fileUrl, // Ensure `res.url` contains the S3 URL.
          }));

          setErrors((prev) => ({
            ...prev,
            image: "",
          }));
        } catch (error) {
          toast.error("Image upload failed");
          setErrors((prev) => ({
            ...prev,
            image: "Failed to upload the image. Please try again.",
          }));
        } finally {
          setIsUploading(false); // Stop showing the progress bar
          setProgress(0);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, JPEG, or PNG files under 1MB are allowed.",
        }));
      }
    } else {
      if (formData.gender === "Male") {
        setFormData((prev) => ({
          ...prev,
          image:
            "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012636473.png",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image:
            "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012892650.png",
        }));
      }
    }
  };

  const fileOfferLetterRef = useRef<HTMLInputElement | null>(null);
  const [offerLetter, setOfferLetter] = useState<File | null>(null);

  const handleOfferLetterChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidSize = file.size <= 1024 * 1024 * 5; // Max 5MB size
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ].includes(file.type);

      if (isValidSize && isValidType) {
        setIsUploading(true);
        simulateProgress();
        try {
          const res = await getImageUrl({ file });
          setOfferLetter(res?.fileUrl);
        } catch (error) {
          toast.error("Image upload failed");
        } finally {
          setIsUploading(false); // Stop showing the progress bar
          setProgress(0);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          offerLetter: "Only PDF files under 5MB are allowed.",
        }));
      }
    }
  };

  const handleRemoveOfferLetter = () => {
    setOfferLetter(null);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  return (
    <>
      <GsuiteDialog open={openGsuiteModal} setOpen={setOpenGsuiteModal} />

      <div className="flex relative flex-col justify-start items-start pb-1 px-1 space-y-2  h-full">
        <h1 className="font-gilroySemiBold w-full text-center text-xl">
          {isEditForm ? "Edit Employee " : "Add Employee"}
        </h1>
        <p className="text-center w-full text-base text-[#7f7f7f] font-gilroyMedium">
          Fill in the details below to onboard a new team member seamlessly.
        </p>
        <div className="h-[1px] bg-[#E7E7E7] w-full"></div>

        {!isEditForm ? (
          next === 0 ? (
            <div className="w-full flex flex-col gap-2 justify-between items-center ">
              <BulkUpload
                bulkApi={bulkUploadUsers}
                closeBtn={() => closeBtn(false)}
                requiredKeys={bulkUploadKeys}
                type="user"
                sampleData={{
                  first_name: "XXXX YYYY",
                  designation: "Engineer",
                  email: "demo@exampledemo.com",
                  phone: "1234567890",
                  employment_type: "Full time",
                  date_of_birth: "09/12/1992",
                  gender: "Male",
                  onboarding_date: "28/01/2020",
                  team_code: "ABCDEF",
                  emp_id: "0123",
                }}
              />
              <div className="rounded-lg p-3  w-full flex justify-between items-center border border-gray-200">
                <div className="flex gap-2">
                  <Image
                    src="/media/integrations-companies/google.webp"
                    alt="GSuite"
                    className="size-9"
                    width={35}
                    height={30}
                  />

                  <div className="flex flex-col ">
                    <h1 className="text-base font-gilroySemiBold">GSuite</h1>
                    <p className="text-[#7f7f7f] text-xs  font-gilroyMedium ">
                      Import all the members automatically
                    </p>
                  </div>
                </div>
                <button
                  disabled={loading}
                  className={` bg-black rounded-md text-white font-gilroyMedium  text-sm py-2 px-6 hover:bg-gray-800 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    setOpenGsuiteModal(true);
                  }}
                >
                  Import
                </button>
              </div>
            </div>
          ) : null
        ) : null}

        {/* {openGsuiteModal ? ( */}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-2 h-full"
        >
          {next === 0 ? (
            <>
              {!isEditForm && (
                <>
                  <div className="flex items-center justify-center ">
                    <div className="border-t border-gray-400 w-7"></div>
                    <span className="mx-2  font-gilroySemiBold text-xs text-gray-400">
                      OR
                    </span>
                    <div className="border-t border-[#B1B1B1] w-7"></div>
                  </div>
                </>
              )}
              <div
                className={`overflow-y-auto flex flex-col gap-2 pt-2 ${
                  isEditForm && "h-[65.5vh]"
                } h-[40vh] hide-scrollbar`}
              >
                <FormField
                  label="Name"
                  error={errors.firstN}
                  id="name"
                  value={formData?.firstN ?? ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const nameRegex = /^[A-Za-z\s]*$/;

                    if (!inputValue || nameRegex.test(inputValue)) {
                      setFormData((prev) => ({
                        ...prev,
                        firstN: inputValue,
                      }));

                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        firstN: inputValue
                          ? inputValue.length >= 2 && inputValue.length <= 35
                            ? ""
                            : "Name must be between 2 and 35 characters"
                          : "Name is required",
                      }));
                    }
                  }}
                  maxLength={35}
                  minLength={2}
                  type="text"
                  placeholder="John Doe"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="font-gilroyMedium text-black text-sm">
                    Upload picture
                  </label>

                  {isUploading ? (
                    <div className="w-full  h-24 flex flex-col items-center justify-center gap-2">
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
                  ) : formData.image ? (
                    <div className="bg-[#E9F3FF] rounded-md border-dashed  border p-3 border-[#52ABFF]">
                      <div className="relative rounded-md size-12 overflow-hidden group">
                        <img
                          src={formData.image}
                          alt={formData.image}
                          className="w-full h-full  object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-[25%] left-[28%]  bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex cursor-pointer flex-col items-center justify-center bg-[#E9F3FF] rounded-md border-dashed h-20 w-full border p-3 border-[#52ABFF]"
                      onClick={() => fileImageRef.current?.click()}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <UploadImageIcon className="size-5" />
                        <div className="flex gap-1 font-gilroySemiBold">
                          {" "}
                          <span className="text-[#0EA5E9] text-[10px]">
                            Click to upload
                          </span>
                          <span className="text-[10px]">or drag and drop</span>
                        </div>
                        <p className="text-xs font-gilroyMedium text-neutral-400 text-[9px]">
                          JPG, JPEG, PNG less than 1MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileImageRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 pt-2">
                  <div className="flex-1">
                    <FormField
                      label="DOB"
                      id="dob"
                      name="dob"
                      value={
                        formData?.dob
                          ? new Date(formData.dob).toISOString().split("T")[0]
                          : ""
                      }
                      type="date"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="z-20 flex-1">
                      <SelectDropdown
                        options={genders}
                        onSelect={(data) =>
                          setFormData((prev) => ({
                            ...prev,
                            gender: data?.value,
                          }))
                        }
                        label="Gender"
                        value={`${formData?.gender ?? ""}`}
                        placeholder="eg: Male"
                        className={cn(
                          errors.gender
                            ? "border-destructive/80 "
                            : "border-[#5F5F5F]",
                          "rounded-md border font-gilroyMedium text-sm"
                        )}
                      />
                      {errors.gender && (
                        <p className="mt-1 text-xs font-gilroyMedium text-destructive">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-4 py-2">
                  <div className="flex-1">
                    <FormField
                      label="Email"
                      disabled={isEditForm}
                      id="email"
                      error={errors.email}
                      name="email"
                      value={formData?.email ?? ""}
                      type="text"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const emailRegex =
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                        if (
                          !inputValue ||
                          /^[a-zA-Z0-9@._-]*$/.test(inputValue)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            email: inputValue,
                          }));

                          // Validate email format on the fly
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            email: inputValue
                              ? emailRegex.test(inputValue)
                                ? ""
                                : "Invalid email format"
                              : "Email is required",
                          }));
                        }
                      }}
                      maxLength={50}
                      placeholder="jhondoe@winuall.com"
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      label="Phone"
                      id="phone"
                      name="phone"
                      error={errors.phone}
                      value={formData?.phone ?? ""}
                      type="tel"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const phoneRegex = /^[0-9]{0,10}$/;

                        // Allow only numbers (or empty string) and prevent invalid input
                        if (!inputValue || phoneRegex.test(inputValue)) {
                          setFormData((prev) => ({
                            ...prev,
                            phone: inputValue,
                          }));

                          // Validate phone number format on the fly
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            phone: inputValue
                              ? /^[0-9]{10}$/.test(inputValue)
                                ? ""
                                : "Phone number must be 10 digits"
                              : "Phone number is required",
                          }));
                        }
                      }}
                      maxLength={10}
                      placeholder="eg: 9876543210"
                    />
                  </div>
                </div>
              </div>
              {/* {error && <span className="w-full text-red-400">{error}</span>} */}
              <div className="flex gap-2 ">
                <button
                  className={buttonVariants({
                    variant: "outlineTwo",
                    className: "w-full",
                  })}
                  type="button"
                  onClick={() => closeBtn(false)}
                >
                  Cancel
                </button>
                <button
                  className={buttonVariants({
                    variant: "primary",
                    className: "w-full",
                  })}
                  onClick={() => {
                    if (validateStepOne()) {
                      setNext(1);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : next === 1 ? (
            <div className="flex flex-col gap-6 relative h-full">
              <div className="w-full flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <FormField
                    label="Employee ID"
                    id="emp_id"
                    error={errors.emp_id}
                    name="emp_id"
                    value={formData?.emp_id ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emp_id: e.target.value,
                      }))
                    }
                    maxLength={50}
                    placeholder="eg: 0123"
                  />
                  {errors.emp_id && (
                    <p className="mt-0.5 font-gilroyMedium text-xs text-destructive">
                      {errors.emp_id}
                    </p>
                  )}
                </div>

                <div className="z-50 flex-1">
                  <SelectDropdown
                    options={[
                      { label: "CEO", value: "CEO" },
                      {
                        label: "Upper Management",
                        value: "Upper Management",
                      },
                      { label: "Employee", value: "Employee" },
                    ]}
                    onSelect={(data) =>
                      setFormData((prev) => ({
                        ...prev,
                        managementType: data?.value,
                      }))
                    }
                    disabled={formData?.managementType !== "Employee"}
                    label="Management Type"
                    value={`${formData?.managementType ?? ""}`}
                    placeholder="eg: Employee"
                    className={cn(
                      errors.managementType
                        ? "border-destructive/80 "
                        : "border-[#5F5F5F]",
                      "rounded-md border"
                    )}
                  />
                  {errors.managementType && (
                    <p className="mt-0.5 font-gilroyMedium text-xs text-destructive">
                      {errors.managementType}
                    </p>
                  )}
                </div>
                {formData.managementType === "Employee" && (
                  <div className="flex flex-col gap-2 pt-3">
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
                        user?.email
                          ?.toLowerCase()
                          ?.includes(query?.toLowerCase())
                      }
                      getOptionValue={(user) => user?.email}
                      getDisplayValue={(user) => (
                        <div className="flex items-center gap-2 text-left w-full">
                          <div className="flex flex-col leading-tight">
                            <div className="font-gilroyMedium">
                              {formData?.reportM?.name ?? ""}
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
                      placeholder="Add Reporting Manager"
                      value={formData?.reportM?.name || "null"}
                      onChange={(selected: User | null) => {
                        setFormData((prev) => ({
                          ...prev,
                          reportM: {
                            name: selected?.email,
                            value: selected?._id,
                          },
                        }));
                      }}
                      width="100%"
                      triggerClassName="border border-[#5F5F5F]"
                    />
                    {errors?.reportM?.length > 0 && (
                      <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                        {errors?.reportM}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex w-full flex-wrap items-center gap-4 py-2">
                  <div className="flex-1">
                    <FormField
                      label="Onboarding Date"
                      id="onboarding"
                      // error={errors.onboarding}
                      name="Joining Date"
                      value={
                        formData?.onboarding
                          ? new Date(formData.onboarding)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      type="date"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          onboarding: e.target.value,
                        }))
                      }
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="z-20 flex-1">
                      <SelectDropdown
                        options={employments}
                        onSelect={(data) =>
                          setFormData((prev) => ({
                            ...prev,
                            employment: data?.value,
                          }))
                        }
                        label="Employment Type"
                        value={`${
                          formData?.employment ??
                          userData?.employment_type ??
                          ""
                        }`}
                        placeholder="eg: Full time"
                        className={cn(
                          errors.employment
                            ? "border-destructive/80 "
                            : "border-[#5F5F5F]",
                          "rounded-md border"
                        )}
                      />
                      {errors.employment && (
                        <p className="mt-0.5 font-gilroyMedium text-xs text-destructive">
                          {errors.employment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-4 ">
                  {errors.onboarding ? (
                    <div className="flex flex-col gap-2 flex-1 -mt-4">
                      <AsyncSelect<Team>
                        fetcher={fetchTeams}
                        queryKey="fetch-teams"
                        preload
                        // fixInputClear={false}
                        renderOption={(team) => (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="font-gilroyMedium">
                                {team?.title}
                              </div>
                              <div className="text-xs font-gilroyRegular text-muted-foreground">
                                {team?.description}
                              </div>
                            </div>
                          </div>
                        )}
                        filterFn={(team, query) =>
                          team?.title
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase()) ||
                          team?.description
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase())
                        }
                        getOptionValue={(team) => team?.title}
                        getDisplayValue={(team) => (
                          <div className="flex items-center gap-2 text-left w-full">
                            <div className="flex flex-col leading-tight">
                              <div className="font-gilroyMedium">
                                {team?._id === formData?.team?.value
                                  ? formData?.team?.name
                                  : ""}
                              </div>
                            </div>
                          </div>
                        )}
                        notFound={
                          <div className="py-6 text-center font-gilroyMedium text-sm">
                            No teams found
                          </div>
                        }
                        label="Team"
                        placeholder="Search Teams"
                        value={formData?.team?.name || "null"}
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            team: {
                              name: selected?.title,
                              value: selected?._id,
                            },
                          }));
                        }}
                        width="100%"
                        triggerClassName="border border-[#5F5F5F]"
                      />
                      {errors?.team?.length > 0 && (
                        <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                          {errors?.team}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1 gap-2 ">
                      <AsyncSelect<Team>
                        fetcher={fetchTeams}
                        queryKey="fetch-teams"
                        preload
                        // fixInputClear={false}
                        renderOption={(team) => (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="font-gilroyMedium">
                                {team?.title}
                              </div>
                              <div className="text-xs font-gilroyRegular text-muted-foreground">
                                {team?.description}
                              </div>
                            </div>
                          </div>
                        )}
                        filterFn={(team, query) =>
                          team?.title
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase()) ||
                          team?.description
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase())
                        }
                        getOptionValue={(team) => team?.title}
                        getDisplayValue={(team) => (
                          <div className="flex items-center gap-2 text-left w-full">
                            <div className="flex flex-col leading-tight">
                              <div className="font-gilroyMedium">
                                {team?._id === formData?.team?.value
                                  ? formData?.team?.name
                                  : ""}
                              </div>
                            </div>
                          </div>
                        )}
                        notFound={
                          <div className="py-6 text-center font-gilroyMedium text-sm">
                            No teams found
                          </div>
                        }
                        label="Team"
                        placeholder="Search Teams"
                        value={formData?.team?.name || "null"}
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            team: {
                              name: selected?.title,
                              value: selected?._id,
                            },
                          }));
                        }}
                        width="100%"
                        triggerClassName="border border-[#5F5F5F]"
                      />
                      {errors?.team?.length > 0 && (
                        <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                          {errors?.team}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex-1">
                      <FormField
                        label="Designation"
                        id="designation"
                        // error={errors.designation}
                        name="designation"
                        value={formData?.designation ?? ""}
                        type="text"
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          setFormData((prev) => ({
                            ...prev,
                            designation: inputValue,
                          }));

                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            designation: inputValue
                              ? ""
                              : "Designation is required",
                          }));
                        }}
                        maxLength={50}
                        placeholder="eg. Frontend Developer"
                      />
                    </div>
                  </div>
                </div>

                {/* Offer letter */}
                <div className="flex flex-col gap-1.5 ">
                  <label className="font-gilroyMedium text-black text-sm">
                    Upload Offer Letter
                  </label>
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
                  ) : offerLetter ? (
                    <div className="bg-[#E9F3FF] rounded-md border-dashed  border p-3 border-[#52ABFF]">
                      <div className="relative w-20 h-20 bg-[#F5F5F5] rounded-xl p-4">
                        <iframe
                          src={offerLetter as any}
                          width="100%"
                          height="100%"
                          title="Offer Letter Preview"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-[25%] left-[28%]  bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={handleRemoveOfferLetter}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex cursor-pointer flex-col items-center justify-center bg-[#E9F3FF] rounded-md border-dashed h-20 w-full border p-3 border-[#52ABFF]"
                      onClick={() => fileOfferLetterRef?.current?.click()}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <UploadImageIcon className="size-5" />
                        <div className="flex gap-1 font-gilroySemiBold">
                          {" "}
                          <span className="text-[#0EA5E9] text-[10px]">
                            Click to upload
                          </span>
                          <span className="text-[10px]">or drag and drop</span>
                        </div>
                        <p className="text-xs font-gilroyMedium text-neutral-400 text-[9px]">
                          JPG, JPEG, PNG less than 1MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileOfferLetterRef}
                    style={{ display: "none" }}
                    onChange={handleOfferLetterChange}
                  />
                  {errors.offerLetter && (
                    <p className="text-destructive text-xs font-gilroySemiBold">
                      {errors.offerLetter}
                    </p>
                  )}
                  <div className="pointer-events-none h-16 w-full" />
                </div>
              </div>
              <div className="flex gap-2 absolute -bottom-2 w-full ">
                <Button
                  variant="outlineTwo"
                  className={"w-full"}
                  type="button"
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
                  {isEditForm ? "Save Changes" : "Submit"}
                </LoadingButton>
              </div>
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  );
};
