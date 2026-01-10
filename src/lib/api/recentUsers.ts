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

export interface RecentUser {
  id: string;
  name: string;
  email?: string;
  profileImageUrl?: string;
  isTeacher?: boolean;
  bio?: string;
  categoryName?: string;
  rating?: number;
  createdAt?;
}

export const getRecentUsers = async (limitCount: number = 20): Promise<RecentUser[]> => {
  try {
    const usersCollection = collection(db, "LimboUserMode");
    const q = query(
      usersCollection,
      orderBy("created_time", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const users: RecentUser[] = [];

    for (const docSnap of querySnapshot.docs) {
      const userData = docSnap.data();
      
      let categoryName = "";
      let rating = 0;

      // If user is a teacher, fetch their category
      if (userData.isTeacher && userData.teacher_ref) {
        try {
          const teacherRef =
            typeof userData.teacher_ref === "string"
              ? doc(
                  db,
                  userData.teacher_ref.startsWith("/")
                    ? userData.teacher_ref.slice(1)
                    : userData.teacher_ref
                )
              : userData.teacher_ref;

          const teacherSnap = await getDoc(teacherRef);

          if (teacherSnap.exists()) {
            const teacherData = teacherSnap.data();
            rating = teacherData.rating || 0;

            // Get first category if available
            if (Array.isArray(teacherData.cat_refs) && teacherData.cat_refs.length > 0) {
              const catRefPath = teacherData.cat_refs[0];
              const catRef =
                typeof catRefPath === "string"
                  ? doc(
                      db,
                      catRefPath.startsWith("/")
                        ? catRefPath.slice(1)
                        : catRefPath
                    )
                  : catRefPath;

              const catSnap = await getDoc(catRef);
              if (catSnap.exists()) {
                categoryName = catSnap.data().category_name || "";
              }
            }
          }
        } catch (error) {
          console.error("Error fetching teacher details:", error);
        }
      }

      users.push({
        id: docSnap.id,
        name: userData.display_name || userData.name || "Unknown User",
        email: userData.email,
        profileImageUrl: userData.photo_url || userData.profileImageUrl || "/pro.png",
        isTeacher: userData.isTeacher || false,
        bio: userData.bio_set ? (userData.bio || "") : "",
        categoryName,
        rating,
        createdAt: userData.created_time || userData.createdAt,
      });
    }

    return users;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    throw error;
  }
};
