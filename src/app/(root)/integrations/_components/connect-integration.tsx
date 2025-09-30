"use client";

import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IntegrationType } from "@/server/integrationActions";
import { getGSuiteAuthUrl } from "@/server/orgActions";
import { UseMutationResult } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormField } from "../../settings/_components/form-field";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeftRightIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

export const ConnectIntegration = ({
  loading,
  integrationData,
  mutation,
  gSuiteMutation,
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
  integrationData?: IntegrationType;
  gSuiteMutation?: UseMutationResult<any, Error, unknown, void>;
  mutation?: UseMutationResult<
    any,
    Error,
    {
      payload?: {
        platform?: string;
        credentials?: {};
        store?: {}[];
        newprice?: {};
      };
    },
    unknown
  >;
}) => {
  const intId = useSearchParams().get("integrationId");
  const isGsuiteIntegration = integrationData?.platform
    ?.toLowerCase()
    .includes("suite");

  const isSlackIntegration = integrationData?.platform
    ?.toLowerCase()
    .includes("slack");
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // console.log(integrationData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (intId && !hasTriggered) {
      gSuiteMutation.mutate({ id: intId });
      setHasTriggered(true);
    }
  }, [intId, hasTriggered]);

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    integrationData?.credentials.forEach((credential) => {
      if (
        credential === "inviteLink" ||
        credential === "inviteLinkExpirationDate"
      )
        return;

      newErrors[credential] = formData[credential]
        ? ""
        : `${credential} is required`;
    });

    newErrors["pricing"] = customPrice ? "" : "Price is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const onGSuitSubmit = async () => {
    if (validateFields()) {
      // Get the current URL
      const currentUrl = window.location.href;

      console.log({
        bulkUpload: false,
        onboarding: false,
        price: {
          plan: selectedPlan,
          price: parseInt(customPrice),
        },
        redirectUri: currentUrl,
      })

      // alert("Sure?");

      window.location.href = await getGSuiteAuthUrl({
        bulkUpload: false,
        price: {
          plan: selectedPlan,
          price: parseInt(customPrice),
        },
        redirectUri: currentUrl,
      });
      return;
    }
  };

  const getExpiryISODate = (duration: string): string | null => {
    const now = new Date();

    switch (duration) {
      case "1 day":
        return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
      case "7 days":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case "30 days":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      case "Never expires":
        return "Never expires"; // Or you can return a specific string like "never"
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  // Handle form submission
  const onSubmit = async () => {
    // console.log("Running onSubmit...");
    // console.log("Form Data:", formData);
    // console.log("Selected Plan:", selectedPlan);
    // console.log("Custom Price:", customPrice);
    // console.log("Integration Data:", integrationData);
    // console.log("Is Slack Integration:", isSlackIntegration);
    // console.log("Expiry Date:", expiryDate);
    // console.log("ISO Expiry:", getExpiryISODate(expiryDate));

    if (validateFields()) {
      try {
        const payload = isSlackIntegration
          ? {
              platform: integrationData?.platform,
              credentials: {
                ...formData,
                inviteLinkExpirationDate: getExpiryISODate(expiryDate),
              },
              newprice: customPrice
                ? {
                    plan: selectedPlan,
                    price: parseInt(customPrice),
                  }
                : integrationData?.price?.find(
                    (plan) => plan.plan === selectedPlan
                  ),
              inviteLinkExpirationDate: getExpiryISODate(expiryDate),
              inviteLink: formData.inviteLink,
            }
          : {
              platform: integrationData?.platform,
              credentials: formData,
              newprice: customPrice
                ? {
                    plan: selectedPlan,
                    price: parseInt(customPrice),
                  }
                : integrationData?.price?.find(
                    (plan) => plan.plan === selectedPlan
                  ),
            };

        mutation.mutate({ payload });
      } catch (error) {
        console.error("Submission Error:", error);
      }
    } else {
      console.warn("Validation failed.");
    }
  };

  const [selectedPlan, setSelectedPlan] = useState(
    integrationData?.price?.[0]?.plan ?? ""
  );

  const [expiryDate, setExpiryDate] = useState("30 days");
  const [customPrice, setCustomPrice] = useState(
    integrationData?.price?.[0]?.price ?? ""
  );
  const [isCustom, setIsCustom] = useState(false);

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);

    if (plan === "Custom Plan") {
      setIsCustom(true);
      setCustomPrice("");
    } else {
      setIsCustom(false);
      const selected = integrationData.price.find((p) => p.plan === plan);
      setCustomPrice(selected?.price || "");
    }
  };

  const handleDateChange = (date: string) => {
    setExpiryDate(date);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setFormData({});
      }}
    >
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl bg-white shadow-lg max-w-md p-6 text-center"
      >
        <div className="flex justify-center">
          <div className="flex gap-6 justify-center items-center">
            <img
              src="/logo.png"
              className="size-10 object-cover"
              alt="Edify logo"
            />

            <div className="transform rotate-180 text-gray-500">
              <HugeiconsIcon icon={ArrowLeftRightIcon} />
            </div>

            <img
              src={integrationData?.companyLogo ?? ""}
              alt="Integration logo"
              className="size-10 object-cover"
            />
          </div>
        </div>

        <DialogTitle className="text-lg font-gilroySemiBold">
          Connect Deviceflow to {integrationData?.platform}
        </DialogTitle>

        <div className="h-[1px] bg-gray-200 mb-3 -mx-6"></div>
        {integrationData?.credentials?.length > 0 ? (
          <div className="flex flex-col gap-5">
            {integrationData?.credentials?.map((credential) =>
              credential === "inviteLinkExpirationDate" ? (
                <div className="flex flex-col gap-1">
                  <p className="text-left font-gilroySemiBold text-sm">
                    Invite Link Expiry Date
                  </p>
                  <Select
                    onValueChange={handleDateChange}
                    defaultValue={"30 days"}
                  >
                    <SelectTrigger className="font-gilroyMedium flex justify-between p-2 pl-2  bg-white border border-[#DEDEDE] rounded-md min-w-[12rem] w-1/2">
                      <SelectValue
                        placeholder={expiryDate}
                        className="flex justify-between p-0"
                      />
                    </SelectTrigger>
                    <SelectContent className="font-gilroyMedium">
                      <SelectItem
                        value="1 day"
                        className="w-full py-2.5 rounded-lg hover:bg-accent"
                      >
                        1 day
                      </SelectItem>

                      <SelectItem
                        value="7 days"
                        className="w-full py-2.5 rounded-lg hover:bg-accent"
                      >
                        7 days
                      </SelectItem>

                      <SelectItem
                        value="30 days"
                        className="w-full py-2.5 rounded-lg hover:bg-accent"
                      >
                        30 days
                      </SelectItem>

                      <SelectItem
                        value="Never expires"
                        className="w-full py-2.5 rounded-lg hover:bg-accent"
                      >
                        Never expires
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-left font-gilroySemiBold text-sm">
                    {credential
                      .replace(/_/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </p>

                  <FormField
                    key={credential}
                    label=""
                    id={credential}
                    error={errors[credential]}
                    name={credential}
                    value={formData[credential] || ""}
                    type="text"
                    onChange={handleChange}
                    className="placeholder:text-neutral-400 h-10 text-sm placeholder:text-xs rounded-md"
                    placeholder={`Enter ${credential.replace(/_/g, " ")}`}
                  />
                </div>
              )
            )}

            {/* If Slack is being integrated */}
          </div>
        ) : (
          <></>
        )}

        <h2 className="text-base/4 text-left font-gilroySemiBold my-1.5">
          Billing
        </h2>

        <div className="flex w-full gap-4 justify-between items-start -mt-0.5">
          <Select onValueChange={handlePlanChange} defaultValue={selectedPlan}>
            <SelectTrigger className="font-gilroyMedium flex justify-between p-2 pl-2  bg-white border border-[#DEDEDE] rounded-md min-w-[12rem] w-1/2">
              <SelectValue
                placeholder={selectedPlan}
                className="flex justify-between p-0"
              />
            </SelectTrigger>
            <SelectContent className="font-gilroyMedium">
              {integrationData?.price?.map((p) => (
                <SelectItem
                  key={p?._id}
                  value={p?.plan}
                  className="w-full py-2.5 rounded-lg hover:bg-accent"
                >
                  {p?.plan}
                </SelectItem>
              ))}
              <SelectItem
                value="Custom Plan"
                className="w-full py-2.5 rounded-lg hover:bg-accent"
              >
                Custom Plan
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              value={customPrice}
              readOnly={!isCustom}
              onChange={(e) => {
                const inputValue = e.target.value;
                const zipRegex = /^[0-9]{0,8}$/;

                if (!inputValue || zipRegex.test(inputValue)) {
                  setCustomPrice(inputValue);
                }
              }}
              placeholder="Enter Price"
              className={cn(
                "font-gilroyMedium",
                !isCustom ? "bg-gray-50" : "bg-white",
                errors.pricing ? "border-destructive/80" : "border"
              )}
            />
            <div className="absolute right-3 top-[50%] text-xs font-gilroyMedium -translate-y-1/2 transform text-black">
              /month
            </div>
            <p
              className={cn(
                "mt-0.5 text-xs text-start font-gilroyMedium text-destructive transition-all duration-300",
                {
                  "opacity-100": errors.pricing,
                  "opacity-0": !errors.pricing,
                }
              )}
            >
              {errors.pricing ?? " "}
            </p>
          </div>
        </div>

        <h1 className="text-base font-gilroySemiBold text-start ">
          {integrationData?.platform} would like to
        </h1>
        <div className="flex flex-col gap-1 text-start h-[9vh] overflow-y-auto ">
          {integrationData?.permissions?.map((item, index) => (
            <div key={index} className="flex items-center gap-1 py-0.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="text-blue-600"
              />
              <p className="text-sm font-gilroyMedium">{item}</p>
            </div>
          ))}
        </div>
        <h1 className="text-sm font-gilroyMedium text-start ">
          We care about your privacy in our Privacy Policy. By clicking Connect,
          you authorize {integrationData?.platform} to access your information.
        </h1>
        <div className="h-[1px] bg-gray-200 my-3 -mx-6"></div>

        <DialogFooter className="flex w-full h-10 -mt-3 -mb-2 items-center justify-between">
          {!isGsuiteIntegration ? (
            <Link
              onClick={(e) => e.stopPropagation()}
              href={integrationData?.wiki}
              target="_blank"
              className={buttonVariants({
                variant: "outlineTwo",
                className: "h-full",
              })}
            >
              How to use?
            </Link>
          ) : (
            <Button className="pointer-events-none" type="button"></Button>
          )}
          <div className="flex gap-3">
            <Button
              variant="outlineTwo"
              type="button"
              disabled={mutation.isPending || loading}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="primary"
              loading={mutation.isPending || loading}
              disabled={mutation.isPending || loading}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isGsuiteIntegration ? onGSuitSubmit() : onSubmit();
              }}
            >
              Connect
            </LoadingButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
