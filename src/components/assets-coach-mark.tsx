import Image from "next/image";
import { Button } from "./buttons/Button";

function AssetCoachMark({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-white flex flex-col items-center  gap-3 rounded-2xl max-w-sm w-full">
      <div className="text-start flex flex-col gap-4">
        <Image
          src="/media/coach-1.webp"
          alt="CoachMark"
          className="w-full h-full rounded-xl"
          width={300}
          height={300}
        />
        <h1 className="text-lg mb-3 font-gilroySemiBold text-gray-800">
          Asset Timeline
        </h1>
      </div>

      <p className="text-sm text-[#00000080] font-gilroyMedium text-start leading-relaxed">
        Follow your assets every step of the way. The Asset Timeline helps you
        see when items were added, who used them, what changes were made, and
        when they were retired — all in one organized, easy-to-understand
        timeline.
      </p>

      <Button
        variant="primary"
        className="w-full text-sm focus-visible:ring-0 focus-visible:ring-transparent"
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
}

export default AssetCoachMark;
