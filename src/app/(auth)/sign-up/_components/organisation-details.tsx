import { employments } from "@/app/(root)/people/_components/helper/utils";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { cn } from "@/lib/utils";
import { signupEmployee } from "@/server/signupActions";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

function OrganisationDetails({ setSteps, token, user }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    onboarding_date: "",
    employment_type: "",
    designation: "",
  });

  const [errors, setErrors] = useState({
    onboarding_date: "",
    employment_type: "",
    designation: "",
  });

  const validateFields = (): boolean => {
    const newErrors = {
      onboarding_date: formData.onboarding_date
        ? ""
        : "Joining Date is required",
      employment_type: formData.employment_type
        ? ""
        : "Employment Type is required",
      designation: formData.designation ? "" : "Role is required",
      // reporting_manager:
      //   formData.reporting_manager.name && formData.reporting_manager.value
      //     ? ""
      //     : "Reporting Manager is required",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const onSubmit = async () => {
    if (validateFields()) {
      const userData = {
        token: token,
        ...formData,
        ...user,
      };

      try {
        setLoading(true);
        await signupEmployee(userData);
        setSteps(4);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }

      // setSteps(4);
    } else {
      console.error("Validation failed. Fix errors before proceeding.");
    }
  };
  return (
    <>
      <div
        className="absolute flex gap-1 text-[#7F7F7F] items-center ml-8 mt-10 font-gilroyMedium cursor-pointer"
        onClick={() => {
          setSteps((prev: number) => prev - 1);
        }}
      >
        <ChevronLeft />
        <div>Back</div>
      </div>
      <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
        <div className="w-[46%]  h-[auto]">
          <img
            src="/media/Onboarding/employee.png"
            alt="edify-background"
            width={"100%"}
          />
        </div>
        <div className="w-[42%] relative h-full justify-center items-center flex flex-col">
          <div
            className={`font-gilroySemiBold flex w-full gap-6 flex-col items-center  leading-[normal] tracking-[0px]`}
          >
            <div className="w-full flex flex-col gap-y-4 mb-0">
              <h1 className="text-center text-3xl font-gilroyBold text-indigo-950">
                Hey {user.first_name}
              </h1>
              <p className="text-center text-sm font-gilroyMedium text-gray-600">
                Enter your organisation details
              </p>
            </div>

            <div className="flex flex-col w-[75%] gap-6">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <FormField
                    placeholder="DD/MM/YYYY"
                    label="Joining Date*"
                    error={errors.onboarding_date}
                    id="onboarding_date"
                    name="onboarding_date"
                    type="date"
                    value={formData?.onboarding_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        onboarding_date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className=" w-1/2">
                  <SelectDropdown
                    options={employments}
                    onSelect={(data) =>
                      setFormData((prev) => ({
                        ...prev,
                        employment_type: data?.value,
                      }))
                    }
                    label="Employment type*"
                    value={`${formData?.employment_type ?? ""}`}
                    placeholder="eg: Male"
                    className={cn(
                      errors.employment_type
                        ? "border-destructive/80 "
                        : "border-[#5F5F5F]",
                      "rounded-xl border"
                    )}
                  />
                  {errors.employment_type && (
                    <p className="mt-1 text-xs font-gilroyMedium text-destructive">
                      {errors.employment_type}
                    </p>
                  )}
                </div>
              </div>
              <FormField
                label="Role*"
                placeholder="Role"
                id="designation"
                error={errors.designation}
                name="designation"
                value={formData?.designation ?? "-"}
                type="text"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    designation: e.target.value,
                  }));
                }}
              />

              {/* <SelectInput
              value={formData.reporting_manager.name || ""}
              optionValue={{ firstV: "first_name", secondV: "email" }}
              key={"user-form-reporting-manager"}
              placeholder="Search by name, etc"
              // @ts-ignore
              fetchOptions={(query: string) => searchManager(query, token)}
              // @ts-ignore
              initialOptions={() => fetchManager(token)}
              onSelect={(data: any) => {
                setFormData((prev) => ({
                  ...prev,
                  reporting_manager: { name: data.email, value: data._id },
                }));
              }}
              label="Reporting Manager"
              className={cn(
                errors.reporting_manager ? "border-destructive/80 border" : ""
              )}
            />
            {errors.reporting_manager && (
              <p className="text-destructive font-gilroyMedium text-xs">
                {errors.reporting_manager}
              </p>
            )} */}
            </div>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex items-center mt-5 justify-center h-[56px] w-[75%] rounded-[9.3px] bg-black px-44 py-[13px]"
            >
              <div className="text-center text-white">Submit</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganisationDetails;
