// @ts-nocheck
import { useState } from "react";
import { FirestoreService } from "@/src/lib/firebase/firestore";
import { useUploadImage } from "@/src/hooks/useUploadImage";
import { useSearchParams } from "next/navigation";

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage } = useUploadImage();
  const searchParams = useSearchParams(); // ✅ must be initialized here

  const createCategory = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const expertId = searchParams.get("userId"); // ✅ extract once
      if (!expertId) {
        throw new Error("Missing expertId (userId) in URL!");
      }

      // ✅ upload image if provided
      let imageUrl = "";
      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile, "categories");
      }

      const categoryData = {
        expertId,
        category: data.category,
        level: data.level,
        topic: data.topic,
        description: data.description,
        rate: Number(data.rate),
        language: data.language,
        inviteCode: data.inviteCode || "",
        imageUrl,
        createdAt: new Date(),
      };

      await FirestoreService.saveDocument("ExpertCategories", categoryData);

      return { success: true, message: "Category created successfully!" };
    } catch (err) {
      console.error("❌ Error creating category:", err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error };
};
