"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/utils/uploadImage";

interface ImageUploaderProps {
  onUpload: (url: string) => void; // returns Cloudinary image URL
  initialUrl?: string; // 👈 new prop for edit mode
}

export function ImageUploader({ onUpload, initialUrl }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 👇 preload the initial image if passed
  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
      onUpload(initialUrl); // ensure parent state gets the value
    }
  }, [initialUrl, onUpload]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview before uploading
    setPreview(URL.createObjectURL(file));

    setLoading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative w-48 h-48">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}

      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
