"use client";
import { RootState } from "@/app/store/store";
import {
  ArrowUpRight,
  Info,
  Mail,
  Package,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const DetailSection = ({ order }: { order: any }) => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const date = new Date(order[0]?.response[0].ordered_on);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex justify-between gap-6 mt-5">
      {/* {JSON.stringify(order)} */}
      <div className="bg-white rounded-[25px] border border-[rgba(195, 195, 195, 0.31)] flex flex-col pt-4 px-6 2xl:py-5 2xl:px-7 flex-[60%] h-fit">
        <div className="flex justify-between items-center">
          <div className="text-[#344054] text-2xl 2xl:text-[30px] font-gilroySemiBold">
            Order ID: {order[0]?.cartDetails?.razorpay_order_id}
          </div>
          {/* <button className="flex items-center gap-2 text-[#667085] 2xl:text-[14px] px-3 py-1 2xl:px-4 2xl:py-2 rounded-[8px] border border-[#D0D5DD] font-gilroySemiBold">
            <img
              src="/media/document-text.svg"
              alt="Document Icon"
              className="2xl:w-5 2xl:h-5 w-4 h-4"
            />
            <div className="font-gilroySemiBold">Invoice</div>
          </button> */}
        </div>

        <div className="my-[25px] flex justify-between items-center">
          <div>
            <span className="font-gilroyMedium text-[13px] 2xl:text-[14px] text-[#667085]">
              Order date:
            </span>{" "}
            <span className="font-gilroySemiBold text-[15px] 2xl:text-base text-[#1D2939]">
              {formattedDate}
            </span>
          </div>
          <div className="flex gap-[10.4px] items-center">
            {/* <div className="2xl:text-[16.118px] text-[14px] font-gilroySemiBold text-[#FF8000] rounded-[16.58px] bg-[#FFFACB] py-1 px-4 text-center">
              In transit
            </div> */}

            {order[0]?.cartDetails?.state !== "failed" ? (
              <div className="2xl:text-[16.118px] text-[14px] font-gilroySemiBold text-[#027A48] bg-[#ECFDF3] py-1 px-4 rounded-[16.58px]">
                {order[0]?.cartDetails?.state}
              </div>
            ) : (
              <div className="bg-alert-foreground text-failure 2xl:text-[16.118px] text-[14px] font-gilroySemiBold py-1 px-4 rounded-[16.58px]">
                {order[0]?.cartDetails?.state}
              </div>
            )}
          </div>
        </div>

        <div className="h-[1px] bg-[#D0D5DD] w-full"></div>
        {/* {JSON.stringify(order[0].response[1])} */}
        <div className="flex flex-col gap-7 2xl:gap-8 my-7 2xl:my-8">
          {order[0]?.response?.map((device: any) => (
            // {JSON.stringify(device)}

            <div className="flex justify-between">
              <div className="2xl:gap-6 gap-5 flex items-end">
                <div className="flex justify-center items-center rounded-[17px] border border-[#D0D5DD] bg-white 2xl:py-3 py-2 2xl:size-[78.87px] size-[74.87px] mx-auto">
                  <img
                    alt="laptop"
                    src={`/media/mac-2.png`}
                    className="2xl:width-[78.87px] width-[74.87px] 2xl:height-[78.87px] height-[74.87px]"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-black font-gilroySemiBold text-[19px] 2xl:text-[23px] -mb-0.5">
                    {device?.itemId?.device_name}
                  </div>
                  <div className="font-gilroyMedium text-[#7C7C7C] text-[15px]">
                    {device?.itemId?.ram || "-"} .{" "}
                    {device?.itemId?.storage || "-"} .{" "}
                    {device?.itemId?.serial_no}
                  </div>
                  <div className="text-[12.435px] font-gilroySemiBold text-[#027A48] bg-[#ECFDF3] py-0.5 px-3 rounded-[16.58px]">
                    {device?.itemId?.device_type}
                  </div>
                </div>
              </div>

              <div className="2xl:mt-[11.44px] mt-[10.44px]">
                <div className="text-[#1D2939] text-lg 2xl:text-xl font-gilroySemiBold">
                  ₹{device?.itemId?.payable}
                </div>
                <div className="text-[#667085] text-[14px] 2xl:text-base font-gilroyMedium text-right">
                  Qty: {device?.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-[#D0D5DD] w-full"></div>

        <div className="2xl:my-[27.11px] mt-[23.11px] mb-1 flex justify-between">
          <div className="flex-1 flex flex-col gap-9 2xl:gap-10">
            <div>
              <div className="2xl:text-xl text-lg text-black font-gilroySemiBold mb-1">
                Payment
              </div>
              <div className="2xl:text-[14px] text-[13px] text-[#667085] font-gilroyMedium">
                <div>{order[0].cartDetails.paymentMethod}</div>
                <span></span>
              </div>
            </div>

            {/* <div className="flex flex-col 2xl:gap-3 gap-2">
              <div className="2xl:text-xl text-lg text-black font-gilroySemiBold">
                Need Help
              </div>

              <div className="flex flex-col 2xl:gap-3 gap-2 2xl:text-[17px] text-base text-[#667085]">
                <div className="flex gap-[5px] items-center cursor-pointer">
                  <Info className="2xl:size-[17px] size-[16px]" />{" "}
                  <span className="font-gilroySemiBold">Order Issues</span>
                  <ArrowUpRight className="2xl:size-[17px] size-[16px]" />
                </div>

                <div className="flex gap-[5px] items-center cursor-pointer">
                  <Package className="2xl:size-[17px] size-[16px]" />
                  <span className="font-gilroySemiBold">Returns</span>
                  <ArrowUpRight className="2xl:size-[17px] size-[16px]" />
                </div>
              </div>
            </div> */}
          </div>
          <div className="flex-1 flex flex-col 2xl:gap-3 gap-2">
            <div className="2xl:text-xl text-lg text-black font-gilroySemiBold mb-1">
              Order Summary
            </div>

            <div className="flex flex-col gap-3 text-lg 2xl:text-xl text-[#667085] font-gilroySemiBold">
              <div className="flex justify-between">
                <div>Amount</div>
                <div>₹{order[0]?.cartDetails?.totalPrice}</div>
              </div>
              {/* <div className="flex justify-between">
                <div>Discount</div>
                <div>- ₹0</div>
              </div> */}

              {/* <div className="flex justify-between">
                <div>Delivery</div>
                <div>₹0</div>
              </div> */}
              {/* <div className="flex justify-between">
                <div>Tax</div>
                <div>₹0</div>
              </div> */}
            </div>

            <div className="flex justify-between items-center 2xl:py-4 py-3 border border-dashed border-t-[1px] border-b-0 border-l-0 border-r-0">
              <div className="font-gilroySemiBold 2xl:text-xl text-lg text-[#667085]">
                Total
              </div>
              <div className="font-gilroyBold 2xl:text-xl text-lg text-black">
                ₹{order[0]?.cartDetails?.totalPrice}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[26.08px] flex-[40%]">
        {/* <div className="bg-white rounded-[25px] border border-[rgba(195, 195, 195, 0.31)] flex flex-col gap-[11px] 2xl:py-5 2xl:px-6 py-4 px-5">
          <div className="text-black font-gilroySemiBold 2xl:text-xl text-lg">
            Customer Info.
          </div>
          <div className="flex 2xl:gap-3 gap-2 items-center text-[#667085]">
            <UserRound className="2xl:size-[27px] size-[23px]" />
            <div className="font-gilroyMedium 2xl:text-lg text-base">
              Lalitya Sahu
            </div>
          </div>

          <div className="flex gap-3 items-center text-[#667085]">
            <Phone className="2xl:size-[27px] size-[23px]" />
            <div className="font-gilroyMedium 2xl:text-lg text-base">
              (+91) 90099 89097
            </div>
          </div>

          <div className="flex gap-3 items-center text-[#667085]">
            <Mail className="2xl:size-[27px] size-[23px]" />
            <div className="font-gilroyMedium 2xl:text-lg text-base">
              lalithya@winuall.com
            </div>
          </div>
        </div> */}
        <div className="bg-white rounded-[25px] border border-[rgba(195, 195, 195, 0.31)] flex flex-col gap-[14px] 2xl:py-5 2xl:px-6 py-4 px-5">
          <div className="text-black font-gilroySemiBold 2xl:text-xl text-lg">
            Shipping Address
          </div>
          <div className="flex 2xl:gap-3 gap-2 items-center text-[#667085]">
            <UserRound className="2xl:size-[27px] size-[23px]" />
            <div className="font-gilroyMedium 2xl:text-lg text-base">
              {userData?.orgId?.name}
            </div>
          </div>
          <div className="w-3/4 2xl:text-lg text-base font-gilroyMedium text-[#667085] flex flex-col gap-2">
            <div>{order[0]?.cartDetails?.addressId?.city}</div>
            <div>(+91) 9596710910</div>
          </div>
        </div>
        <div className="bg-white rounded-[25px] border border-[rgba(195, 195, 195, 0.31)] flex flex-col gap-[14px] 2xl:py-5 2xl:px-6 py-4 px-5">
          <div className="text-black font-gilroySemiBold 2xl:text-xl text-lg">
            Billing Address
          </div>
          <div className="flex 2xl:gap-3 gap-2 items-center text-[#667085]">
            <UserRound className="2xl:size-[27px] size-[23px]" />
            <div className="font-gilroyMedium 2xl:text-lg text-base">
              {userData?.firstName} {userData?.lastName}
            </div>
          </div>
          <div className="w-3/4 2xl:text-lg text-base font-gilroyMedium text-[#667085] flex flex-col gap-2">
            <div>
              {/* 2nd Floor, SRS Arcade, 15/2 Hosa Rd, Kasavanahalli, Bengaluru,
              Karnataka 560035 */}
              {userData?.addressDetails?.title},{" "}
              {userData?.addressDetails?.address},{" "}
              {userData?.addressDetails?.city},{" "}
              {userData?.addressDetails?.state},{" "}
              {userData?.addressDetails?.landmark},{" "}
              {userData?.addressDetails?.pinCode}
            </div>
            <div>(+91) {userData?.addressDetails?.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
