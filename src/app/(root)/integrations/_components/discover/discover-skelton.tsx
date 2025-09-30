import React from "react";

export const DiscoverSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 w-full animate-pulse">
      {/* Skeleton for TotalSpends */}
      <div className="bg-gray-300 h-8 w-1/3 rounded"></div>

      <section className="flex justify-between">
        {/* Skeleton for CategoriesFilter (left side) */}
        <div className="rounded-2xl p-4 max-w-[14rem] w-full h-fit bg-gray-300 flex flex-col items-start gap-3">
          <div className="bg-gray-400 h-5 w-24 mb-2 rounded"></div>
          <div className="w-full flex flex-col items-center gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="w-full flex justify-start gap-3 p-2 px-4 rounded-xl bg-gray-400 h-6"
              />
            ))}
          </div>
        </div>

        {/* Skeleton for IntegrationCompaniesSecx and other right side components */}
        <div className="flex flex-col gap-6 py-4 pl-8 ml-5 flex-1">
          {/* Header for current category */}
          <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
          {/* Skeleton list for IntegrationCompaniesSecx */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-gray-300 h-32 rounded" />
            ))}
          </div>
          {/* Skeleton for the banner card and request integration card */}
          <div className="flex justify-between gap-4">
            <div className="max-w-[59.5%] h-32 w-full bg-gray-300 rounded" />
            <div className="w-32 h-32 bg-gray-300 rounded" />
          </div>
          {/* Additional skeletons for Newly Added and Popular sections */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-gray-300 h-32 rounded" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
