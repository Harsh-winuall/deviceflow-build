"use client";

import BulkUpload from "@/components/bulk-upload";
import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  AsyncMultiSelectCombobox,
  BaseOption,
} from "@/components/ui/async-multi-select-combobox";
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
import {
  addingBulkUploadUsersIntegration,
  addMembersByUser,
  bulkUploadUsersIntegration,
  missionUsersIntegration,
} from "@/server/customIntegrationActions";
import { fetchUsers, User } from "@/server/userActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  userIds: z.any(),
});

type IntegrationForm = z.infer<typeof schema>;

function AddingNewMembersIntegration({
  children,
  filterUserData,
  integrationId,
}: {
  children?: React.ReactNode;
  isEdit?: boolean;
  integrationId?: string;
  filterUserData?: any;
}) {
  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const form = useForm<IntegrationForm>({
    defaultValues: {
      userIds: [],
    },
    resolver: zodResolver(schema),
  });

  const selectedEmails = form.watch("userIds");

  type UserOption = BaseOption & User;

  const fetchUserOptions = async (): Promise<UserOption[]> => {
    const response = await missionUsersIntegration({
      id: integrationId,
    });
    return response.users?.map((u) => ({
      ...u,
      label: u?.email,
      value: u?._id,
    }));
  };

  const addMembersByUserMutation = useMutation({
    mutationFn: addMembersByUser,
    onSuccess: () => {
      toast.success("Members Added");
      queryClient.invalidateQueries({
        queryKey: ["user-by-integrations"],
        exact: false,
        refetchType: "all",
        type:"all"
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to add Members");
    },
  });
  // console.log(integrationId);
  const handleSubmit = (data) => {
    const userIds = data.userIds; // assuming selected user objects
    // console.log(data);

    addMembersByUserMutation.mutate({
      integrationId,
      userIds,
    });

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-lg max-w-md p-4 min-h-[35vh]">
        <DialogTitle className="text-start">Custom Integration</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="userIds"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Add Members<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 ">
                      <AsyncMultiSelectCombobox<UserOption>
                        fetcher={fetchUserOptions}
                        preload
                        filterFn={(opt, q) =>
                          opt?.first_name
                            ?.toLowerCase()
                            ?.includes(q?.toLowerCase()) ||
                          opt?.email?.toLowerCase()?.includes(q?.toLowerCase())
                        }
                        renderItem={(opt) => (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="font-gilroyMedium">
                                {opt?.first_name}
                              </div>
                              <div className="text-xs font-gilroyRegular text-muted-foreground">
                                {opt?.email}
                              </div>
                            </div>
                          </div>
                        )}
                        renderSelectedItem={(opts) => {
                          const firstThree = opts?.slice(0, 3) ?? [];
                          const remaining =
                            opts?.length > 3 ? opts.length - 3 : 0;
                          return (
                            <div className="flex flex-wrap items-center gap-1">
                              {firstThree?.map((o) => (
                                <span
                                  key={o?.value}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-neutral-100 rounded"
                                >
                                  {o?.first_name}
                                </span>
                              ))}
                              {remaining > 0 && (
                                <span className="font-gilroyMedium text-xs">
                                  + {remaining} More
                                </span>
                              )}
                            </div>
                          );
                        }}
                        value={selectedEmails}
                        onChange={(val) => {
                          // console.log(val);
                          form.setValue("userIds", val);
                        }}
                        label="Members"
                        placeholder="Select members"
                        notFound={
                          <div className="py-6 text-center font-gilroyMedium text-sm">
                            No users found
                          </div>
                        }
                        width="100%"
                        clearable
                      />
                      {error?.length ? (
                        <p className="text-xs text-destructive font-gilroyMedium">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage className="invisible" />
                </FormItem>
              )}
            />
            <div className="w-full  mb-4 text-xs text-[#0000004D] flex gap-2 items-center justify-center font-gilroyMedium">
              <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
              OR
              <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
            </div>
            <BulkUpload
              bulkApi={
                addingBulkUploadUsersIntegration
              }
              closeBtn={() => setOpen(false)}
              requiredKeys={["email"]}
              sampleData={{
                email: "demo@exampledemo.com",
              }}
              integrationId={integrationId}
            />
            <div className="flex gap-2 mt-5">
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
                className="w-1/2 text-[13px]"
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddingNewMembersIntegration;
