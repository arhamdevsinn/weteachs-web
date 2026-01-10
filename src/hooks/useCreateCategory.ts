// @ts-nocheck
import { useState } from "react";
import { FirestoreService } from "@/src/lib/firebase/firestore";
import { useUploadImage } from "@/src/hooks/useUploadImage";
import { useSearchParams } from "next/navigation";
import { doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config"; // ensure db import for building refs

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage } = useUploadImage();
  const searchParams = useSearchParams(); 

  const createCategory = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const expertId = typeof window !== "undefined"
        ? localStorage.getItem("userId") || localStorage.getItem("user_id")
        : null; // ✅ extract once
      if (!expertId) {
        throw new Error("Missing expertId (userId) in localStorage");
      }

      // upload image if provided
      let imageUrl = data.imageUrl || "";
      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile, "categories");
      }

      // Build document payload with proper field names and refs
      const categoryData = {
        title: data.title || data.category || "",
        topic: data.topic || "",
        description: data.description || "",
        category_rate: Number(data.rate ?? data.category_rate ?? 0),
        Language: data.language || data.Language || "Language",
        ExperienceLevel: data.level || data.ExperienceLevel || "",
        image: imageUrl,
        teacher_name: data.teacher_name || "",
        upload_time: serverTimestamp(),
        // store references as DocumentReference objects
        teacher_ref: data.teacher_ref
          ? (typeof data.teacher_ref === "string" && data.teacher_ref.includes("/")
              ? doc(db, ...data.teacher_ref.split("/"))
              : doc(db, "TeacherDetails", data.teacher_ref))
          : doc(db, "TeacherDetails", expertId),
        who_created_ref: doc(db, "LimboUserMode", expertId),
        who_created_id: expertId,
        createdAt: serverTimestamp(),
        inviteCode: data.inviteCode || "",
      };

      await FirestoreService.saveDocument("ExpertCategories", categoryData);

      return { success: true, message: "Category created successfully!" };
    } catch (err) {
      console.error("❌ Error creating category:", err);
      setError(err?.message || String(err));
      return { success: false, message: err?.message || String(err) };
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error };
};
