"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { setPasswordSchema, SetPasswordSchemaType } from "./validations";
import { useMutation } from "@tanstack/react-query";
import { setPassword } from "@/server/loginActions";

export default function SetPasswordForm({ token }: { token?: string }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => {
      return setPassword(token, password);
    },
    onSuccess: () => {
      toast.success("Password set successfully!");
      router.replace("/login");
    },
    onError: (error: any) => {
      setErrorMessage(error.message.toLowerCase().includes("token") ? "Token has Expired" : "An error occurred. Please try again later.");
      toast.error("Failed to set password");
    },
  });

  async function onSubmit({ password }: SetPasswordSchemaType) {
    setLoading(true);
    try {
      setErrorMessage("");
      mutation.mutate({ token: token, password });

    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("Failed to set password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-0 max-w-md mx-auto py-10"
      >
        <div className="-space-y-2 h-full">
          <FormField
            control={form.control}
            name="password"
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
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex text-sm font-gilroyMedium justify-between items-center pb-4">
          <p
            className={cn(
              "text-sm text-red-600 font-gilroyMedium min-h-[1rem]",
              !errorMessage && "invisible"
            )}
          >
            {errorMessage}
          </p>
        </div>

        <div className="space-y-4">
          <LoadingButton
            loading={loading}
            type="submit"
            variant="primary"
            className="w-full rounded-md font-gilroyMedium"
          >
            Confirm
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
