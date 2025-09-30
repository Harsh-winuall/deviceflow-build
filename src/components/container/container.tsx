import { cn } from "@/lib/utils";

type ChildrenProps = { children: React.ReactNode; className?: string };

type CombinedContainerProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export const InnerContainer = ({ children, className }: ChildrenProps) => {
  return (
    <section
      className={cn(
        "flex rounded-md px-3 py-4 flex-col w-[97%] overflow-y-auto h-full min-h-[90vh] 2xl:mt-0 2xl:min-h-[70vh]",
        className
      )}
    >
      {children}
    </section>
  );
};

export const OuterContainer = ({ children }: ChildrenProps) => {
  return (
    <div className="flex hide-scrollbar flex-col w-full justify-center items-start min-h-[83vh] max-h-full 2xl:min-h-0 2xl:max-h-screen">
      {children}
    </div>
  );
};

export const CombinedContainer = ({
  children,
  className,
}: CombinedContainerProps) => {
  return (
    <OuterContainer>
      <InnerContainer className={className}>{children}</InnerContainer>
    </OuterContainer>
  );
};
