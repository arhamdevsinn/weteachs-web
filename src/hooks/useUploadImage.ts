// @ts-nocheck
import { useState } from "react";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/lib/firebase/config"; 
export const useUploadImage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const storage = getStorage(app);

  const uploadImage = async (file: File, folder: string = "uploads") => {
    if (!file) throw new Error("No file provided.");

    setUploading(true);
    setError(null);

    try {
      // Create a unique file name (timestamp + original name)
      const timestamp = Date.now();
      const fileRef = ref(storage, `${folder}/${timestamp}_${file.name}`);

      // Upload the file
      await uploadBytes(fileRef, file);

      // Get the download URL
      const url = await getDownloadURL(fileRef);

      console.log("✅ Uploaded successfully:", url);
      return url;
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      setError(err.message || "Image upload failed.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
