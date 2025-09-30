import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { requestForDemo } from "@/server/loginActions";
import React, { forwardRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
export const CTA = forwardRef<HTMLDivElement>((_, ref) => {
  const [onRegisterClicked, setOnRegisterClicked] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    if (currentStep === 3) {
      if (
        typeof window !== "undefined" &&
        (window as any).Calendly &&
        typeof (window as any).Calendly.initPopupWidget === "function"
      ) {
        (window as any).Calendly.initPopupWidget({
          url: "https://calendly.com/abhinav-prakash-winuall/30min?preview_source=et_card&month=2025-05", // ← replace this
        });
      } else {
        console.error("Calendly widget is not available.");
      }
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const phoneRegex = /^[0-9]{10}$/;
  const initialPaths = [
    {
      default: "M740 0.400391H0V362.4H740V0.400391Z",
      hover: "M740 0H0V362H740V0Z",
    },
    {
      default: "M112.882 -1.69214V477.487",
      hover: "M112.882 -2.09253V477.087",
    },
    { default: "M363.729 243.129H740.001", hover: "M363.729 242.728H740.001" },
    { default: "M363.729 326.828H740.001", hover: "M363.729 326.428H740.001" },
    { default: "M363.729 284.978H740.001", hover: "M363.729 284.578H740.001" },
    { default: "M363.729 201.279H740.001", hover: "M363.729 200.879H740.001" },
    { default: "M363.729 201.342V416.805", hover: "M363.729 200.941V416.405" },
    { default: "M489.153 201.342V416.805", hover: "M489.153 200.941V416.405" },
    { default: "M614.577 201.342V416.805", hover: "M614.576 200.941V416.405" },
    {
      default: "M614.577 -1.69214V201.279",
      hover: "M614.576 -2.09253V200.879",
    },
    {
      default:
        "M306.243 255.16C306.243 195.934 258.044 147.92 198.588 147.92C139.132 147.92 90.9326 195.934 90.9326 255.16C90.9326 314.387 139.132 362.4 198.588 362.4C258.044 362.4 306.243 314.387 306.243 255.16Z",
      hover:
        "M306.243 254.76C306.243 195.533 258.044 147.52 198.588 147.52C139.132 147.52 90.9326 195.533 90.9326 254.76C90.9326 313.987 139.132 362 198.588 362C258.044 362 306.243 313.987 306.243 254.76Z",
    },
    {
      default:
        "M433.758 339.295H273.843C259.989 339.295 248.758 350.537 248.758 364.405V406.255C248.758 420.122 259.989 431.365 273.843 431.365H433.758C447.612 431.365 458.843 420.122 458.843 406.255V364.405C458.843 350.537 447.612 339.295 433.758 339.295Z",
      hover:
        "M433.758 338.895H273.843C259.989 338.895 248.758 350.137 248.758 364.005V405.854C248.758 419.722 259.989 430.964 273.843 430.964H433.758C447.612 430.964 458.843 419.722 458.843 405.854V364.005C458.843 350.137 447.612 338.895 433.758 338.895Z",
    },
    {
      default:
        "M286.358 30.8614L213.499 58.516C206.69 61.1008 203.263 68.7223 205.844 75.539L233.471 148.47C236.054 155.287 243.668 158.718 250.477 156.132L323.336 128.478C330.146 125.893 333.573 118.272 330.99 111.455L303.363 38.524C300.782 31.7072 293.167 28.2765 286.358 30.8614Z",
      hover:
        "M358.939 96.3375L288.884 62.1999C282.336 59.0095 274.436 61.7332 271.238 68.2835L237.029 138.368C233.831 144.92 236.548 152.817 243.096 156.007L313.151 190.145C319.699 193.335 327.599 190.612 330.796 184.06L365.005 113.976C368.203 107.425 365.487 99.5279 358.939 96.3375Z",
    },
    {
      default:
        "M705.323 53.1238C710.343 53.1238 714.414 49.0501 714.414 44.025C714.414 38.9999 710.343 34.9263 705.323 34.9263C700.303 34.9263 696.234 38.9999 696.234 44.025C696.234 49.0501 700.303 53.1238 705.323 53.1238Z",
      hover:
        "M705.323 359.724C710.343 359.724 714.414 355.65 714.414 350.625C714.414 345.6 710.343 341.526 705.323 341.526C700.303 341.526 696.234 345.6 696.234 350.625C696.234 355.65 700.303 359.724 705.323 359.724Z",
    },
    {
      default:
        "M675.469 53.1238C680.489 53.1238 684.559 49.0501 684.559 44.025C684.559 38.9999 680.489 34.9263 675.469 34.9263C670.449 34.9263 666.379 38.9999 666.379 44.025C666.379 49.0501 670.449 53.1238 675.469 53.1238Z",
      hover:
        "M677.469 250.724C682.489 250.724 686.559 246.65 686.559 241.625C686.559 236.6 682.489 232.526 677.469 232.526C672.449 232.526 668.379 236.6 668.379 241.625C668.379 246.65 672.449 250.724 677.469 250.724Z",
    },
    {
      default:
        "M645.615 53.1238C650.636 53.1238 654.705 49.0501 654.705 44.025C654.705 38.9999 650.636 34.9263 645.615 34.9263C640.595 34.9263 636.525 38.9999 636.525 44.025C636.525 49.0501 640.595 53.1238 645.615 53.1238Z",
      hover:
        "M645.615 239.724C650.636 239.724 654.705 235.65 654.705 230.625C654.705 225.6 650.636 221.526 645.615 221.526C640.595 221.526 636.525 225.6 636.525 230.625C636.525 235.65 640.595 239.724 645.615 239.724Z",
    },
    {
      default:
        "M581.799 235.103C581.819 231.592 585.269 228.609 589.097 229.799L671.463 255.696C674.368 256.602 675.499 259.509 674.801 261.944L671.765 281.801C671.35 284.387 669.596 286.558 667.164 287.502L654.53 292.409L638.823 298.506C637.766 298.922 636.937 299.715 636.466 300.734L625.792 324.215C623.096 329.123 616.044 329.085 613.385 324.158L582.44 258.037C581.498 256.036 581.064 253.828 581.139 251.619L581.799 235.103Z",
      hover:
        "M548.873 350.487C545.707 348.967 544.486 344.573 547.198 341.621L605.824 278.234C607.884 275.996 610.995 276.216 612.899 277.887L629.552 289.122C631.712 290.602 632.925 293.116 632.738 295.718L631.772 309.238L630.569 326.044C630.493 327.177 630.855 328.265 631.575 329.127L648.239 348.814C651.522 353.35 648.473 359.709 642.883 360.007L569.879 359.711C567.668 359.708 565.486 359.156 563.522 358.144L548.873 350.487Z",
    },
    {
      default:
        "M637.277 278.346L626.867 297.223C624.171 302.131 617.118 302.093 614.46 297.166L582.478 237.821C580.083 233.385 584.288 228.289 589.097 229.799L671.464 255.696C676.103 257.149 676.197 263.699 671.596 265.304L639.634 276.365C638.634 276.705 637.786 277.422 637.258 278.366L637.277 278.346Z",
      hover:
        "M611.683 318.823L624.296 336.303C627.58 340.839 624.531 347.199 618.941 347.496L551.62 351.036C546.586 351.304 543.776 345.324 547.197 341.622L605.823 278.234C609.12 274.662 615.081 277.377 614.565 282.223L610.899 315.845C610.779 316.894 611.064 317.968 611.692 318.849L611.683 318.823Z",
    },
    {
      default: "M637.049 299.808L638.709 276.799",
      hover: "M630.987 328.204L610.896 316.866",
    },
    {
      default: "M625.811 324.195L629.073 293.088",
      hover: "M648.228 348.789L621.502 332.541",
    },
    {
      default: "M613.403 324.138L612.667 294.069",
      hover: "M642.873 359.982L615.376 347.792",
    },
    {
      default:
        "M628.267 150.156L600.679 193.887C597.769 198.547 592.666 201.385 587.161 201.385H530.315C524.809 201.399 519.706 198.547 516.797 193.887L489.493 150.156C486.255 144.974 486.255 138.418 489.478 133.25L517.065 89.5198C519.99 84.845 525.078 82.0073 530.568 82.0073H587.43C592.935 82.0073 598.038 84.8451 600.948 89.4898L628.251 133.25C631.489 138.418 631.489 144.989 628.267 150.156Z",
      hover:
        "M698.386 310.772L670.798 354.503C667.888 359.162 662.786 362 657.28 362H600.434C594.928 362.015 589.826 359.162 586.916 354.503L559.612 310.772C556.374 305.59 556.374 299.033 559.597 293.865L587.184 250.135C590.109 245.46 595.197 242.623 600.687 242.623H657.549C663.054 242.623 668.157 245.46 671.067 250.105L698.37 293.865C701.608 299.033 701.608 305.604 698.386 310.772Z",
    },
    {
      default:
        "M590.368 98.2414C591.338 96.7031 592.949 96.5239 593.591 96.5239C594.248 96.5239 595.844 96.6882 596.814 98.2414L598.649 101.199V101.139L620.343 135.893C622.552 139.432 622.552 144.003 620.343 147.527L610.152 163.762L596.53 185.358C595.56 186.897 594.069 187.076 593.472 187.062C592.86 187.062 591.353 186.897 590.384 185.344L566.854 147.632C564.646 144.107 564.631 139.553 566.794 135.998L590.368 98.2414Z",
      hover:
        "M660.488 258.857C661.458 257.318 663.07 257.139 663.711 257.139C664.368 257.139 665.964 257.303 666.934 258.857L668.769 261.814V261.754L690.463 296.508C692.672 300.048 692.672 304.619 690.463 308.142L680.273 324.377L666.65 345.974C665.68 347.513 664.189 347.691 663.592 347.677C662.98 347.677 661.474 347.513 660.504 345.959L636.974 308.247C634.766 304.722 634.751 300.168 636.915 296.613L660.488 258.857Z",
    },
    {
      default:
        "M247.727 262.544C247.575 258.551 248.64 254.528 250.833 251.009L382.731 39.6995C386.505 33.6503 393.112 29.9934 400.236 29.9934H473.88C481.004 29.9934 487.625 33.6655 491.4 39.6995L494.171 44.1488L495.16 45.7334L509.134 68.1017L526.776 96.3515C528.861 99.7036 529.912 103.498 529.912 107.307C529.912 111.101 528.861 114.91 526.776 118.263L415.9 295.868L397.694 325.032L397.633 325.138L394.893 329.557C391.118 335.591 384.497 339.263 377.373 339.263H303.713C296.589 339.263 289.968 335.576 286.193 329.557L267.18 299.097L250.833 272.89C248.853 269.721 247.803 266.155 247.727 262.544Z",
      hover:
        "M300.453 198.023C303.776 195.805 307.762 194.609 311.908 194.637L560.997 196.527C568.127 196.579 574.7 200.297 578.426 206.369L616.946 269.136C620.672 275.207 621.006 282.771 617.838 289.145L615.495 293.834L614.661 295.506L602.906 319.116L588.057 348.928C586.29 352.459 583.606 355.338 580.359 357.331C577.126 359.315 573.33 360.413 569.382 360.389L360.015 358.787L325.636 358.525L325.513 358.528L320.314 358.504C313.196 358.443 306.604 354.72 302.877 348.648L264.349 285.869C260.623 279.797 260.302 272.225 263.458 265.859L279.474 233.723L293.259 206.082C294.925 202.737 297.414 199.977 300.453 198.023Z",
    },
    {
      default:
        "M387.693 318.236C386.886 318.236 384.861 318.007 383.567 315.95L367.676 290.489L355.559 271.518L353.307 267.922C351.906 265.682 351.129 263.108 351.069 260.517C350.977 257.546 351.753 254.681 353.307 252.183L412.565 157.255L478.553 51.4628C479.847 49.3905 481.887 49.1619 482.693 49.1619C483.5 49.1619 485.54 49.3905 486.834 51.4628L487.792 53.0017L517.14 99.46C520.124 104.244 520.124 110.43 517.14 115.215L391.864 315.844L391.802 315.95C390.508 318.007 388.499 318.236 387.678 318.236H387.693Z",
      hover:
        "M326.197 346.446C325.775 345.758 324.911 343.913 325.987 341.734L339.376 314.872L349.207 294.623L351.093 290.822C352.27 288.457 354.058 286.448 356.234 285.041C358.719 283.409 361.566 282.572 364.508 282.589L476.411 283.442L601.092 284.348C603.535 284.367 604.797 285.986 605.219 286.673C605.641 287.361 606.513 289.219 605.424 291.406L604.613 293.028L580.368 342.341C577.851 347.387 572.579 350.623 566.94 350.582L330.418 348.75L330.295 348.753C327.865 348.726 326.619 347.134 326.189 346.434L326.197 346.446Z",
    },
  ];
  const [paths, setPaths] = useState(initialPaths.map((path) => path.default));

  const handleMouseEnter = () => {
    setPaths(initialPaths.map((path) => path.hover));
  };

  const handleMouseLeave = () => {
    setPaths(initialPaths.map((path) => path.default));
  };

  const [formData, setFormData] = useState({
    name: "",
    cmpname: "",
    email: "",
    phone: "",
    type: "register",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    cmpname: "",
    email: "",
    teamSize: "",
  });

  const validateStep1 = () => {
    const newErrors = {
      name: formData?.name ? "" : "Name is required",
      cmpname: formData?.cmpname ? "" : "Company Name is required",
    };

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return !Object.values(newErrors).some((err) => err);
  };

  const validateStep2 = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    const newErrors = {
      // name: formData?.name ? "" : "Name is required",
      // company_name: formData?.company_name ? "" : "Company Name is required",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await requestForDemo({
        ...formData,
        type: "register",
        utm_source: params?.slug,
      });
      if (response) {
        handleNext();
      }
    } catch (error) {
      toast.error("Some Error Occured. Try again Later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={` flex w-full bg-zinc-800 h-[376px] max-lg:h-fit max-lg:py-5 py-[7px] pl-24 max-lg:px-4 max-sm:-mb-16`}
      >
        <div className="flex max-lg:flex-col max-sm:justify-between justify-between flex-grow max-lg:flex-wrap items-center max-sm:gap-x-0  gap-x-28 max-lg:gap-y-2 gap-y-24 min-[1430px]:flex-nowrap">
          <div className="w-[37%] max-lg:w-full">
            {currentStep === 0 && (
              <div
                className={`${
                  onRegisterClicked ? "slide-out-left" : ""
                }  flex w-[494px] max-lg:w-full max-lg:items-center flex-shrink-0 flex-col items-start gap-y-8`}
              >
                <div className="font-gilroySemiBold max-lg:mx-auto flex max-lg:justify-center max-lg:items-center items-start  text-[52px] max-lg:text-3xl font-bold leading-[58px] tracking-[-1.2px] max-lg:w-[90%]">
                  <div className="max-lg:w-[90%]">
                    <p className="text-[gray] max-lg:w-full max-lg:text-center">
                      {"Ready to be a part of "}
                    </p>
                    <p className="text-white max-lg:w-full max-lg:text-center">
                      BETA program?
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    // setOnRegisterClicked(true);
                    handleNext();
                  }}
                  className="font-gilroySemiBold rounded-xl bg-white max-sm:px-5 px-4 max-sm:py-2 py-3 text-center leading-6 tracking-[-0.2px] text-zinc-800 hover:bg-gray-50 cursor-pointer border border-zinc-800 hover:border-gray-200"
                >
                  Register
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div
                className="  max-sm:w-[100%] slide-in-left flex flex-col flex-grow flex-wrap items-start justify-center gap-x-28 gap-y-4 min-[1430px]:flex-nowrap"
                id="register"
                ref={ref}
              >
                <div
                  className={`font-gilroy w-full text-3xl font-bold leading-[58px] tracking-[0px] text-[gray]`}
                >
                  <span>
                    {"Register for "}
                    <span className="text-white">BETA</span>
                  </span>
                </div>
                <div className="relative" style={{ width: "100%" }}>
                  <input
                    type="text"
                    id="floating_outlined"
                    style={{ border: "1px solid #FFF" }}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Enter Your Name"
                    value={formData?.name}
                    name="name"
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="floating_outlined"
                    style={{ backgroundColor: "#27272A" }}
                    className="absolute text-lg text-white  duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0]   px-1 peer-focus:px-2 peer-focus:text-white  scale-100 -translate-y-1/2 top-1/2 top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto start-1"
                  >
                    Name
                  </label>

                  <p className="text-red-500 text-sm font-gilroyRegular my-1.5">
                    {errors.name}
                  </p>
                </div>
                <div className="relative" style={{ width: "100%" }}>
                  <input
                    type="text"
                    name="cmpname"
                    value={formData?.cmpname}
                    id="floating_outlined"
                    style={{ border: "1px solid #FFF" }}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Enter Your Company Name"
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="floating_outlined"
                    style={{ backgroundColor: "#27272A" }}
                    className="absolute text-lg text-white  duration-300 transform -translate-y-6 scale-75 z-10 origin-[0]   px-1 peer-focus:px-2 peer-focus:text-white  scale-100 -translate-y-1/2 top-1/2 top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto start-1"
                  >
                    Company Name
                  </label>
                  <p className="text-red-500 text-sm font-gilroyRegular my-1.5">
                    {errors.cmpname}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div
                    onClick={() => {
                      // setSubmitClicked(true);
                      handleBack();
                    }}
                    className="font-inter w-[123px] rounded-xl text-white bg-zinc-700 px-4 py-3 text-center leading-6 tracking-[-0.2px] border border-zinc-800 hover:border-gray-200 cursor-pointer"
                  >
                    Back
                  </div>

                  <div
                    onClick={() => {
                      // setSubmitClicked(true);
                      if (validateStep1()) {
                        handleNext();
                      }
                    }}
                    className="font-inter w-[123px] rounded-xl bg-white px-4 py-3 text-center leading-6 tracking-[-0.2px] text-zinc-800 border border-zinc-800 hover:border-gray-200 cursor-pointer"
                  >
                    Next
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div
                className="  max-sm:w-[100%] slide-in-left flex flex-col flex-grow flex-wrap items-start justify-center gap-x-28 gap-y-4 min-[1430px]:flex-nowrap"
                id="register"
                ref={ref}
              >
                <div
                  className={`font-gilroy w-full text-3xl font-bold leading-[58px] tracking-[0px] text-[gray]`}
                >
                  <span>
                    {"Register for "}
                    <span className="text-white">BETA</span>
                  </span>
                </div>
                <div className="relative" style={{ width: "100%" }}>
                  <input
                    type="text"
                    id="floating_outlined"
                    style={{ border: "1px solid #FFF" }}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Enter Email ID"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const emailRegex =
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                      if (
                        !inputValue ||
                        /^[a-zA-Z0-9@._-]*$/.test(inputValue)
                      ) {
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
                    name="email"
                    value={formData?.email}
                  />
                  <label
                    htmlFor="floating_outlined"
                    style={{ backgroundColor: "#27272A" }}
                    className="absolute text-lg text-white  duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0]   px-1 peer-focus:px-2 peer-focus:text-white  scale-100 -translate-y-1/2 top-1/2 top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto start-1"
                  >
                    Email Id
                  </label>
                  <p className="text-red-500 text-sm font-gilroyRegular my-1.5">
                    {errors.email}
                  </p>
                </div>
                <div className="relative" style={{ width: "100%" }}>
                  <input
                    type="text"
                    id="floating_outlined"
                    style={{ border: "1px solid #FFF" }}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Enter your Phone Number"
                    name="phone"
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
                  />
                  <label
                    htmlFor="floating_outlined"
                    style={{ backgroundColor: "#27272A" }}
                    className="absolute text-lg text-white  duration-300 transform -translate-y-6 scale-75 z-10 origin-[0]   px-1 peer-focus:px-2 peer-focus:text-white  scale-100 -translate-y-1/2 top-1/2 top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto start-1"
                  >
                    Phone
                  </label>
                  <p className="text-red-500 text-sm font-gilroyRegular my-1.5">
                    {errors.phone}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div
                    onClick={() => {
                      // setSubmitClicked(true);
                      handleBack();
                    }}
                    className="font-inter w-[123px] rounded-xl text-white bg-zinc-700 px-4 py-3 text-center leading-6 tracking-[-0.2px] border border-zinc-800 hover:border-gray-200 cursor-pointer"
                  >
                    Back
                  </div>

                  <div
                    onClick={() => {
                      // setSubmitClicked(true);
                      if (validateStep2()) {
                        handleSubmit();
                      }
                    }}
                    className="font-inter w-[223px] rounded-xl bg-white px-4 py-3 text-center leading-6 tracking-[-0.2px] text-zinc-800 border border-zinc-800 hover:border-gray-200 cursor-pointer"
                  >
                    {loading ? <Spinner /> : "Schedule Demo"}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div
                className={` slide-in-left flex w-[100%] flex-col gap-y-8 pr-[0.02px] leading-[43px] tracking-[0px] `}
              >
                <div className="h-24 flex-shrink-0">
                  <span>
                    <p className="text-[52px] max-sm:text-[44px] font-bold leading-[43px] text-white">
                      {"Congratulations! "}
                      <span className="text-[gray]" />
                    </p>
                    <p className="text-3xl max-sm:text-xl font-gilroySemiBold leading-[43px] mt-4 text-[gray]">
                      Our team will contact you soon.
                    </p>
                  </span>
                </div>
                <div className="text-xl font-gilroyMedium leading-[43px] max-sm:leading-[35px]">
                  <span>
                    <p className="text-[gray]">For further info:</p>
                    <p className="text-white">{"(+91) 9513245671 "}</p>
                    <p className="text-white">
                      <a
                        href="mailto:support@deviceflow.ai"
                        className="hover:underline cursor-pointer"
                      >
                        support@deviceflow.ai
                      </a>
                    </p>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-[55%] max-sm:w-[110%] max-lg:w-[90%]   max-lg:-ml-16 ">
            <svg
              width="100%"
              height="363"
              viewBox="0 0 740 363"
              fill="none"
              className=""
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_3192_65642"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="740"
                height="363"
              >
                <path d={paths[0]} fill="white" className="transition-path" />
              </mask>
              <g mask="url(#mask0_3192_65642)">
                <path
                  d={paths[1]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[2]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[3]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[4]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[5]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[6]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[7]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[8]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[9]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[10]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[11]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[12]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[13]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[14]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[15]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="0.836158"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[16]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.88136"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[17]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.88136"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[18]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[19]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[20]}
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[21]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.88136"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[22]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  className="transition-path"
                />
                <path
                  d={paths[23]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.88136"
                  strokeLinejoin="round"
                  className="transition-path"
                />
                <path
                  d={paths[24]}
                  fill="#232529"
                  stroke="white"
                  strokeWidth="1.0452"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  className="transition-path"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
});
