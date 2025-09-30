"use client";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const StoreGlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [term, setTerm] = useState(searchParams.get("q") || ""); // Initialize with query param if available

  // Update URL when `term` changes
  useEffect(() => {
    const query = term ? `?q=${encodeURIComponent(term)}` : "";
    if (pathname.startsWith("/store/all-products")) {
      router.replace(`/store/all-products${query}`);
    }
  }, [term, router]);

  return (
    <div
      className={cn(
        "flex items-center py-1 gap-1 pl-1.5 pr-0.5 text-black hover:ring-[1px] rounded-full hover:text-black hover:ring-black transition-all duration-300 cursor-pointer",
        isFocused && "w-full max-w-xs ring-[1px] ring-black"
      )}
      onClick={() => setIsFocused(true)}
    >
      <Search className="size-[1.35rem] mb-0.5" />
      <input
        className={cn(
          "flex-grow duration-300 -mt-0.5 ease-in-out bg-transparent placeholder:text-[#7F7F7F] text-sm font-gilroyMedium whitespace-nowrap outline-none focus:outline-none",
          isFocused ? "input-transition" : "w-0"
        )}
        value={term}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTerm(e.target.value)
        }
        autoFocus={isFocused}
        placeholder="Search"
      />
    </div>
  );
};
