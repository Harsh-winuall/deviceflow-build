import { Icons } from "@/components/icons";
import DeviceFlowLogo from "@/icons/DeviceFlowLogo";
import SocialMediaIcons from "@/icons/SocialMediaIcons";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface FooterProps {
  scrollToAbout: () => void;
  scrollToCTA: () => void;
  scrollToFeatures: () => void;
  scrollToSignUp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  scrollToAbout,
  scrollToCTA,
  scrollToFeatures,
  scrollToSignUp,
}) => {
  const router = useRouter();
  return (
    <>
      <div
        className={`flex w-full flex-col gap-y-2 bg-neutral-800 pt-[74px] mt-10 max-lg:hidden`}
      >
        <div className="flex items-center px-24">
          <div className="flex items-center justify-center gap-x-[6.5px] pt-px">
            <DeviceFlowLogo/>
          </div>
        </div>
        <div className="flex items-end justify-center px-24 pt-[34px]">
          <div className="flex flex-grow items-center pr-44">
            <div className="flex flex-grow flex-wrap items-start justify-between gap-x-20 gap-y-2.5 text-gray-200 min-[1430px]:flex-nowrap">
              <div className="font-gilroyMedium flex items-center justify-center gap-x-36 text-sm leading-5 tracking-[-0.1px]">
                <div>Company</div>
                <div>Support</div>
              </div>
              <div className="font-gilroyMedium leading-6 tracking-[-0.2px] text-gray-400">
                Ready to grow?
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center px-24">
          <div className="font-inter flex flex-grow flex-wrap items-start justify-between gap-x-20 gap-y-12 pt-2 min-[1430px]:flex-nowrap">
            <div className="flex h-[91px] flex-col items-center">
              <div className="-mt-2 flex h-24 flex-shrink-0 flex-col items-start gap-y-1.5 text-sm leading-5 tracking-[-0.1px] text-gray-300">
                <div className="flex flex-wrap items-center gap-x-44 gap-y-2.5 min-[1430px]:flex-nowrap font-gilroyRegular">
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={scrollToFeatures}
                  >
                    About
                  </div>
                  <a
                    href="mailto:contact@edify.club"
                    className="hover:underline cursor-pointer -ml-1"
                  >
                    contact@edify.club
                  </a>
                </div>
                <div className="flex flex-col items-start gap-y-1.5 font-gilroyRegular">
                  <div className="flex flex-wrap items-center justify-center gap-x-44 gap-y-2.5 min-[1430px]:flex-nowrap">
                    <Link
                      href={"/login"}
                      className="hover:underline cursor-pointer"
                    >
                      Login
                    </Link>
                    <div>
                      <span>
                        {"Ph: "}
                        <a className="underline" href="tel:+91 9513245671">
                          +91 9513245671
                        </a>
                        ,
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-y-1.5">
                    <div
                      className="cursor-pointer hover:underline"
                      onClick={scrollToAbout}
                    >
                      Features
                    </div>
                    <div className="flex items-center justify-center gap-x-0.5">
                      <div
                        className="cursor-pointer hover:underline"
                        onClick={scrollToCTA}
                      >
                        Beta Signup
                      </div>
                      {/* <IconArrowTr className="h-5 w-[17px] flex-shrink-0" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-y-3 text-center leading-6 tracking-[-0.2px] text-white font-gilroyMedium">
              <div
                className="w-72 rounded-xl bg-zinc-700 px-4 py-3 cursor-pointer hover:bg-black"
                onClick={scrollToCTA}
              >
                Register for Beta
              </div>
              <Link
                href={"/login"}
                className="flex w-72 items-center justify-center rounded-xl border border-solid border-zinc-700 px-[15px] py-[11px] cursor-pointer"
              >
                <div className="flex-grow text-center">Login</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end pt-14">
          <div className="flex items-start justify-center border-t border-solid border-zinc-700 px-24 pb-[60px] pt-[19px]">
            <div className="flex flex-grow flex-wrap items-center justify-between gap-x-3 gap-y-[9px] text-xs leading-[18px] tracking-[0px] text-gray-300 min-[1430px]:flex-nowrap font-gilroyRegular">
              <div className="flex flex-col items-center gap-y-1">
                <div>© 2025 Edify. All rights reserved.</div>
                <div>Kuzagan Services Private Limited</div>
              </div>
              <div className="flex items-center justify-center gap-x-8 ">
                <div>
                  <a
                    target="_blank"
                    href="/terms-and-conditions"
                    className="cursor-pointer hover:underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  ∙{" "}
                  <a
                    target="_blank"
                    href="/privacy-policy"
                    className="cursor-pointer hover:underline"
                  >
                    Privacy Policy
                  </a>
                  ∙{" "}
                  <a
                    target="_blank"
                    href="https://warranty.edify.club/"
                    className="cursor-pointer hover:underline"
                  >
                    Service and Warranty
                  </a>
                </div>

                <div className="flex items-center justify-center gap-x-3">
                  {/* <IconFilledTwitter className="h-4 w-4 flex-shrink-0" />
                  <IconOutlineDribbble className="h-4 w-4 flex-shrink-0" />
                  <IconFilledLinkedin className="h-4 w-4 flex-shrink-0" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full gap-8 bg-neutral-800 pt-[74px] mt-10 mx-auto hidden max-lg:block">
        <div className="w-full mx-auto flex justify-center items-center mb-8">
          <DeviceFlowLogo/>
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="font-gilroyMedium text-base leading-6 tracking-[-0.2px] text-center text-gray-200">
            Ready to grow?
          </div>
          <div className="flex flex-col items-center gap-y-3 text-center leading-6 tracking-[-0.2px] text-white">
            <div
              className="w-72 rounded-xl font-gilroyMedium bg-zinc-700 px-4 py-3 cursor-pointer hover:bg-black"
              onClick={scrollToCTA}
            >
              Register for Beta
            </div>
            <Link
              href={"/login"}
              className="flex w-72 items-center justify-center rounded-xl border border-solid border-zinc-700 px-[15px] py-[11px] cursor-pointer"
            >
              <div className="flex-grow text-center font-gilroyMedium">
                Login
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm font-gilroyRegular text-center">
            <div className="text-gray-200">Company</div>
            <div className="flex flex-col gap-[6px] text-gray-300">
              <div
                className="cursor-pointer hover:underline"
                onClick={scrollToFeatures}
              >
                About
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={scrollToAbout}
              >
                Features
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={scrollToCTA}
              >
                Beta Signup
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm font-gilroyRegular text-center mt-4">
            <div className="text-gray-200">Support</div>
            <div className="flex flex-col gap-[6px] text-gray-200">
              <a href="mailto:contact@edify.club hover:underline">
                contact@edify.club
              </a>
              <a href="tel:+91 9513245671" className="hover:underline">
                Ph: +91 9513245671
              </a>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#31373D] w-full mt-8 mb-4"></div>

        <div className="flex flex-col text-gray-200 text-xs font-gilroyRegular gap-8 w-full mb-8 px-16 text-center">
          <div>© 2024 Edify. All rights reserved.</div>
          <div className="flex gap-8 items-center mx-auto">
            <div>
              <a
                target="_blank"
                href="https://edify.club/terms-of-services"
                className="cursor-pointer hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              ∙{" "}
              <a
                target="_blank"
                href="https://edify.club/privacy-policy"
                className="cursor-pointer hover:underline"
              >
                Privacy Policy
              </a>
            </div>
            <div className="flex gap-3 items-center">
              <a
                href="https://www.linkedin.com/company/edify-club/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn"
              >
                <SocialMediaIcons.linkedin_icon />
              </a>
              <a
                href="https://www.instagram.com/edify_club/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://x.com/edify_club?t=xINA1nE4OivzN6U79c2Myw&s=31"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter"
              >
                <SocialMediaIcons.twitter_icon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
