"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onFirst?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

const Dropdown = ({
  title,
  children,
  onFirst = false,
  icon,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(onFirst);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={` rounded-lg overflow-hidden ${className}`}>
      <div
        className={`flex justify-between items-center px-3 py-3 cursor-pointer bg-[#F6F6F6] transition-colors rounded-lg ${headerClassName}`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <h3 className="font-gilroyMedium text-sm text-black leading-[18.952px]">
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#BFBFBF]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#BFBFBF]" />
        )}
      </div>

      <div
        className={`transition-all duration-300 linear overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className={`mt-3 bg-white ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
};

export default Dropdown;
