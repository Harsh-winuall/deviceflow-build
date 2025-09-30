import { cn } from "@/lib/utils";

export const MeetAIAgents = () => {
  return (
    <section className="h-[55vh] lg:h-[65vh] w-full flex items-center justify-start bg-[#101010] relative select-none">
      <div className="flex flex-col items-center w-full gap-y-10 h-[80%]">
        <div className="flex flex-col w-full gap-y-4 items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-6xl font-gilroyBold text-white">
            <span className="text-white/50">Meet </span>AI Agents
          </h1>
          <p className="text-white/50 font-gilroyMedium w-[80%] lg:w-[48%] text-center text-sm sm:text-base lg:text-lg ">
            Deviceflow&apos;s AI agents automate onboarding, offboarding, and
            routine IT
            <br className="hidden lg:block" />
            tasks — simplifying workflows and boosting efficiency.
          </p>
        </div>

        <div className="rounded-full w-[70%] lg:w-[35%] p-1.5 lg:p-2 z-10 flex items-center gap-x-1 border-[#60606080] border">
          <div className="bg-[#101010] text-[#787878]/5 h-9 sm:h-10 lg:h-14 w-full flex items-center font-gilroyMedium   p-2 lg:p-3 pl-3 lg:pl-4 rounded-full text-sm">
            <ShinyText
              text="How may I help you?"
              speed={2}
              className="text-sm "
            />
          </div>
          <img
            src="/media/ai-agents.png"
            alt="AI agents"
            className="object-contain size-9 lg:size-14 animate-slowspin"
          />
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute -z-0 top-[40%] left-[10%] h-[40%] w-[80%] rounded-full bg-[#392653B2] opacity-100 blur-3xl",
          "lg:left-[20%] lg:top-[30%] lg:w-[55%] lg:h-[44%]"
        )}
      />

      <div className="w-full absolute -bottom-2 lg:-bottom-14 xl:-bottom-[14%] flex items-center justify-center">
        <h1 className="text-6xl sm:text-[8rem] lg:text-[12rem] font-gilroyBold text-white/30 opacity-30 animate-pulse select-none">
          Coming Soon
        </h1>
      </div>
    </section>
  );
};

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className,
}: ShinyTextProps) {
  return (
    <div
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-gradient-to-r from-[#787878]/40 to-[#787878]/40", // darkened base
        "animate-shine",
        className
      )}
      style={
        {
          backgroundImage: `linear-gradient(120deg, 
            rgba(120, 120, 120, 1) 35%,       
            rgba(255, 255, 255, 0.9) 50%,     
            rgba(120, 120, 120, 1) 65%        
          )`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          animationDuration: `${speed}s`,
        } as React.CSSProperties
      }
    >
      {text}
    </div>
  );
}
