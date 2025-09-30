import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export const StoreBannerCardBig = () => {
  return (
    <div className="w-full h-full relative flex bg-white backdrop-blur-[22.8px] border border-[#c0c0c099] rounded-2xl px-6 py-4 flex-col">
      <span className="text-[10px] font-gilroyMedium text-[#B1B1B1] border border-[#B2B2B2] w-fit px-3 py-0.5 mb-1 rounded-full">
        Store
      </span>
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="font-gilroyMedium text-2xl xl:text-3xl w-[70%]">
            Highest Quality Refurbished & New Devices
          </h1>

          <Link
            href="https://edify.club"
            target="_blank"
            className="flex absolute top-6 right-4 cursor-pointer w-fit justify-center font-gilroyMedium items-center bg-black text-white rounded-full text-base gap-1 py-1 px-4"
          >
            Visit <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
          </Link>
        </div>
        <div className="flex gap-4">
          <span className="text-[12px] font-gilroyMedium text-black border border-black w-fit px-3 py-0.5 2xl:px-3.5 2xl:py-1 mb-1 rounded-full">
            Laptops{" "}
          </span>
          <span className="text-[12px] font-gilroyMedium text-black border border-black w-fit px-3 py-0.5 2xl:px-3.5 2xl:py-1 mb-1 rounded-full">
            Accessories{" "}
          </span>
        </div>
      </div>
      <div className="absolute right-0 bottom-0">
        <img
          src="/media/store-item/store-banner-img.webp"
          alt="Store Banner "
          className="object-contain w-48 2xl:w-60 min-h-min bottom-0 overflow-hidden rounded-br-2xl"
        />
      </div>
    </div>
  );
};
