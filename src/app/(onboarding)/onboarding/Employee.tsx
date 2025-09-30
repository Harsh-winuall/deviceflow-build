"use client";

import {
  bulkUploadKeys,
  employments,
  genders,
} from "@/app/(root)/people/_components/helper/utils";
import { Icons } from "@/app/(root)/people/icons";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { AsyncSelect } from "@/components/ui/async-select";
import { useAlert } from "@/hooks/useAlert";
import CompanyOnbardingIcon from "@/icons/CompanyOnbardingIcon";
import { cn } from "@/lib/utils";
import { fetchTeams, Team } from "@/server/teamActions";
import {
  bulkUploadUsers,
  createUser,
  CreateUserArgs,
  fetchUsers,
  User,
} from "@/server/userActions";
import { notFound } from "next/navigation";
import { useState } from "react";
import BulkUpload from "./BulkUpload";
import { GsuiteDialogOnboarding } from "@/components/bulk-upload/gsuite-bulk-upload-onboarding";
import Image from "next/image";

interface UserFormProps {
  closeBtn: (state: boolean) => void;
  isEditForm?: boolean;
  userData?: CreateUserArgs | User;
}

export const Employee = ({ setSteps }: any) => {
  const { showAlert } = useAlert();
  const [success, setSuccess] = useState(false);
  const [next, setNext] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openGsuiteModal, setOpenGsuiteModal] = useState(false);
  const [formData, setFormData] = useState({
    firstN: "",
    phone: "",
    email: "",
    image: "",
    designation: "",
    team: { name: "", value: "" },
    reportM: { name: "", value: "" },
    gender: "",
    offerLetter: "",
    employment: "",
    dob: "",
    onboarding: "",
  });

  const [errors, setErrors] = useState({
    firstN: "",
    phone: "",
    email: "",
    image: "",
    designation: "",
    team: "",
    reportM: "",
    gender: "",
    offerLetter: "",
    employment: "",
    dob: "",
    onboarding: "",
  });

  const validateStepOne = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    const newErrors = {
      firstN: formData.firstN ? "" : "Name is required",
      // image: formData.image ? "" : "Image is required",
      dob: formData.dob ? "" : "Date of birth is required",
      gender: formData.gender ? "" : "Gender is required",
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
      designation: formData.designation ? "" : "Designation is required",
      // team: formData.team.value ? "" : "Team is required",
      // reportM: formData.reportM.value ? "" : "Reporting Manager is required",
      employment: formData.employment ? "" : "Employment type is required",
      // offerLetter: formData.offerLetter ? "" : "Offer Letter is required",
      onboarding: formData.onboarding ? "" : "Onboarding date is required",
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
      // teamId: formData.team.value,
      onboarding_date: formData.onboarding,
      // reporting_manager: formData.reportM.value,
      employment_type: formData.employment,
      // offerLetter: formData.offerLetter,
      date_of_birth: formData.dob,
      gender: formData.gender,
    };

    if (formData.team.value && formData.team.value.length !== 0) {
      // @ts-ignore
      user.teamId = formData.team.value;
    }

    if (formData.reportM.value && formData.reportM.value.length !== 0) {
      // @ts-ignore
      user.reporting_manager = formData.reportM.value;
    }

    try {
      setLoading(true);
      try {
        await createUser(user);

        const employeeCount = localStorage.getItem("employee-count");
        if (employeeCount) {
          const empCountInt = parseInt(employeeCount);
          if (empCountInt >= 0) {
            localStorage.setItem("employee-count", `${empCountInt + 1}`);
          }
        }

        setLoading(false);
        setSuccess(true);

        setFormData({
          firstN: "",
          phone: "",
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
        });
      } catch (error: any) {
        showAlert({
          title: "Can't create user",
          description: "Phone no. or email is used already !!",
          isFailure: true,
          key: "create-user-failure",
        });
        setNext(0);
      }

      setLoading(false);
    } catch (error) {
      notFound();
    }
  };

  return (
    <>
      <GsuiteDialogOnboarding
        open={openGsuiteModal}
        setOpen={setOpenGsuiteModal}
        onSuccess={() => {
          localStorage.setItem("employee-count", "3");
          setSuccess(true);
        }}
      />

      <div className="w-full h-screen items-center justify-evenly flex flex-col lg:flex-row p-8">
        {success ? (
          <div className="w-full relative h-full justify-center items-center flex flex-col gap-6">
            <div className="w-full">
              <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
                Employee Added!!
              </div>
              <div className="text-center text-md mt-2 font-gilroyMedium leading-[normal] text-zinc-400">
                Employee is added successful
              </div>
            </div>
            <Button
              className="w-[75%]"
              type="button"
              variant="primary"
              onClick={() => {
                setSteps(5);
              }}
            >
              Add Device
            </Button>

            <Button
              type="submit"
              className="  w-[75%]   "
              style={{
                backgroundColor: "#EDEDED",
              }}
              onClick={() => {
                setSuccess(false);
                setNext(0);
              }}
            >
              Create New Employee
            </Button>
          </div>
        ) : (
          <div className="w-full relative h-full justify-center items-center flex flex-col gap-6">
            <div className="w-full">
              <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
                Add employees
              </div>
              <div className="text-center text-xl font-gilroyMedium leading-[normal] text-zinc-400">
                Add all the employees in organisation
              </div>
            </div>
            {next === 0 && (
              <div className="w-[75%] flex flex-col gap-2 justify-between items-center ">
                <BulkUpload
                  bulkApi={bulkUploadUsers}
                  requiredKeys={bulkUploadKeys}
                  setSuccess={(success: boolean) => {
                    setSuccess(success);
                    setLoading(false);
                  }}
                  sampleData={{
                    first_name: "XXXX YYYY",
                    designation: "Engineer",
                    email: "demo@exampledemo.com",
                    phone: "1234567890",
                    employment_type: "Full time",
                    date_of_birth: "09/12/1992",
                    gender: "Male",
                    onboarding_date: "28/01/2020",
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
            )}

            {next === 0 && <CompanyOnbardingIcon className="size-8" />}

            <form
              onSubmit={handleSubmit}
              className="w-[85%] flex flex-col justify-center gap-4"
            >
              {next === 0 ? (
                <>
                  <div className="overflow-y-auto h-[30vh] hide-scrollbar space-y-4 ">
                    <div className="flex-1 mt-1">
                      <FormField
                        label="Name"
                        error={errors.firstN}
                        id="name"
                        value={formData?.firstN ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firstN: e.target.value,
                          }))
                        }
                        maxLength={35}
                        minLength={2}
                        type="text"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-4 pt-3">
                      <div className="flex-1">
                        <FormField
                          label="DOB"
                          error={errors.dob}
                          id="dob"
                          name="dob"
                          value={
                            formData?.dob
                              ? new Date(formData.dob)
                                  .toISOString()
                                  .split("T")[0]
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
                              "rounded-md border"
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
                    <div className="flex w-full flex-wrap items-center gap-4 py-3">
                      <div className="flex-1">
                        <FormField
                          label="Email"
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

                  <div className="flex flex-col gap-2 mb-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        if (validateStepOne()) {
                          setNext(1);
                        }
                      }}
                    >
                      Next
                    </Button>
                    <Button
                      onClick={() => setSteps(4)}
                      className="w-full"
                      variant="outline"
                    >
                      Skip
                    </Button>
                  </div>
                </>
              ) : next === 1 ? (
                <div className="flex flex-col gap-6 relative ">
                  <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-gilroyMedium text-black">
                        Reporting Manager{" "}
                        <span className="text-xs font-gilroyRegular text-neutral-400">
                          (optional)
                        </span>
                      </label>
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
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-4 py-2">
                      <div className="flex-1">
                        <FormField
                          label="Onboarding Date"
                          id="onboarding_date"
                          error={errors.onboarding}
                          name="Joining Date"
                          value={formData?.onboarding ?? ""}
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
                            value={`${formData?.employment ?? ""}`}
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
                      <div className="flex-1">
                        <div
                          className={cn(
                            `flex flex-col gap-1 `,
                            errors?.onboarding ? "-mt-10" : "-mt-6"
                          )}
                        >
                          <label className="text-sm font-gilroyMedium text-black">
                            Team{" "}
                            <span className="text-xs font-gilroyRegular text-neutral-400">
                              (optional)
                            </span>
                          </label>
                          <AsyncSelect<Team>
                            fetcher={fetchTeams}
                            queryKey="fetch-teams"
                            preload
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
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex-1">
                          <FormField
                            label="Designation"
                            id="designation"
                            error={errors.designation}
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
                  </div>
                  <div className="flex gap-2  w-full  mt-4">
                    <LoadingButton
                      variant="primary"
                      loading={loading}
                      type="submit"
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
        )}
      </div>
    </>
  );
};
