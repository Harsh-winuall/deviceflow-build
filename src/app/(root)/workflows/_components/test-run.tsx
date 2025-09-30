"use client";
import { Button } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import {
  testRunWorkflow,
  updateWorkflow,
} from "@/server/workflowActions/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, LoaderCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInvalidateWorkflow } from "../[id]/_components/hooks/use-invalidate-workflow";

export const TestRun = ({
  workflowId,
  enableTestRun,
  allNodesIntegrated,
}: {
  enableTestRun?: boolean;
  allNodesIntegrated?: boolean;
  workflowId: string;
}) => {
  const [open, setOpen] = useState(false);

  const {
    data: workflowData,
    mutate,
    status,
  } = useMutation({
    mutationFn: testRunWorkflow,
  });

  return (
    <>
      <TestRunDialog
        workflowId={workflowId}
        workflowData={workflowData}
        open={open}
        setOpen={setOpen}
        status={status}
      />
      <Button
        variant="primary"
        disabled={!allNodesIntegrated || enableTestRun}
        className="flex items-center rounded-[5px] gap-2 h-9"
        onClick={() => {
          setOpen(true);
          mutate(workflowId);
        }}
      >
        Publish
      </Button>
    </>
  );
};

const STEP_DELAY_MS = 3000;

export function StepperSkeleton({ steps = 3 }: { steps?: number }) {
  return (
    <div className="px-5 overflow-y-auto min-h-0 h-fit max-h-[11.3rem] space-y-2">
      {[...Array(steps)].map((_, i) => (
        <div key={i} className="flex gap-2 justify-start">
          {/* Step Indicator Column */}
          <div className="flex flex-col items-center">
            {/* Circle Indicator */}
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
            </div>

            {/* Separator Line */}
            {i < steps - 1 && (
              <div className="w-0.5 h-2 bg-gray-200 animate-pulse mt-2"></div>
            )}
          </div>

          {/* Step Content */}
          <div className="flex flex-col flex-1 pt-1">
            {/* App Name */}
            <Skeleton className="h-4 w-20 mb-1" />

            {/* Optional reason text (for some steps) */}
          </div>
        </div>
      ))}
    </div>
  );
}

