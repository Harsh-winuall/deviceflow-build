import { cn } from "@/lib/utils";
import { User02Icon, User03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "lucide-react";

export const MemberIcon = ({
  src,
  isPlaceholder,
  className,
}: {
  src?: string;
  isPlaceholder: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "size-9 rounded-full border-2 border-white flex items-center justify-center",
      isPlaceholder ? "bg-gray-200 text-gray-500" : "",
      className
    )}
  >
    {isPlaceholder ? (
      "-uyfguhijtrfyg"
    ) : // <Icons.team_no_memeber_logo className="size-40" />
    src ? (
      <img
        src={src}
        alt="Member"
        className="rounded-full w-full h-full object-cover"
      />
    ) : (
      <HugeiconsIcon icon={User02Icon} />
      // <UserIcon />
    )}
  </div>
);
