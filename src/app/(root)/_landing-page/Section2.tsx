import { forwardRef } from "react";
import { Slide } from "react-awesome-reveal";
import { MeetAIAgents } from "./meet-ai-agents";

export const Section2 = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <>
      <div className="pl-36 pr-36 max-lg:hidden">
        <Slide direction="down" fraction={1} triggerOnce>
          <div className=" flex flex-col w-full items-start justify-center gap-4 relative mt-16 pl-36 pr-36 ">
            <p className="relative self-stretch font-gilroyBold text-base-600 text-[52px] text-center tracking-[-1.20px] leading-[Truepx]">
              Everything You Need to <br />
              Manage Your IT Infrastructure
            </p>
          </div>
        </Slide>
        <Slide direction="left" className="pt-16 " fraction={0.5} triggerOnce>
          <img
            src={"/media/landingPage/Content.webp"}
            alt="content"
            height={504}
            width={"100%"}
          />
        </Slide>
        <div className="flex gap-4 mt-4 pb-11">
          <img
            src={"/media/landingPage/Content-2.webp"}
            alt="content-2"
            width={"55%"}
            style={{ height: 600 }}
          />
          <img
            src={"/media/landingPage/Content-3.webp"}
            alt="content-3"
            width={"45%"}
            style={{ height: 600 }}
          />
        </div>
      </div>

      <div className="max-lg:hidden">
        <MeetAIAgents />
        {/* desktop */}
      </div>

      <div className="pl-36 pr-36 max-lg:hidden">
        <Slide direction="down" fraction={1} triggerOnce>
          <div id="how-to-deviceflow">
            <div className=" flex flex-col w-full items-start justify-center gap-4 relative mt-16 pl-36 pr-36 ">
              <p className="relative self-stretch font-gilroyBold text-base-600 text-[52px] text-center tracking-[-1.20px] leading-[Truepx]">
                Three Steps to Hassle-Free <br />
                IT Management
              </p>
            </div>
          </div>
        </Slide>
        <div className="flex gap-12 mt-16 pb-11 items-center">
          <Slide direction="left" fraction={1} triggerOnce>
            <img
              src={"/media/landingPage/hassel-free-1.webp"}
              alt="hassel-free-1"
              width={"100%"}
              height={504}
            />
          </Slide>
          <Slide direction="right" fraction={1} triggerOnce>
            <div className="text-black text-[42px] font-gilroySemiBold  leading-[57.60px]">
              Add your devices and users to DeviceFlow's intuitive platform.
            </div>
          </Slide>
        </div>
        <div className="flex gap-12 mt-16 pb-11 items-center">
          <Slide direction="left" fraction={1} triggerOnce>
            <div className="text-black text-[42px] font-gilroySemiBold  leading-[57.60px]">
              Manage device allocation, purchases, and inventory with a few
              clicks.
            </div>
          </Slide>
          <Slide direction="right" fraction={1} triggerOnce>
            <img
              src={"/media/landingPage/hassel-free-2.webp"}
              alt="hassel-free-2"
              width={"100%"}
              height={504}
            />
          </Slide>
        </div>
        <div className="flex gap-12 mt-16 pb-11 items-center">
          <Slide direction="left" fraction={1} triggerOnce>
            <img
              src={"/media/landingPage/hassel-free-4.webp"}
              alt="hassel-free-4"
              width="100%"
              height={504}
            />
          </Slide>
          <Slide direction="right" fraction={1} triggerOnce>
            <div className="text-black text-[42px] font-gilroySemiBold  leading-[57.60px]">
              Monitor asset lifecycle and optimize your IT workflows seamlessly.
            </div>
          </Slide>
        </div>
      </div>

      <div className="hidden max-lg:block mb-4 pb-4">
        <div className="w-[90%] mx-auto my-12 flex flex-col gap-20 ">
          <div className="gap-3">
            <div className="text-[#6B7280] text-center font-gilroyBold">
              About
            </div>
            <div className="flex flex-col gap-12">
              <div className="text-center text-[#1D1F20] font-gilroyBold text-2xl">
                Everything You Need to Manage Your IT Infrastructure
              </div>
              <img
                src={"/media/landingPage/Content-3.webp"}
                width={"100%"}
                alt="content-3"
              />
              <img
                src={"/media/landingPage/Content-2.webp"}
                width={"100%"}
                alt="content-2"
              />
              <img
                src={"/media/landingPage/Content.webp"}
                alt="content-1"
                height={504}
                width={"100%"}
              />
            </div>
          </div>
        </div>

        <div className="hidden max-lg:block">
          <MeetAIAgents />
          {/* mobile */}
        </div>

        <div className="w-[90%] mx-auto my-12 flex flex-col gap-20 ">
          <div className="gap-3">
            <div className="text-[#6B7280] text-center font-gilroyBold">
              Features
            </div>
            <div className="flex flex-col gap-6">
              <div className="text-center text-[#1D1F20] font-gilroyBold text-2xl">
                Three Steps to Hassle-Free IT Management
              </div>
              <div className="mt-2 flex flex-col gap-12">
                <div>
                  <p className="text-xs text-[#727272] font-gilroyRegular text-center">
                    Step 1
                  </p>
                  <div className="text-black font-gilroySemiBold text-lg w-fit mx-auto mt-2">
                    Add your devices and users to <br />
                    DeviceFlow's intuitive platform.
                  </div>
                  <img
                    src={"/media/landingPage/hassel-free-1.webp"}
                    alt="hassel-1-mob"
                    className="mt-6"
                    width={"100%"}
                    height={504}
                  />
                </div>

                <div>
                  <p className="text-xs text-[#727272] font-gilroyRegular text-center">
                    Step 2
                  </p>
                  <div className="text-black font-gilroySemiBold text-lg w-fit mx-auto mt-2">
                    Manage device allocation, purchases, <br />
                    and inventory with a few clicks.
                  </div>
                  <img
                    src={"/media/landingPage/hassel-free-2.webp"}
                    alt="hassel-2-mob"
                    className="mt-6"
                    width={"100%"}
                    height={504}
                  />
                </div>

                <div>
                  <p className="text-xs text-[#727272] font-gilroyRegular text-center">
                    Step 3
                  </p>
                  <div className="text-black font-gilroySemiBold text-lg w-fit mx-auto mt-2">
                    Monitor asset lifecycle and optimize <br /> your IT
                    workflows seamlessly.
                  </div>
                  <img
                    src={"/media/landingPage/hassel-free-4.webp"}
                    alt="hassel-3-mob"
                    className="mt-6"
                    width={"100%"}
                    height={504}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
