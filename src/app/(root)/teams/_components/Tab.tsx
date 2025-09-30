import { cn } from "@/lib/utils";

interface TabProps {
  active: boolean;
  onClick: () => void;
  id?: string;
  label: string;
  triangleBackgroundColor?: string; // Background color for ::before
  triangleBorderTopColor?: string; // Border-top color for ::after
  className?: string; // Optional width for the line
}

export function Tab({
  active,
  onClick,
  label,
  className,
  id,
  triangleBackgroundColor = "#f2f6d6",
  triangleBorderTopColor = "#f2f6d6",
}: TabProps) {
  return (
    <div
      id={id}
      className={`relative flex justify-center items-center pl-8 cursor-pointer transition-all duration-300 ${
        active
          ? "text-black dark:text-white"
          : "text-[#7F7F7F] dark:text-gray-400"
      }`}
      onClick={onClick}
    >
      <span
        className={cn(
          "relative 2xl:text-lg text-base font-gilroyMedium after:content-[''] after:absolute after:top-[100%] after:left-[-30%] after:w-[160%] after:h-[2px] after:transition-all after:duration-300 ",
          active
            ? "after:bg-black dark:after:bg-white after:scale-x-100"
            : "after:bg-gray-300 dark:after:bg-gray-600 after:scale-x-0",
          className
        )}
      >
        {label}
      </span>
      {active && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="triangle"
          style={{
            "--triangle-bg-color": triangleBackgroundColor,
            "--triangle-border-top-color": triangleBorderTopColor,
          }}
        ></div>
      )}
    </div>
  );
}
