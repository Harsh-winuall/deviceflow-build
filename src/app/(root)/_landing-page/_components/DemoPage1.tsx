import React, { useState } from "react";
import { FormField } from "../../settings/_components/form-field";
import Spinner from "@/components/Spinner";

interface DemoProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Handles input change events
  errors: { name: string; cmpname: string; phone: string; email: string; teamSize: string ; }; // Errors object
  setErrors: React.Dispatch<
    React.SetStateAction<{
      name: string;
      cmpname: string;
      phone: string;
      email: string;
      teamSize: string;
    }>
  >; // Setter for errors state
  formData: { name: string; cmpname: string; phone: string; email: string; teamSize: string }; // Form data structure
  setStep: (step: number) => void; // Function to set the current step
  validateStep: () => boolean;
  handleSubmit: () => void;
  loading: boolean;
}

export const DemoPage1 = ({
  formData,
  loading,
  setErrors,
  errors,
  handleChange,
  setStep,
  validateStep,
  handleSubmit
}: DemoProps) => (
  <div>
    <div className="text-[#090914] text-3xl font-gilroyBold">
      Schedule a Demo
    </div>

    <div className="flex flex-col gap-9 mt-9 mb-6">
      <FormField
        label="Name"
        id="name"
        name="name"
        type="text"
        value={formData?.name}
        onChange={handleChange}
        placeholder="Enter your name"
        error={errors.name}
      />

      <FormField
        label="Company Name"
        id="cmpname"
        name="cmpname"
        type="text"
        value={formData?.cmpname}
        onChange={handleChange}
        error={errors.cmpname}
        placeholder="Enter your company"
      />

      <FormField
        label="Team Size"
        id="teamSize"
        name="teamSize"
        type="text"
        value={formData?.teamSize}
        onChange={handleChange}
        error={errors?.teamSize}
        placeholder="Team Size"
      />

      <FormField
        label="Email"
        id="email"
        name="email"
        type="text"
        value={formData?.email}
        onChange={(e) => {
          const inputValue = e.target.value;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          if (!inputValue || /^[a-zA-Z0-9@._-]*$/.test(inputValue)) {
            handleChange(e);

            // Validate email format on the fly
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: inputValue
                ? emailRegex.test(inputValue)
                  ? ""
                  : "Invalid email format"
                : "Email is required",
            }));
          }
        }}
        maxLength={50}
        placeholder="Enter your email"
        error={errors.email}
      />

      <FormField
        label="Phone"
        id="phone"
        name="phone"
        type="tel"
        value={formData?.phone}
        onChange={(e) => {
          const inputValue = e.target.value;
          const phoneRegex = /^[0-9]{0,10}$/;

          if (!inputValue || phoneRegex.test(inputValue)) {
            handleChange(e);

            // Validate phone number format on the fly
            setErrors((prevErrors) => ({
              ...prevErrors,
              phone: inputValue
                ? /^[0-9]{10}$/.test(inputValue)
                  ? ""
                  : "Phone number must be 10 digits"
                : "Phone number is required",
            }));
          }
        }}
        maxLength={10}
        placeholder="Enter your contact"
        error={errors.phone}
      />
    </div>

    <div
      className="rounded-[9px] bg-black text-white text-base font-gilroySemiBold py-3 cursor-pointer"
      onClick={() => {
        if (validateStep()) {
          handleSubmit();
        }
      }} // Move to step 2
    >
      {loading? <Spinner/> : "Request demo"}
    </div>
  </div>
);
