import Image from "next/image";
import { useState } from "react";
import { Button } from "./buttons/Button";
import { DialogClose } from "./ui/dialog";

function TicketsCoachMark({ onNext }: { onNext: () => void }) {
  const [show, setShow] = useState(true);
  if (!show) return null;

  const handleCalendlyClick = () => {
    window.open(
      "https://calendly.com/abhinav-prakash-winuall/30min?preview_source=et_card&month=2025-05",
      "_blank"
    );
    onNext();
  };

  return (
    <div className="bg-white flex flex-col items-center gap-3 rounded-2xl max-w-sm w-full">
      <div className="text-start flex flex-col gap-4">
        <Image
          src="/media/coach-2.webp"
          alt="CoachMark"
          width={300}
          height={300}
          className="w-full h-full rounded-xl"
        />
        <h1 className="text-lg mb-3 font-gilroySemiBold text-gray-800">
          Smart Ticketing Panel
        </h1>
      </div>

      <p className="text-sm text-[#00000080] font-gilroyMedium text-start leading-relaxed">
        Easily manage and track all your service requests from one centralized
        panel. Whether it's an IT issue, maintenance task, or support request —
        you can create, assign, prioritize, and resolve tickets effortlessly.
      </p>

      <div className="flex gap-3 w-full">
        <Button
          variant="outlineTwo"
          className="w-full text-sm"
          onClick={handleCalendlyClick}
        >
          Need a Demo?
        </Button>
        <DialogClose asChild>
          <Button
            onClick={onNext}
            variant="primary"
            className="w-full text-sm focus-visible:ring-0 focus-visible:ring-transparent"
          >
            Got it
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}

export default TicketsCoachMark;
