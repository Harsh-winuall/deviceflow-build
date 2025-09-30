// types.ts

// Define the structure for each section of the form
export interface DevicePage1 {
  _id?: string;
  os?: string;
  model?: string;
  processor?: string;
  ram?: string;
  storage?: string[];
  device_name?: string;
  custom_model?: string;
  brand?: string;
  device_condition?: string;
}

export interface DevicePage2 {
  _id?: string;
  serialNumber: string;
  invoiceFile?: File | null;
  purchaseDate: string;
  warrantyExpiryDate: string;
}

export interface AdvanceDeviceDetails {
  _id?: string;
  serialNumber: string;
  invoiceFile?: File | null;
  purchaseDate: string;
  warrantyExpiryDate: string;
}

export interface assignedToObj {
  name: string;
  value: string;
}

export interface ExtraDetails {
  _id?: string;
  brand: string;
  assignedTo: assignedToObj;
  officeLocation: assignedToObj;
  purchaseOrder: string;
  purchaseValue: number;
  ownership: string;
  image: string;
}

export interface KeyboardDetailsInterface {
  model: string;
  serialNumber: string;
  purchaseDate: string;
  invoiceFile?: File | null;
  warrantyExpiryDate: string;
  brand: string;
  device_condition: string;
}

// Combined FormData interface
export interface FormData {
  deviceType: string;
  userId: string | undefined;
  keyboardDetails: KeyboardDetailsInterface;
  laptopPage1: DevicePage1;
  laptopPage2: DevicePage2;
  mobilePage1: DevicePage1;
  mobilePage2: DevicePage2;
  mouseDetails: KeyboardDetailsInterface;
  monitorDetails: KeyboardDetailsInterface;
}

// FormErrors interface using Partial and nested keys
export type FormErrors = Partial<
  Record<
    | keyof DevicePage1
    | keyof DevicePage2
    | keyof KeyboardDetailsInterface
    | "deviceType",
    string
  >
>;
