"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getImageUrl } from "@/components/utils/upload";
import UploadImageIcon from "@/icons/UploadImageIcon";
import WarningIcon from "@/icons/WarningIcon";
import { updateDevice } from "@/server/deviceActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const UploadDocuments = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    images: [] as string[],
  });

  const fileIssueImages = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100); // Simulates progress eivery 100ms
  };

  const handleDocsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Validate each file
    const validFiles = Array.from(files).filter((file) => {
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ].includes(file.type);
      return isValidSize && isValidType;
    });

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files were invalid. Only JPG, JPEG, or PNG files under 1MB are allowed."
      );
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    simulateProgress();

    try {
      // Upload all valid files
      const uploadPromises = validFiles.map((file) => getImageUrl({ file }));
      const results = await Promise.all(uploadPromises);

      // Add all new URLs to the images array
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...results.map((res) => res.fileUrl)],
      }));

      // console.log(formData.images);

      // setErrors((prev) => ({
      //   ...prev,
      //   images: "",
      // }));
    } catch (error) {
      // console.log(error);
      toast.error("Some images failed to upload");
      // setErrors((prev) => ({
      //   ...prev,
      //   images: "Failed to upload some images. Please try again.",
      // }));
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const uploadDocuments = useMutation({
    mutationFn: (id: string) =>
      updateDevice(id, { upload_docs: formData.images }),
    onSuccess: () => {
      setOpen(false);
      toast.success("Documents Uploaded Successfully!");
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to upload documents");
    },
  });

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-fit">
        {children}
      </DialogTrigger>

      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col gap-4">
        <DialogTitle>Upload Documents</DialogTitle>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex flex-wrap gap-4">
            {/* Add new upload button */}
            <div
              className="flex flex-wrap gap-2 items-center justify-start bg-[#E9F3FF] rounded-md border-dashed h-16 w-full border-[1px] px-2 py-1 border-[#52ABFF] cursor-pointer"
              onClick={() => fileIssueImages?.current?.click()}
            >
              {isUploading ? (
                <div className="w-full h-16 flex flex-col items-center justify-center gap-2">
                  <div className="w-3/4 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-black rounded-full"
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.1s linear",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-blue-500 font-gilroySemiBold">
                    {progress}%
                  </span>
                </div>
              ) : (
                formData.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative h-[50px] w-20 border-2 border-dashed  rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 group"
                  >
                    <img
                      src={imageUrl}
                      alt={`issue-image-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white size-4" />
                    </button>
                  </div>
                ))
              )}

              {formData.images.length === 0 && !isUploading && (
                <div className="flex flex-col justify-center items-center w-full mx-auto">
                  <div className="font-gilroySemiBold text-sm gap-1 flex items-center">
                    <span className="text-[#0EA5E9]">Click to upload</span>
                    <span className="text-[#525252]">or drag and drop</span>
                  </div>
                  <p className="text-xs text-[#A3A3A3]">
                    JPG, JPEG, PNG, PDF less than 5MB
                  </p>
                </div>
              )}
              {formData.images.length > 0 && !isUploading && (
                <div className="w-20 h-[50px] bg-gray-100 flex justify-center items-center rounded-xl border border-dashed border-gray-600">
                  <div className="bg-gray-400 text-white text-3xl rounded-full flex items-center justify-center size-6">
                    <Plus className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileIssueImages}
            style={{ display: "none" }}
            onChange={handleDocsUpload}
            multiple
            accept="image/jpeg, image/png, image/jpg"
          />
          {/* {errors.images && (
            <p className="text-destructive text-sm">{errors.images}</p>
          )} */}
        </div>

        <DialogFooter>
          <LoadingButton
            variant="primary"
            className="w-full"
            type="submit"
            disabled={uploadDocuments.isPending}
            onClick={() => uploadDocuments.mutate(id)}
            loading={uploadDocuments.isPending}
          >
            Upload Documents
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
