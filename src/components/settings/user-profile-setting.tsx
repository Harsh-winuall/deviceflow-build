import { getCurrentOrg, Org, updateOrg } from "@/server/orgActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../buttons/Button";
import { toast } from "sonner";
import { updateAddress } from "@/server/addressActions";
import { sendOtp, verifyOtpAndLogin } from "@/server/settingActions";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

const schema = z.object({
  name: z.string(),
  email: z.string(),
  phone_no: z.string(),

  org_address: z.string(),
});

type OrgBasicDetails = z.infer<typeof schema>;

function UserProfileSettings({ OrgData }: { OrgData: Org }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(!!OrgData?.phone); // assume server tells us

  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  if (!OrgData) return null;
  const queryClient = useQueryClient();
  const form = useForm<OrgBasicDetails>({
    defaultValues: {
      name: OrgData.name || "",
      email: OrgData.email || "",
      phone_no: OrgData.phone,

      org_address: OrgData?.office_address?.[0]?.address || "",
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    control,
    getValues,
    formState: { dirtyFields },
  } = form;

  const isSaveAllowed = Object.keys(dirtyFields).some(
    (field) => field !== "phone_no"
  );
  const updatingOrgData = useMutation({
    mutationFn: updateOrg,
    onSuccess: () => {
      toast.success("Organisation details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-org"] });
      form.reset(form.getValues());
    },
    onError: () => {
      toast.error("Failed to update Organisation");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, address }: { id: string; address: string }) =>
      updateAddress(id, { address }),
    onSuccess: () => {
      toast.success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-org"] });
      form.reset(form.getValues());
    },
    onError: () => {
      toast.error("Failed to update address");
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      verifyOtpAndLogin(phone, otp),
    onSuccess: () => {
      toast.success("Phone verified successfully");
      setIsOtpVerified(true);
      setIsOtpVisible(false);
    },
    onError: (err: any) =>
      toast.error(err?.message || "OTP verification failed"),
  });

  const resendOtpMutation = useMutation({
    mutationFn: (phone: string) => sendOtp(phone),
    onSuccess: () => toast.success("OTP sent successfully"),
    onError: (err: any) => toast.error(err?.message || "Failed to send OTP"),
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent form submit behavior
    const phone = getValues("phone_no")?.toString(); // Convert to string

    const code = otp.join("");
    if (code.length !== 4) {
      toast.error("Enter 4-digit OTP");
      return;
    }

    if (!phone) {
      toast.error("Phone number is missing");
      return;
    }

    verifyOtpMutation.mutate({ phone, otp: code });
  };

  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const phone = getValues("phone_no")?.toString();

    if (!phone) {
      toast.error("Phone number is missing");
      return;
    }

    resendOtpMutation.mutate(phone);
  };

  const onSubmit = () => {
    const values = getValues();
    const addressId = OrgData.office_address?.[0]?._id;
    const addressValue = values.org_address;

    const isOrgUpdated = dirtyFields.name;

    const isAddressUpdated =
      dirtyFields.org_address && addressId && addressValue;

    if (isOrgUpdated) {
      updatingOrgData.mutate({
        name: values.name,
      });
    } else if (isAddressUpdated) {
      updateAddressMutation.mutate({
        id: addressId,
        address: addressValue,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input className="h-9" {...field} placeholder="Full Name*" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className="h-9"
                    {...field}
                    placeholder="Email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="relative">
            <FormField
              name="phone_no"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 "
                      {...field}
                      placeholder="Phone number"
                      onChange={(e) => {
                        const phone = e.target.value;
                        field.onChange(e); // react-hook-form's handler
                        if (/^\d{10}$/.test(phone)) {
                          setIsOtpVisible(true);
                          setIsOtpVerified(false);
                          resendOtpMutation.mutate(phone.toString());
                        } else {
                          setIsOtpVisible(false);
                        }
                      }}
                    />
                  </FormControl>
                  {isOtpVerified && (
                    <div className="absolute right-6 top-7">
                      <HugeiconsIcon
                        className="text-[#0D9B00] size-5 "
                        icon={CheckmarkCircle02Icon}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          {isOtpVisible && !isOtpVerified && (
            <div className="rounded-md flex justify-between bg-[#FAFAFA] p-2">
              {/* Left */}
              <div className="flex flex-col gap-1">
                <h1 className="flex gap-1 text-xs font-gilroyMedium">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    className="size-4 text-[#0D9B00]"
                  />
                  Verify your phone number
                </h1>
                <p className="text-[#7D7D7D] text-[10px] pl-5 font-gilroyMedium">
                  We have sent you 4 digit code
                </p>
                <button
                  onClick={handleResend}
                  className="text-[#004DFF] pt-3 pl-5 text-[10px] font-gilroyMedium underline disabled:opacity-60"
                  disabled={resendOtpMutation.isPending}
                >
                  Didn’t receive any code?
                </button>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end justify-center gap-2">
                <div className="flex gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 rounded-md border border-gray-300 text-center text-lg"
                      value={digit}
                      onChange={(e) => {
                        handleChange(idx, e.target.value);
                        if (e.target.value === "" && idx > 0) {
                          inputRefs.current[idx - 1]?.focus(); // move back on delete
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                          inputRefs.current[idx - 1]?.focus();
                        }
                      }}
                      ref={(el) => {
                        inputRefs.current[idx] = el!;
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerify}
                  className="mt-1 px-4 py-1 border rounded-md text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50"
                  disabled={verifyOtpMutation.isPending}
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          <FormField
            name="org_address"
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input className="h-9" {...field} placeholder="Address" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!isSaveAllowed}
            className={`ml-auto mt-4 w-fit text-white ${
              isSaveAllowed
                ? "bg-green-600 hover:bg-opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UserProfileSettings;
