import { Icons } from "@/components/icons";
import StoreProductIcons from "@/icons/StoreProductIcons";
import React, { useEffect, useRef, useState } from "react";

type FilterDropdownProps = {
  label: string;
  options: { value: string | number; label: string }[];
  selectedValue: string | null;
  onChange: (selected: string) => void;
};

export const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onChange,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    onChange(value); 
  };

  return (
    <div className="relative w-32 h-8" ref={dropdownRef}>
      <button
        className="w-full text-base font-gilroyMedium py-1 px-4 flex justify-center items-center gap-2.5 bg-white  rounded-md shadow-sm focus:outline-none relative"
        onClick={toggleDropdown}
      >
        <span className="font-gilroyMedium text-sm">{label}</span>
        <StoreProductIcons.arrow_down
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
        {selectedValue && (
          <div className="absolute top-0 right-0 rounded-full text-white size-3.5 bg-red-500 flex justify-center items-center">
            <span className="text-[10px] font-gilroyMedium">
              1
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
          <div className="p-2 ">
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={option.label}
                className="flex w-full h-fit items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="radio" // Changed to radio
                  id={option.label}
                  name={label} // Ensure only one option can be selected at a time
                  checked={selectedValue === option.value.toString()} // Compare to selectedValue
                  onChange={() => handleOptionClick(option.value.toString())}
                  className="size-4 text-black checked:text-black border-gray-300 rounded-md"
                />
                <span className="text-sm font-gilroyMedium w-full text-[#344054]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {/* <div className="flex justify-center px-3 pb-3 items-center w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-black w-full text-white text-sm font-gilroyMedium rounded-md  focus:outline-none "
            >
              Apply
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};
