import { getCurrentOrg, Org, updateOrg } from "@/server/orgActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { getImageUrl } from "../utils/upload";
import { Button } from "../buttons/Button";

function OrgLogo({ OrgData }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("/media/logo/logo.png");
  const { mutate: updateLogo, isPending: uploadPending } = useMutation({
    mutationFn: updateOrg,
  });
  const queryClient = useQueryClient();
  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: getImageUrl,
    onSuccess: (data) => {
      if (data?.fileUrl) {
        setImageUrl(data.fileUrl);

        // Trigger updateOrg mutation properly
        updateLogo(
          { logo: data.fileUrl },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["get-org"] });
            },
            onError: (err) => {
              console.error("Failed to update org with new logo", err);
            },
          }
        );
      }
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadImage({ file });
    }
  };

  const handleDeleteLogo = () => {
    updateLogo(
      { logo: "" }, // or null if your API expects null
      {
        onSuccess: () => {
          setImageUrl("/media/logo/logo.png"); // fallback image
          queryClient.invalidateQueries({ queryKey: ["get-org"] });
        },
        onError: (err) => {
          console.error("Failed to delete org logo", err);
        },
      }
    );
  };
  return (
    <div className="flex justify-between items-center w-full">
      {/* Logo Image */}
      <img
        src={OrgData?.logo || "/media/logo/logo.png"}
        className="rounded-full size-16"
        alt="Logo"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload/Delete Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outlineTwo"
          onClick={handleUploadClick}
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload"}
        </Button>
        <Button
          onClick={handleDeleteLogo}
          variant="outlineTwo"
          className="text-red-500"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default OrgLogo;
