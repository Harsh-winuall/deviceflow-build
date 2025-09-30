"use client";
import { LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  SideDialogContent,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppTaskType } from "../types/task";

// Define schema for the action form
const formSchema = z.object({
  employee_name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  employement_type: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  asset: z.string().min(1).optional(),
});

function DeviceFlowDialog({
  children,
  data,
  onDelete,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  open?: boolean;
  data?: any;
  onDelete?: () => void;
  setOpen?: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <SideDialogContent className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-8">
        <DialogTitle className="border-b p-3 text-sm font-gilroySemiBold flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <DialogClose>
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                className="size-5 cursor-pointer"
              />
            </DialogClose>
            Set Action
          </div>

          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="text-[#0C941C] size-4"
          />
        </DialogTitle>
        <DialogDescription className="sr-only">
          deviceflow description
        </DialogDescription>
        <div className="px-3 pt-3 pb-0 h-full w-full overflow-y-auto hide-scrollbar">
          <Form {...form}>
            <form
              id="device-flow-dialog"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full h-full overflow-y-auto hide-scrollbar"
            >
              <div className="flex gap-2 items-center mb-3">
                <img
                  src="/media/deviceflow-condition.svg"
                  alt="Google Workspace"
                  className="size-12"
                />
                <div>
                  <h1 className="text-[15px] font-gilroySemiBold">
                    Deviceflow
                  </h1>
                  <p className="text-xs font-gilroyMedium w-fit text-black border border-gray-100 py-0.5 px-2 rounded-md">
                    Action
                  </p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="employee_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="{Employee Name}"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="{Phone Number}"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employement_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employement Type</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="{Employement Type}"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="{Team}" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Asset</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="{Asset}"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="border-t p-3 justify-end">
          <DialogClose className="w-fit">
            <LoadingButton
              type="submit"
              form="device-flow-dialog"
              variant="primary"
              className="text-[13px] rounded-[5px] w-fit h-9"
            >
              Continue
            </LoadingButton>
          </DialogClose>
        </DialogFooter>
      </SideDialogContent>
    </Dialog>
  );
}

export default DeviceFlowDialog;
