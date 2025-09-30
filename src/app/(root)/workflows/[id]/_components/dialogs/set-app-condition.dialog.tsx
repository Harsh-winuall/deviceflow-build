"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import type React from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAsanaChannels,
  getChannelsFromKey,
  getServices,
  getSlackChannelMessage,
  setConfigApp,
  updateAppAction,
} from "@/server/workflowActions/workflowById/workflowNodes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ChangeAppDropdown from "../dropdowns/change-app-dropdown";
import { ConfirmationModal } from "../dropdowns/confirmation-popup";
import { cn } from "@/lib/utils";
import Link from "next/link";
import IfConditionDialog from "./instructions/if-condition-dialog";

// Define schema for the action form
const actionSchema = z.object({
  description: z.string().optional(),
  groupId: z.string().optional(),
  action: z.string().min(1, "Action is required"),
  channel: z.string(),
  workspace_gid: z.string().optional(),
  project_gid: z.string().optional(),
  messageInput: z.string().optional(),
  org: z.string().optional(),
  github_repo: z.string().optional(),
  asana_channel: z.string().optional(),
  asana_team_channel: z.string().optional(),
  parameters: z.record(z.string()).optional(),
  inviteLink: z.string().optional(),
});

type ActionFormValues = z.infer<typeof actionSchema>;

