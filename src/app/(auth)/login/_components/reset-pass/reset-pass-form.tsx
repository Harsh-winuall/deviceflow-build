"use client";

import { LoadingButton } from "@/components/buttons/Button";
import React, { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/server/loginActions";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { RequestOTPSchemaType, ResetPassSchemaType } from "../validations";

type Props = {
  uId: string;
  setPage: (page: number) => void;
  timeLeft: number;
  setTimeLeft: (timeLeft: number) => void;
  error: string;
  setError: (error: string) => void;
  otp?: string[];
  setOtp?: (otp: string[]) => void;
  reqOtpForm: UseFormReturn<
    {
      email?: string;
    },
    any,
    {
      email?: string;
    }
  >;
  resetPassForm?: UseFormReturn<
    {
      otp?: string;
      "new-password"?: string;
      "confirm-password"?: string;
    },
    any,
    {
      otp?: string;
      "new-password"?: string;
      "confirm-password"?: string;
    }
  >;
  requestOtpSubmit?: ({ email }: RequestOTPSchemaType) => void;
};

export const ResetPassForm = ({
  uId,
  setPage,
  timeLeft,
  setTimeLeft,
  error,
  setError,
  reqOtpForm,
  requestOtpSubmit,
  resetPassForm,
  otp,
  setOtp,
}: Props) => {
  useEffect(() => {
    resetPassForm.setValue("otp", otp.join(""));
  }, [otp, resetPassForm]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timer);
      setOtp(new Array(6).fill("")); // Reset OTP fields
      setTimeLeft(0); // Avoid negative count
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && element.nextElementSibling) {
      (element.nextElementSibling as HTMLElement).focus();
    }
  };

  const handleBackspace = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        (event.currentTarget.previousElementSibling as HTMLElement)?.focus();
      }
    }
  };

  const resetPassMutation = useMutation({
    mutationFn: ({
      userId,
      otp,
      password,
    }: {
      userId: string;
      otp: string;
      password: string;
    }) => resetPassword(userId, otp, password),
    onSuccess: (data) => {
      if (data?.message === "Invalid or Expired otp") {
        setError("Invalid or Expired otp");
      } else {
        setError("");
        setOtp;
        setPage(3);
      }
    },
    onError: () => {
      setError("Failed to reset password. Please try again.");
    },
  });

  function resetPassSubmit(values: ResetPassSchemaType) {
    resetPassMutation.mutate({
      userId: uId,
      otp: values?.otp,
      password: values["confirm-password"],
    });
  }

  return (
    <Form {...resetPassForm}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          resetPassForm.handleSubmit(resetPassSubmit)(e);
        }}
        className="flex flex-col gap-1 w-full mx-auto pt-5"
      >
        <FormField
          control={resetPassForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <div className="flex justify-center items-center">
                  {otp.map((data, index) => (
                    <>
                      <input
                        className={cn(
                          "size-12 mx-2  font-gilroyMedium text-lg text-center bg-[#F6F6F6] border rounded-lg shadow",
                          data ? "border-white" : "border-[#DDD]"
                        )}
                        type="text"
                        name="otp"
                        maxLength={1}
                        key={index}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleBackspace(e, index)}
                      />
                    </>
                  ))}
                  <input type="hidden" {...resetPassForm.register("otp")} />
                </div>
              </FormControl>

              <div className="text-center font-gilroyMedium text-sm text-[#4E4D4D]">
                {formatTimeLeft()}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={resetPassForm.control}
          name="new-password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your new password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={resetPassForm.control}
          name="confirm-password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password again"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <p
          className={cn(
            "text-sm text-red-600 font-gilroyMedium min-h-[1.1rem] -mt-2",
            !error && "invisible"
          )}
        >
          {error}
        </p>

        <LoadingButton
          variant="primary"
          className="w-full mt-3"
          loading={resetPassMutation?.isPending}
          type="submit"
        >
          Submit
        </LoadingButton>

        <p className="text-[#5A5A5A] text-center mt-4 text-sm font-gilroyMedium">
          Don&apos;t receive code?{" "}
          <span
            className="text-black cursor-pointer"
            onClick={() => {
              reqOtpForm.handleSubmit(requestOtpSubmit)();
              resetPassForm.reset();
              setOtp(new Array(6).fill(""));
            }}
          >
            Re-send
          </span>
        </p>
      </form>
    </Form>
  );
};
