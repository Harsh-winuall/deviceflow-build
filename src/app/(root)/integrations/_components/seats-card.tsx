import { GetAvatar } from "@/components/get-avatar"; // adjust path if needed
import { cn } from "@/lib/utils";
import { IntegrationUsers } from "@/server/integrationActions";
import { User } from "@/server/userActions";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SeatsCardProps {
  type: "total" | "unmapped" | "unused";
  totalSeats?: number | string;
  onClick?: () => void;
  className?: string;
  data?: IntegrationUsers;
}

const SeatsCard = ({
  type,
  totalSeats,
  onClick,
  className,
  data,
}: SeatsCardProps) => {
  const renderMembers = () => {
    if (!data) return null;

    let usersToRender: User[] = [];

    switch (type) {
      case "total":
        usersToRender = data.allUsers;
        break;
      case "unmapped":
        usersToRender = data.missingIntegrationUsers;
        break;
      case "unused":
        // Adjust this depending on your backend data structure
        usersToRender = []; // Or whatever logic for "unused"
        break;
    }

    return usersToRender.slice(0, 3).map((user, index) => (
      <div
        key={index}
        className="size-6 rounded-full overflow-hidden border border-white bg-neutral-200"
      >
        {user?.image && user?.image?.length > 0 ? (
          <img
            src={user?.image}
            alt={user?.first_name ?? "User"}
            className="size-6 object-cover"
          />
        ) : (
          <GetAvatar
            name={user.first_name ?? user?.name ?? "Guest"}
            size={24}
          />
        )}
      </div>
    ));
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "max-w-52 w-full h-32 rounded-lg flex flex-col justify-between border p-3 cursor-pointer text-sm hover:border-black",
        className
      )}
    >
      <div className="space-y-3">
        <span className="font-gilroyMedium capitalize">{type} Seats</span>
        <div className="font-gilroyBold text-3xl">{totalSeats}</div>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex -space-x-2 justify-end -mb-8">
          {renderMembers()}
        </div>
        <div className="rounded-full bg-[#F6F6F6] size-5 flex justify-center items-center">
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 ml-0.5 stroke-black font-gilroySemiBold"/>
        </div>
      </div>
    </div>
  );
};

export default SeatsCard;
