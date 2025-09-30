"use client";

import { ReportData } from "@/server/checkMateActions";
import { forwardRef, Ref } from "react";

export const ReportFormat = forwardRef(
  ({ data, ref }: { data?: ReportData; ref: Ref<HTMLElement> }) => {
    if (!data?.success || !data?.data) return null;

    const {
      serial_no,
      processor,
      score,
      Name,
      Device,
      Ram,
      Storage,
      "Processor Generation": processorGeneration,
      "Screen Size(in Inches)": screenSize,
      "Battery Health": batteryHealth,
      "Backup In Minute": batteryBackup,
      "Reported On": reportedOn,
      ...checks
    } = data?.data;

    return (
      <section
        ref={ref}
        id="invoice"
        className="min-h-screen h-fit max-w-screen-xl w-full bg-white flex flex-col items-center justify-start gap-8 py-12 px-20"
      >
        <img
          src="/media/Deviceflow.png"
          alt="Device flow logo"
          className="w-52 h-12 object-contain"
        />
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#7F7F7F] font-gilroyMedium text-sm">
            Device Score
          </span>
          <span className="font-gilroyBold text-4xl text-[#0D9B00]">
            {score}
          </span>
          <span className="text-[12px] font-gilroyMedium">
            👌 Your device is running perfectly
          </span>
        </div>
        <h1 className="font-gilroySemiBold text-lg">{Device}</h1>
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col justify-center items-center">
            <span className="font-gilroyMedium text-sm">Diagnosed By</span>
            <span className="text-[#7F7F7F] font-gilroyMedium">{Name}</span>
          </div>
          <div className="h-[1.3rem] w-[1px] bg-[#D0D0D0]" />
          <div className="flex flex-col justify-center items-center">
            <span className="font-gilroyMedium text-sm">Serial Number</span>
            <span className="text-[#7F7F7F] font-gilroyMedium">
              {serial_no}
            </span>
          </div>
          <div className="h-[1.3rem] w-[1px] bg-[#D0D0D0]" />
          <div className="flex flex-col justify-center items-center">
            <span className="font-gilroyMedium text-sm">Diagnosed On</span>
            <span className="text-[#7F7F7F] font-gilroyMedium">
              {checks["createdAt"]}
            </span>
          </div>
        </div>
        <h2 className="font-gilroySemiBold text-sm">Specifications</h2>
        <div className="flex flex-col gap-2.5 w-full">
          {[
            ["Processor", processor],
            ["RAM", Ram],
            ["Storage", Storage],
            ["Processor Generation", processorGeneration],
            ["Screen Size", screenSize],
            ["Battery Health", batteryHealth],
            ["Battery Backup", batteryBackup],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="w-full flex justify-between items-center font-gilroyMedium text-sm"
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <h2 className="font-gilroySemiBold text-sm">Device Checks</h2>
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(checks).map(([key, value], i) => (
            <div
              key={i}
              className="w-full flex justify-between items-center font-gilroyMedium text-sm"
            >
              <span>{key}</span>
              <span>
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
);
