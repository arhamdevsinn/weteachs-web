import { doc, setDoc, collection } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";

export const CategoryAPI = {
  createTeacherCategory: async (teacherId: string, data: any) => {
    if (!teacherId) throw new Error("teacherId is required");
    if (!data) throw new Error("Category data is required");

    // 1. create category doc
    const categoryRef = doc(collection(db, "Categories"));
    await setDoc(categoryRef, {
      ...data,
      createdAt: new Date(),
    });

    // 2. link to teacher (auto-create if missing)
    const teacherRef = doc(db, "TeacherGallery", teacherId);
    await setDoc(
      teacherRef,
      { cat_refs: arrayUnion(categoryRef.id) }, // ✅ save ID not ref
      { merge: true }
    );

    return { id: categoryRef.id, ...data };
  },
};
