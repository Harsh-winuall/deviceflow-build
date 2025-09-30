import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import Image from "next/image";

function CoachmarksFour({ onNext }: { onNext: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white flex flex-col gap-3">
      <div className="w-full h-[180px]  relative overflow-hidden rounded bg-[#f3f3f3]">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded" />
        )}
        <Image
          src="/media/coachmarks/workflow-4.svg"
          alt="CoachMark"
          width={300}
          height={180}
          priority
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <h1 className="text-lg font-gilroySemiBold text-gray-800">Ready to Go</h1>

      <p className="text-sm text-[#00000080] font-gilroyMedium text-start leading-relaxed">
        Once you're happy with the steps, hit Publish. Your workflow is live and
        ready to automate future onboarding tasks without any repeated manual
        setup steps.
      </p>

      <Button
        variant="primary"
        className="w-full rounded-[5px] text-sm focus-visible:ring-0 focus-visible:ring-transparent"
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
}

export default CoachmarksFour;
