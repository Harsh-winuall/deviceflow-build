"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const CouponsModal = ({
  triggerLabel,
  content,
  onApply,
  selectedCouponCode,
}: {
  triggerLabel: React.ReactNode;
  content: React.ReactNode;
  onApply: (code: string) => void;
  selectedCouponCode: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (selectedCouponCode) {
      onApply(selectedCouponCode);
      setOpen(false); // Close the modal
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{triggerLabel}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg max-w-[376px] z-[200] top-[60%]">
        <DialogTitle className="text-base font-gilroySemiBold text-black mb-[10.54px]">
          Apply Coupons
        </DialogTitle>
        <div className="flex justify-between items-center w-full bg-white gap-4 p-4 border border-[#D1D1D8] rounded-[13px]">
            <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Coupon Code"
                value={selectedCouponCode}
                readOnly
            />
            <div className="text-base font-gilroyRegular cursor-pointer text-black text-nowrap" onClick={handleApply}>Apply</div>
        </div>

        <div className="h-[1px] bg-[#D1D1D8] w-full my-[19px]"></div>

        <div className="overflow-y-auto">{content}</div>
      </DialogContent>
    </Dialog>
  );
};
