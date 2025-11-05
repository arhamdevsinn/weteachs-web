"use client";
import React, { useState } from "react";
import Image from "next/image";

const ImageUploader = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file)); // 👉 create temporary preview URL
    }
  };

  return (
    <div className="mb-6 text-center">
      <label
        htmlFor="imageUpload"
        className="h-40 w-full bg-gray-100 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition relative overflow-hidden"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={160}
            height={160}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <>
            <span className="text-primary text-sm">
              Click or drag an image to upload
            </span>
            <span className="text-xs text-primary mt-1">
              Upload an image to stand out!
            </span>
          </>
        )}
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
