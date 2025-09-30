import { Button } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { sendMakingOtp, verifyMakingOtp } from "@/server/deviceActions";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

function LicenseVerificationKey({
  children,
  id,
  licenseKey,
  className,
}: {
  children?: React.ReactNode;
  id?: string;
  licenseKey?: string;
  className?: string;
}) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [open, setOpen] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // ✅ Mutation to send OTP
  const sendOtpMutation = useMutation({
    mutationFn: sendMakingOtp,
    onSuccess: () => toast.success("OTP sent successfully"),
    onError: (err: any) => toast.error(err?.message || "Failed to send OTP"),
  });

  // ✅ Mutation to verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: verifyMakingOtp,
    onSuccess: () => {
      // setVerified(true);
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      toast.success("Email verified successfully");
      setOpen(false);
    },
    onError: (err: any) =>
      toast.error(err?.message || "OTP verification failed"),
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== otp.length) {
      toast.error(`Enter ${otp.length}-digit OTP`);
      return;
    }

    verifyOtpMutation.mutate({ otp: code, id });
  };

  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendOtpMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          // Send OTP immediately when opened
          // sendOtpMutation.mutate();
        } else {
          // Reset OTP fields when closed
          setOtp(["", "", "", "", "", ""]);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex items-center">
          <h3
            className={cn(
              "text-[13px] font-gilroyMedium text-[#808080]",
              className
            )}
          >
            <span className="ml-0.5 rounded-sm font-gilroyMedium">
              {verifyOtpMutation?.data?.licenseKey ?? licenseKey}
            </span>
          </h3>
          <span
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
              sendOtpMutation.mutate();
            }}
            className="text-[#025CE5] text-[10px] pl-2 cursor-pointer"
          >
            Show
          </span>
        </div>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="rounded-[10px] max-w-xs p-4 min-h-fit flex flex-col"
      >
        <DialogTitle className="text-center text-lg font-gilroySemiBold">
          Verify your email
        </DialogTitle>
        <DialogDescription className="text-center text-[#474747] font-gilroyMedium text-[13px]">
          Enter code we’ve sent to your inbox {session?.data?.user?.user?.email}
        </DialogDescription>

        {/* OTP Inputs */}
        <div className="flex gap-2 mt-1">
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
                  inputRefs.current[idx - 1]?.focus();
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

        {/* Resend OTP */}
        <p className="text-[#474747] my-2 text-center text-[13px] font-gilroyMedium">
          Didn’t get the code?
          <button
            onClick={handleResend}
            className="text-[#004DFF] font-gilroyMedium pl-1 disabled:opacity-60"
            disabled={sendOtpMutation.isPending}
          >
            Resend
          </button>
        </p>

        {/* Verify Button */}
        <DialogClose>
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Submit"}
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default LicenseVerificationKey;
