"use client";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/icons";
import { Address, createAddress, updateAddress } from "@/server/addressActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner, { spinnerVariants } from "@/components/Spinner";
import { PrimarySelector } from "./primary-selector";
import { FormField } from "./form-field";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

export const AddressForm = ({
  closeBtn,
  isEditForm,
  _id,
  title = "",
  phone = "",
  address = "",
  city = "",
  state = "",
  pinCode = "",
  landmark = "",
  isPrimary = false,
  totalAddresses,
}: {
  closeBtn: (value: boolean) => void;
  isEditForm?: boolean;
  _id?: string;
  title?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
  isPrimary?: boolean;
  totalAddresses: Address[] | undefined;
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title,
    phone,
    address,
    city,
    state,
    pinCode,
    landmark,
    isPrimary,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateAddressForm = (formData: {
    title: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!formData?.title) errors.title = "Title is required";
    if (!formData?.phone) errors.phone = "Phone number is required";
    if (!formData?.address) errors.address = "Address is required";
    if (!formData?.city) errors.city = "City is required";
    if (!formData?.state) errors.state = "State is required";
    if (!formData?.pinCode) errors.pinCode = "Pin code is required";

    return errors;
  };

  const hasPrimaryAddress = (addresses: Address[]): boolean => {
    return addresses?.some((address) => address?.isPrimary) || false;
  };

  const handleSubmit = async () => {
    const newErrors = validateAddressForm(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    if (isEditForm) {
      try {
        await updateAddress(_id!, formData);
        toast.success("Address updated successfully !");
        router.refresh();
        closeBtn(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to update address  !");
      }
    } else {
      try {
        if (hasPrimaryAddress(totalAddresses!)) {
          await createAddress({ ...formData, isPrimary: false });
        } else {
          await createAddress(formData);
        }
        toast.success("Added new address !!");
        router.refresh();
        closeBtn(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to create address  !");
      }
    }
  };

  return (
    <div className="flex flex-col w-[100%] gap-6">
      <div className="flex items-center gap-4">
        <Icons.teamMemberIcon className="size-9 border  bg-black rounded-full" />
        <h1 className="text-xl font-gilroySemiBold">
          {isEditForm ? "Edit Address" : "Add New Address"}
        </h1>
      </div>
      <div className="h-[1px] bg-[#E7E7E7] w-full "></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex relative flex-col gap-8"
      >
        {/* Primary/Secondary Selection */}
        {!totalAddresses?.some((address) => address?.isPrimary) && (
          <PrimarySelector
            isPrimary={formData?.isPrimary}
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, isPrimary: value }))
            }
          />
        )}

        {/* Form Fields */}
        <FormField
          label="Address Title"
          id="title"
          value={formData?.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          type="text"
          error={errors?.title}
          placeholder="eg: Home, Office"
        />

        <FormField
          label="Phone Number"
          id="phone"
          type="text"
          value={formData?.phone}
          onChange={(e) => {
            if (/^\d{0,10}$/.test(e.target.value))
              setFormData((prev) => ({ ...prev, phone: e.target.value }));
          }}
          maxLength={10}
          error={errors?.phone}
          placeholder="eg: 1234567890"
        />

        <FormField
          label="Address"
          id="address"
          value={formData?.address}
          className="h-24"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          type="text"
          error={errors?.address}
          placeholder=""
        />

        <div className="flex gap-3">
          <FormField
            label="City"
            id="city"
            value={formData?.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            type="text"
            error={errors?.city}
            placeholder="eg: New York"
          />

          <FormField
            label="State"
            id="state"
            value={formData?.state}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, state: e.target.value }))
            }
            type="text"
            error={errors?.state}
            placeholder="eg: NY"
          />
        </div>

        <FormField
          label="Pin Code"
          id="pinCode"
          value={formData?.pinCode}
          maxLength={6}
          onChange={(e) => {
            if (/^\d{0,6}$/.test(e.target.value))
              setFormData((prev) => ({ ...prev, pinCode: e.target.value }));
          }}
          error={errors?.pinCode}
          placeholder="eg: 10001"
        />

        {/* Submit and Cancel Buttons */}
        <div className="flex  space-x-3 w-full pt-16 justify-between items-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-full w-1/2"
            onClick={() => closeBtn(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full border w-1/2 bg-primary text-primary-foreground"
          >
            {loading ? (
              <Spinner className={spinnerVariants({ size: "sm" })} />
            ) : (
              <>
                {isEditForm ? "Edit Address" : "Submit"}
                <ChevronRight className="size-6" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
