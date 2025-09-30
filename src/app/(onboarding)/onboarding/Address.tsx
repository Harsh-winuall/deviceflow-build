"use client";
import { FormField } from "@/app/(root)/settings/_components/form-field";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { createAddress } from "@/server/addressActions";
import { useState } from "react";

export const Address = ({ steps }: any) => {
  const [formData, setFormData] = useState<{
    title: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    landmark: string;
    isPrimary: boolean;
  }>({
    title: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    isPrimary: false,
  });
  const [loading, setLoading] = useState(false);
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

    if (!formData.title) errors.title = "Title is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.pinCode) errors.pinCode = "Pin code is required";

    return errors;
  };

  const handleSubmit = async () => {
    const newErrors: any = validateAddressForm(formData);
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    try {
      await createAddress(formData);
      steps(3);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
      <div className=" w-full relative h-full justify-center items-center flex flex-col gap-6">
        <div className="w-full">
          <div className="text-center text-2xl font-gilroyBold leading-[normal] text-indigo-950">
            Add Address
          </div>
          <div className="text-center  font-gilroyMedium leading-[normal] text-zinc-400">
            Add your address
          </div>
        </div>

        <form
          className="flex flex-col gap-8 w-[75%]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
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
          {/* Form Fields */}
          <FormField
            label="Address"
            id="address"
            value={formData?.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            type="text"
            error={errors?.address}
            placeholder="eg: 123 Street, City"
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
          <div className="flex flex-col gap-1.5  w-full pt-2 justify-between items-center">
            <LoadingButton
              loading={loading}
              type="submit"
              variant="primary"
              className="w-full"
            >
              Submit
            </LoadingButton>
            <Button
              onClick={() => steps(3)}
              className="w-full"
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
