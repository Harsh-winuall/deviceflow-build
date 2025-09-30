import { getDeviceById, StoreDevice } from "@/server/deviceActions";
import StoreDeviceMain from "./_components/main";
import { Cart, getCart } from "@/server/cartActions";
// import Link from "next/link";
// import { ChevronLeft, MoveLeft } from "lucide-react";
// import { BackBtn } from "../cart/checkout/_components/back-btn";

type TeamPageProps = { params: { id: string } };

// function validateDeviceData(data: StoreDevice) {
//   const requiredKeys: { [key: string]: string } = {
//     _id: "string",
//     device_name: "string",
//     device_type: "string",
//     is_charger_provided: "boolean",
//     asset_serial_no: "string",
//     serial_no: "string",
//     ram: "string",
//     processor: "string",
//     storage: "array",
//     custom_model: "string",
//     brand: "string",
//     warranty_status: "boolean",
//     warranty_expiary_date: "string",
//     ownership: "string",
//     purchase_order: "string",
//     purchase_value: "number",
//     payable: "number",
//     os: "string",
//     image: "array",
//     invoice: "object",
//     deleted_at: "object",
//     device_purchase_date: "string",
//     assigned_at: "string",
//     userName: "string",
//     email: "object",
//     userId: "object",
//     city: "object",
//     addressId: "string",
//     perfectFor: "array",
//     deviceFeatures: "array",
//     device_condition: "string",
//     description: "string",
//     reviews: "array",
//     ratings: "array",
//     overallReviews: "number",
//     overallRating: "number",
//     ratingDetails: "array",
//   };

//   function isTypeValid(value: any, type: string): boolean {
//     if (type === "array") return Array.isArray(value);
//     if (type === "object") return value === null || typeof value === "object";
//     return typeof value === type;
//   }

//   for (const key in requiredKeys) {
//     // @ts-ignore
//     if (!(key in data) || !isTypeValid(data[key], requiredKeys[key])) {
//       return false;
//     }
//   }
//   return true;
// }

export default async function DeviceDetail({ params }: TeamPageProps) {
  try {
    const data: StoreDevice = await getDeviceById(params.id);
    const cart: Cart = await getCart();

    return (
      <>
        <StoreDeviceMain data={data} cart={cart} />
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load data. Please try again later. <br />
        <a href="/" className="underline text-blue-500">
          Back to home
        </a>
      </div>
    );
  }
}