export const TestRunDialog = ({
  children,
  workflowId,
  workflowData,
  open: isDialogOpen,
  setOpen: setIsDialogOpen,
  status,
}: {
  open: boolean;
  workflowData: any;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
  workflowId: string;
  status: "idle" | "pending" | "error" | "success";
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingStepIndex, setLoadingStepIndex] = useState<number | null>(null);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [failedStepIndex, setFailedStepIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { invalidateWorkflow } = useInvalidateWorkflow(workflowId);
  const stepIndexRef = useRef(0);
  // Add at the top inside TestRunDialog
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  // console.log("opened");

  const allStepsCompleted =
    workflowData?.results?.length === completedSteps.length &&
    failedStepIndex === null &&
    loadingStepIndex === null;

  const updateMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      status?: string;
      isValidTestRun: boolean;
    }) => updateWorkflow(workflowId, data),
    onMutate: async (newData) => {
      // Optimistically update the status
      if (newData.status) {
        invalidateWorkflow?.();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-all-workflows"] });
      queryClient.setQueryData(["workflow-by-id", workflowId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isValidTestRun: true,
        };
      });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update workflow");
    },
  });

  useEffect(() => {
    if (allStepsCompleted) {
      updateMutation.mutate({
        isValidTestRun: true,
      });
    }
  }, [allStepsCompleted]);
  // console.log(workflowData);

  useEffect(() => {
    if (!isDialogOpen || !workflowData) return;

    const steps = workflowData.results;

    // ✅ Always reset first — this is the fix!
    stepIndexRef.current = 0;
    setCurrentStep(0);
    setCompletedSteps([]);
    setFailedStepIndex(null);
    setLoadingStepIndex(null);
    // console.log("Starting test run from index", stepIndexRef.current);

    const runNextStep = () => {
      if (stepIndexRef.current >= steps.length || failedStepIndex !== null) {
        setLoadingStepIndex(null);
        return;
      }

      const step = steps[stepIndexRef.current];
      setLoadingStepIndex(stepIndexRef.current);

      timerRef.current = setTimeout(() => {
        if (step.executable === false) {
          setFailedStepIndex(stepIndexRef.current);
          setLoadingStepIndex(null);
          return;
        }

        setCompletedSteps((prev) => [...prev, stepIndexRef.current]);
        setCurrentStep((prev) => prev + 1);
        stepIndexRef.current++;

        if (stepIndexRef.current < steps.length) {
          runNextStep();
        } else {
          setLoadingStepIndex(null);
        }
      }, STEP_DELAY_MS);
    };

    runNextStep();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDialogOpen, workflowData]);
  useEffect(() => {
    if (!isDialogOpen) {
      setCurrentStep(0);
      setLoadingStepIndex(null);
      setCompletedSteps([]);
      setFailedStepIndex(null);
      stepIndexRef.current = 0;
    }
  }, [isDialogOpen]);
  // Scroll the current step into view on step change
  useEffect(() => {
    const el = stepRefs.current[currentStep];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentStep, loadingStepIndex]);

  // Show skeleton loading state
  if (status === "pending" || !workflowData) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-gilroyMedium max-w-sm rounded-[10px] p-0">
          <DialogTitle className="font-gilroySemiBold px-5 pt-5 text-black text-sm">
            Test Workflow
          </DialogTitle>
          <DialogDescription className="sr-only">
            Test workflow
          </DialogDescription>

          {/* Separator */}
          <div className="h-[1px] w-full bg-gray-300"></div>

          {/* Skeleton Content */}
          <StepperSkeleton steps={5} />

          {/* Skeleton Footer */}
          <DialogFooter>
            <div className="flex w-full gap-2 p-5 pt-0">
              <Skeleton className="w-full flex-1 h-9 rounded-[10px]" />
              <Skeleton className="w-full flex-1 h-9 rounded-[10px]" />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePublish = () => {
    updateMutation.mutate(
      {
        status: "published",
        enabled: true,
      },
      {
        onSuccess: () => {
          invalidateWorkflow?.();
          toast.success("Workflow published successfully");
          router.push("/ai-agents");
        },
      }
    );
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="font-gilroyMedium max-w-sm   rounded-[10px] p-0 ">
        <DialogTitle className="font-gilroySemiBold px-5 pt-3 text-black text-sm  ">
          Test Workflow
        </DialogTitle>
        <DialogDescription className="sr-only ">
          Test workflow
        </DialogDescription>
        {/* {JSON.stringify(workflowData)} */}
        <div className="h-[1px] w-full bg-gray-300 "></div>
        <Stepper
          value={currentStep}
          onValueChange={setCurrentStep}
          orientation="vertical"
          className="px-5 overflow-y-auto min-h-0 h-fit max-h-[11rem]"
        >
          {workflowData?.results?.map((step, i) => {
            const isCompleted = completedSteps.includes(i) || i < currentStep;
            const isFailed = failedStepIndex === i;
            const isLoading = loadingStepIndex === i;

            return (
              <div
                className="flex gap-2.5 justify-start"
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                key={step.nodeId}
              >
                <StepperItem
                  key={i}
                  step={i}
                  id={i}
                  loading={isLoading}
                  completed={isCompleted || isFailed}
                  executable={step.executable}
                  className="[&:not(:last-child)]:flex-1/2 h-fit w-fit flex gap-1"
                >
                  <StepperTrigger asChild>
                    <StepperIndicator asChild>
                      <span className="transition-all group-data-[loading=true]/step:scale-50 group-data-[state=completed]/step:scale-50 group-data-[loading=true]/step:opacity-0 group-data-[state=completed]/step:opacity-0">
                        {/* {step.name} */}
                      </span>
                      {loadingStepIndex !== i ? (
                        step.executable ? (
                          <Check
                            className="absolute scale-50 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          <XIcon
                            className="absolute scale-0 opacity-0 text-white transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 group-data-[state=active]/step:scale-100 group-data-[state=active]/step:opacity-100"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        )
                      ) : (
                        <span className="absolute scale-50 opacity-0 transition-all group-data-[loading=true]/step:scale-100 group-data-[loading=true]/step:opacity-100">
                          <LoaderCircle
                            className="animate-spin text-gray-400"
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </StepperIndicator>
                  </StepperTrigger>
                  {i < workflowData?.results.length - 1 && (
                    <StepperSeparator executable={step?.executable} />
                  )}
                </StepperItem>
                <div className="flex flex-col text-xs mt-1">
                  <p>
                    {(() => {
                      try {
                        if (step?.description?.includes('"service"')) {
                          const parsed = JSON.parse(step?.description);
                          return parsed.service || JSON.stringify(parsed); // Adjust key as needed
                        }
                        return step?.description || step?.appName;
                      } catch (err) {
                        console.error(
                          "Invalid JSON in step.description:",
                          step?.description
                        );
                        return step?.description || step?.appName;
                      }
                    })()}
                  </p>

                  {!step?.executable && (
                    <p>
                      {(isFailed || (isCompleted && !step.executable)) && (
                        <span className="text-xs text-red-500 font-gilroyMedium">
                          {step?.reason}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* <div className="flex flex-col text-xs mt-1">
                  <p>
                    {(() => {
                      if (
                        typeof step?.description === "string" &&
                        step?.description?.includes('"service"')
                      ) {
                        const parsed = JSON.parse(step?.description);
                        return parsed?.service || step?.appName || null;
                        
                      }

                      return step?.description || step?.appName || null;
                    })()}
                  </p>
                </div> */}
              </div>
            );
          })}
        </Stepper>

        <DialogFooter>
          <div className="flex w-full gap-2 p-5 pt-0 mt-3">
            <DialogClose className="flex gap-3 w-full">
              <Button
                onClick={handlePublish}
                className={`w-full rounded-[5px] flex-1 ${
                  allStepsCompleted ||
                  status === "success" ||
                  workflowData?.status === "complete"
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={
                  allStepsCompleted ||
                  status === "success" ||
                  workflowData?.status === "complete"
                }
                variant="outlineTwo"
              >
                Close
              </Button>
              <Button
                onClick={handlePublish}
                className={`w-full rounded-[5px] flex-1 ${
                  !allStepsCompleted || workflowData?.status === "partial"
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={
                  !allStepsCompleted || workflowData?.status === "partial"
                }
                variant="primary"
              >
                Use it Now
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
