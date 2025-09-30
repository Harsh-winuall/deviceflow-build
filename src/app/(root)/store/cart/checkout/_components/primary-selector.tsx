export const PrimarySelector = ({
  isPrimary,
  onSelect,
}: {
  isPrimary: boolean;
  onSelect: (value: boolean) => void;
}) => (
  <div className="flex justify-between font-gilroyMedium text-sm bg-[#F0F0F0] p-1.5 rounded-xl items-center gap-3">
    {/* Primary */}
    <div
      className={`w-full flex items-center justify-center rounded-lg p-2 cursor-pointer ${
        isPrimary ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={() => onSelect(true)}
    >
      Primary
    </div>

    {/* Secondary */}
    <div
      className={`w-full flex items-center justify-center rounded-lg p-2 cursor-pointer ${
        !isPrimary ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={() => onSelect(false)}
    >
      Secondary
    </div>
  </div>
);
