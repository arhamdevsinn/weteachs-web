// @ts-nocheck
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";

export const UserProfileAPI = {
  getProfile: async (uid: string) => {
    const userDocRef = doc(db, "LimboUserMode", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      throw new Error("Profile not found");
    }

    const profileData = userSnap.data();

    let teacherDetails = null;
    let gallery: string[] = [];
    let categories: any[] = []; // 👈 will hold resolved categories

    if (profileData.isTeacher && profileData.teacher_ref) {
      const teacherRef = profileData.teacher_ref; // DocumentReference -> TeacherDetails/{id}
      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        teacherDetails = { id: teacherRef.id, ...teacherSnap.data() };

        // 🔹 fetch categories from cat_refs
        if (Array.isArray(teacherDetails.cat_refs)) {
          const catDocs = await Promise.all(
            teacherDetails.cat_refs.map(async (catRef: any) => {
              const catSnap = await getDoc(catRef);
              return catSnap.exists() ? { id: catRef.id, ...catSnap.data() } : null;
            })
          );
          categories = catDocs.filter(Boolean); // remove nulls
        }

        // 🔹 teacher_gallery is a DocumentReference
        if (teacherDetails.teacher_gallery) {
          const galleryDocSnap = await getDoc(teacherDetails.teacher_gallery);

          if (galleryDocSnap.exists()) {
            const data = galleryDocSnap.data();

            // ✅ Expecting: { teacher_gallery_list: ["url1", "url2", ...] }
            if (Array.isArray(data.teacher_gallery_list)) {
              gallery = data.teacher_gallery_list;
            }
          }
        }
      }
    }

    return {
      profile: {
        ...profileData,
        uid,
      },
      teacherDetails,
      gallery,     
      categories,  
    };
  },
};