function AppConditionDialog({
  children,
  data,
  onDelete,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  open: boolean;
  data?: any;
  onDelete: () => void;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  // Initialize selectedActionKey with the existing templateKey if available
  const [selectedActionKey, setSelectedActionKey] = useState<string | null>(
    data?.backendData?.templateKey || null
  );

  const { data: services, status: servicesStatus } = useQuery({
    queryKey: ["get-node-services", data?.backendData?.template?.name],
    queryFn: () => getServices(data?.backendData?.template?.name),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
  });

  const setActionMutation = useMutation({
    mutationFn: updateAppAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", data?.backendData?.workflowId],
        exact: false,
      });
      toast.success("App Condition set Successfully");
    },
    onError: () => {
      toast.error("Failed to set App Condition");
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setChannelMutation = useMutation({
    mutationFn: setConfigApp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", data?.backendData?.workflowId],
        exact: false,
      });
    },
    onError: () => {
      toast.error("Failed to set App Condition");
    },
  });

  const form = useForm<ActionFormValues>({
    defaultValues: {
      description: data?.backendData?.template?.description || "",
      action: data?.backendData?.templateKey || "",
      parameters: {},
      project_gid: data?.backendData?.configData?.project_gid,
      groupId: data.backendData?.configData?.groupId,
      workspace_gid: data?.backendData?.configData?.workspace_gid,
      org: data?.backendData?.configData?.org,
      github_repo: "",
      asana_channel: "",
      asana_team_channel: "",
      messageInput: data?.backendData?.configData?.message,
      channel: "",
      inviteLink: data?.backendData?.configData?.inviteLink ?? "",
    },
    resolver: zodResolver(actionSchema),
  });

  // Update selectedActionKey when form action changes or when component mounts with existing data
  useEffect(() => {
    const currentAction = form?.getValues("action");
    if (currentAction && currentAction !== selectedActionKey) {
      setSelectedActionKey(currentAction);
    }
  }, [form.watch("action"), selectedActionKey]);

  // Also set it when the dialog opens with existing data
  useEffect(() => {
    if (open && data?.backendData?.templateKey && !selectedActionKey) {
      setSelectedActionKey(data.backendData.templateKey);
    }
  }, [open, data?.backendData?.templateKey, selectedActionKey]);

  const handleSubmit = (formData: ActionFormValues) => {
    try {
      selectedActionKey?.toLowerCase()?.split("_")?.includes("message")
        ? setChannelMutation.mutate({
            channelId: formData?.channel,
            currentNodeId: data?.backendData?.parentNodeId,
            messageInput: formData?.messageInput,
          })
        : selectedActionKey?.toLowerCase()?.split("_")?.includes("team") &&
          !selectedActionKey?.toLowerCase()?.split("_")?.includes("asana")
        ? setChannelMutation.mutate({
            teamId: formData?.channel,
            currentNodeId: data?.backendData?.parentNodeId,
          })
        : selectedActionKey === "invite_github_org_user"
        ? setChannelMutation.mutate({
            teamId: formData?.channel,
            currentNodeId: data?.backendData?.parentNodeId,
            org: formData.org,
          })
        : selectedActionKey === "invite_github_repo_user"
        ? setChannelMutation.mutate({
            repoId: JSON.parse(formData?.github_repo)?.id,
            currentNodeId: data?.backendData?.parentNodeId,
            repoName: JSON.parse(formData?.github_repo)?.name,
          })
        : selectedActionKey === "invite_asana_workspace_user"
        ? setChannelMutation.mutate({
            teamId: formData.channel,
            currentNodeId: data?.backendData?.parentNodeId,
            workspace_gid: formData?.workspace_gid,
          })
        : selectedActionKey === "add_asana_team_user"
        ? setChannelMutation.mutate({
            currentNodeId: data?.backendData?.parentNodeId,
            team_gid: formData?.asana_team_channel,
          })
        : selectedActionKey === "add_asana_project_user"
        ? setChannelMutation.mutate({
            currentNodeId: data?.backendData?.parentNodeId,
            project_gid: formData?.asana_team_channel,
          })
        : selectedActionKey === "create_slack_user"
        ? setChannelMutation.mutate({
            currentNodeId: data?.backendData?.parentNodeId,
            inviteLink: formData?.inviteLink,
          })
        : selectedActionKey === "add_workspace_user_to_group"
        ? setChannelMutation.mutate({
            currentNodeId: data?.backendData?.parentNodeId,
            groupId: formData?.groupId,
          })
        : null;

      setActionMutation.mutate({
        nodeId: data?.backendData?.parentNodeId,
        templateKey: formData?.action,
        workflowId: data?.backendData?.workflowId,
        description: formData?.description,
      });

      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const { data: channels, status: channelStatus } = useQuery({
    queryKey: ["get-channel-services", selectedActionKey],
    queryFn: () => getChannelsFromKey(selectedActionKey!),
    enabled: !!selectedActionKey,
  });

  const { data: asanaChannels } = useQuery({
    queryKey: [
      "get-asana-channels",
      selectedActionKey,
      form.watch("asana_channel"),
    ],
    queryFn: async () => {
      return getAsanaChannels({
        platform: "Asana",
        template_key: form?.watch("action"),
        workspace_gid: form?.watch("asana_channel"),
      });
    },
    enabled: !!selectedActionKey,
    gcTime: 0,
  });

  const selectedChannel = form.watch("channel");
  const fetchSlackMessage = useCallback(() => {
    return getSlackChannelMessage({ channelId: selectedChannel });
  }, [selectedChannel]);

  const { data: message, status } = useQuery({
    queryKey: ["get-channel-message", selectedChannel],
    queryFn: fetchSlackMessage,
    enabled: !!selectedChannel,
  });

  // Options for the action select field
  const actionOptions =
    services?.map((service, index) => ({
      value: service?.key,
      label: service?.service,
    })) || [];

  const channelOptions =
    channels?.data?.map((channel, index) => ({
      value: channel?.id,
      label: channel?.name,
    })) || [];

  const repoOptions =
    channels?.data?.map((channel, index) => ({
      value: JSON.stringify(channel),
      label: channel?.name,
    })) || [];

  const asanaChannelOptions =
    asanaChannels?.data?.map((channel) => ({
      value: channel?.id,
      label: channel?.name,
    })) || [];

  // console.log("Fetching Channels", channels);
  const isLoading = !channels || Object.keys(channels).length === 0;
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </DialogTrigger>
      <SideDialogContent
        className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="border-b p-3 text-sm font-gilroySemiBold flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              className="size-5 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            Set Action
          </div>
          {data?.backendData?.templateKey ? (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="text-[#0C941C] size-4"
            />
          ) : (
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="text-[#F59E0B] size-4"
            />
          )}
        </DialogTitle>
        <DialogDescription className="sr-only">
          app description
        </DialogDescription>
        <div className="p-3 h-[28.6rem] w-full overflow-y-auto hide-scrollbar">
          <Form {...form}>
            <form
              id="set-action-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full overflow-y-auto hide-scrollbar"
            >
              {/* App logo and labels section */}
              <div className="flex gap-2 items-center">
                <div className="rounded-lg p-1.5 border border-gray-100 flex-shrink-0">
                  <img
                    src={
                      data?.backendData?.template?.image || "/placeholder.svg"
                    }
                    alt={data?.backendData?.template?.name}
                    className="size-10"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center w-full">
                    <p className="font-gilroySemiBold text-sm text-[#222222]">
                      {data.appType}
                    </p>
                    <ChangeAppDropdown data={data}>
                      <p className="text-xs font-gilroyMedium border rounded-[5px] border-[#CCCCCC] px-2 py-1 cursor-pointer">
                        Change
                      </p>
                    </ChangeAppDropdown>
                  </div>
                  <p className="text-xs font-gilroyMedium w-fit text-black border border-gray-100 py-0.5 px-2 rounded-md">
                    Action
                  </p>
                </div>
              </div>

              <div className=" mt-4 gap-5">
                {/* Description field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter description"
                          className="placeholder:text-[13px] placeholder:text-[#CCCCCC] font-gilroyMedium"
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Action select field */}
                <div className="space-y-1 mt-3">
                  <FormLabel className="font-gilroyMedium text-sm">
                    Action
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedActionKey(val);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex justify-between font-gilroyMedium",
                                !field.value
                                  ? "text-[#CCCCCC] text-[13px]"
                                  : "text-black"
                              )}
                            >
                              <SelectValue
                                placeholder="Choose action"
                                className={"text-[#CCCCCC]"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-gilroyMedium">
                            {actionOptions?.length > 0 ? (
                              actionOptions.map((option) => (
                                <SelectItem
                                  key={String(option.value)}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-gray-500">
                                ⚠️ No options available.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                {/* {JSON.stringify(channels)}
                {JSON.stringify(selectedActionKey)} */}
                {/* Invite Link + Error Box */}
                {selectedActionKey === "create_slack_user" &&
                  !channels?.success && (
                    <>
                      {/* Invite Link Input */}
                      <div className="space-y-1 mt-2">
                        <FormLabel className="font-gilroyMedium text-sm">
                          Invite Link
                        </FormLabel>
                        <FormField
                          control={form.control}
                          name="inviteLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter Slack invite link"
                                  className="placeholder:text-[13px] placeholder:text-[#CCCCCC] font-gilroyMedium"
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Error Message Box */}
                      <p className="bg-[#FFFDE7] text-[#FFA100] border border-[#FFA100] rounded-[5px] p-2 mt-3 font-gilroyMedium text-xs">
                        {channels?.message}. See{" "}
                        <Link
                          scroll={true}
                          target="_blank"
                          href={channels?.link ?? "#"}
                        >
                          <span className="text-[#3985FF] px-1 cursor-pointer underline">
                            how to configure
                          </span>
                        </Link>{" "}
                        for more details.
                      </p>
                    </>
                  )}

                {/* Rest of your conditional rendering logic remains the same */}
                {(selectedActionKey
                  ?.toLowerCase()
                  .split("_")
                  .includes("message") ||
                  selectedActionKey
                    ?.toLowerCase()
                    .split("_")
                    .includes("team")) &&
                  !selectedActionKey
                    ?.toLowerCase()
                    .split("_")
                    .includes("asana") && (
                    <>
                      {selectedActionKey
                        ?.toLowerCase()
                        .split("_")
                        .includes("message") && (
                        <div className="space-y-1 mt-2">
                          <FormLabel className="font-gilroyMedium text-sm">
                            {selectedActionKey
                              ?.toLowerCase()
                              .split("_")
                              .includes("message")
                              ? "Slack Message"
                              : selectedActionKey
                                  ?.toLowerCase()
                                  .split("_")
                                  .includes("invite_github_org_user")
                              ? "Available orgs"
                              : selectedActionKey
                                  ?.toLowerCase()
                                  .split("_")
                                  .includes("invite_github_repo_user")
                              ? "Available Repos"
                              : "Team"}
                          </FormLabel>

                          <FormField
                            control={form.control}
                            name="messageInput"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      ref={inputRef}
                                      placeholder="e.g. Onboarding {First Name} {Last Name} on {Team}"
                                      className="placeholder:text-[13px] placeholder:text-[#CCCCCC] placeholder:font-gilroyMedium font-gilroyMedium pr-10"
                                      value={field.value || ""}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                      }}
                                      onKeyDown={(e) => {
                                        e.stopPropagation;
                                        if (
                                          e.key === "{" ||
                                          (e.shiftKey && e.key === "[")
                                        ) {
                                          e.preventDefault();
                                          setDropdownOpen(true);
                                        }
                                      }}
                                    />

                                    <IfConditionDialog
                                      data={data?.backendData?.ifCondition}
                                      open={dropdownOpen}
                                      onOpenChange={setDropdownOpen}
                                      onSelect={(val) => {
                                        const current = field.value || "";
                                        const updated = `${current} {${val}}`;
                                        field.onChange(updated);
                                        setDropdownOpen(false);

                                        // ✅ Refocus the input after a small delay
                                        setTimeout(() => {
                                          inputRef.current?.focus();
                                        }, 0);
                                      }}
                                    >
                                      <img
                                        src="/media/curly-braces.svg"
                                        className="absolute top-1/2 -translate-y-1/2 right-3  cursor-pointer"
                                        alt="Curly-braces"
                                      />
                                    </IfConditionDialog>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {channels?.success && (
                        <div className="space-y-1 mt-2">
                          <FormLabel className="font-gilroyMedium text-sm">
                            {selectedActionKey
                              ?.toLowerCase()
                              .split("_")
                              .includes("message")
                              ? "Channel"
                              : "Team"}
                          </FormLabel>

                          <FormField
                            control={form.control}
                            name="channel"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    form.setValue("channel", val);
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                      <SelectValue
                                        placeholder={`Choose options`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="font-gilroyMedium">
                                    {channelOptions?.length > 0 ? (
                                      channelOptions?.map((option) => (
                                        <SelectItem
                                          key={option?.value}
                                          value={option?.value}
                                        >
                                          {option?.label}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="p-2 text-sm text-gray-500">
                                        ⚠️ No conditions available.
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {!isLoading &&
                      !channels?.success &&
                      selectedActionKey !== "move_user_team_device_flow" ? (
                        <p className="bg-[#FFFDE7] text-[#FFA100] border border-[#FFA100] rounded-[5px] p-2 mt-3 font-gilroyMedium  text-xs">
                          {channels?.message} . See{" "}
                          <Link
                            scroll={true}
                            target="_blank"
                            href={channels?.link ?? "#"}
                          >
                            <span className="text-[#3985FF] px-1 cursor-pointer underline">
                              how to configure
                            </span>
                          </Link>
                          for more details.
                        </p>
                      ) : null}

                      {message &&
                      !message?.success &&
                      selectedActionKey !== "move_user_team_device_flow" ? (
                        <p className="bg-[#FFFDE7] text-[#FFA100] border border-[#FFA100] rounded-[5px] p-2 mt-3 font-gilroyMedium text-xs">
                          {message?.message} See{" "}
                          <Link
                            href={message?.link ?? "!#"}
                            scroll={true}
                            target="_blank"
                          >
                            <span className="text-[#3985FF] px-1 cursor-pointer underline">
                              how to configure
                            </span>{" "}
                          </Link>
                          for more details.
                        </p>
                      ) : null}
                    </>
                  )}
                {/* {JSON.stringify(channels)} */}
                {/* ⚠️ Warning block only when channel integration fails */}
                {!isLoading &&
                  !channels?.success &&
                  (selectedActionKey === "invite_github_org_user" ||
                    selectedActionKey === "invite_github_repo_user") && (
                    <p className="bg-[#FFFDE7] text-[#FFA100] border border-[#FFA100] rounded-[5px] p-2 mt-3 font-gilroyMedium text-xs">
                      {channels?.message}. See{" "}
                      <Link
                        scroll={true}
                        target="_blank"
                        href={channels?.link ?? "#"}
                      >
                        <span className="text-[#3985FF] px-1 cursor-pointer underline">
                          how to configure
                        </span>
                      </Link>
                      for more details.
                    </p>
                  )}

                {/* ✅ Org selection only when channel is configured */}
                {!isLoading &&
                  channels?.success &&
                  selectedActionKey === "invite_github_org_user" && (
                    <div className="space-y-1 mt-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Available Orgs
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="org"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder="Choose options" />
                                </SelectTrigger>
                              </FormControl>
                              {/* {JSON.stringify(channelOptions)} */}
                              <SelectContent className="font-gilroyMedium">
                                {channelOptions?.length > 0 ? (
                                  channelOptions.map((option) => (
                                    <SelectItem
                                      key={String(option.value)}
                                      value={String(option.value)}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No options available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                {!isLoading &&
                  channels?.success &&
                  selectedActionKey === "add_workspace_user_to_group" && (
                    <div className="space-y-1 mt-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Group Names
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="groupId"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder="Choose options" />
                                </SelectTrigger>
                              </FormControl>
                              {/* {JSON.stringify(channelOptions)} */}
                              <SelectContent className="font-gilroyMedium">
                                {channelOptions?.length > 0 ? (
                                  channelOptions.map((option) => (
                                    <SelectItem
                                      key={String(option.value)}
                                      value={String(option.value)}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No options available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                {!isLoading &&
                  channels?.success &&
                  selectedActionKey === "invite_github_repo_user" && (
                    <div className="space-y-1 mt-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Available Repos
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="github_repo"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {repoOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-left capitalize"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                {!isLoading &&
                  !channels?.success &&
                  selectedActionKey === "invite_asana_workspace_user" && (
                    <p className="bg-[#FFFDE7] text-[#FFA100] border border-[#FFA100] rounded-[5px] p-2 mt-3 font-gilroyMedium text-xs">
                      {channels?.message}. See{" "}
                      <Link
                        scroll={true}
                        target="_blank"
                        href={channels?.link ?? "#"}
                      >
                        <span className="text-[#3985FF] px-1 cursor-pointer underline">
                          how to configure
                        </span>
                      </Link>
                      for more details.
                    </p>
                  )}
                {selectedActionKey
                  ?.toLowerCase()
                  .includes("invite_asana_workspace_user") &&
                  channels?.success && (
                    <div className="space-y-1 mt-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Available Workspace
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="workspace_gid"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("workspace_gid", val);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {channelOptions?.length > 0 ? (
                                  channelOptions?.map((option) => (
                                    <SelectItem
                                      key={option?.value}
                                      value={option?.value}
                                    >
                                      {option?.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No conditions available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                {selectedActionKey
                  ?.toLowerCase()
                  .includes("add_asana_project_user") && (
                  <>
                    <div className="space-y-1 mt-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Add Project User
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="asana_channel"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("asana_channel", val);
                                setSelectedActionKey("add_asana_project_user");
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {channelOptions?.length > 0 ? (
                                  channelOptions?.map((option) => (
                                    <SelectItem
                                      key={option?.value}
                                      value={option?.value}
                                    >
                                      {option?.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No conditions available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div
                      className="space-y-1 mt-2"
                      key={"add_asana_project_user"}
                    >
                      <FormLabel className="font-gilroyMedium text-sm">
                        Add Channels
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="asana_team_channel"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("asana_team_channel", val);
                                setSelectedActionKey("add_asana_project_user");
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {asanaChannelOptions?.length > 0 ? (
                                  asanaChannelOptions?.map((option) => (
                                    <SelectItem
                                      key={option?.value}
                                      value={option?.value}
                                    >
                                      {option?.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No conditions available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {selectedActionKey
                  ?.toLowerCase()
                  .includes("add_asana_team_user") && (
                  <>
                    <div className="space-y-2">
                      <FormLabel className="font-gilroyMedium text-sm">
                        Add Project User
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="asana_channel"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("asana_channel", val);
                                setSelectedActionKey("add_asana_team_user");
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {channelOptions?.length > 0 ? (
                                  channelOptions?.map((option) => (
                                    <SelectItem
                                      key={option?.value}
                                      value={option?.value}
                                    >
                                      {option?.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No conditions available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2" key={"add_asana_team_user"}>
                      <FormLabel className="font-gilroyMedium text-sm">
                        Add Team Channel
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="asana_team_channel"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("asana_team_channel", val);
                                setSelectedActionKey("add_asana_team_user");
                                // console.log(val);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="flex justify-between font-gilroyMedium placeholder:text-[#CCCCCC]">
                                  <SelectValue placeholder={`Choose options`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="font-gilroyMedium">
                                {asanaChannelOptions?.length > 0 ? (
                                  asanaChannelOptions?.map((option) => (
                                    <SelectItem
                                      key={option?.value}
                                      value={option?.value}
                                    >
                                      {option?.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    ⚠️ No conditions available.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter className="border-t p-3 justify-end">
          <div className="w-fit">
            <ConfirmationModal
              functionToBeExecuted={() => {
                onDelete();
                setOpen(false);
              }}
              type="failure"
              title="Are you sure?"
              description="Deleting this node"
              successBtnText="Delete"
            >
              <Button
                type="button"
                className="flex gap-2 items-center rounded-[5px] text-[13px] text-red-500 h-9"
                variant="outlineTwo"
              >
                <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                Delete Node
              </Button>
            </ConfirmationModal>
          </div>

          <LoadingButton
            form="set-action-form"
            type="submit"
            variant="primary"
            className="text-[13px] rounded-[5px] w-fit h-9"
            loading={setActionMutation?.isPending}
            onClick={(e) => e.stopPropagation()}
          >
            Continue
          </LoadingButton>
        </DialogFooter>
      </SideDialogContent>
    </Dialog>
  );
}

export default AppConditionDialog;
