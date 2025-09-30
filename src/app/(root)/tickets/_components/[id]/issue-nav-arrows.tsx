"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface UserNavArrowsProps {
  prevTicketId: string | null;
  nextTicketId: string | null;
}

const IssueNavArrows: React.FC<UserNavArrowsProps> = ({
  prevTicketId,
  nextTicketId,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePrev = () => {
    if (prevTicketId) {
      startTransition(() => {
        router.push(`/tickets/${prevTicketId}`);
      });
    }
  };

  const handleNext = () => {
    if (nextTicketId) {
      startTransition(() => {
        router.push(`/tickets/${nextTicketId}`);
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
        title={prevTicketId ? "Previous Ticket" : "No previous Ticket"}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="text-[#6C6C6C] size-5"
        />
      </div>
      <div
        className={`rounded-md border border-[rgba(0,0,0,0.2)] hover:border-black size-8 flex justify-center items-center cursor-pointer ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={handleNext}
        title={nextTicketId ? "Next Ticket" : "No next Ticket"}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="text-[#6C6C6C] size-5"
        />
      </div>
    </>
  );
};

export default IssueNavArrows;
