"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserNavArrowsProps {
  prevUserId: string | null;
  nextUserId: string | null;
}

const UserNavArrows: React.FC<UserNavArrowsProps> = ({
  prevUserId,
  nextUserId,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePrev = () => {
    if (prevUserId) {
      startTransition(() => {
        router.push(`/people/${prevUserId}`);
      });
    }
  };

  const handleNext = () => {
    if (nextUserId) {
      startTransition(() => {
        router.push(`/people/${nextUserId}`);
      });
    }
  };

  return (
    <>
      <div
        className={`rounded-md border border-[rgba(0,0,0,0.2)] hover:border-black size-8 flex justify-center items-center cursor-pointer ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={handlePrev}
        title={prevUserId ? "Previous User" : "No previous user"}
      >
        <ChevronLeft className="text-[#6C6C6C] size-5" />
      </div>
      <div
        className={`rounded-md border border-[rgba(0,0,0,0.2)] hover:border-black size-8 flex justify-center items-center cursor-pointer ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={handleNext}
        title={nextUserId ? "Next User" : "No next user"}
      >
        <ChevronRight className="text-[#6C6C6C] size-5" />
      </div>
    </>
  );
};

export default UserNavArrows;
