import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";

function CoachmarksOne({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full h-[180px] relative overflow-hidden rounded bg-[#f3f3f3]">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded"></div>
        )}
        <Image
          src="/media/coachmarks/workflow-1.svg"
          alt="CoachMark"
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          width={300}
          height={180}
          onLoad={() => setImageLoaded(true)}
          priority
        />
      </div>
      <h1 className="text-lg text-start font-gilroySemiBold text-gray-800">
        Automate Tasks with Workflows
      </h1>
      <p className="text-sm text-[#00000080] font-gilroyMedium text-start leading-relaxed">
        Save time on repeated tasks like onboarding. With Workflows, you can
        create step-by-step processes once and let the AI Agent handle the rest
        for you.
      </p>
      <div className="flex w-full gap-2.5">
        <DialogClose asChild>
          <Button
            variant="outlineTwo"
            className="w-full rounded-[5px] text-sm focus-visible:ring-0 focus-visible:ring-transparent"
            onClick={onSkip}
          >
            Skip
          </Button>
        </DialogClose>
        <Button
          variant="primary"
          className="w-full rounded-[5px] text-sm focus-visible:ring-0 focus-visible:ring-transparent"
          onClick={onNext}
        >
          Show Me How
        </Button>
      </div>
    </div>
  );
}

export default CoachmarksOne;
