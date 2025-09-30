"use client";

import { GetAvatar } from "@/components/get-avatar";
import TeamsNoMemberIcon from "@/icons/TeamsNoMemberIcon";
import Link from "next/link";

const MemberIcon = ({
  src,
  isPlaceholder,
}: {
  src?: string;
  isPlaceholder: boolean;
}) => (
  <div
    className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
      isPlaceholder ? "bg-gray-200 text-gray-500" : ""
    }`}
  >
    {isPlaceholder ? (
      <TeamsNoMemberIcon className="w-4 h-4" />
    ) : (
      <img
        src={src}
        alt="Member"
        className="rounded-full w-full h-full object-cover"
      />
    )}
  </div>
);

interface TeamCardProps {
  title?: string;
  description?: string;
  image?: string;
  employees_count?: number;
  team_code?: string;
  _id?: string;
  active_manager?: { _id: string; first_name: string; image?: string }[];
  active_employees?: { _id: string; first_name: string; image?: string }[];
  buttons?: React.ReactNode;
}

export const TeamCard = ({
  title,
  description,
  image,
  employees_count,
  _id,
  active_manager,
  active_employees,
  buttons,
  team_code,
}: TeamCardProps) => {
  const renderMembers = () => {
    const members = active_employees || [];
    const maxMembersToShow = 3;

    return Array.from({ length: maxMembersToShow }, (_, index) => {
      const member = members[index];
      if (member) {
        return <GetAvatar name={member.first_name} size={28} />;
      } else {
        return <MemberIcon key={`placeholder-${index}`} isPlaceholder={true} />;
      }
    }).reverse();
  };

  return (
    <div
      className="border border-[rgba(171,171,171,0.19)] hover:border-[#B3B3B3] bg-[#FCFCFC] backdrop-blur-[14.1px]
 relative rounded-lg w-[calc(33%-16px)] 2xl:w-[calc(25%-16px)]  p-4 flex flex-col transition-all "
    >
      <Link
        href={`/teams/${_id}`}
        className="flex flex-col gap-5 cursor-pointer"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GetAvatar name={title ?? ""} />

            <div className="-mt-1 flex-col flex">
              <h1 className="text-base  font-gilroySemiBold">
                {active_manager?.[0]?.first_name || "No Manager"}
              </h1>
              <p className="text-sm font-gilroyMedium text-[#7C7C7C] -mt-1">
                Manager
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <div className="flex  flex-col flex-wrap ">
            <p className="font-gilroySemiBold text-base line-clamp-2">
              {title ?? "-"}
            </p>
            <p className="font-gilroySemiBold text-xs text-[#7C7C7C] line-clamp-2">
              ({team_code ?? "-"})
            </p>
          </div>
        </div>

        {/* Members Section */}
        <div className="flex -mt-3 items-center justify-between">
          <h1 className="text-sm font-gilroyMedium ">
            {employees_count === 0
              ? "No Members Yet"
              : `${employees_count} Active Members`}
          </h1>
          <div className="flex -space-x-5 items-center">{renderMembers()}</div>
        </div>
      </Link>

      {/* Buttons Section */}
      {buttons && (
        <div className="absolute flex-col flex gap-2 right-5">{buttons}</div>
      )}
    </div>
  );
};
