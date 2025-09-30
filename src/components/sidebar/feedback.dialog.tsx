"use client";

import { cn } from "@/lib/utils";
import { sendFeedback } from "@/server/dashboard";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "../buttons/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export const FeedbackDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const mutation = useMutation({
    mutationFn: sendFeedback,
    onSuccess: () => {
      setClickedIndex(null);
      setFormData((prev) => ({ ...prev, rating: 0, comment: "" }));
      setOpen(false);
      toast.success("Thank you for your feedback!");
    },
    onError: () => {
      toast.error("Failed to submit feedback. Please try again.");
    },
  });

  const handleSubmitFeedback = async () => {
    if (!formData.rating || !formData.comment) {
      toast.error("Please select rating and leave a comment.");
      return;
    }
    mutation.mutate({ comment: formData?.comment, rating: formData?.rating });
  };

  const emojis = [
    {
      png: "/media/emojis/worst.png",
      gif: "/media/emojis/worst-gif.gif",
      text: "Worst",
      id: 1,
    },
    {
      png: "/media/emojis/bad.png",
      gif: "/media/emojis/bad-gif.gif",
      text: "Bad",
      id: 2,
    },
    {
      png: "/media/emojis/fine.png",
      gif: "/media/emojis/fine-gif.gif",
      text: "Fine",
      id: 3,
    },
    {
      png: "/media/emojis/good.png",
      gif: "/media/emojis/good-gif.gif",
      text: "Good",
      id: 4,
    },
    {
      png: "/media/emojis/great.png",
      gif: "/media/emojis/great-gif.gif",
      text: "Great",
      id: 5,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-fit p-0 rounded-md" closeButton>
        <div className="p-5 w-[413px]">
          <h1 className="text-lg font-gilroySemiBold mb-4 w-full text-center">
            Feedback
          </h1>
          <div className="text-sm text-gray-600 gap-2 flex flex-col w-full">
            <div className="text-xl text-black font-gilroySemiBold text-center">
              Share your feedback!
            </div>

            <div className="flex justify-center">
              <p className="text-sm text-[#363636] font-gilroyMedium w-[70%] text-center">
                Your input is important for us. We take customer feedback very
                seriously.
              </p>
            </div>

            <div className="flex justify-center gap-6 my-5">
              {emojis.map((emoji, index) => (
                <div
                  key={`${index}feedback-dialog`}
                  className="flex flex-col cursor-pointer group"
                  onClick={() => {
                    setClickedIndex(index);
                    setFormData((prev) => ({ ...prev, rating: emoji.id }));
                  }}
                >
                  <img
                    src={
                      clickedIndex === index || hoveredIndex === index
                        ? `${emoji.gif}?t=${new Date().getTime()}` // Add timestamp to prevent caching
                        : emoji.png
                    }
                    alt={`Emoji ${index + 1}`}
                    className="w-10 h-10 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setClickedIndex(index);
                      setFormData((prev) => ({
                        ...prev,
                        rating: emoji.id,
                      }));
                    }}
                  />

                  <div
                    className={`text-center text-sm ${
                      clickedIndex === index ? "text-black" : "text-[#C9C9C9]"
                    } font-gilroySemiBold`}
                  >
                    {emoji.text}
                  </div>
                </div>
              ))}
            </div>

            <textarea
              id="review-write"
              placeholder="Add a comment"
              onChange={handleCommentChange}
              rows={6}
              className={cn(
                "mb-2 rounded-[8px] max-h-32 placeholder:text-[#767676] placeholder:font-gilroyMedium text-[15px] border border-[#DFDFDF] my-2 font-gilroyMedium text-sm py-3 px-4 outline-none focus:outline-none"
              )}
            />
          </div>

          <LoadingButton
            variant="primary"
            loading={mutation.isPending}
            className="w-full mt-3"
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
