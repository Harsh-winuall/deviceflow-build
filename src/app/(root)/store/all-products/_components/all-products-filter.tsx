"use client";

import { SetStateAction, useEffect, useState } from "react";
import { MoveLeft } from "lucide-react";
import { BackBtn } from "../../cart/checkout/_components/back-btn";
import { StoreDevice } from "@/server/deviceActions";
import { searchStoreDevices } from "@/server/storeActions";
import { useAlert } from "@/hooks/useAlert";
import { FilterDropdown } from "../../_components/filter-dropdown";

export default function AllProductsFilter({
  setData,
  setFilterData,
}: {
  setData: React.Dispatch<SetStateAction<StoreDevice[]>>;
  setFilterData: React.Dispatch<SetStateAction<{ ram: string; storage: string; os: string; brand: string; searchTerm:string; }>>;
}) {
  const { showAlert } = useAlert();
  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[][]>([]);

  const updateFilters = () => {
    const newFilters: string[][] = [];

    if (selectedRam) newFilters.push(["ram", "Like", selectedRam]);
    if (selectedStorage) newFilters.push(["storage", "Like", selectedStorage]);
    if (selectedOS) newFilters.push(["os", "Like", selectedOS]);
    if (selectedBrand) newFilters.push(["brand", "Like", selectedBrand]);

    setFilters(newFilters);
  };

  useEffect(() => {
    updateFilters();
  }, [selectedRam, selectedStorage, selectedOS, selectedBrand]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await searchStoreDevices({ filters });
        setData(res);
      } catch (error) {
        showAlert({
          isFailure: true,
          description: "Device not found",
          title: "Failed to fetch data",
          key: "store-filters-api",
        });
      }
    };
    fetch();
  }, [filters]);

  const clearAllFilters = () => {
    setSelectedRam(null);
    setSelectedStorage(null);
    setSelectedOS(null);
    setSelectedBrand(null);
    setFilters([]); // Clear all filters
    setFilterData({ ram: "", storage: "", os: "", brand: "",searchTerm:"" }); 
  };

  return (
    <div className="flex items-center justify-between py-2 px-6 w-full bg-[#F4F4F4] rounded-2xl">
      <div className="flex flex-wrap gap-4   items-center justify-start ">
        <BackBtn className="pr-3">
          <MoveLeft className="size-5 cursor-pointer" />
        </BackBtn>
        <h1 className="font-gilroyMedium text-base tracking-wide">Filters:</h1>
        <div className="flex gap-2.5">
          <FilterDropdown
            label="RAM"
            options={[
              { value: "4GB", label: "4GB" },
              { value: "6GB", label: "6GB" },
              { value: "8GB", label: "8GB" },
              { value: "16GB", label: "16GB" },
            ]}
            selectedValue={selectedRam}
            onChange={(value)=>{
              setSelectedRam(value);
              setFilterData((prev) => ({ ...prev, ram: value }));
            }}
          />

          <FilterDropdown
            label="Storage"
            options={[
              { value: "128GB", label: "128GB" },
              { value: "256GB", label: "256GB" },
              { value: "512GB", label: "512GB" },
              { value: "1TB", label: "1TB" },
            ]}
            selectedValue={selectedStorage}
            onChange={(value)=>{
              setSelectedStorage(value);
              setFilterData((prev) => ({ ...prev, storage: value }));
            }}
          />

          <FilterDropdown
            label="OS"
            options={[
              { value: "windows", label: "Windows" },
              { value: "mac", label: "Mac" },
              { value: "linux", label: "Linux" },
            ]}
            selectedValue={selectedOS}
            onChange={(value)=>{
              setSelectedOS(value);
              setFilterData((prev) => ({ ...prev, os: value }));
            }}
          />

          <FilterDropdown
            label="Brand"
            options={[
              { value: "apple", label: "Apple" },
              { value: "dell", label: "Dell" },
              { value: "lenovo", label: "Lenovo" },
              { value: "acer", label: "Acer" },
            ]}
            selectedValue={selectedBrand}
            onChange={(value)=>{
              setSelectedBrand(value);
              setFilterData((prev) => ({ ...prev, brand: value }));
            }}
          />
        </div>
      </div>
      {filters.length > 0 && (
        <span
          className="font-gilroyMedium text-sm tracking-wide flex items-center cursor-pointer text-black"
          onClick={clearAllFilters}
        >
          Clear All
        </span>
      )}
    </div>
  );
}
