"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/utils/uploadImage";

interface ImageUploaderProps {
  onUpload: (url: string) => void; // returns Cloudinary image URL
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview before uploading
    setPreview(URL.createObjectURL(file));

    setLoading(true);
    try {
      const url = await uploadImageToCloudinary(file);
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
