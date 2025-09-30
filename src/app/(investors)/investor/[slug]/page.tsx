"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import FeaturesSection from "./_components/company-section";
import Brands from "./_components/brands";
import { Icons } from "@/components/icons";
import { useParams, useRouter } from "next/navigation";
import { Section2 } from "@/app/(root)/_landing-page/Section2";
import { Section3 } from "@/app/(root)/_landing-page/Section3";
import { Testimonials } from "@/app/(root)/_landing-page/Testimonials";
import { CTA } from "@/app/(root)/_landing-page/CTA";
import { FAQ } from "@/app/(root)/_landing-page/FAQ";
import { Footer } from "@/app/(root)/_landing-page/Footer";
import { Integration } from "@/app/(root)/_landing-page/Integration";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DemoForm from "@/app/(root)/_landing-page/_components/DemoForm";
import { INVESTOR_DETAILS } from "./constant";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const elementRef = useRef(null);
  const ctaRef = useRef<HTMLDivElement>(null); // Reference to the CTA section
  const featRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const newRef = useRef<HTMLDivElement>(null);
  const signupref = useRef<HTMLDivElement>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { slug }: { slug: string } = useParams();
  const investorDetails = Object.values(INVESTOR_DETAILS).find(
    (item) => item.slug === slug
  );

  const scrollToCTA = () => {
    if (ctaRef.current) {
      ctaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    if (featRef.current) {
      featRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNew = () => {
    if (newRef.current) {
      newRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSignUp = () => {
    if (signupref.current) {
      signupref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <div className="flex flex-col gap-0 max-lg:w-full">
      <div
        className={
          "bg-[url('/media/Grid.svg')] bg-cover font-gilroyMedium flex w-full flex-col items-center gap-y-8 tracking-[0px]  max-lg:hidden"
        }
      >
        <div className="fade-in-top flex flex-wrap items-center justify-center gap-x-7 gap-y-5 self-stretch bg-white py-6 pl-12 pr-12 min-[1430px]:flex-nowrap">
          <div className="font-gilroyMedium flex flex-grow flex-wrap items-center justify-between gap-x-10 gap-y-[11px] text-sm leading-normal min-[1430px]:flex-nowrap">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="flex h-full w-full flex-shrink-0 items-center justify-center gap-x-[6.5px] overflow-clip px-3 pb-2.5 pt-[11px]">
                  <img
                    src="/media/landingPage/Deviceflow-logo.png"
                    alt="deviceflow-logo"
                    width={184}
                    height={41}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-8">
              <div className="cursor-pointer" onClick={scrollToFeatures}>
                About
              </div>
              <div onClick={scrollToAbout} className="cursor-pointer">
                Features
              </div>
            </div>
            <Link href={"/login"}>
              <div className="pl-3 font-gilroyMedium underline">Log in</div>
            </Link>
          </div>
          <div
            onClick={scrollToCTA}
            className={
              "flex w-[162px] cursor-pointer items-center justify-center rounded-xl border border-solid border-gray-600 bg-neutral-800 hover:bg-black px-[15px] py-[11px]"
            }
          >
            <div className="font-gilroy text-center font-gilroySemiBold leading-6 tracking-[-0.2px] text-white cursor-pointer">
              <span>
                {"Register for "}
                Beta
              </span>
            </div>
          </div>
        </div>

        <div className="border border-[#B0B0B0] bg-[linear-gradient(145deg,#000,#656565)] shadow-[inset_0px_-1px_1px_1px_rgba(204,199,199,0.20),inset_0px_1px_1px_1px_rgba(204,199,199,0.20),0px_13px_20px_-1px_rgba(0,0,0,0.20)] px-8 py-5 rounded-[22px] flex gap-6 items-center">
          <img src="/media/logo/deviceflow-white.svg" />

          <span className="text-[#797979] font-gilroyBold text-xl">x</span>

          <img
            src={investorDetails?.logo}
            style={
              slug === "beenext"
                ? { width: "225px", height: "30px" }
                : { width: "139px", height: "auto" }
            }
          />
        </div>

        {/* <div className="fade-in  flex items-end justify-center self-stretch pt-6">
          <div
            className="font-inter flex flex-wrap items-center justify-center gap-x-1 gap-y-1 rounded-[100px] bg-zinc-100 py-0.5 pl-0.5 pr-2 text-sm leading-5 tracking-[-0.1px] min-[1430px]:flex-nowrap cursor-pointer"
            onClick={() => router.push("#how-to-deviceflow")}
          >
            <div className="rounded-[100px] bg-neutral-800 px-2 py-0.5 text-center text-white">
              Offer
            </div>
            <div className="text-zinc-700">
              Get access to 12 months of DeviceFlow access for FREE being a {investorDetails?.name} company!
            </div>
            <IconOutlineArrowRight className="h-[13px] w-3.5 flex-shrink-0" />
          </div>
        </div> */}
        <div
          className="fade-in fltopex w-auto text-center font-bold leading-[88px] tracking-[-1px] text-neutral-800 
              text-[60px] sm:text-[45px] md:text-[46px] lg:text-[50px] xl:text-[60px] 
              items-center justify-center"
        >
          <h1>
            Streamline IT Asset Management <br /> with DeviceFlow
          </h1>
        </div>

        <h1 className="fade-in flex w-[548px] items-center justify-center text-center text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-[#757575]">
          Simplify your office's IT workflows with seamless asset, user, and
          inventory management.
        </h1>

        <div className="fade-in flex items-center justify-center self-stretch">
          <div className="flex items-center justify-end pl-9">
            <div className="flex items-center justify-center gap-x-3 text-center font-gilroySemiBold leading-6 tracking-[-0.2px]">
              <div
                onClick={scrollToCTA}
                className={
                  "flex w-[162px] cursor-pointer  items-center justify-center rounded-xl border border-solid border-gray-600 bg-neutral-800 hover:bg-black px-[15px] py-[11px]"
                }
              >
                <div className="font-gilroy text-center font-gilroySemiBold leading-6 tracking-[-0.2px] text-white cursor-pointer">
                  <span>
                    {"Register for "}
                    Beta
                  </span>
                </div>
              </div>
              <div className="flex items-center w-[148px] hover:bg-gray-50 justify-center rounded-xl border border-solid border-gray-100 bg-white px-[15px] py-[11px] cursor-pointer">
                <div
                  className="text-center text-zinc-700"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Request Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full hidden max-lg:block">
        <div className="relative flex items-center py-4 ">
          <Icons.burger_icon
            className="absolute left-4 cursor-pointer"
            onClick={toggleModal}
          />
          <div className="flex justify-center w-full mx-auto">
            <img
              src="/media/landingPage/Deviceflow-logo.png"
              alt="device-flow-png"
              width={170}
              height={41}
            />
          </div>
        </div>

        {/* Modal */}
        {isModalVisible && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={toggleModal}
            ></div>
            {/* Modal Content */}
            <div className="absolute left-4 top-[60px] z-20 bg-white shadow-lg rounded-[12px] p-3 w-[50%]">
              <ul className="text-sm text-gray-800 w-full text-center">
                <li
                  className="py-2 cursor-pointer text-[#191D23] font-gilroySemiBold text-base"
                  onClick={() => {
                    setIsModalVisible(false);
                    scrollToFeatures();
                  }}
                >
                  About
                </li>
                <li
                  className="py-2 cursor-pointer text-[#191D23] font-gilroySemiBold text-base"
                  onClick={() => {
                    setIsModalVisible(false);
                    scrollToAbout();
                  }}
                >
                  Features
                </li>

                <div className="h-[1px] bg-[#D6D6D6] mt-2"></div>
                <li
                  className="py-3 cursor-pointer text-[#191D23] font-gilroySemiBold text-base underline"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Log in
                </li>

                <div
                  onClick={() => {
                    setIsModalVisible(false);
                    scrollToCTA();
                  }}
                  className={
                    "flex cursor-pointer items-center justify-center rounded-xl border text-center border-solid border-gray-600 bg-neutral-800 hover:bg-black px-[15px] py-[8px]"
                  }
                >
                  <div className="font-gilroy text-center font-gilroySemiBold leading-6 tracking-[-0.2px] text-white cursor-pointer">
                    <span>
                      {"Register for "}
                      Beta
                    </span>
                  </div>
                </div>
              </ul>
            </div>
          </>
        )}

        <div className="w-[80%] mx-auto text-center mt-11">
          <div className="w-full flex justify-center mb-12">
            <div className="border border-[#B0B0B0] bg-[linear-gradient(145deg,#000,#656565)] overflow-hidden shadow-[inset_0px_-1px_1px_1px_rgba(204,199,199,0.20),inset_0px_1px_1px_1px_rgba(204,199,199,0.20),0px_13px_20px_-1px_rgba(0,0,0,0.20)] px-4 py-3 rounded-[22px] flex gap-3 items-center w-fit">
              <img
                src="/media/logo/deviceflow-white.svg"
                width={100}
                height={150}
              />

              <span className="text-[#797979] font-gilroyBold text-xl">x</span>

              <img
                src={investorDetails?.logo}
                style={
                  slug === "beenext"
                    ? { width: "108px", height: "17px" }
                    : {
                        width: ["peak-xv", "ipv"].includes(slug)
                          ? "100px"
                          : slug === "prime-vp"
                          ? "80px"
                          : "60px",
                        height: "25px",
                      }
                }
              />
            </div>
          </div>

          <div className="font-gilroyBold text-[#1D1F20] text-[35px] leading-[1.2]">
            Streamline IT Asset
            <br /> Management with
            <br />
            DeviceFlow
          </div>

          <div className="flex justify-center items-center mt-2">
            <div className="text-[#757575] font-gilroyMedium text-sm text-center w-[90%]">
              Simplify your office's IT workflows with seamless asset, user, and
              inventory management.
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <div
              onClick={scrollToCTA}
              className={
                "flex cursor-pointer items-center justify-center rounded-xl border text-center border-solid border-gray-600 bg-neutral-800 hover:bg-black px-[15px] py-[11px]"
              }
            >
              <div className="font-gilroy text-center font-gilroySemiBold leading-6 tracking-[-0.2px] text-white cursor-pointer">
                <span>
                  {"Register for "}
                  Beta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-24">
        <FeaturesSection />
      </div>

      {/* <div className="bg-[url('/media/brands-bg.svg')] bg-cover bg-center flex justify-center items-center mt-24 pt-24 pb-20">
        <Brands />
      </div> */}

      <div ref={featRef}>
        <Section2 ref={newRef} />
      </div>
      <div ref={aboutRef}>
        <Section3 ref={aboutRef} />
      </div>

      <Integration />
      <Testimonials />
      <div ref={ctaRef}>
        <CTA ref={signupref} />
      </div>
      <FAQ />
      <Footer
        scrollToAbout={scrollToAbout}
        scrollToCTA={scrollToCTA}
        scrollToFeatures={scrollToFeatures}
        scrollToSignUp={scrollToSignUp}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl bg-white p-5 shadow-lg text-center">
          <DemoForm
            setIsOpen={() => {
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
