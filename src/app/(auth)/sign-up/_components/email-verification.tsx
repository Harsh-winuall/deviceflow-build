import { FormField } from "@/app/(root)/settings/_components/form-field";
import React, { useEffect, useState } from "react";
import { signupReqOTP, verifySignupOTP } from "@/server/signupActions";

function EmailVerification({ setSteps, user, setUser }: any) {
  const [otpSent, setOtpSent] = useState(false); // Tracks if OTP is sent
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [timeLeft, setTimeLeft] = useState(0); // Timer starts only when OTP is sent
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;
    const updatedOtp = [
      ...otp.map((d, idx) => (idx === index ? element.value : d)),
    ];
    setOtp(updatedOtp);

    // Focus next input if value is entered
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (event: any, index: number) => {
    if (event.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Clear the previous box
        setOtp(newOtp);

        const prevSibling = event.target.previousSibling;
        if (prevSibling) prevSibling.focus();
      }
    }
  };

  const validateFieldsEmail = (): boolean => {
    const newErrors = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email
      )
        ? ""
        : "Invalid email format",
      otp: "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleNext = async () => {
    if (validateFieldsEmail()) {
      if (!formData.email) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
        return;
      }

      try {
        setLoading(true);
        const res = await signupReqOTP(formData.email);
        if (res) {
          setOtpSent(true);
        }
        setTimeLeft(300); // Start the timer (5 minutes)
        setOtp(new Array(6).fill("")); // Clear OTP input
        setOtpSent(true); // Hide Send OTP button and show Verify OTP button
        setErrors((prev) => ({ ...prev, email: "" })); // Clear email error
        setLoading(false);
      } catch (error) {
        setOtpSent(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const validateFields = (): boolean => {
    const newErrors = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email
      )
        ? ""
        : "Invalid email format",
      otp: otp.join("").length === 6 ? "" : "Invalid otp",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      if (otp.every((num) => num.length === 1)) {
        const otpPass = otp.join("");
        try {
          setLoading(true);
          const res = await verifySignupOTP(formData.email, otpPass);
          setLoading(false);
          setUser({ ...user, email: formData.email });
          setSteps(2);
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            otp: "Invalid otp",
          }));
          setLoading(false);
        } finally {
          setLoading(false);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: "Invalid otp",
        }));
      }
    }
  };

  return (
    <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
      <div className="w-[46%] h-[auto]">
        <img
          src="/media/Onboarding/employee.png"
          alt="edify-background"
          width={"100%"}
        />
      </div>
      <div className="w-[42%] relative h-full justify-center items-center flex flex-col">
        <div className="font-gilroySemiBold flex w-full gap-3 flex-col items-center">
          <div className="w-full flex flex-col gap-y-4 mb-6">
            <h1 className="text-center text-3xl font-gilroyBold text-indigo-950">
              Welcome Onboard
            </h1>
            <p className="text-center text-sm font-gilroyMedium text-gray-600">
              Create your credentials to access your organization{" "}
            </p>
          </div>
          <div className="w-[78%]">
            <FormField
              label="Email"
              disabled={otpSent}
              id="email"
              error={errors.email}
              name="email"
              value={formData?.email ?? ""}
              type="text"
              onChange={(e) => {
                const inputValue = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  email: inputValue,
                }));
              }}
              className="placeholder:text-gray-300 "
              placeholder="Enter your email"
            />
          </div>

          {!otpSent && (
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center mt-4 mb-0.5 justify-center h-[50px] w-[78%] rounded-[9.3px] bg-black px-44 py-[13px]"
            >
              <div className="text-center text-white whitespace-nowrap text-sm font-gilroySemiBold">
                Send OTP
              </div>
            </button>
          )}

          {otpSent && timeLeft > 0 && (
            <>
              <div className="flex justify-center gap-2 space-x-2 my-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    className="w-12 h-12 text-xl bg-[#F6F6F6]  border-[#DDDDDD] text-center border rounded-lg"
                    type="text"
                    name="otp"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleBackspace(e, index)}
                  />
                ))}
              </div>{" "}
              <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                {errors.otp}
              </p>
              <p className="text-center text-zinc-500 mb-2">
                {formatTimeLeft()}
              </p>
            </>
          )}

          {otpSent && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center my-0.5 justify-center h-[50px] w-[78%] rounded-[9.3px] bg-black px-44 py-[13px]"
            >
              <div className="text-center text-white whitespace-nowrap text-sm font-gilroySemiBold">
                Submit
              </div>
            </button>
          )}

          {otpSent && (
            <div className="font-gilroy w-full text-center font-medium leading-[normal] tracking-[0px] mt-3">
              <span style={{ cursor: "pointer" }} onClick={handleNext}>
                <span className="text-center text-neutral-600">
                  {"Don't receive code? "}
                </span>
                Re-send
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
