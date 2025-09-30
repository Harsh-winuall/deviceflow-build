"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDeviceReview } from "@/server/storeActions";
import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/icons";
import { useAlert } from "@/hooks/useAlert";
import { toast } from "sonner";
import Spinner, { spinnerVariants } from "@/components/Spinner";
import { cn } from "@/lib/utils";
import ProductReviewStars from "@/icons/ProductReviewStars";

export const CreateReview = ({
  children,
  deviceId,
}: {
  children: React.ReactNode;
  deviceId: string;
}) => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<{
    comment: string;
    deviceId: string;
    rating: string;
  }>({ comment: "", deviceId: deviceId, rating: "0" });

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ rating: string; comment: string }>({
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let hasError = false;

    if (!(formData.comment.trim().length > 0)) {
      setErrors((prev) => ({ ...prev, comment: "Comment is required !!" }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, comment: "" }));
    }

    if (parseInt(formData.rating) <= 0) {
      setErrors((prev) => ({ ...prev, rating: "Rating is required !!" }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      await createDeviceReview(formData);
      setOpen(false);
      showAlert({
        title: "Review submitted successfully!",
        description:
          "Thank you for your feedback. We appreciate your input and will review it shortly.",
        isFailure: false,
        key: "create-review-1",
      });
      setFormData({ comment: "", deviceId: deviceId, rating: "" });
      router.refresh();
    } catch (e: any) {
      toast.error("Failed to add a review!");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating: rating.toString() }));
    setErrors((prev) => ({ ...prev, rating: "" })); // Clear rating error when rating is selected
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <form className="flex flex-col gap-3" onSubmit={handleCreate}>
            <span className="text-xl font-gilroySemiBold text-gray-900">
              Write a Review
            </span>
            <span className="text-base text-gray-600 font-gilroyMedium">
              How would you rate your device?
            </span>
            <div className="flex items-center justify-center py-1.5">
              <RatingStarComp
                rating={Number(formData.rating)}
                onRatingChange={handleRatingChange}
                className="size-8"
              />
            </div>
            {errors.rating && (
              <p className="text-destructive text-sm">{errors.rating}</p>
            )}{" "}
            <textarea
              id="review-write"
              placeholder="Write a review..."
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className={cn(
                " mb-2 rounded-md font-gilroyMedium text-sm p-3 outline-none focus:outline-none  bg-[#F9F9F9]",
                errors.comment ? "border-destructive/80 border " : ""
              )}
            />
            {errors.comment && (
              <p className="text-destructive text-sm">{errors.comment}</p>
            )}
            <DialogFooter className="flex w-full items-center justify-center">
              <Button
                className="w-full rounded-md border bg-black text-white hover:text-black hover:bg-white ring-1 ring-white hover:ring-1 hover:ring-black shadow-sm"
                type="submit"
              >
                {loading ? (
                  <Spinner className={spinnerVariants({ size: "sm" })} />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
const RatingStarComp = ({
  rating,
  onRatingChange,
  className,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  className?: string;
}) => {
  const handleStarClick = (index: number) => {
    onRatingChange(index + 1); // Set the rating based on the star clicked
  };

  return (
    <div className="flex flex-row items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          onClick={() => handleStarClick(index)}
          className="cursor-pointer"
        >
          {index < rating ? (
            <ProductReviewStars.star_filled
              className={`${className} text-yellow-500`}
            />
          ) : (
            <ProductReviewStars.star_unfilled
              className={`${className} text-gray-300`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingStarComp;
