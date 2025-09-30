"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  connectGsuiteIntegration,
  getIntegrationById,
} from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/buttons/Button";
import { getGSuiteAuthUrl } from "@/server/orgActions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftRightIcon } from "@hugeicons/core-free-icons";

export const GsuiteDialogOnboarding = ({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}) => {
  const params = useSearchParams();
  const integrationId = params.get("integrationId");
  const { data: integrationData, status } = useQuery({
    queryKey: ["get-integration-by-id", "67ee34f2562e6fc2ccd25a0f"],
    queryFn: () => getIntegrationById({ id: "67ee34f2562e6fc2ccd25a0f" }),
    // staleTime: 1000 * 60 * 5,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    newErrors["pricing"] = customPrice ? "" : "Price is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const [selectedPlan, setSelectedPlan] = useState(
    integrationData?.price?.[0]?.plan ?? ""
  );
  const [customPrice, setCustomPrice] = useState(
    integrationData?.price?.[0]?.price ?? ""
  );

  useEffect(() => {
    if (integrationId) {
      getGsuiteResponse();
    }
  }, [integrationId]);

  const getGsuiteResponse = async () => {
    const result = await connectGsuiteIntegration({ id: integrationId });

    if (result.success) {
      onSuccess?.();
      toast.success("Import Success");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    // Only set the selected plan if it's not already set
    if (!selectedPlan && integrationData?.price?.[0]?.plan) {
      setSelectedPlan(integrationData.price[0].plan);
    }
    // Only set the custom price if it's not already set
    if (!customPrice && integrationData?.price?.[0]?.price) {
      setCustomPrice(integrationData.price[0].price);
    }
  }, [integrationData]);
  const [isCustom, setIsCustom] = useState(false);

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);

    if (plan === "Custom Plan") {
      setIsCustom(true);
      setCustomPrice(""); // or keep previous customPrice if you want
    } else {
      setIsCustom(false);
      const selected = integrationData.price.find((p) => p.plan === plan);
      setCustomPrice(selected?.price || "");
    }
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const newprice = {
        plan: selectedPlan,
        price: parseInt(customPrice),
      };

      // Get the current URL
      const currentUrl = window.location.href;

      window.location.href = await getGSuiteAuthUrl({
        bulkUpload: true,
        onboarding: true,
        price: newprice,
        redirectUri: currentUrl, // Use the current URL as the redirect URI
      });
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-white shadow-lg max-w-md p-6 text-center">
        {/* Header with logos and arrows */}
        <div className="flex justify-center">
          <div className="flex gap-6 justify-center items-center">
            <img
              src="/media/integrations/edify-logo.png"
              className="size-10"
              alt="Edify logo"
            />
            <div className="transform rotate-180 text-gray-500">
              <HugeiconsIcon icon={ArrowLeftRightIcon} />
            </div>
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg2FNWBQeuQDT6OE9MR5aAR1Gq-DBTiQbNLQ&s"
              }
              alt="Integration logo"
              className="size-10"
            />
          </div>
        </div>

        {/* Title and description */}
        <DialogTitle className="text-lg font-gilroySemiBold">
          Connect Deviceflow to Gsuite
        </DialogTitle>
        <div className="h-[1px] bg-gray-200 mb-3"></div>

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
                  className="w-full py-2.5 rounded-lg"
                >
                  {p?.plan}
                </SelectItem>
              ))}
              <SelectItem
                value="Custom Plan"
                className="w-full py-2.5 rounded-lg"
              >
                Custom Plan
              </SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Input
              value={customPrice}
              readOnly={!isCustom}
              onChange={(e) => {
                const inputValue = e.target.value;
                const zipRegex = /^[0-9]{0,12}$/;

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
          Gsuite would like to
        </h1>
        <h1 className="text-sm font-gilroyMedium text-start ">
          We care about your privacy in our Privacy Policy. By clicking Connect,
          you authorize Gsuite to access your information.
        </h1>
        <div className="h-[1px] bg-gray-200 my-3"></div>

        <DialogFooter className="flex w-full h-10 -mt-3 -mb-2 items-center justify-between">
          <Button className="rounded-lg text-sm bg-white text-black w-fit font-gilroyMedium tracking-wide border hover:border-black">
            How to use?
          </Button>
          <div className="flex gap-3">
            <Button
              className="rounded-lg text-sm bg-white text-black w-fit font-gilroyMedium tracking-wide border hover:border-black"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg text-sm bg-black text-white w-full font-gilroyMedium tracking-wide hover:bg-neutral-900/80"
              type="button"
              onClick={() => {
                handleSubmit();
              }}
            >
              Connect
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
