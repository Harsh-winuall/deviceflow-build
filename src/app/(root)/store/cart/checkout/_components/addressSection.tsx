"use client";
import { toast } from "sonner";
import { Address } from "@/server/addressActions";
import { updateCartAddress } from "@/server/cartActions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AddressSectionProps {
  allAddresses: Address[];
}

const AddressSection = ({ allAddresses }: AddressSectionProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState(
    allAddresses?.length > 0 ? allAddresses?.[0]._id : ""
  );
  const router = useRouter();

  const handleAddressChange = async (addressId: string) => {
    try {
      const updateResponse = await updateCartAddress(addressId);
      router.refresh();
    } catch (error) {
      toast.error("Failed to change address");
    }
  };

  return (
    <div className="bg-white mt-10 h-full">
      <div className="h-full min-h-[40vh] w-full overflow-y-auto">
        {allAddresses?.length > 0 ? (
          allAddresses?.map((address: Address, i: number) => (
            <div className="flex flex-col" key={address?._id}>
              <div className="flex items-start group">
                <div className="flex items-start w-full">
                  <input
                    type="radio"
                    id={`address-cart-${i}`}
                    name="address"
                    value={address?._id}
                    checked={selectedAddressId === address?._id}
                    onChange={() => {
                      setSelectedAddressId(address?._id);
                      handleAddressChange(address?._id ?? "");
                      router.refresh();
                    }}
                    className="mr-3 accent-black size-5 mt-1"
                  />

                  <label
                    htmlFor={`address-cart-${i}`}
                    className="flex flex-col w-full cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-2 items-center">
                        <div className="font-gilroySemiBold text-xl text-[#17183B]">
                          {address?.title}
                        </div>

                        {address?.isPrimary && (
                          <div className="rounded-sm ring-1 ring-[#027A48] py-0.5 px-1 text-xs text-[#027A48] font-gilroySemiBold">
                            Primary
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="font-gilroyMedium text-base text-[#17183B] mt-2">
                      {`${address?.address}, ${address?.landmark}, ${address?.city}, ${address?.state}, ${address?.pinCode}`}
                    </div>

                    <div className="font-gilroyMedium text-base text-[#17183B] mt-2">
                      <span>Contact</span> -{" "}
                      <span className="font-gilroySemiBold">
                        {address?.phone ?? ""}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {i < allAddresses?.length - 1 && allAddresses?.length > 1 && (
                <div className="h-[1px] bg-[#D1D1D8] w-full my-[27px]"></div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col w-full h-[30vh] gap-y-8 items-center justify-center ">
            <span className="text-2xl font-gilroyMedium">
              No addresses found :(
            </span>
          </div>
        )}
      </div>

      {allAddresses?.length > 0 ? (
        <>
          <div className="h-[1px] bg-[#D1D1D8] w-full mt-8 mb-5"></div>
        </>
      ) : null}
    </div>
  );
};

export default AddressSection;
