import StoreBanner from "@/icons/StoreBanner";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const StoreBannerCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full h-fit relative flex  bg-white  backdrop-blur-[22.8px] border border-[#c0c0c099] rounded-lg px-6 py-4 flex-col",
        className
      )}
    >
      <h1 className="text-[10px] text-[#B1B1B1] border border-[#B2B2B2] w-fit px-3 py-0.5 mb-1 rounded-full">
        Store
      </h1>
      <div>
        <div>
          <h1 className="w-52 font-gilroyMedium text-xl">
            Top-Quality Refurbished & New Devices
          </h1>

          <Link
            href="https://edify.club/"
            target="_blank"
            className="flex absolute top-6 right-4 cursor-pointer w-fit justify-center font-gilroyMedium items-center bg-black text-white rounded-full text-base gap-1 py-0.5 px-3"
          >
            Visit <ChevronRight className="size-4" />
          </Link>
        </div>
        <h1 className="text-xs text-[#B1B1B1] w-52 font-gilroyMedium">
          <p>Affordable, reliable, and ready for work..</p>
        </h1>
      </div>
      <div className="absolute right-0 bottom-0">
        <StoreBanner />
      </div>
    </div>
  );
};
