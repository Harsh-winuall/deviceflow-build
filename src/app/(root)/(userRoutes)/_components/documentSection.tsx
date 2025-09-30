import { FileText } from "lucide-react";
import { useState } from "react";
import InfoDisplay from "./infoDisplay";
import Link from "next/link";
import { User } from "@/server/userActions";

type DocumentType = {
  label: string;
  name: string;
  fileUrl?: string;
};

const Document = ({ userInfo }: { userInfo: User }) => {
  const [documents, setDocuments] = useState<DocumentType[]>([
    { label: "Aadhaar Card", name: "aadhaarCard", fileUrl: "" },
    { label: "PAN Card", name: "panCard", fileUrl: "" },
    { label: "ID Card", name: "idCard", fileUrl: "" },
  ]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updatedDocs = documents.map((doc) =>
        doc.name === name
          ? { ...doc, fileUrl: URL.createObjectURL(e.target.files![0]) }
          : doc
      );
      setDocuments(updatedDocs);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {documents.map((document) => (
        <div
          key={document.name}
          className="flex flex-col gap-2 p-4 border shadow-sm rounded-md"
        >
          <div className="flex items-center gap-2">
            <FileText className="text-gray-600" />
            <h1 className="font-gilroyMedium text-lg">{document.label}</h1>
          </div>

          {/* File Input */}
          <div className="mt-2">
            {document.fileUrl ? (
              <div className="flex items-center gap-4">
                <Link
                  href={document.fileUrl}
                  target="_blank"
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  View Uploaded File
                </Link>
                <button
                  onClick={() =>
                    setDocuments(
                      documents.map((doc) =>
                        doc.name === document.name
                          ? { ...doc, fileUrl: "" }
                          : doc
                      )
                    )
                  }
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-gilroySemiBold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => handleFileChange(e, document.name)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Document;
