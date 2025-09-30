"use client";
import React, { useRef, useState } from "react";

interface CSVUploadProps {
  csvError: string | null;
  setCsvError: (err: string | null) => void;
  validateCSV: (file: File) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({
  csvError,
  setCsvError,
  validateCSV,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetErrors = () => setCsvError(null);

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      resetErrors();
      validateCSV(file); // Validate the file immediately after selection
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input when the button is clicked
    }
  };

  return (
    <div className="mt-6">
      <button
        className="bg-black text-white py-2 px-4 rounded w-full transition duration-300 hover:bg-gray-800"
        onClick={handleFileUploadClick}
      >
        Upload CSV
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleCSVChange}
        className="hidden"
      />
      {csvError && (
        <p className="text-red-500 text-sm font-gilroyMedium transition-all duration-300 mb-4">
          {csvError}
        </p>
      )}
    </div>
  );
};

export default CSVUpload;
