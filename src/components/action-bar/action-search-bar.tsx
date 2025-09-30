import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const ActionSearchBar = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <div className="flex items-center border border-[#DEDEDE] rounded-[5px] p-2 h-full">
      <div className="flex gap-2 justify-center items-center h-full">
        <HugeiconsIcon
          icon={Search01Icon}
          className="size-[1.16rem] font-gilroySemiBold"
        />
        <input
          {...props}
          type="text"
          className={`flex-grow placeholder:text-[#CCCCCC] h-[19px] bg-transparent outline-none text-black placeholder-black font-gilroyMedium placeholder:text-[15px] transition-all duration-1000 `}
        />
      </div>
    </div>
  );
};
