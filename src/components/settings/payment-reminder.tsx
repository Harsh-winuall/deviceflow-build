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
import { signOut, useSession } from "next-auth/react";
import {
  getSubcriptionStatus,
  initiatePayment,
  renewSubscription,
} from "@/server/settingActions";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DialogPlans from "./deviceflow-plans";

const PaymentReminderDialog = ({
  children,
  amount = 2000,
  role,
  type,
}: {
  children?: React.ReactNode;
  amount?: number;
  role?: number;
  type?: string;
}) => {
  const [open, setOpen] = useState(true);
  const [openPlan, setOpenPlans] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["subscription-plan"],
    queryFn: () => getSubcriptionStatus(),
  });

  const renewPlanMutation = useMutation({
    mutationFn: renewSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
      toast.success("Subscription Renewed!");
    },
    onError: () => {
      toast.error("Failed to renew subscription. Please try again.");
    },
  });

  const handleLogout = () => {
    signOut();
    queryClient.clear();
    sessionStorage.clear();
  };

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
      const res = await initiatePayment({ paymentOption: "card" });

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
        handler: async function (response: any) {
          // This runs after successful payment
          // Send response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
          // to backend for verification
          // queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
          // console.log("Payment success:", response);
          await update({
            subscriptionStatus: undefined,
            amount: undefined,
          });
          toast.success("Payment Successful!");
          router.refresh();
          setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="rounded-[10px] bg-white shadow-md shadow-black/10 py-4 px-5 w-full mx-auto max-w-xs"
      >
        <div className="w-full flex justify-center items-center">
          <img
            src="/media/megaphone.webp"
            alt="icon"
            width={112}
            height={112}
            className=""
          />
        </div>

        <div className="text-[#6B6B6B] font-gilroyMedium text-[13px] w-full text-center my-4">
          {role === 1
            ? "The payment from your organization is still pending. Please contact your admin to restore access."
            : type === "Expired"
            ? "Your payment has not been completed. Please pay now to continue using the Deviceflow."
            : "Subscription expired. Please renew to access Deviceflow services."}
        </div>

        {role === 1 ? (
          <Button
            variant="primary"
            className="w-full font-gilroyMedium text-[13px]"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <div className="flex flex-col gap-1">
            {type === "Expired" ? (
              <Button
                variant="primary"
                className="w-full font-gilroyMedium text-[13px]"
                onClick={handlePayment}
              >
                Pay ₹{formatNumber(amount / 100)}
              </Button>
            ) : type === "Cancelled" ? (
              <Button
                variant="primary"
                className="w-full font-gilroyMedium text-[13px]"
                onClick={() => {
                  renewPlanMutation.mutate();
                }}
              >
                Renew
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full font-gilroyMedium text-[13px]"
                onClick={() => {
                  setOpenPlans(true);
                }}
              >
                Purchase Now
              </Button>
            )}

            <Button
              variant="default"
              className="w-full font-gilroyMedium text-[11px] text-[#6B6B6B] hover:border hover:border-black rounded-md"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        )}

        <DialogPlans
          data={data?.[0]}
          open={openPlan}
          setOpen={setOpenPlans}
        ></DialogPlans>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReminderDialog;
