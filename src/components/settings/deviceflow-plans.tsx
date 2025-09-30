"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAvailablePlans,
  initiatePayment,
  renewSubscription,
  requestPlan,
} from "@/server/settingActions";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { LoadingButton } from "../buttons/Button";

const features = [
  "20,000+ of PNG & SVG graphics",
  "Access to 100 million stock images",
  "Upload Enterprise icons and fonts",
  "Unlimited Sharing",
  "Upload graphics & video in up to 4k",
  "Unlimited Projects",
];

const cycleNameMap: Record<string, string> = {
  Monthly: "Month",
  Annually: "Annum",
};

const DialogPlans = ({
  children,
  data,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  data: any;
  open?: boolean;
  setOpen?: (val: boolean) => void;
}) => {
  const { data: plans, status } = useQuery({
    queryKey: ["plans"],
    queryFn: getAvailablePlans,
  });
  const [requestText, setRequestText] = useState(false);

  const currentMainPlan = data?.plan;
  console.log("Current Main Plan:", currentMainPlan);

  const renewPlanMutation = useMutation({
    mutationFn: (planId?: string) => {
      renewSubscription(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plan"] });
      toast.success("Subscription Renewed!");
      setOpen && setOpen(false);
    },
    onError: () => {
      toast.error("Failed to renew subscription. Please try again.");
    },
  });

  const requestPlanMutation = useMutation({
    mutationFn: (planId: string) => {
      console.log(planId);
      requestPlan(planId);
    },
    onSuccess: (data) => {
      setRequestText(true);
      toast.success("Our Agent will contact you soon");
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to request plan! Please try again later"
      );
    },
  });

  const [isYearly, setIsYearly] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (status === "pending") {
    return <LoadingButton loading={true}></LoadingButton>;
  }

  if (status === "error" || !plans) {
    return (
      <p className="text-center font-gilroyMedium text-red-500">
        Failed to load plans
      </p>
    );
  }

  const handlePayment = async (planId: string) => {
    try {
      // Call API to create invoice & order
      const res = await initiatePayment({
        paymentOption: "card",
        planId,
      });
      console.log("Plan ID:", planId);

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
          console.log("Payment success:", response);
          toast.success("Payment Successful!");
          setOpen && setOpen(false);
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

  const getButtonText = (group: any, currentPlan: any) => {
    if (requestPlanMutation.isPending) {
      return <Spinner size="sm" />;
    }

    // Enterprise Plan Logic
    if (group._id === "Enterprise Plan") {
      if (currentPlan?.planName === "Enterprise Plan") {
        if (
          (currentPlan?.billingCycles === "Monthly" && !isYearly) ||
          (currentPlan?.billingCycles === "Annually" && isYearly)
        ) {
          if (
            data?.isCancelled !== undefined &&
            data?.isCancelled !== true &&
            data?.expiredOn !== undefined &&
            data?.expiredOn === null
          ) {
            return "Current Plan";
          }
        } else {
          return "Request a Call";
        }
      }
      return requestText === false ? "Request a Call" : "Requested";
    }

    // Pro Plan Logic
    if (group._id === "Pro Plan") {
      if (currentPlan?.planName === "Pro Plan") {
        // Same plan and same billing cycle
        if (
          (currentPlan?.billingCycles === "Monthly" && !isYearly) ||
          (currentPlan?.billingCycles === "Annually" && isYearly)
        ) {
          if (
            data?.isCancelled !== undefined &&
            data?.isCancelled !== true &&
            data?.expiredOn !== undefined &&
            data?.expiredOn === null
          ) {
            return "Current Plan";
          }
          return "Renew Plan";
        }
        // Same plan but different billing cycle
        if (currentPlan?.billingCycles === "Monthly" && isYearly) {
          return "Upgrade Plan";
        }
        if (currentPlan?.billingCycles === "Annually" && !isYearly) {
          return "Downgrade Plan";
        }
      } else {
        return "Downgrade Plan";
      }
    }

    // Default for other cases
    return "Change Plan";
  };

  const calculateSavings = (monthlyPrice, annualPrice) => {
    const annualEquivalent = monthlyPrice * 12;
    const savings = ((annualEquivalent - annualPrice) / annualEquivalent) * 100;
    return Math.round(savings);
  };

  console.log(plans);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        closeButton={true}
        className="rounded-lg xl:max-w-[70vw] 2xl:max-w-[55vw] max-w-[80vw] lg:h-fit h-[77vh] max-h-[95vh] lg:py-10 xl:py-14  px-28 flex flex-col"
      >
        <div className=" w-full h-full flex flex-col items-center mx-auto">
          <h1 className="text-[#191D23] font-gilroyBold lg:text-2xl xl:text-3xl w-[50%] lg:w-[60%] text-center">
            Smart Plans for Smarter IT Management
          </h1>

          <div className="mt-5 mb-14 flex gap-5 items-center">
            <span className="text-[#191D23] lg:text-xs xl:text-[13px] font-gilroyMedium ">
              Pay Monthly
            </span>

            <div className="flex gap-5 items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  color="black"
                  id="plan"
                  className="peer-checked:bg-black data-[state=checked]:bg-primary"
                  defaultChecked={false}
                  checked={isYearly}
                  onChange={() => setIsYearly(!isYearly)}
                />
              </div>
              <span className="text-[#191D23] lg:text-xs xl:text-[13px] font-gilroyMedium ">
                Pay Yearly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-16">
            {/* Plans left and right */}
            {plans?.map((group: any, idx: number) => {
              const currentPlan = group.plans.find(
                (p: any) => p._id === data?.planId
              );
              console.log(currentPlan);
              return (
                <div
                  key={group._id}
                  className={`w-[350px] h-[500px] lg:w-[330px] lg:h-fit rounded-xl xl:px-5 xl:py-7 lg:py-5 lg:px-4 relative ${
                    group._id === "Enterprise Plan"
                      ? "bg-[black] shadow-[#CCD9FF] shadow-xl text-white"
                      : ""
                  }`}
                >
                  {group._id === "Enterprise Plan" && (
                    <div className="flex w-[200px] absolute items-end -top-16 left-16">
                      <img src="/media/curly-arrow.svg" className="w-20 h-14" />
                      <span className="text-black text-base font-gilroyMedium mb-2">
                        Save{" "}
                        {calculateSavings(
                          plans[0].plans[0].pricingPerSeat,
                          plans[0].plans[1].pricingPerSeat
                        )}
                        %
                      </span>
                    </div>
                  )}

                  <h2
                    className={`font-gilroyBold lg:text-lg xl:text-xl ${
                      group._id === "Enterprise Plan"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {group._id}
                  </h2>

                  <p
                    className={`font-gilroyMedium xl:text-[13px] lg:text-xs mt-2 ${
                      group._id === "Enterprise Plan"
                        ? "text-[#F7F8F9]"
                        : "text-[#64748B]"
                    }`}
                  >
                    {group._id === "Pro Plan"
                      ? "Everything you need to manage assets with ease — ideal for startups and growing teams."
                      : "Advanced controls, integrations, and support — built for large teams and complex workflows."}
                  </p>

                  {/* Show Monthly pricing by default */}
                  {isYearly && group.plans[1] ? (
                    <div>
                      {group._id !== "Enterprise Plan" ? (
                        <div className="mt-4 flex items-end gap-1">
                          <span
                            className={`xl:text-5xl lg:text-4xl font-gilroySemiBold ${
                              group._id === "Enterprise Plan"
                                ? "text-white"
                                : "text-[#191D23]"
                            }`}
                          >
                            ₹
                            {Math.floor(
                              (group?.plans[1].pricingPerSeat ?? 0) / 100
                            )}
                          </span>
                          <p
                            className={`flex gap-1 font-gilroyRegular mb-1 xl:text-[13px] lg:text-xs ${
                              group._id === "Enterprise Plan"
                                ? "text-[#F7F8F9]"
                                : "text-[#4B5768]"
                            }`}
                          >
                            <span>/</span>
                            <span>Seat</span>
                            <span>/</span>
                            <span>
                              {cycleNameMap[group.plans[1].billingCycles]}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-end gap-1 xl:text-5xl lg:text-4xl font-gilroySemiBold text-white">
                          Let’s Talk
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {group._id !== "Enterprise Plan" ? (
                        <div className="mt-4 flex items-end gap-1">
                          <span
                            className={`xl:text-5xl lg:text-4xl font-gilroySemiBold ${
                              group._id === "Enterprise Plan"
                                ? "text-white"
                                : "text-[#191D23]"
                            }`}
                          >
                            ₹
                            {Math.floor(
                              (group?.plans[0].pricingPerSeat ?? 0) / 100
                            )}
                          </span>
                          <p
                            className={`flex gap-1 font-gilroyRegular mb-1 xl:text-[13px] lg:text-xs ${
                              group._id === "Enterprise Plan"
                                ? "text-[#F7F8F9]"
                                : "text-[#4B5768]"
                            }`}
                          >
                            <span>/</span>
                            <span>Seat</span>
                            <span>/</span>
                            <span>
                              {cycleNameMap[group.plans[0].billingCycles]}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-end gap-1 xl:text-5xl lg:text-4xl font-gilroySemiBold text-white">
                          Let’s Talk
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="mt-8">
                    <ul
                      className={`xl:text-sm lg:text-xs font-gilroyMedium gap-3 flex flex-col ${
                        group._id === "Enterprise Plan" ? "text-[#F7F8F9]" : ""
                      }`}
                    >
                      {features.map((feat, index) => (
                        <li className="flex gap-2 items-center" key={index}>
                          {group._id === "Enterprise Plan" ? (
                            <div className="flex justify-center items-center xl:p-1.5 lg:p-1 rounded-full bg-[#E8EDFB]">
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                size={12}
                                color="#1d4ed8"
                              />
                            </div>
                          ) : group._id === "Pro Plan" && index < 2 ? (
                            <div className="flex justify-center items-center xl:p-1.5 lg:p-1 rounded-full bg-[#E8EDFB]">
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                size={12}
                                color="#1d4ed8"
                              />
                            </div>
                          ) : (
                            <div className="flex justify-center items-center xl:p-1.5 lg:p-1 rounded-full bg-[#F7F8F9]">
                              <HugeiconsIcon
                                icon={Cancel01Icon}
                                size={12}
                                color="#191D23"
                              />
                            </div>
                          )}
                          <p
                            className={`${
                              group._id === "Pro Plan" &&
                              index > 1 &&
                              "text-[#A0ABBB]"
                            }`}
                          >
                            {feat}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button */}
                  <div
                    className={`w-full font-gilroySemiBold xl:text-sm lg:text-xs justify-center items-center flex py-2.5 px-3.5 rounded mt-8 cursor-pointer ${
                      group._id === "Enterprise Plan"
                        ? "bg-white text-black"
                        : "bg-white text-black border border-[#E6E6E6]"
                    }`}
                    onClick={() => {
                      // 1. Enterprise Plan → only request, no payment
                      // if (group._id === "Enterprise Plan") {
                      //   if (
                      //     currentMainPlan &&
                      //     ((currentMainPlan?.billingCycles === "Monthly" &&
                      //       isYearly) ||
                      //       (currentMainPlan?.billingCycles === "Annually" &&
                      //         !isYearly))
                      //   ) {
                      //     // Request upgrade if switching between monthly/yearly
                      //     requestPlanMutation.mutate(
                      //       isYearly
                      //         ? group?.plans?.[1]?._id
                      //         : group?.plans?.[0]?._id
                      //     );
                      //     setOpen && setOpen(false);
                      //   } else {
                      //     toast("You are already on this plan");
                      //   }
                      //   return;
                      // }

                      // 2. Non-Enterprise plans (Pro Plan etc.) → handle payments
                      if (group._id === "Pro Plan") {
                        if (
                          currentMainPlan?.planName === group._id &&
                          ((currentMainPlan?.billingCycles === "Monthly" &&
                            !isYearly) ||
                            (currentMainPlan?.billingCycles === "Annually" &&
                              isYearly))
                        ) {
                          if (
                            data?.isCancelled !== undefined &&
                            data?.isCancelled === true
                          ) {
                            renewPlanMutation.mutate();
                          } else if (
                            data?.isCancelled !== undefined &&
                            data?.isCancelled !== true &&
                            data?.expiredOn !== undefined &&
                            data?.expiredOn === null
                          ) {
                            toast("You are already on this plan"); //For Active Case
                            return;
                          } else if (
                            //For Expired or Cancelled Case
                            currentMainPlan?.billingCycles === "Monthly" &&
                            !isYearly
                          ) {
                            // handlePayment(group?.plans?.[0]?._id);
                          } else {
                            // handlePayment(group?.plans?.[1]?._id);
                          }
                          return;
                        }

                        if (currentMainPlan?.planName !== group._id) {
                        }

                        if (
                          currentMainPlan?.planName !== group._id ||
                          (currentMainPlan?.billingCycles === "Monthly" &&
                            isYearly)
                        ) {
                          if (data?.isUpgradeRequested) {
                            toast("Plan upgrade already requested");
                            return;
                          }
                          console.log(group?.plans?.[1]?._id);
                          // handlePayment(group?.plans?.[1]?._id);
                          renewPlanMutation.mutate(group?.plans?.[1]?._id);
                          return;
                        }

                        if (
                          currentMainPlan?.planName !== group._id ||
                          (currentMainPlan?.billingCycles === "Annually" &&
                            !isYearly)
                        ) {
                          if (data?.isUpgradeRequested) {
                            toast("Plan downgrade already requested");
                            return;
                          }
                          console.log(group?.plans?.[0]?._id);
                          // handlePayment(group?.plans?.[0]?._id);
                          renewPlanMutation.mutate(group?.plans?.[0]?._id);
                          return;
                        }

                        // Default → first-time subscription or no current plan
                        // handlePayment(
                        //   isYearly
                        //     ? group?.plans?.[1]?._id
                        //     : group?.plans?.[0]?._id
                        // );
                      } else {
                        console.log(group._id, currentMainPlan);
                        if (
                          currentMainPlan?.planName === group._id &&
                          ((currentMainPlan?.billingCycles === "Monthly" &&
                            !isYearly) ||
                            (currentMainPlan?.billingCycles === "Annually" &&
                              isYearly))
                        ) {
                          toast("You are already on this plan");
                          return;
                        } else if (
                          currentMainPlan?.planName !== group._id ||
                          (currentMainPlan?.billingCycles === "Monthly" &&
                            isYearly) ||
                          (currentMainPlan?.billingCycles === "Annually" &&
                            !isYearly)
                        ) {
                          // Request upgrade if switching between monthly/yearly

                          requestPlanMutation.mutate(
                            isYearly
                              ? group?.plans?.[1]?._id
                              : group?.plans?.[0]?._id
                          );
                          setOpen && setOpen(false);
                        }
                        return;
                      }
                    }}
                  >
                    {getButtonText(group, currentMainPlan)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPlans;
