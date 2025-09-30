"use client";
import Spinner from "@/components/Spinner";
import { requestLaptop } from "@/server/storeActions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const NoProducts = ({filterData, searchQuery}:{filterData:{ram:string; storage: string; os: string; brand:string; searchTerm:string;}, searchQuery:string;}) => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const router = useRouter();
  
  const handleRequestLaptop = async () => {
    setLoading(true);
    try {
      const response = await requestLaptop({...filterData, searchTerm:searchQuery});
      if (response.ok) {
        setRequested(true);
      } else {
        console.error("Failed to request laptop");
      }
    } catch (error) {
      console.error("Error while requesting laptop:", error);
      setRequested(true);
    } finally {
      setLoading(false);
    }
    setLoading(false);
    setRequested(true);
  };

  return (
    <div className="flex items-center justify-center h-[calc(60vh-4rem)] -mb-7 z-[300]">
      <div className="w-[560px] p-8 text-center">
        <h1 className="text-4xl font-gilroySemiBold mb-4 text-[#909090]">
          {requested ? "Requested" : "No devices found"}
        </h1>
        <p className="text-[#909090] mb-8 text-xl font-gilroySemiBold">
          {requested ? (
            <>
              Our customer support will contact you soon!
              <br />
              For further info, contact{" "}
              <span className="text-black">support@deviceflow.ai</span>
            </>
          ) : (
            <>
              There are no devices available for this query. <br />
              <span className="text-black">Don’t worry!</span> You can request
              this configuration.
            </>
          )}
        </p>
        <button
          className="bg-black text-white py-2.5 px-6 rounded-[4px] text-base font-gilroySemiBold cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (!loading && !requested) {
              handleRequestLaptop();
            }
            else{
              router.replace('/store/all-products');
            }
          }}
          disabled={loading || requested} // Disable button when loading or already requested
        >
          {loading ? <Spinner /> : requested ? "Done" : "Request Laptop"}
        </button>
      </div>
    </div>
  );
};

export default NoProducts;
