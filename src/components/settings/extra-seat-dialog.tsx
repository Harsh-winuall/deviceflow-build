"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../buttons/Button";
import { formatNumber } from "@/lib/utils";
import { createInvoice, initiatePayment } from "@/server/settingActions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ExtraSeatConfirmationDialog = ({
  data,
  children,
  open,
  setOpen,
  followingFn,
  seatCount,
  isGsuite,
}: {
  data?: any;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  followingFn?: (val: any) => void;
  seatCount?: number;
  isGsuite?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      // Call API to create invoice & order
      const res = await initiatePayment({
        paymentOption: "card",
        seatCount:
          (data?.blockedUsers && data?.blockedUsers?.length) ||
          (seatCount && seatCount),
      });

      console.log("Initiated Payment :", res);

      if (!res) {
        toast.error("Failed to initiate payment");
        return;
      }

      const options = {
        key: "rzp_test_oismFrOGZBlrzI", // public key
        amount: res.totalAmount, // in paise
        currency: "INR",
        name: "DeviceFlow",
        description: "Subscription Payment",
        order_id: res?.orderId, // Razorpay order id from backend
        prefill: {
          name: data?.[0]?.organisation?.name || "Customer Name",
          email: data?.[0]?.organisation?.email || "test@example.com",
          contact: data?.[0]?.organisation?.phone || "9999999999",
        },
        theme: {
          color: "#004DFF",
        },
        handler: function (response: any) {
          // This runs after successful payment
          // Send response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
          // to backend for verification
          queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
          queryClient.invalidateQueries({ queryKey: ["fetch-people"] });
          console.log("Payment success:", response);
          followingFn && followingFn();
          setOpen && setOpen(false);
          setPage(1);

          router.refresh();

          toast.success("Payment Successful!");
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled!");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     // Call API to create invoice & order
  //     // const res = await createInvoice(
  //     //   data?.blockedUsers && data?.blockedUsers?.length || seatCount && seatCount,
  //     //   undefined
  //     // );

  //     handlePayment();

  //     console.log("This is after payment");

  //     // console.log("Initiated Payment :", res);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Something went wrong!");
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-[10px] bg-white shadow-md shadow-black/10 py-4 px-5 w-full mx-auto max-w-xs">
        <div className="w-full flex justify-center items-center">
          <img
            src="/media/crown.webp"
            alt="icon"
            width={164}
            height={119}
            className=""
          />
        </div>

        <div className="text-[#6B6B6B] font-gilroyMedium text-[13px] w-full text-center">
          Seat limit reached! You currently have {data?.maxSeats} users. Add
          more seats at{" "}
          <span className="font-gilroySemiBold">
            ₹{formatNumber(data?.pricePerSeat / 100)} per seat
          </span>{" "}
          to continue. The cost will automatically reflect in your next billing
          cycle.
        </div>

        {page === 1 ? (
          <div className="flex flex-col gap-1">
            <Button
              variant="primary"
              className="w-full mt-5 font-gilroyMedium text-[13px]"
              onClick={() => setPage(2)}
            >
              Add Extra Seat
            </Button>

            <DialogClose>
              <Button
                variant="default"
                className="w-full font-gilroyMedium text-[11px] text-black/30"
              >
                Skip For Now
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Button
              variant="primary"
              className="w-full mt-5 font-gilroyMedium text-[13px]"
              onClick={handlePayment}
            >
              Confirm
            </Button>

            <DialogClose>
              <Button
                variant="default"
                className="w-full font-gilroyMedium text-[11px] text-black/30"
                onClick={() => {
                  setPage(1);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExtraSeatConfirmationDialog;
