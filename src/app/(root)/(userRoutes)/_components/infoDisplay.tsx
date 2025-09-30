type Display = {
  infoLabel: string;
  infoText: string | undefined;
  isEditing?: boolean;
  infoName: string;
  onInputChange?: (value: string) => void;
  inputType?: "text" | "select"; // Add this for dynamic input type
  selectOptions?: string[]; // Add this for dropdown options
};

const InfoDisplay = ({
  infoLabel,
  infoName,
  infoText,
  isEditing = false,
  onInputChange,
  inputType = "text", // Default to 'text' if not specified
  selectOptions = [],
}: Display) => {
  return (
    <div className="flex flex-col gap-1 w-2/5">
      <h1>{infoLabel}</h1>
      {isEditing ? (
        inputType === "select" ? (
          <select
            name={infoName}
            className={`p-2 border rounded-md ${
              isEditing ? "border-black" : "border-gray-200"
            } text-slate-500`}
            value={infoText}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={infoName}
            className={`p-2 border rounded-md ${
              isEditing ? "border-black" : "border-gray-200"
            } text-slate-500`}
            value={infoText}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
          />
        )
      ) : (
        <p className="p-2 border rounded-md border-gray-300 text-slate-500">
          {infoText || "N/A"}
        </p>
      )}
    </div>
  );
};

export default InfoDisplay;
