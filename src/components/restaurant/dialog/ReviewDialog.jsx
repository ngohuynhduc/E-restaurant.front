"use client";

import React, { useState } from "react";
import { Loader2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ButtonInteract } from "@/components/ui/interactButton";
import { uploadMultipleImage } from "@/services/uploadImageService";
import { useParams } from "next/navigation";

export default function ReviewDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState("");
  const [uploading, setUploading] = useState(false);
  const params = useParams();
  const id = params?.id;

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleMouseEnter = (star) => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleImageChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    const newFilesLengh = e?.target?.files?.length ?? 0;
    if (newFilesLengh > 1) {
      e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      const uploadedImages = await uploadMultipleImage(newFiles);
      setImages(uploadedImages[0]?.url);
      console.log("🚀 ~ handleImageChange ~ uploadedImages:", uploadedImages);
    } catch (error) {
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const removeImage = () => {
    // Revoke the URL to prevent memory leaks

    setImages("");
  };

  const handleSubmit = async () => {
    // Validate form
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (content.trim() === "") {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    // Create review data object
    const reviewData = {
      restaurantId: id,
      rating,
      comment: content,
      image: images,
    };

    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (data.status === 201) {
        alert("Đánh giá thành công");
      } else {
        alert("Đánh giá không thành công");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    // Reset form and close dialog
    setRating(0);
    setContent("");
    setImages("");
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <ButtonInteract>Đánh giá</ButtonInteract>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Đánh giá</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Rating Stars */}
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="rating" className="text-center">
                Chọn số sao
              </Label>
              <div className="flex space-x-1" id="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                      "cursor-pointer transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung đánh giá</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hãy chia sẻ trải nghiệm của bạn về nhà hàng này nhé..."
                className="min-h-32"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Thêm hình ảnh (tùy chọn)</Label>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  {!images && (
                    <Label
                      htmlFor="image-upload"
                      className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400"
                    >
                      {uploading ? (
                        <Loader2 className="absolute h-5 w-5 animate-spin text-gray-500" />
                      ) : (
                        <span className="text-2xl text-gray-500">+</span>
                      )}
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </Label>
                  )}

                  {/* Preview uploaded images */}
                  {images && (
                    <div className="flex flex-wrap gap-2">
                      <div className="relative h-32 w-32">
                        <img
                          src={images}
                          alt={`Review image`}
                          className="h-full w-full rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage()}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <ButtonInteract type="button" onClick={handleSubmit} className="w-full">
              Xác nhận đánh giá
            </ButtonInteract>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
