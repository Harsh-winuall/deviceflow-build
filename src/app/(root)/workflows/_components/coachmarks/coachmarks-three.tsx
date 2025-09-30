import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import Image from "next/image";

function CoachmarksThree({ onNext }: { onNext: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-3 ">
      <div className="w-full h-[180px] relative overflow-hidden rounded bg-[#f3f3f3]">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded" />
        )}
        <Image
          src="/media/coachmarks/workflow-3.svg"
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

      <h1 className="text-lg font-gilroySemiBold text-gray-800">
        Make It Yours
      </h1>
      <p className="text-sm text-[#00000080] font-gilroyMedium text-start leading-relaxed">
        Edit the workflow by adding or modifying steps to match your exact
        onboarding process, ensuring it aligns perfectly with your team's
        internal requirements.
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

export default CoachmarksThree;
