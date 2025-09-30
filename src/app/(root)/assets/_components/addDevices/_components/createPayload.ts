import { FormData } from "./types";

export const createPayload = (formData: FormData) => {
  const { deviceType, userId } = formData;

  let payload = {};

  switch (deviceType) {
    case "laptop":
      payload = {
        os: formData?.laptopPage1?.os,
        custom_model: formData?.laptopPage1?.model,
        processor: formData?.laptopPage1?.processor,
        ram: formData?.laptopPage1?.ram,
        storage: formData?.laptopPage1?.storage,
        device_name: formData?.laptopPage1?.device_name,
        brand: formData?.laptopPage1?.brand,
        device_condition: formData?.laptopPage1?.device_condition,
        serial_no: formData?.laptopPage2?.serialNumber,
        device_purchase_date: formData?.laptopPage2?.purchaseDate,
        warranty_expiary_date: formData?.laptopPage2?.warrantyExpiryDate,
        // invoice: formData.laptopPage2.invoiceFile
      };
      break;

    case "mobile":
      payload = {
        os: formData?.mobilePage1?.os,
        custom_model: formData?.mobilePage1?.model,
        processor: formData?.mobilePage1?.processor,
        ram: formData?.mobilePage1?.ram,
        storage: formData?.mobilePage1?.storage,
        device_name: formData?.mobilePage1?.device_name,
        brand: formData?.mobilePage1?.brand,
        device_condition: formData?.mobilePage1?.device_condition,
        serial_no: formData?.mobilePage2?.serialNumber,
        device_purchase_date: formData?.mobilePage2?.purchaseDate,
        warranty_expiary_date: formData?.mobilePage2?.warrantyExpiryDate,
        // invoice: formData.laptopPage2.invoiceFile
      };
      break;

    case "keyboard":
      payload = {
        custom_model: formData?.keyboardDetails?.model,
        brand: formData?.keyboardDetails?.brand,
        serial_no: formData?.keyboardDetails?.serialNumber,
        device_purchase_date: formData?.keyboardDetails?.purchaseDate,
        warranty_expiary_date: formData?.keyboardDetails?.warrantyExpiryDate,
        device_condition: formData?.keyboardDetails?.device_condition,
        // invoice: formData.laptopPage2.invoiceFile
      };
      break;

    case "monitor":
      payload = {
        custom_model: formData?.monitorDetails?.model,
        brand: formData?.monitorDetails?.brand,
        serial_no: formData?.monitorDetails?.serialNumber,
        device_purchase_date: formData?.monitorDetails?.purchaseDate,
        warranty_expiary_date: formData?.monitorDetails?.warrantyExpiryDate,
        device_condition: formData?.monitorDetails?.device_condition,
        // invoice: formData.monitorDetails.invoiceFile
      };
      break;

    case "mouse":
      payload = {
        custom_model: formData?.mouseDetails?.model,
        brand: formData?.mouseDetails?.brand,
        serial_no: formData?.mouseDetails?.serialNumber,
        device_purchase_date: formData?.mouseDetails?.purchaseDate,
        warranty_expiary_date: formData?.mouseDetails?.warrantyExpiryDate,
        device_condition: formData?.mouseDetails?.device_condition,
        // invoice: formData.mouseDetails.invoiceFile
      };
      break;

    default:
      throw new Error("Unsupported device type.");
  }

  return {
    device_type: deviceType,
    userId: userId,
    ...payload, // Include details dynamically based on type
  };
};
