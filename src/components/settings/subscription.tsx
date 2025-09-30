"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../buttons/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertDiamondIcon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkBadge01Icon,
  CheckmarkBadge02Icon,
  SpamIcon,
} from "@hugeicons/core-free-icons";
import InvoicesComponent from "./invoices-table";
import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  getSubcriptionStatus,
  initiatePayment,
  renewSubscription,
} from "@/server/settingActions";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import DialogPlans from "./deviceflow-plans";
import { toast } from "sonner";
import SubscriptionSectionSkeleton from "./subscription-skeleton";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SubscriptionSection = () => {
  const [open, setOpen] = useState(false);
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const { data: session, update } = useSession();
  const [type, setType] = useState("All Invoices");
  const queryClient = useQueryClient();
  const { data, status } = useQuery({
    queryKey: ["subscription-plan", type],
    queryFn: () => getSubcriptionStatus(type),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
      setOpen(false);
      toast.success("Subscription cancelled successfully!");
    },
    onError: () => {
      toast.error("Failed to cancel subscription. Please try again.");
    },
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

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (invoiceId?: string) => {
    try {
      // Call API to create invoice & order
      const res = await initiatePayment({
        paymentOption: "card",
        ...(invoiceId && { invoiceId: invoiceId }),
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
        handler: async function (response: any) {
          // This runs after successful payment
          // Send response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
          // to backend for verification
          queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
          await update({
            subscriptionStatus: undefined,
            amount: undefined,
          });
          console.log("Payment success:", response);
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

  if (status === "pending") {
    return <SubscriptionSectionSkeleton />;
  }

  function formatDate(dateString?: string | null): string {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // invalid date safeguard

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const getPlanButtonConfig = (planData) => {
    const isPro = planData?.plan?.planName === "Pro Plan";
    const isEnterprise = planData?.plan?.planName === "Enterprise Plan";
    const isCancelled = planData?.isCancelled === true;
    const expiredOn = planData?.expiredOn;
    const planStatus = planData?.planStatus;

    // Rule 3: If planStatus === "Trial"
    if (planStatus === "Trial") {
      if (isPro) {
        return { text: "Upgrade Plan", variant: "primary" };
      } else {
        return { text: "Change Plan", variant: "outlineTwo" };
      }
    }

    // Rule 1: Pro Plan logic
    if (isPro) {
      if (isCancelled !== true && expiredOn === null) {
        return { text: "Upgrade Plan", variant: "primary" };
      } else {
        return { text: "Renew Plan", variant: "primary" };
      }
    }

    // Rule 2: Enterprise Plan logic
    if (isEnterprise) {
      if (isCancelled !== true && expiredOn === null) {
        return { text: "Change Plan", variant: "outlineTwo" };
      } else {
        return { text: "Renew Plan", variant: "primary" };
      }
    }

    // Default fallback
    return { text: "Purchase Plan", variant: "primary" };
  };

  // Your simplified component code
  const buttonConfig = getPlanButtonConfig(data?.[0]);

  console.log(data);
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <span className="text-[13px] font-gilroyMedium text-[#B3B3B3] h-fit">
          Current Plan
        </span>

        <Button
          onClick={() => {
            setPlansDialogOpen(true);
          }}
          variant={buttonConfig.variant}
          size="xs"
          className={`w-fit text-[11px] px-3 font-gilroyMedium py-0 ${
            buttonConfig.variant === "primary" ? "text-white" : "text-black"
          }`}
        >
          {buttonConfig.text}
        </Button>
        {/* <Button
          onClick={() => {}}
          variant="primary"
          size="xs"
          className="text-white w-fit text-[11px] px-3 font-gilroyMedium py-0"
        >
          Upgrade Plan
        </Button> */}
      </div>

      {/* Plan Title and Pricing */}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {data?.[0]?.planStatus === "Active" ? (
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              color="white"
              fill="#0d9b00"
            />
          ) : data?.[0]?.planStatus === "Trial" ? (
            <HugeiconsIcon
              icon={SpamIcon}
              size={28}
              color="white"
              fill="#ffb200"
            />
          ) : (
            <div className="bg-red-500 rounded-full p-1">
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="text-white size-3"
                stroke="24"
              />
            </div>
          )}
          <span className="text-base font-gilroyMedium">
            {data?.[0]?.plan?.planName}{" "}
            {data?.[0]?.planStatus === "Trial" && "(Trial Period)"}
          </span>
        </div>

        <div className="text-[13px] font-gilroyMedium text-[#757575]">
          {data?.[0]?.planStatus === "Trial"
            ? `Free until ${formatDate(
                data?.[0]?.trialEndDate ?? ""
              )}. Renews at ₹${formatNumber(
                (data?.[0]?.pricingPerMonthPerSeat ||
                  data?.[0]?.pricingPerYearPerSeat) / 100 || 0
              )}/seat`
            : data?.[0]?.plan?.planName === "Pro Plan"
            ? `₹${formatNumber(
                (data?.[0]?.pricingPerMonthPerSeat ||
                  data?.[0]?.pricingPerYearPerSeat) / 100 || 0
              )}/seat`
            : `₹${formatNumber(data?.[0]?.customPrice / 100 || 0)}`}
        </div>

        {/* <div className="text-[13px] font-gilroyMedium text-[#757575]">
          ₹
          {formatNumber(
            (data?.[0]?.pricingPerMonthPerSeat ||
              data?.[0]?.pricingPerYearPerSeat) / 100 || 0
          )}
          /seat
        </div> */}

        <div className="text-[13px] font-gilroyMedium text-[#757575]">
          {data?.[0]?.isCancelled !== true ? (
            data?.[0]?.plan?.planName === "Pro Plan" ? (
              `${data?.[0]?.totalUsers} Seats`
            ) : (
              "Unlimited Seats"
            )
          ) : (
            <span>
              The subscription will be cancelled on{" "}
              <span className="text-black">
                {new Date(data?.[0]?.nextDueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
          )}
        </div>

        {data?.[0]?.isCancelled !== true && data?.[0]?.isUpgradeRequested && (
          <div className="text-[13px] font-gilroyMedium text-[#757575]">
            Your new plan will take effect from{" "}
            <span className="text-black">
              {formatDate(data?.[0]?.nextDueDate ?? "")}
            </span>
          </div>
        )}
      </div>

      {/* Plan Details */}
      <div className="flex flex-col gap-2.5 mt-8">
        <div className="font-gilroyMedium text-[15px] text-black">
          Plan Details
        </div>

        <div className="flex flex-col w-[80%] gap-2.5">
          <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">
              Status
            </span>

            <span className="w-4 text-center mr-4">:</span>

            <span
              className={`font-gilroyMedium text-left  flex-1 ${
                data?.[0]?.planStatus === "Active" ||
                data?.[0]?.planStatus === "Trial"
                  ? "text-[#0D9B00]"
                  : "text-[#FF0000]"
              }`}
            >
              {(data?.[0]?.planStatus === "Trial"
                ? "Active"
                : data?.[0]?.planStatus) || "-"}
            </span>
          </div>

          <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">
              Purchased On
            </span>

            <span className="w-4 text-center mr-4">:</span>

            <span className={`font-gilroyMedium text-left  flex-1 `}>
              {data?.[0]?.startDate
                ? new Date(data?.[0]?.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>

          {/* {data?.[0]?.planStatus === "Active" && (
            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Next Billing Date
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.nextDueDate
                  ? new Date(data?.[0]?.nextDueDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </span>
            </div>
          )} */}

          {data?.[0]?.expiredOn && data?.[0]?.expiredOn !== null && (
            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Expired On
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.expiredOn &&
                  new Date(data?.[0]?.expiredOn).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </span>
            </div>
          )}

          {data?.[0]?.planStatus === "Active" ||
            (data?.[0]?.planStatus === "Trial" && (
              <div className="flex w-full items-start text-[13px]">
                <span className="w-32 text-[#757575] font-gilroyMedium">
                  Next Billing Date
                </span>

                <span className="w-4 text-center mr-4">:</span>

                <span className={`font-gilroyMedium text-left  flex-1 `}>
                  {data?.[0]?.nextDueDate
                    ? new Date(data?.[0]?.nextDueDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : new Date(data?.[0]?.trialEndDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      ) || "-"}
                </span>
              </div>
            ))}

          <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">
              Billing Cycle
            </span>

            <span className="w-4 text-center mr-4">:</span>

            <span className={`font-gilroyMedium text-left  flex-1 `}>
              {data?.[0]?.billingCycle || "-"}
            </span>
          </div>

          <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">Seats</span>

            <span className="w-4 text-center mr-4">:</span>

            <span className={`font-gilroyMedium text-left  flex-1 `}>
              {(data?.[0]?.plan?.planName === "Pro Plan"
                ? data?.[0]?.totalUsers
                : "Unlimited") || "-"}
            </span>
          </div>
        </div>

        {data?.[0]?.isCancelled !== true &&
          ((!data?.[0]?.expiredOn || data?.[0]?.expiredOn === null) &&
          data?.[0]?.planStatus === "Trial" ? (
            <div className="text-[11px] text-[#C2C2C2] font-gilroyMedium">
              *Extra seats can be added or removed by just onboarding or
              off-boarding users on deviceflow
            </div>
          ) : (
            <div className="text-[11px] text-[#C2C2C2] font-gilroyMedium">
              *Seats can be reduced by just deleting users on deviceflow and
              will be effective from next month.
            </div>
          ))}
      </div>

      {/* Due Payment */}

      {data?.[0]?.isCancelled !== true && (
        <div className="flex flex-col gap-2.5 mt-8">
          <div className="flex justify-between">
            <div className="font-gilroyMedium text-[15px] text-black h-fit">
              Upcoming Payment
            </div>

            {data?.[0]?.expiredOn &&
              (data?.[0]?.expiredOn !== null ||
                (data?.[0].invoices?.[0]?.status === "Unpaid" &&
                  data?.[0].invoices?.[0]?.type === "Regular Invoice")) && (
                <Button
                  variant="default"
                  className="text-[11px] font-gilroyMedium px-3 py-0 text-white bg-[#004DFF]"
                  onClick={() => {
                    handlePayment(
                      data?.[0]?.invoices &&
                        data?.[0]?.invoices?.length > 0 &&
                        data?.[0]?.invoices[0].status === "Unpaid"
                        ? data?.[0]?.invoices[0]._id
                        : undefined
                    );
                  }}
                  size="xs"
                  //   disabled={isPending}
                >
                  Pay Now
                </Button>
              )}
          </div>

          <div className="flex flex-col w-[80%] gap-2.5">
            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Total Amount
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                ₹
                {data?.[0]?.isUpgradeRequested
                  ? data?.[0]?.plan?.planName === "Enterprise Plan"
                    ? formatNumber(
                        (data?.[0]?.isUpgradeRequested?.customPrice ?? 0) / 100
                      )
                    : formatNumber(
                        (data?.[0]?.activeUserCount *
                          (data?.[0]?.isUpgradeRequested
                            ?.pricingPerMonthPerSeat ||
                            data?.[0]?.isUpgradeRequested
                              ?.pricingPerYearPerSeat)) /
                          100
                      )
                  : data?.[0]?.expiredOn &&
                    (data?.[0]?.expiredOn !== null ||
                      (data?.[0].invoices?.[0]?.status === "Unpaid" &&
                        data?.[0].invoices?.[0]?.type === "Regular Invoice"))
                  ? formatNumber(
                      (data?.[0]?.invoices[0].totalAmount ?? 0) / 100
                    )
                  : data?.[0]?.plan?.planName === "Enterprise Plan"
                  ? formatNumber((data?.[0]?.customPrice ?? 0) / 100)
                  : formatNumber(
                      (data?.[0]?.activeUserCount *
                        (data?.[0]?.pricingPerMonthPerSeat ||
                          data?.[0]?.pricingPerYearPerSeat)) /
                        100
                    )}
              </span>
            </div>

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Due Date
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.nextDueDate
                  ? new Date(data?.[0]?.nextDueDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </span>
            </div>

            {data?.[0]?.plan.planName === "Pro Plan" && (
              <div className="flex w-full items-start text-[13px]">
                <span className="w-32 text-[#757575] font-gilroyMedium">
                  Billable Seats
                </span>

                <span className="w-4 text-center mr-4">:</span>

                <span className={`font-gilroyMedium text-left  flex-1 `}>
                  {data?.[0]?.expiredOn !== undefined &&
                  (data?.[0]?.expiredOn !== null ||
                    (data?.[0].invoices?.[0]?.status === "Unpaid" &&
                      data?.[0].invoices?.[0]?.type === "Regular Invoice"))
                    ? data?.[0]?.invoices[0].seatCount ?? 0
                    : data?.[0]?.activeUserCount}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {(!data?.[0]?.expiredOn || data?.[0]?.expiredOn === null) &&
        data?.[0]?.isCancelled !== true &&
        data?.[0]?.planStatus === "Trial" && (
          <ConfirmationModal
            type="failure"
            functionToBeExecuted={() => {
              cancelMutation.mutate();
            }}
            open={open}
            setOpen={setOpen}
            title="Please confirm"
            description="Are you sure you want to cancel the subscription. The changes will be undone"
            successBtnText="Cancel Plan"
          >
            <p className="text-[13px] font-gilroyMedium text-[#FF0000] mt-4 cursor-pointer w-fit">
              Cancel Plan
            </p>
          </ConfirmationModal>
        )}

      {/* Billing Details */}
      {data?.[0]?.planStatus === "Trial" ? null : data?.[0]?.plan?.planName ===
        "Pro Plan" ? (
        <div className="flex flex-col gap-2.5 mt-8">
          <div className="font-gilroyMedium text-[15px] text-black h-fit">
            Last Payment Details
          </div>

          <div className="flex flex-col w-[80%] gap-2.5">
            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Payment Method
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.latestPaidInvoice?.paymentMethod || "-"}
              </span>
            </div>

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Transaction ID
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.latestPaidInvoice?.razorpay_order_id || "-"}
              </span>
            </div>

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Payment Date
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.latestPaidInvoice?.paidAt
                  ? new Date(
                      data?.[0]?.latestPaidInvoice?.paidAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>

          {data?.[0]?.expiredOn === null && data?.[0]?.isCancelled !== true && (
            <ConfirmationModal
              open={open}
              setOpen={setOpen}
              type="failure"
              functionToBeExecuted={() => {
                cancelMutation.mutate();
              }}
              title="Please confirm"
              description="Are you sure you want to cancel the subscription. The changes will be undone"
              successBtnText="Cancel Plan"
            >
              <p className="text-[13px] font-gilroyMedium text-[#FF0000] mt-2 cursor-pointer w-fit">
                Cancel Plan
              </p>
            </ConfirmationModal>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mt-8">
          <div className="flex justify-between">
            <div className="font-gilroyMedium text-[15px] text-black h-fit">
              Billing Details
            </div>

            {/* <Button
              variant="outlineTwo"
              className="text-[11px] font-gilroyMedium px-3 py-0"
              onClick={() => {}}
              size="xs"
              //   disabled={isPending}
            >
              Update Method
            </Button> */}
          </div>

          <div className="flex flex-col w-[80%] gap-2.5">
            {/* <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">Email</span>

            <span className="w-4 text-center mr-4">:</span>

            <span className={`font-gilroyMedium text-left  flex-1 `}>
              {data?.[0]?.organisation?.email || "-"}
            </span>
          </div>

          <div className="flex w-full items-start text-[13px]">
            <span className="w-32 text-[#757575] font-gilroyMedium">
              Address
            </span>

            <span className="w-4 text-center mr-4">:</span>

            <span className={`font-gilroyMedium text-left  flex-1 `}>
              {data?.[0]?.address?.city || "-"},{" "}
              {data?.[0]?.address?.country || "-"}
            </span>
          </div> */}

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Payment Method
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.billingDetails?.paymentMethod || "-"}
              </span>
            </div>

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Transaction ID
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.latestPaidInvoice?.razorpay_order_id || "-"}
              </span>
            </div>

            <div className="flex w-full items-start text-[13px]">
              <span className="w-32 text-[#757575] font-gilroyMedium">
                Last Payment Date
              </span>

              <span className="w-4 text-center mr-4">:</span>

              <span className={`font-gilroyMedium text-left  flex-1 `}>
                {data?.[0]?.billingDetails?.lastPaymentDate
                  ? new Date(
                      data?.[0]?.billingDetails?.lastPaymentDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>

          {data?.[0]?.expiredOn === null && data?.[0]?.isCancelled !== true && (
            <ConfirmationModal
              type="failure"
              functionToBeExecuted={() => {
                cancelMutation.mutate();
              }}
              open={open}
              setOpen={setOpen}
              title="Please confirm"
              description="Are you sure you want to cancel the subscription. The changes will be undone"
              successBtnText="Cancel Plan"
            >
              <p className="text-[13px] font-gilroyMedium text-[#FF0000] mt-2 cursor-pointer">
                Cancel Plan
              </p>
            </ConfirmationModal>
          )}
        </div>
      )}

      {/* Invoices Section */}
      <div className="flex flex-col gap-2.5 mt-8">
        <div className="flex justify-between items-center">
          <div className="font-gilroyMedium text-[15px] text-black h-fit">
            Invoices
          </div>

          <Select onValueChange={(val) => setType(val)} value={type}>
            <SelectTrigger
              className={cn(
                "font-gilroyMedium w-fit text-[13px] justify-between h-9"
              )}
            >
              <SelectValue placeholder="All Invoices" />
            </SelectTrigger>

            <SelectContent className="font-gilroyMedium md:text-[13px]">
              <SelectItem value="All Invoices" className="md:text-[13px]">
                All Invoices
              </SelectItem>

              <SelectItem value="Regular" className="md:text-[13px]">
                Regular
              </SelectItem>
              <SelectItem value="Extra" className="text-[13px]">
                Extra Seats
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InvoicesComponent invoices={data?.[0]?.invoices} />
      </div>

      <DialogPlans
        data={data?.[0]}
        open={plansDialogOpen}
        setOpen={setPlansDialogOpen}
      ></DialogPlans>
    </div>
  );
};

export default SubscriptionSection;
