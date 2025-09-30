import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, LoadingButton } from "@/components/buttons/Button";
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
  Add01Icon,
  AlertCircleIcon,
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  CursorEdit01FreeIcons,
  Delete01Icon,
  Note02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  getServices,
  setConfigInstruction,
  updateNodeDescription,
} from "@/server/workflowActions/workflowById/workflowNodes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "../../dropdowns/confirmation-popup";
import { useUpdateAppActions } from "../../hooks/use-update-app-actions";
import { EditConditionForm } from "./edit-condition.form";
import { EmailTemplate } from "./email-templete";
import { cn, safeJsonStringify } from "@/lib/utils";

const schema = z.object({
  description: z.string().optional(),
  action: z.string().optional(),
});

export type InstructionValues = z.infer<typeof schema>;

export const InstructionDialog = ({
  children,
  onDelete,
  data,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  data?: any;
  open: boolean;
  onDelete: () => void;
  setOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [isEditScreen, setIsEditScreen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  // console.log(data, "@DATA");

  const { data: services } = useQuery({
    queryKey: ["get-node-services", data?.backendData?.template?.name],
    queryFn: () => getServices(data?.backendData?.template?.name),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { updateAppActionsMutation } = useUpdateAppActions(
    data?.backendData?.workflowId
  );

  // console.log(services, "@get-node-service");

  const form = useForm<InstructionValues>({
    defaultValues: {
      description: data?.backendData?.serviceDescription ?? "",
      action: data?.backendData?.templateLabel ?? "",
    },
    resolver: zodResolver(schema),
  });

  const currentService = form.watch("action");
  const resetToDefaultService = useCallback(() => {
    const defaultService = services?.filter((val) => !val.custom)[0];
    if (defaultService) {
      form.setValue("action", safeJsonStringify(defaultService));
    }
  }, [services, form]);
  const setConfigMutation = useMutation({
    mutationFn: setConfigInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", data?.workflowId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-instruction-actions"],
        exact: true,
        type: "all",
        refetchType: "all",
      });
      toast.success("Conditions saved successfully");
    },
    onError: () => {
      toast.error("Failed to add configuration");
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: updateNodeDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", data?.workflowId],
        exact: false,
        type: "all",
        refetchType: "all",
      });
      // toast.success("Description updated");
    },
    onError: () => {
      toast.error("Failed to update description");
    },
  });

  const handleSubmit = (formData: InstructionValues) => {
    try {
      const backendData = data?.backendData;
      if (backendData?.serviceDescription !== formData?.description) {
        updateDescriptionMutation.mutate({
          nodeId: backendData?._id,
          description: formData?.description,
        });
      }

      // console.log("@FORMDATA", formData);
      const parsedConfig = JSON?.parse(currentService ?? "{}");

      // console.log(parsedConfig, "@PARSEDCONFIG");

      updateAppActionsMutation.mutate({
        nodeId: data.backendData.parentNodeId,
        templateKey: services[0].key,
        workflowId: data.backendData.workflowId,
        customTempleteKey: formData?.action,
        config: {
          cc: parsedConfig?.config.cc,
          html: parsedConfig?.config.html,
          subject: parsedConfig?.config.subject,
        },
      });

      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setIsEditScreen(false);
        form.reset();
      }}
    >
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </DialogTrigger>
      <SideDialogContent
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-8"
      >
        <DialogTitle className="border-b p-3 text-sm font-gilroySemiBold flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              className="size-5 cursor-pointer"
              onClick={() => {
                if (isEditScreen) {
                  setIsEditScreen(false);
                } else {
                  setOpen(false);
                }
                if (isNew) {
                  setIsNew(false);
                }
              }}
            />
            Configure
          </div>
          {form?.watch("action")?.length === 0 ? (
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="text-[#F59E0B] size-4"
            />
          ) : (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="text-[#0C941C] size-4"
            />
          )}
        </DialogTitle>
        <DialogDescription className="sr-only">
          instruction description
        </DialogDescription>
        <div className="p-3 h-[28.6rem] w-full overflow-y-auto hide-scrollbar">
          {!isEditScreen ? (
            <Form {...form}>
              <form
                id="set-condition-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full overflow-y-auto h-full hide-scrollbar"
              >
                <div className="flex gap-2 items-center">
                  {/*<img src="/media/path-form.svg" alt="path" className="size-10" />*/}
                  <div className="p-2 rounded-lg bg-[#0062FF0D] border border-[#0062FF] flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Note02Icon}
                      className="text-[#0062FF] size-6"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center w-full">
                      <p className="font-gilroySemiBold text-sm text-[#222222]">
                        Send instructions
                      </p>
                    </div>
                    <p className="text-xs font-gilroyMedium w-fit text-black border border-gray-100 py-0.5 px-2 rounded-md">
                      Action
                    </p>
                  </div>
                </div>

                <div className=" mt-4">
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
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="invisible" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="font-gilroyMedium text-sm">
                      Action
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
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
                              {services?.map((option, i) => (
                                <SelectItem
                                  key={`${option?.service}-${i}`}
                                  value={safeJsonStringify(option)}
                                  className="text-left"
                                >
                                  {option?.service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* {JSON.stringify(currentService)} */}
                  {currentService ? (
                    <EmailTemplate
                      setIsEdit={setIsEditScreen}
                      defaultService={services?.filter((val) => !val.custom)[0]}
                      currentNodeData={data?.backendData}
                      currentService={currentService}
                      setCurrentService={resetToDefaultService}
                    />
                  ) : null}

                  <div className="border-t border-dashed border-[#0000001A] w-full h-px mt-0 mb-5" />

                  <Button
                    type="button"
                    variant="outlineTwo"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditScreen(true);
                      setIsNew(true);
                    }}
                    className="w-full font-gilroyMedium rounded-[5px] text-xs items-center flex py-1"
                  >
                    <HugeiconsIcon
                      icon={Add01Icon}
                      className="text-black size-3"
                    />{" "}
                    Add custom actions
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <EditConditionForm
              currentNodeData={data?.backendData}
              currentService={currentService}
              isEdit={isEditScreen}
              defaultService={services?.filter((val) => !val.custom)[0]}
              isNew={isNew}
              setIsEditScreen={setIsEditScreen}
              key={`edit-form-${data?.backendData?._id}`}
            />
          )}
        </div>

        <DialogFooter className="border-t p-3 justify-end">
          {!isEditScreen ? (
            <>
              <div className="w-fit">
                <ConfirmationModal
                  functionToBeExecuted={() => {
                    onDelete();
                    setOpen(false);
                  }}
                  title="Are you sure?"
                  successBtnText="Delete"
                  type="failure"
                  description="Delete this node"
                >
                  <Button
                    type="button"
                    className="flex gap-2 h-9 items-center text-[13px] text-red-500 rounded-[5px]"
                    variant="outlineTwo"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                    Delete Node
                  </Button>
                </ConfirmationModal>
              </div>

              <LoadingButton
                type="submit"
                form="set-condition-form"
                variant="primary"
                className="text-[13px] w-fit h-9 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
                loading={setConfigMutation?.isPending}
              >
                Continue
              </LoadingButton>
            </>
          ) : (
            <LoadingButton
              type="submit"
              form="edit-condition-form"
              variant="primary"
              disabled={updateAppActionsMutation?.isPending}
              className="text-[13px] w-fit h-9 rounded-[5px]"
              loading={updateAppActionsMutation?.isPending}
              onClick={(e) => {
                e.stopPropagation();
                // setIsEditScreen(false);
              }}
            >
              Save & Continue
            </LoadingButton>
          )}
        </DialogFooter>
      </SideDialogContent>
    </Dialog>
  );
};
