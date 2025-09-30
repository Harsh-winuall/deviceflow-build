import { useRef, useState } from "react";
import { X } from "lucide-react"; // Assuming you have an Icons component for your icons
import { Icons } from "@/components/icons";

interface FileUploadProps {
  allowedTypes: string[]; // Allowed file types (e.g. ['application/pdf', 'image/jpeg'])
  maxSize: number; // Max file size in bytes
  onFileChange: (file: File | null) => void; // Callback to pass back the file or null when removed
  errorMessage?: string; // Optional error message to display
}

const FileUpload: React.FC<FileUploadProps> = ({
  allowedTypes,
  maxSize,
  onFileChange,
  errorMessage,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const isValidSize = selectedFile.size <= maxSize;
      const isValidType = allowedTypes.includes(selectedFile.type);

      if (isValidSize && isValidType) {
        setFile(selectedFile);
        onFileChange(selectedFile); // Callback to pass back the file
      } else {
        setFile(null);
        onFileChange(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileChange(null); // Callback to pass null when the file is removed
  };

  return (
    <div className="flex flex-col gap-1.5">
      {file ? (
        <div className="relative w-20 h-20 bg-[#F5F5F5] rounded-xl p-4">
          <iframe
            src={URL.createObjectURL(file)}
            width="100%"
            height="100%"
            title="File Preview"
            className="object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={handleRemoveFile}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center justify-center bg-[#E9F3FF] rounded-2xl border-dashed h-24 w-full border-2 p-6 border-[#52ABFF]"
          onClick={() => fileRef?.current?.click()}
        >
          <div className="flex flex-col justify-center items-center">
            <Icons.uploadImage className="size-5" />
            <span className="text-[#0EA5E9]">Click to upload</span>
            <p className="text-xs text-neutral-400">
              {allowedTypes.join(", ")} under {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {errorMessage && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default FileUpload;
