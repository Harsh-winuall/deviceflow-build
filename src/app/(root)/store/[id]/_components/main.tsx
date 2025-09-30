"use client";
import { StoreDevice } from "@/server/deviceActions";
import { DeviceDetailedSecx } from "./device-detail-secx";
import { DeviceReviewsSecx } from "./device-review-secx";
import { DeviceSecx } from "./device-secx";
import { PerfectForSecx } from "./perfect-for-secx";
import { Cart, DeviceWithQty } from "@/server/cartActions";

export default function StoreDeviceMain({
  data,
  cart,
}: {
  data: StoreDevice;
  cart: Cart;
}) {
  return (
    <>
      <div className="flex flex-col bg-[#fff] font-gilroyRegular">
        <DeviceSecx data={data} cart={cart} />
        <PerfectForSecx data={data} />
        <DeviceDetailedSecx data={data} />
        <DeviceReviewsSecx data={data} />
      </div>
    </>
  );
}
