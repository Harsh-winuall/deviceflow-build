// Form.tsx
"use client";
import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import { useAlert } from "@/hooks/useAlert";
import { createDevices, Device, updateDevice } from "@/server/deviceActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPayload } from "./_components/createPayload";
import {
  DevicePage1,
  DevicePage2,
  FormData,
  FormErrors,
  KeyboardDetailsInterface,
} from "./_components/types";
import DeviceType from "./deviceType";
import KeyboardForm from "./keyBoardForm";
import LaptopForm from "./laptopForm";
import LaptopForm2 from "./laptopForm2";
import MobileForm from "./MobileForm";
import MobileForm2 from "./MobileForm2";
import MonitorForm from "./MonitorForm";
import MouseForm from "./mouseForm";

import { useQueryClient } from "@tanstack/react-query";
// import AssignAssetsForm from "../assignAssetsForm";
type FormProps = {
  closeBtn: () => void; // Define the type for closeBtn
  isEditForm?: boolean;
  deviceData?: Device;
};
function Form({ closeBtn, deviceData, isEditForm }: FormProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(0);
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
      device_condition: "",
    },
    monitorDetails: {
      model: "",
      invoiceFile: null,
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      brand: "",
      device_condition: "",
    },
    mouseDetails: {
      model: "",
      invoiceFile: null,
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      brand: "",
      device_condition: "",
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
      custom_model: "",
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

  const prefillFormData = () => {
    if (isEditForm && deviceData) {
      const updatedData = {
        ...formData,
        deviceType: deviceData.device_type,
        userId: deviceData?.userId as string,
      };

      switch (deviceData.device_type) {
        case "keyboard":
          updatedData.keyboardDetails = {
            brand: deviceData?.brand ?? "",
            model: deviceData?.custom_model ?? "",
            purchaseDate: deviceData?.device_purchase_date ?? "",
            serialNumber: deviceData?.serial_no ?? "",
            warrantyExpiryDate: deviceData?.warranty_expiary_date ?? "",
            device_condition: deviceData?.device_condition ?? "",
          };
          break;
        case "mouse":
          updatedData.mouseDetails = {
            brand: deviceData?.brand ?? "",
            model: deviceData?.custom_model ?? "",
            purchaseDate: deviceData?.device_purchase_date ?? "",
            serialNumber: deviceData?.serial_no ?? "",
            warrantyExpiryDate: deviceData?.warranty_expiary_date ?? "",
            device_condition: deviceData?.device_condition ?? "",
          };
          break;
        case "monitor":
          updatedData.monitorDetails = {
            brand: deviceData?.brand ?? "",
            model: deviceData?.custom_model ?? "",
            purchaseDate: deviceData?.device_purchase_date ?? "",
            serialNumber: deviceData?.serial_no ?? "",
            warrantyExpiryDate: deviceData?.warranty_expiary_date ?? "",
            device_condition: deviceData?.device_condition ?? "",
          };
          break;
        case "laptop":
          updatedData.laptopPage1 = {
            os: deviceData?.os ?? "",
            model: deviceData?.custom_model ?? "",
            processor: deviceData?.processor ?? "",
            ram: deviceData?.ram ?? "",
            storage: deviceData?.storage ?? [],
            device_name: deviceData?.device_name ?? "",
            brand: deviceData?.brand ?? "",
            device_condition: deviceData?.device_condition ?? "",
          };
          updatedData.laptopPage2 = {
            serialNumber: deviceData?.serial_no ?? "",
            purchaseDate: deviceData?.device_purchase_date ?? "",
            warrantyExpiryDate: deviceData?.warranty_expiary_date ?? "",
          };
          break;
        case "mobile":
          updatedData.mobilePage1 = {
            os: deviceData?.os ?? "",
            model: deviceData?.custom_model ?? "",
            processor: deviceData?.processor ?? "",
            ram: deviceData?.ram ?? "",
            storage: deviceData?.storage ?? [],
            custom_model: deviceData?.custom_model ?? "",
            brand: deviceData?.brand ?? "",
            device_condition: deviceData?.device_condition ?? "",
          };
          updatedData.mobilePage2 = {
            serialNumber: deviceData?.serial_no ?? "",
            purchaseDate: deviceData?.device_purchase_date ?? "",
            warrantyExpiryDate: deviceData?.warranty_expiary_date ?? "",
          };
          break;
      }

      setFormData(updatedData);
    }
  };

  useEffect(() => {
    prefillFormData();
  }, [isEditForm, deviceData]);

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
          if (!monitor?.device_condition)
            currentErrors.device_condition = "Device Condition is required.";
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
          if (!mouse?.device_condition)
            currentErrors.device_condition = "Device Condition is required.";
          if (!mouse?.warrantyExpiryDate)
            currentErrors.warrantyExpiryDate =
              "Warranty Expiry Date is required";
        } else if (formData?.deviceType === "keyboard") {
          // if(!keyboard?.invoiceFile) currentErrors.invoiceFile = "Incoice File is required.";
          if (!keyboard?.model) currentErrors.model = "Model is required.";
          if (!keyboard?.brand) currentErrors.brand = "Brand is required.";
          if (!keyboard?.serialNumber)
            currentErrors.serialNumber = "Serial Number is required";
          if (!keyboard?.device_condition)
            currentErrors.device_condition = "Device Condition is required.";
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

  const handleSubmit = async () => {
    if (validate()) {
      if (isEditForm) {
        setIsLoading(true);
        try {
          const payload: any = createPayload(formData);
          await updateDevice(deviceData?._id ?? "", payload);
          toast.success("Device updated successfully !");
          closeBtn();
          queryClient.invalidateQueries({
            queryKey: ["get-dashboard-data"],
            exact: false,
            refetchType: "all",
          });

          queryClient.invalidateQueries({
            queryKey: ["fetch-assets"],
            exact: false,
            refetchType: "all",
          });
          router.refresh();
        } catch (error) {
          setIsLoading(false);
          toast.error("Failed to update Device !");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        try {
          const payload: any = createPayload(formData);
          await createDevices(payload);
          showAlert({
            isFailure: false,
            title: "WOAHH !",
            description: "Device created successfully !",
            key: "device-creating",
          });
          closeBtn();
          queryClient.invalidateQueries({
            queryKey: ["get-dashboard-data"],
            exact: false,
            refetchType: "all",
          });
          router.refresh();
        } catch (error) {
          setIsLoading(false);
          toast.error("Failed to created Device !");
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-gilroySemiBold  text-lg text-center w-full">
        {isEditForm
          ? `Update ${formData?.deviceType ? formData?.deviceType : "device"}`
          : `Add new ${formData?.deviceType ? formData?.deviceType : "device"}`}
      </h1>
      <div className="bg-gray-100 h-[1px]"></div>
      <div className="flex flex-col  h-[70vh]  px-1  ">
        {/* {JSON.stringify(formData)} */}

        {step === 0 && (
          <>
            <DeviceType
              isEditForm={isEditForm}
              userName={deviceData?.email ?? ""}
              formData={formData}
              setFormData={setFormData}
              data={formData?.deviceType}
              setData={(data: string) =>
                setFormData((prev) => ({ ...prev, deviceType: data }))
              }
              error={errors?.deviceType}
              closeBtn={closeBtn}
              setTotalSteps={(steps: number) => {
                setTotalStep(steps);
              }}
            />
          </>
        )}
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
      </div>
      <div className="flex gap-2 -mt-3 w-full">
        {step >= 1 ? (
          <Button
            variant="outlineTwo"
            className="w-full"
            onClick={handlePrevStep}
            disabled={isLoading}
          >
            Back
          </Button>
        ) : (
          <Button
            variant="outlineTwo"
            className="w-full"
            onClick={() => {
              closeBtn();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        {step < totalStep ? (
          <LoadingButton
            loading={isLoading}
            variant="primary"
            className="w-full"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            Next
          </LoadingButton>
        ) : (
          <LoadingButton
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
export default Form;
