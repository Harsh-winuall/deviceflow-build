import { forwardRef, useState } from "react";

export const Section3 = forwardRef<HTMLDivElement>((_, ref) => {
  const [cardHeight1, setCardHeight1] = useState(334);
  const [cardHeight4, setCardHeight4] = useState(334);
  const [cardHeight2, setCardHeight2] = useState(334);
  const [cardHeight5, setCardHeight5] = useState(334);
  const [cardHeight3, setCardHeight3] = useState(334);
  const [cardHeight6, setCardHeight6] = useState(334);

  return (
    <div
      className={`flex w-full flex-col gap-y-16 max-lg:gap-y-10 bg-zinc-800 max-sm:px-1 max-lg:px-16 px-32 py-20 max-lg:py-14`}
      ref={ref}
    >
      <div className="flex items-center px-0.5 max-lg:mx-auto">
        <div className="text-[52px] max-sm:text-2xl max-lg:text-3xl font-gilroyBold leading-[58px] tracking-[-1.2px]">
          <div>
            <span className="text-gray-400">{"Why Choose "}</span>
            <span className="text-white">DeviceFlow?</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-6 min-[1430px]:flex-nowrap">
        <div className="flex flex-col items-center gap-y-8 max-[1428px]:flex-row max-[1428px]:gap-8 max-[1024px]:flex-col ">
          <div
            onMouseEnter={() => {
              setCardHeight1(526);
            }}
            onMouseLeave={() => {
              setCardHeight1(334);
            }}
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight1 > 334
                  ? cardHeight1
                  : cardHeight4 <= 334
                  ? cardHeight4
                  : 147,
              overflow: "hidden",
            }}
            className={`flex flex-col items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px] max-sm:w-[90%]`}
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-1.webp"
                  alt="deviceflow-1"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Save time with automation.
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>
                  Update your contacts with the latest information on autopilot.
                </p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Automatically ensure your contact list stays up-to-date,
                    saving time and effort. Simplify the process of managing
                    accurate contact details, so you’re always connected without
                    manual updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight4 > 334
                  ? cardHeight4
                  : cardHeight1 <= 334
                  ? cardHeight1
                  : 147,
              overflow: "hidden",
            }}
            onMouseEnter={() => {
              setCardHeight4(526);
            }}
            onMouseLeave={() => {
              setCardHeight4(334);
            }}
            className="flex flex-col items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px] max-sm:w-[90%]"
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-2.webp"
                  alt="deviceflow-2"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Device analysis
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>
                  Get deeper insights into your contacts at a single glance.
                </p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Access key details instantly, streamline your
                    decision-making process, and build stronger relationships
                    with a tool designed to enhance clarity and connection
                    effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-8 max-[1428px]:flex-row max-[1428px]:gap-8 max-[1024px]:flex-col ">
          <div
            onMouseEnter={() => {
              setCardHeight2(526);
            }}
            onMouseLeave={() => {
              setCardHeight2(334);
            }}
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight2 > 334
                  ? cardHeight2
                  : cardHeight5 <= 334
                  ? cardHeight5
                  : 147,
              overflow: "hidden",
            }}
            className={`flex flex-col items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px] max-sm:w-[90%]`}
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-3.webp"
                  alt="deviceflow-3"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Reduce IT operational costs.
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>Stay lean with Attio’s lightweight browser extension.</p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Designed for seamless integration,Boost productivity with
                    its intuitive interface, enabling quick access to key
                    features without slowing down your system. Experience
                    efficiency and convenience in managing your tasks, all in
                    one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight5 > 334
                  ? cardHeight5
                  : cardHeight2 <= 334
                  ? cardHeight2
                  : 147,
              overflow: "hidden",
            }}
            onMouseEnter={() => {
              setCardHeight5(526);
            }}
            onMouseLeave={() => {
              setCardHeight5(334);
            }}
            className="flex flex-col max-sm:hidden items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px]"
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-4.webp"
                  alt="deviceflow-4"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Minimise asset loss.
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>Streamline your workflow with customizable shortcuts.</p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Save time by automating repetitive tasks, accessing tools
                    faster, and navigating seamlessly. Boost productivity and
                    efficiency with shortcuts that adapt to your unique
                    workflow, keeping everything within easy reach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-8 max-[1428px]:flex-row max-[1428px]:gap-8 max-[1024px]:flex-col ">
          <div
            onMouseEnter={() => {
              setCardHeight3(526);
            }}
            onMouseLeave={() => {
              setCardHeight3(334);
            }}
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight3 > 334
                  ? cardHeight3
                  : cardHeight6 <= 334
                  ? cardHeight6
                  : 147,
              overflow: "hidden",
            }}
            className={`flex flex-col items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px] max-sm:w-[90%]`}
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-5.webp"
                  alt="deviceflow-5"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Quick actions
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>Streamline your workflow with customizable shortcuts.</p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Simplify complex tasks, save time, and boost productivity
                    with tailored commands at your fingertips. Empower yourself
                    to work smarter, not harder, with an interface designed for
                    maximum efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              transition: "height 0.5s ease-in-out",
              height:
                cardHeight6 > 334
                  ? cardHeight6
                  : cardHeight3 <= 334
                  ? cardHeight3
                  : 147,
              overflow: "hidden",
            }}
            onMouseEnter={() => {
              setCardHeight6(526);
            }}
            onMouseLeave={() => {
              setCardHeight6(334);
            }}
            className="flex flex-col max-sm:hidden items-center justify-center rounded-3xl border border-solid border-zinc-700 bg-zinc-800 p-[3px] max-sm:w-[90%]"
          >
            <div
              className={
                "flex w-96 flex-col items-start justify-end gap-y-1.5 rounded-3xl border border-solid border-zinc-600 p-10"
              }
              style={{ height: "100%", width: "100%" }}
            >
              <div className="flex flex-col items-center pl-[0.06px]">
                <img
                  src="/media/landingPage/device-flow-6.webp"
                  alt="deviceflow-6"
                />
              </div>
              <div className="self-stretch  [max-width:291px]">
                <div className=" text-[22px] font-gilroyMedium leading-8 tracking-[-0.3px] text-gray-100">
                  Gain real-time insights
                </div>
              </div>
              <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                <p>
                  Update your contacts with the latest information on autopilot.
                </p>
              </div>
              <div
                style={{
                  height: "100%",
                  transition: "height 0.5s ease-in-out",
                  overflow: "hidden",
                }}
              >
                <div className="font-gilroyMedium flex items-start self-stretch leading-6 tracking-[-0.2px] text-gray-400">
                  <p>
                    Keep your contact list accurate and up-to-date without
                    manual effort. Simplify communication, avoid outdated
                    details, and maintain seamless connections with a reliable
                    solution that ensures your information stays current.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
