"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/buttons/drop-down";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useState } from "react";

export const DownloadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuOptions = [
    "All assets",
    "Assigned Assets",
    "Unassigned Assets",
    "Deleted Assets",
  ];
  const [option, setOption] = useState("All assets");
  const handleClick = () => {
    setIsOpen(false);
  };
  const handleSelect = (v: string) => {
    setOption(v);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={() => setIsOpen(!isOpen)}>
          {" "}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-400 rounded-full hover:text-black hover:border-black transition-all duration-300",
              isOpen ? "text-black border-black" : ""
            )}
          >
            <Download size={16} />
            <span className="text-sm font-gilroyMedium">Download</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent visible={isOpen}>
          <div className="h-1 w-full" />
          {menuOptions.map((v, i) => (
            <>
              <DropdownMenuRadioItem
                onSelect={() => handleSelect(v)}
                selected={option === v}
                key={v}
              >
                {v}
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
            </>
          ))}
          <div
            className="flex py-2 justify-center items-center"
            onClick={handleClick}
          >
            <button className="rounded-full px-1.5 text-sm py-1 bg-primary text-white">
              Download
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
