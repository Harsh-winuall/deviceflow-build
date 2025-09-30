"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPassDialog } from "./reset-pass/reset-pass.dialog";
import { loginSchema, LoginSchemaType } from "./validations";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginSchemaType) {
    try {
      setErrorMessage("");
      setLoading(true);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
        // callbackUrl: "https://app.deviceflow.ai"
      });
      setLoading(false);

      if (response?.status === 200) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error("Invalid credentials. Please try again.");
        router.push("/login");
      }, 1000);
    }
  }, [error]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-0 max-w-md mx-auto py-10"
        >
          <div className="-space-y-2 h-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex text-sm font-gilroyMedium justify-between items-center  pb-4">
            <p
              className={cn(
                "text-sm text-red-600 font-gilroyMedium min-h-[1rem]",
                !errorMessage && "invisible"
              )}
            >
              {errorMessage}
            </p>

            <ResetPassDialog>
              <p className="text-[#2563EB] underline">Reset Password?</p>
            </ResetPassDialog>
          </div>
          <div className="space-y-4">
            <LoadingButton
              loading={loading}
              type="submit"
              variant="primary"
              className="w-full rounded-md font-gilroyMedium"
            >
              Login
            </LoadingButton>
            <div className="w-full mt-6 mb-4 text-xs text-[#0000004D] flex gap-2 items-center justify-center font-gilroyMedium">
              <div className="w-[10%] h-[0.5px] bg-[#0000001A]" />
              OR
              <div className="w-[10%] h-[0.5px] bg-[#0000001A]" />
            </div>
            <Button
              type="button"
              onClick={async () => {
                await signIn("google", {
                  redirect: false,
                  callbackUrl: "https://deviceflow.ai",
                });
                router.push("/");
                router.refresh();
              }}
              variant="outlineTwo"
              className="h-10 w-full rounded-md"
            >
              <img
                src="media/integrations-companies/gsuite-icon.png "
                className="size-4"
              />{" "}
              Login with Google
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
