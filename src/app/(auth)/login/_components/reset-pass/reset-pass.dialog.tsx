"use client";

import { Button as PrimaryButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { requestOtp } from "@/server/loginActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  reqOtpSchema,
  type RequestOTPSchemaType,
  resetPassSchema,
  type ResetPassSchemaType,
} from "../validations";
import { RequestOTPForm } from "./req-otp-form";
import { ResetPassForm } from "./reset-pass-form";

export const ResetPassDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const [uId, setUId] = useState("");

  const reqOtpForm = useForm<RequestOTPSchemaType>({
    resolver: zodResolver(reqOtpSchema),
    defaultValues: { email: "" },
    shouldUnregister: false,
  });

  const resetPassForm = useForm<ResetPassSchemaType>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: { otp: "", "confirm-password": "", "new-password": "" },
  });

  useEffect(() => {
    if (!open) {
      setPage(1);
      setError("");
      setOtp(new Array(6).fill(""));
      reqOtpForm.reset();
      resetPassForm.reset();
    }
  }, [open]);

  const requestOtpMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      setUId(data?.userId);
      setPage(2);
      setTimeLeft(60);
      setError("");
    },
    onError: () => {
      setError("Failed to send otp");
    },
  });

  function requestOtpSubmit({ email }: RequestOTPSchemaType) {
    requestOtpMutation.mutate(email);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "rounded-2xl py-20 max-w-md",
          page === 2 && "py-12",
          page === 3 && "py-36 space-y-6"
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-normal font-gilroyBold text-center tracking-normal text-2xl">
            {page === 1 || page === 2 ? "Reset Password" : "All Done!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {page === 1
              ? "Enter the email ID associated with your account"
              : page === 2
              ? "Enter the OTP sent to admin"
              : "Your password has been successfully updated. You can now log in with your new credentials"}
          </DialogDescription>
        </DialogHeader>

        {page === 1 ? (
          <RequestOTPForm
            reqOtpForm={reqOtpForm}
            requestOtpSubmit={requestOtpSubmit}
            error={error}
            requestOtpMutation={requestOtpMutation}
          />
        ) : page === 2 ? (
          <ResetPassForm
            uId={uId}
            setPage={setPage}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            reqOtpForm={reqOtpForm}
            requestOtpSubmit={requestOtpSubmit}
            resetPassForm={resetPassForm}
            setError={setError}
            error={error}
            otp={otp}
            setOtp={setOtp}
          />
        ) : page === 3 ? (
          <DialogClose>
            <PrimaryButton
              variant="primary"
              type="button"
              className="w-full py-3"
            >
              Back to Login
            </PrimaryButton>
          </DialogClose>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
