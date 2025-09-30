"use client";
import React from "react";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

const SubscriptionSectionSkeleton = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Current Plan */}
      <div className="flex justify-between items-center">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-6 w-24 rounded-lg" />
      </div>

      {/* Plan Title and Pricing */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-5 w-5 rounded-full" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <SkeletonBox className="h-3 w-40" />
        <SkeletonBox className="h-3 w-24" />
      </div>

      {/* Plan Details */}
      <div className="flex flex-col gap-3 mt-8">
        <SkeletonBox className="h-4 w-28" />
        <div className="flex flex-col gap-2 w-[80%]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <SkeletonBox className="h-3 w-28" />
              <SkeletonBox className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Due Payment */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-6 w-20 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2 w-[80%]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <SkeletonBox className="h-3 w-28" />
              <SkeletonBox className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Billing Details */}
      <div className="flex flex-col gap-3 mt-8">
        <SkeletonBox className="h-4 w-32" />
        <div className="flex flex-col gap-2 w-[80%]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <SkeletonBox className="h-3 w-28" />
              <SkeletonBox className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-3 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <SkeletonBox key={i} className="h-6 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSectionSkeleton;
