"use client";

import { LoadingButton } from "@/components/buttons/Button";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RequestOtpResponse } from "@/server/loginActions";
import { UseMutationResult } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { RequestOTPSchemaType } from "../validations";

type Props = {
  error: string;
  reqOtpForm: UseFormReturn<
    {
      email?: string;
    },
    any,
    {
      email?: string;
    }
  >;
  requestOtpMutation: UseMutationResult<
    RequestOtpResponse,
    Error,
    string,
    unknown
  >;
  requestOtpSubmit: ({ email }: RequestOTPSchemaType) => void;
};

export const RequestOTPForm = ({
  error,
  reqOtpForm,
  requestOtpSubmit,
  requestOtpMutation,
}: Props) => {
  return (
    <Form {...reqOtpForm}>
      <form
        className="flex flex-col gap-3 w-full mx-auto"
        onSubmit={(e) => {
          e.stopPropagation();
          reqOtpForm.handleSubmit(requestOtpSubmit)(e);
        }}
      >
        <FormField
          control={reqOtpForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <p
          className={cn(
            "text-sm text-red-600 font-gilroyMedium min-h-[1.1rem] -mt-5",
            !error && "invisible"
          )}
        >
          {error}
        </p>

        <LoadingButton
          loading={requestOtpMutation.isPending}
          disabled={requestOtpMutation.isPending}
          variant="primary"
          type="submit"
          className="w-full"
        >
          Send OTP
        </LoadingButton>
        <DialogClose asChild>
          <Button
            variant="outline"
            type="reset"
            className="w-full"
            onClick={() => {
              reqOtpForm.reset();
            }}
          >
            Back to login
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};
