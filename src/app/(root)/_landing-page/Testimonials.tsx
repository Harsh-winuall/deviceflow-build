import React from "react";
import { Companies } from "./Companies";
export function Testimonials({}) {
  return (
    <div>
      {" "}
      <div
        className={`font-gilroy flex w-full flex-col items-center gap-y-3 bg-white px-36 max-sm:px-28 py-24 max-sm:pt-24 max-sm:pb-10 text-center tracking-[0px] text-gray-500 `}
      >
        <div className="w-[692px] font-gilroySemiBold leading-6 max-sm:text-sm max-lg:text-base max-sm:w-full">
          Testimonials
        </div>
        <div className="w-[692px] max-sm:text-2xl max-lg:text-3xl max-sm:w-[150%] text-4xl font-gilroySemiBold leading-[44px] tracking-[-0.32px] text-gray-950">
          Trusted by 50+ Startups and Founders
        </div>
      </div>
      <Companies />
      <div className="testimonials-container max-sm:w-[85%]">
        <div className="testimonial-column">
          <div className="testimonials max-sm:gap-7" id="testimonial-column1">
            <div
              className={`font-gilroy border-gray-200 w-h flex  flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  alt="streak"
                  src="/media/testmonials/streak.png"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Shiv Bidani
                  </div>
                  <div className="text-gray-500">Cofounder, Streak</div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "I had a great experience buying a refurbished Dell laptop
                  from Edify; their customer service was exceptionally helpful
                  and the product quality was excellent. Highly recommended for
                  their personal touch and efficient service!"
                </p>
              </div>
            </div>

            <div
              className={`font-gilroy border-gray-200 flex w-h flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  alt="law"
                  src="/media/testmonials/law.png"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Ashish Ranga
                  </div>
                  <div className="text-gray-500">
                    Cofounder, BM Law (bmlc.in)
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "Edify provided us with high-quality refurbished laptops at
                  great prices. Excellent service, reliable products, and a
                  smooth experience. Highly recommended!"
                </p>
              </div>
            </div>

            <div
              className={`font-gilroy border-gray-200 flex w-h flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  src="/media/testmonials/sorted.png"
                  loading="lazy"
                  alt="sorted"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Nitin Gupta
                  </div>
                  <div className="text-gray-500"> Cofounder , handpicked</div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "Edify delivered top-notch refurbished laptops with great
                  performance and affordability. Smooth process and excellent
                  service. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-column">
          <div className="testimonials" id="testimonial-column2">
            <div
              className={`font-gilroy border-gray-200 flex w-h flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  src="/media/testmonials/law.png"
                  alt="law"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Ashish Ranga
                  </div>
                  <div className="text-gray-500">
                    Cofounder, BM Law (bmlc.in)
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "Edify provided us with high-quality refurbished laptops at
                  great prices. Excellent service, reliable products, and a
                  smooth experience. Highly recommended!"
                </p>
              </div>
            </div>
            <div
              className={`font-gilroy border-gray-200 flex w-h flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  alt="sks"
                  src="/media/testmonials/sks.png"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Sandeep
                  </div>
                  <div className="text-gray-500">Cofounder, SKS Advisors</div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "Edify has truly set a benchmark with their top-quality
                  refurbished laptops. The seamless experience they offer—right
                  from product selection to delivery—reflects their dedication
                  to excellence. Their commitment to sustainability,
                  performance, and customer satisfaction makes them an ideal
                  technology partner for any corporate setup. We are thoroughly
                  impressed with their solutions and look forward to continued
                  collaboration"
                </p>
              </div>
            </div>
            <div
              className={`font-gilroy border-gray-200 w-h flex  flex-col gap-y-6 rounded-3xl max-sm:rounded-[20px] border border-solid  bg-white p-8 max-sm:p-7 font-gilroyMedium leading-6 tracking-[0px]`}
            >
              <div className="flex items-center justify-center gap-x-3">
                <img
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain object-center"
                  src="/media/testmonials/streak.png"
                  alt="streak"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <div className="text-lg font-gilroySemiBold leading-7 text-gray-950">
                    Shiv Bidani
                  </div>
                  <div className="text-gray-500">Cofounder, Streak</div>
                </div>
              </div>
              <div className="flex items-start">
                <p>
                  "I had a great experience buying a refurbished Dell laptop
                  from Edify; their customer service was exceptionally helpful
                  and the product quality was excellent. Highly recommended for
                  their personal touch and efficient service!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
