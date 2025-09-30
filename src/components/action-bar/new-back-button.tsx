"use client";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import React from "react";
import { LeftIcon } from "./icons";

export const NewBackButton = () => {
  const router = useRouter();
  return (
    <div
      className="rounded-[5px] cursor-pointer border border-[#E5E5E5] py-[8.5px] hover:border-black p-2"
      onClick={() => router.back()}
    >
      <LeftIcon className="size-4" />
      <span className="sr-only">Back Button</span>
    </div>
  );
};
