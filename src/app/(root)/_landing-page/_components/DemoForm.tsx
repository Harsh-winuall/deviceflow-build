import React, { useState } from "react";
import { DemoPage1 } from "./DemoPage1";
import { DemoPage2 } from "./DemoPage2";
import { requestForDemo } from "@/server/loginActions";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

const DemoForm = ({ setIsOpen }: { setIsOpen: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const params = useParams();
  const investorSlug = params.investor || "";
  const [formData, setFormData] = useState({
    name: "",
    cmpname: "",
    email: "",
    phone: "",
    utm_source: params?.slug ?? "",
    teamSize: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    cmpname: "",
    email: "",
    utm_source: "",
    teamSize: "",
  });

  const validateStep = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    const newErrors = {
      name: formData?.name ? "" : "Name is required",
      cmpname: formData?.cmpname ? "" : "Company Name is required",
      teamSize: formData?.teamSize ? "" : "Team size is required",
      email: formData?.email
        ? emailRegex.test(formData?.email)
          ? ""
          : "Invalid email format"
        : "Email is required",
      phone: formData?.phone
        ? phoneRegex.test(formData?.phone)
          ? ""
          : "Phone number must be 10 digits"
        : "Phone number is required",
    };

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));

    return !Object.values(newErrors).some((err) => err);
  };

  // Handle input changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    // setLoading(true);
    try {
      const response = await requestForDemo(formData);
      if (response) {
        setStep(2);
      }
    } catch (error) {
      toast.error("Some Error Occured. Try again Later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 ? (
        <DemoPage1
          formData={formData}
          errors={errors}
          setErrors={setErrors}
          handleChange={handleChange}
          setStep={setStep}
          validateStep={validateStep}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <DemoPage2 setStep={setStep} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default DemoForm;
