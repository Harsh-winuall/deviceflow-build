"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { createDevices } from "@/server/deviceActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPayload } from "../../(root)/assets/_components/addDevices/_components/createPayload";
import {
  DevicePage1,
  DevicePage2,
  FormData,
  FormErrors,
  KeyboardDetailsInterface,
} from "../../(root)/assets/_components/addDevices/_components/types";
import KeyboardForm from "../../(root)/assets/_components/addDevices/keyBoardForm";
import LaptopForm from "../../(root)/assets/_components/addDevices/laptopForm";
import LaptopForm2 from "../../(root)/assets/_components/addDevices/laptopForm2";
import MobileForm from "../../(root)/assets/_components/addDevices/MobileForm";
import MobileForm2 from "../../(root)/assets/_components/addDevices/MobileForm2";
import MonitorForm from "../../(root)/assets/_components/addDevices/MonitorForm";
import MouseForm from "../../(root)/assets/_components/addDevices/mouseForm";
import DeviceTypeOnboarding from "./DeviceTypeOnboarding";
import { Pause } from "lucide-react";
type FormProps = {
  closeBtn: () => void; // Define the type for closeBtn
};
export const DeviceComponent = ({
  setWelcomeScreen,
}: {
  setWelcomeScreen: (value: boolean) => void;
}) => {
  // const { showAlert } = useAlert();

  const [step, setStep] = useState<number>(0);
  const [success, setSuccess] = useState(false);
  const [totalStep, setTotalStep] = useState<number>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    deviceType: "",
    userId: "",
    keyboardDetails: {
      model: "",
      invoiceFile: null,
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      brand: "",
    },
    monitorDetails: {
      model: "",
      invoiceFile: null,
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      brand: "",
    },
    mouseDetails: {
      model: "",
      invoiceFile: null,
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      brand: "",
    },
    laptopPage1: {
      os: "",
      model: "",
      processor: "",
      ram: "",
      storage: [""],
      device_name: "",
      brand: "",
      device_condition: "",
    },
    laptopPage2: {
      serialNumber: "",
      invoiceFile: null,
      purchaseDate: "",
      warrantyExpiryDate: "",
    },
    mobilePage1: {
      os: "",
      model: "",
      processor: "",
      ram: "",
      storage: [""],
      device_name: "",
      brand: "",
      device_condition: "",
    },
    mobilePage2: {
      serialNumber: "",
      invoiceFile: null,
      purchaseDate: "",
      warrantyExpiryDate: "",
    },
  });
  // Utility function to update nested form data with better type safety
  const updateFormData = <K extends keyof FormData>(
    section: K,
    data: Partial<FormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        ...data,
      },
    }));
  };

  const validate = (): boolean => {
    let currentErrors: FormErrors = {};
    const device1 = formData?.laptopPage1;
    const m1 = formData?.mobilePage1;
    const device2 = formData?.laptopPage2;
    const m2 = formData?.mobilePage2;
    const device3 =
      formData?.keyboardDetails ||
      formData?.monitorDetails ||
      formData?.mouseDetails;
    const monitor = formData?.monitorDetails;
    const keyboard = formData?.keyboardDetails;
    const mouse = formData?.mouseDetails;
    switch (step) {
      case 0:
        if (!formData?.deviceType) {
          currentErrors.deviceType = "Please select a device type.";
        }
        break;
      case 1:
        if (formData?.deviceType === "laptop") {
          if (!device1?.os) {
            currentErrors.os = "Operating System is required.";
          }
          if (!device1?.brand) currentErrors.brand = "Brand is required.";
          if (!device1?.model) currentErrors.model = "Model is required.";
          if (!device1?.processor)
            currentErrors.processor = "Processor is required.";
          if (!device1?.ram) currentErrors.ram = "RAM is required.";
          if (!device1?.storage) currentErrors.storage = "Storage is required.";
          if (!device1?.device_condition)
            currentErrors.device_condition = "Device Condition is required.";
        } else if (formData?.deviceType === "mobile") {
          if (!m1?.os) {
            currentErrors.os = "Operating System is required.";
          }
          if (!m1?.brand) currentErrors.brand = "Brand is required.";
          if (!m1?.model) currentErrors.model = "Model is required.";
          if (!m1?.processor)
            currentErrors.processor = "Processor is required.";
          if (!m1?.ram) currentErrors.ram = "RAM is required.";
          if (!m1?.storage) currentErrors.storage = "Storage is required.";
          if (!m1?.device_condition)
            currentErrors.device_condition = "Device Condition is required.";
          if (!m1?.custom_model)
            currentErrors.custom_model = "Device Name is required.";
        } else if (formData?.deviceType === "monitor") {
          // if(!monitor?.invoiceFile) currentErrors.invoiceFile = "Incoice File is required.";
          if (!monitor?.model) currentErrors.model = "Model is required.";
          if (!monitor?.brand) currentErrors.brand = "Brand is required.";
          if (!monitor?.serialNumber)
            currentErrors.serialNumber = "Serial Number is required";
          if (!monitor?.purchaseDate)
            currentErrors.purchaseDate = "Purchase Date is required";
          if (!monitor?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
        } else if (formData?.deviceType === "mouse") {
          // if(!mouse?.invoiceFile) currentErrors.invoiceFile = "Incoice File is required.";
          if (!mouse?.model) currentErrors.model = "Model is required.";
          if (!mouse?.brand) currentErrors.brand = "Brand is required.";
          if (!mouse?.serialNumber)
            currentErrors.serialNumber = "Serial Number is required";
          if (!mouse?.purchaseDate)
            currentErrors.purchaseDate = "Purchase Date is required";
          if (!mouse?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
        } else if (formData?.deviceType === "keyboard") {
          // if(!keyboard?.invoiceFile) currentErrors.invoiceFile = "Incoice File is required.";
          if (!keyboard?.model) currentErrors.model = "Model is required.";
          if (!keyboard?.brand) currentErrors.brand = "Brand is required.";
          if (!keyboard?.serialNumber)
            currentErrors.serialNumber = "Serial Number is required";
          if (!keyboard?.purchaseDate)
            currentErrors.purchaseDate = "Purchase Date is required";
          if (!keyboard?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
        }
        break;
      case 2:
        if (formData?.deviceType === "laptop") {
          if (!device2?.serialNumber) {
            currentErrors.serialNumber = "Serial Number is required";
          }
          if (!device2?.purchaseDate)
            currentErrors.purchaseDate = "Purchase Date is required";
          if (!device2?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
          // if (!device2.invoiceFile)
          //   currentErrors.invoiceFile = "Incoice File is required.";
        } else if (formData?.deviceType === "mobile") {
          if (!m2?.serialNumber) {
            currentErrors.serialNumber = "Serial Number is required";
          }
          if (!m2?.purchaseDate)
            currentErrors.purchaseDate = "Purchase Date is required";
          if (!m2?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
          // if (!device2.invoiceFile)
          //   currentErrors.invoiceFile = "Incoice File is required.";
        }
        break;
      default:
        break;
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };
  const handleNextStep = () => {
    if (validate()) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  const handlePrevStep = () => {
    setStep((prevStep) => (prevStep >= 1 ? prevStep - 1 : prevStep));
  };

  useEffect(() => {
    if (success) {
      setSuccess(true);
      setWelcomeScreen(true);
    }
  }, [success]);

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        const payload: any = createPayload(formData);

        await createDevices(payload);

        const employeeCount = localStorage.getItem("employee-count");
        if (employeeCount) {
          const empCountInt = parseInt(employeeCount);
          if (empCountInt > 0) {
            localStorage.setItem("employee-count", `${empCountInt + 1}`);
          }
        }

        setSuccess(true);
        setWelcomeScreen(true);
      } catch (error) {
        setIsLoading(false);
        setSuccess(false);
        setWelcomeScreen(false);
        setStep(0);
        toast.error("Failed to created Device !");
      }
    }
  };
  return (
    <div
      className={`w-full ${
        success ? "h-[auto]" : "h-screen"
      } justify-evenly  items-center flex flex-col lg:flex-row p-8`}
    >
      {success ? (
        <div
          className={`w-full relative ${
            success ? "h-[auto]" : "h-full"
          } justify-center items-center flex flex-col gap-6`}
        >
          <div className="w-full">
            <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
              Great!! Setup complete
            </div>
            <div className="text-center text-md mt-2 font-gilroySemiBold leading-[normal] text-zinc-400">
              Your are ready to manage assets with DeviceFlow
            </div>
          </div>

          <Button
            className="w-[75%]"
            variant="primary"
            type="button"
            onClick={() => {
              localStorage.setItem("employee-count", "3");
              router.push("/");
            }}
          >
            Done
          </Button>
        </div>
      ) : (
        <div className="w-full relative h-full justify-center items-center flex flex-col gap-4">
          <div className="w-full">
            <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
              Add Devices
            </div>
            <div className="text-center text-xl font-gilroyMedium leading-[normal] text-zinc-400">
              Add all the devices in organisation
            </div>
          </div>

          {step === 0 && (
            <div className="flex w-[75%] gap-4">
              <DeviceTypeOnboarding
                setFormData={setFormData}
                setSuccess={setSuccess}
                data={formData?.deviceType}
                setData={(data: string) =>
                  setFormData((prev) => ({ ...prev, deviceType: data }))
                }
                error={errors?.deviceType}
                setTotalSteps={(steps: number) => {
                  setTotalStep(steps);
                }}
                // setSuccess={setSuccess}
                // data={formData?.deviceType}
                // setData={(data: string) =>
                //   setFormData((prev) => ({ ...prev, deviceType: data }))
                // }
                // error={errors?.deviceType}
                // setTotalSteps={(steps: number) => {
                //   setTotalStep(steps);
                // }}
              />
            </div>
          )}

          <div className="flex flex-col w-[86%] justify-start items-start pb-1 px-1 space-y-4 gap-1">
            {step === 1 && formData?.deviceType === "keyboard" ? (
              <KeyboardForm
                data={formData?.keyboardDetails}
                setData={(data: Partial<KeyboardDetailsInterface>) =>
                  updateFormData("keyboardDetails", data)
                }
                errors={errors}
              />
            ) : step === 1 && formData?.deviceType === "mouse" ? (
              <MouseForm
                data={formData?.mouseDetails}
                setData={(data: Partial<KeyboardDetailsInterface>) =>
                  updateFormData("mouseDetails", data)
                }
                errors={errors}
              />
            ) : step === 1 && formData.deviceType === "laptop" ? (
              <LaptopForm
                data={formData?.laptopPage1}
                setData={(data: Partial<DevicePage1>) =>
                  updateFormData("laptopPage1", data)
                }
                errors={errors}
                deviceType={formData?.deviceType}
              />
            ) : step === 1 && formData?.deviceType === "mobile" ? (
              <MobileForm
                data={formData?.mobilePage1}
                setData={(data: Partial<DevicePage1>) =>
                  updateFormData("mobilePage1", data)
                }
                errors={errors}
                deviceType={formData?.deviceType}
              />
            ) : step === 1 && formData?.deviceType === "monitor" ? (
              <MonitorForm
                data={formData?.monitorDetails}
                setData={(data: Partial<KeyboardDetailsInterface>) =>
                  updateFormData("monitorDetails", data)
                }
                errors={errors}
              />
            ) : (
              <></>
            )}
            {step === 2 && formData?.deviceType === "laptop" ? (
              <LaptopForm2
                data={formData?.laptopPage2}
                setData={(data: Partial<DevicePage2>) =>
                  updateFormData("laptopPage2", data)
                }
                errors={errors}
              />
            ) : step === 2 && formData?.deviceType === "mobile" ? (
              <MobileForm2
                data={formData.mobilePage2}
                setData={(data: Partial<DevicePage2>) =>
                  updateFormData("mobilePage2", data)
                }
                errors={errors}
              />
            ) : (
              <></>
            )}
            {/* Navigation buttons */}
            <div className="flex gap-3 w-full mt-auto pb-2">
              {step < totalStep ? (
                <LoadingButton
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Next
                </LoadingButton>
              ) : (
                <div className="space-y-1.5 w-full">
                  <LoadingButton
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                  >
                    Submit
                  </LoadingButton>
                  <Button
                    onClick={() => {
                      setWelcomeScreen(true);
                      setSuccess(true);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Skip
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
