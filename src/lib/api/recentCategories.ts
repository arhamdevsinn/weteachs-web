// @ts-nocheck
import { db } from "@/src/lib/firebase/config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";

export interface RecentCategory {
  id: string;
  title: string;
  category_image_url?: string;
  description?: string;
  teacher_name?: string;
  teacher_photo_url?: string;
  upload_time?: string;
  teacher_ref?: string;
}

export const getRecentCategories = async (limitCount: number = 8): Promise<RecentCategory[]> => {
  try {
    const categoriesCollection = collection(db, "Categories");
    const q = query(
      categoriesCollection,
      orderBy("upload_time", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const categories: RecentCategory[] = [];

    for (const docSnap of querySnapshot.docs) {
      const categoryData = docSnap.data();
      
      let teacherName = "";
      let teacherPhotoUrl = "";

      // If category has a teacher reference, fetch teacher details
      if (categoryData.teacher_ref) {
        try {
          const teacherRef =
            typeof categoryData.teacher_ref === "string"
              ? doc(
                  db,
                  categoryData.teacher_ref.startsWith("/")
                    ? categoryData.teacher_ref.slice(1)
                    : categoryData.teacher_ref
                )
              : categoryData.teacher_ref;

          const teacherSnap = await getDoc(teacherRef);

          if (teacherSnap.exists()) {
            const teacherData = teacherSnap.data();

            // Try to get limbo reference for teacher name and photo
            if (teacherData.limbo_ref) {
              try {
                const limboRef =
                  typeof teacherData.limbo_ref === "string"
                    ? doc(
                        db,
                        teacherData.limbo_ref.startsWith("/")
                          ? teacherData.limbo_ref.slice(1)
                          : teacherData.limbo_ref
                      )
                    : teacherData.limbo_ref;

                const limboSnap = await getDoc(limboRef);
                if (limboSnap.exists()) {
                  const limboData = limboSnap.data();
                  teacherName = limboData.display_name || limboData.name || "";
                  teacherPhotoUrl = limboData.photo_url || "";
                }
              } catch (error) {
                console.error("Error fetching limbo details:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching teacher details:", error);
        }
      }

      categories.push({
        id: docSnap.id,
        category_name: categoryData.category_name || "Unknown Category",
        category_image_url: categoryData.category_image_url || "/sample.png",
        description: categoryData.description || "",
        teacher_name: teacherName,
        teacher_photo_url: teacherPhotoUrl || "/pro.png",
        upload_time: categoryData.upload_time,
        teacher_ref: categoryData.teacher_ref,
      });
    }

    return categories;
  } catch (error) {
    console.error("Error fetching recent categories:", error);
    throw error;
  }
};
