import { Input } from "@/components/inputs/Input";
import { cn } from "@/lib/utils";

export const FormField = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  className,
  ...props
}: {
  label: string;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Correct type
  error?: string;
  placeholder: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="group relative w-full">
    <label
      htmlFor={id}
      className="absolute start-4 top-0 z-10 block -translate-y-1/2 bg-background px-1 text-sm font-gilroyMedium text-foreground"
    >
      {label}
    </label>
    <Input
      id={id}
      className={cn(
        error
          ? "border-destructive/80 focus-visible:border-destructive/80 focus-visible:ring-destructive/0 h-10"
          : "h-10 placeholder:text-gray-400 placeholder:text-sm pl-4 rounded-md border border-[#5F5F5F]",
        className
      )}
      value={value}
      onChange={onChange} // Fix: Re-enabled onChange
      placeholder={placeholder}
      {...props}
    />
    <p
      className={cn(
        "mt-0.5 text-xs text-start font-gilroyMedium text-destructive transition-all duration-300",
        {
          "opacity-100": error,
          "opacity-0": !error,
        }
      )}
    >
      {error || " "}
    </p>
  </div>
);
