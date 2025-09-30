import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  requestIntegration,
  RequestIntegrationType,
} from "@/server/customIntegrationActions";
import {
  addNewLocations,
  Location,
  updateSingleLocation,
} from "@/server/settingActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { da } from "date-fns/locale";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is Required"),
  users: z.string().min(1, "Numbers of users is Required"),
  purpose: z.string(),
});

type RequestForm = z.infer<typeof schema>;

function RequestIntegration({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<RequestForm>({
    defaultValues: {
      name: "",
      users: "",
      purpose: "",
    },
    resolver: zodResolver(schema),
  });

  const RequestIntegration = useMutation({
    mutationFn: requestIntegration,
    onSuccess: () => {
      toast.success("Request has been sent");
      queryClient.invalidateQueries({
        queryKey: ["all-userss"],
        refetchType: "all",
        exact: false,
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to sent");
    },
  });

  const handleSubmit = (data) => {
    RequestIntegration.mutate(data);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
      >
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-lg max-w-md p-4 min-h-[35vh]">
          <DialogTitle className="   text-start">Request Form</DialogTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Integration name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage className="invisible" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Number of users<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="font-gilroyMedium w-full text-xs justify-between">
                          <SelectValue placeholder="Select users" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-gilroyMedium md:text-[13px]">
                        <SelectItem
                          value="1-10 users"
                          className="md:text-[13px]"
                        >
                          1-10 users
                        </SelectItem>
                        <SelectItem
                          value=" 11-50 users"
                          className="md:text-[13px]"
                        >
                          11-50 users
                        </SelectItem>
                        <SelectItem
                          value="51-200 users"
                          className="md:text-[13px]"
                        >
                          51-200 users
                        </SelectItem>
                        <SelectItem
                          value="201-500 users"
                          className="md:text-[13px]"
                        >
                          201-500 users
                        </SelectItem>
                        <SelectItem
                          value=" 501-1000 users"
                          className="md:text-[13px]"
                        >
                          501-1000 users
                        </SelectItem>
                        <SelectItem
                          value="1000+ users"
                          className="md:text-[13px]"
                        >
                          1000+ users
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="invisible" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How do you use it? </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Brief about your usage" />
                    </FormControl>
                    <FormMessage className="invisible" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 mt-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-1/2 text-[13px]"
                    variant="outlineTwo"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  variant="primary"
                  loading={RequestIntegration.isPending}
                  className="w-1/2 text-[13px]"
                >
                  Done
                </LoadingButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RequestIntegration;
