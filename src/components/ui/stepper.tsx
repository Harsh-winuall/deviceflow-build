"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, LoaderCircle, XIcon } from "lucide-react";
import * as React from "react";
import { createContext, useContext } from "react";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
  executable?: boolean | null;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      defaultValue = 0,
      value,
      onValueChange,
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) {
          setInternalStep(step);
        }
        onValueChange?.(step);
      },
      [value, onValueChange]
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "Stepper";

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
  executable?: boolean | null;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    {
      step,
      completed = false,
      disabled = false,
      loading = false,
      executable = null,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep
        ? "completed"
        : activeStep === step
        ? "active"
        : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider
        value={{ step, state, isDisabled: disabled, isLoading, executable }}
      >
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
            className
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": true } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  }
);
StepperItem.displayName = "StepperItem";

// StepperTrigger
interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    if (asChild) {
      return <div className={className}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
StepperTrigger.displayName = "StepperTrigger";

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  StepperIndicatorProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const { state, step, isLoading, executable } = useStepItem();

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all",
        // Default and inactive
        "data-[state=inactive]:bg-[#E5E5E5]",
        // Override bg on loading manually (via `data-loading`)
        "group-data-[loading=true]/step:bg-[#E5E5E5]",

        // Completed or active: green or red depending on executable
        executable === false
          ? "data-[state=completed]:bg-red-600 data-[state=active]:bg-red-600"
          : "data-[state=completed]:bg-[#0C941C] data-[state=active]:bg-[#0C941C]",

        // White icon/text for completed/active
        "data-[state=completed]:text-white",
        "data-[state=active]:text-white",
        className
      )}
      data-state={state}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className="transition-all group-data-[loading=true]/step:scale-0 group-data-[state=completed]/step:scale-0 group-data-[state=active]/step:scale-0 group-data-[loading=true]/step:opacity-0 group-data-[state=completed]/step:opacity-0 group-data-[state=active]/step:opacity-0 group-data-[loading=true]/step:transition-none">
            {step + 1}
          </span>
          {(state === "completed" || state === "active") && executable && (
            <CheckIcon
              className="absolute scale-0 opacity-0 text-white transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 group-data-[state=active]/step:scale-100 group-data-[state=active]/step:opacity-100"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
          {(state === "completed" || state === "active") &&
            executable === false &&
            !isLoading && (
              <XIcon
                className="absolute scale-0 opacity-0 text-white transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 group-data-[state=active]/step:scale-100 group-data-[state=active]/step:opacity-100"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          {isLoading && (
            <span className="absolute transition-all">
              <LoaderCircle
                className="animate-spin"
                size={14}
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
          )}
        </>
      )}
    </div>
  );
});
StepperIndicator.displayName = "StepperIndicator";

// StepperTitle
const StepperTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
StepperTitle.displayName = "StepperTitle";

// StepperDescription
const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
StepperDescription.displayName = "StepperDescription";

// StepperSeparator
interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  executable?: boolean | null;
}

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  StepperSeparatorProps
>(({ className, executable, ...props }, ref) => {
  const { isLoading } = useStepItem();

  return (
    <div
      ref={ref}
      className={cn(
        "m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=vertical]/stepper:h-1 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:flex-none transition-all",

        // Base inactive color
        "group-data-[state=inactive]/step:bg-[#E5E5E5]",

        // ✅ Override with light gray while loading
        isLoading && "group-data-[loading=true]/step:bg-[#E5E5E5]",

        // Completed/Active color logic
        executable === false
          ? "group-data-[state=completed]/step:bg-red-600 group-data-[state=active]/step:bg-red-600"
          : "group-data-[state=completed]/step:bg-[#0C941C] group-data-[state=active]/step:bg-[#0C941C]",

        className
      )}
      {...props}
    />
  );
});

StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
