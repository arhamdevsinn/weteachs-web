// @ts-nocheck
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
    let categories: [] = [];

    // initialize subcollections to avoid ReferenceError
    let teacherVideos: [] = [];
    let teacherReviews: [] = [];
    let teacherGalleryCollection: [] = [];
    let teacherExpertTexts: [] = [];

    if (profileData.isTeacher && profileData.teacher_ref) {
      const teacherRef = profileData.teacher_ref;
      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        teacherDetails = { id: teacherRef.id, ...teacherSnap.data() };

        // 🔹 Fetch category data
        if (Array.isArray(teacherDetails.cat_refs)) {
          const catDocs = await Promise.all(
            teacherDetails.cat_refs.map(async (catRef) => {
              const catSnap = await getDoc(catRef);
              return catSnap.exists() ? { id: catRef.id, ...catSnap.data() } : null;
            })
          );
          categories = catDocs.filter(Boolean);
        }

        // 🔹 Fetch gallery list
        if (teacherDetails.teacher_gallery) {
          const galleryDocSnap = await getDoc(teacherDetails.teacher_gallery);
          if (galleryDocSnap.exists()) {
            const data = galleryDocSnap.data();
            if (Array.isArray(data.teacher_gallery_list)) {
              gallery = data.teacher_gallery_list;
            }
          }
        }

        // 🔹 Fetch subcollections
        const teacherDocRef = doc(db, "TeacherDetails", teacherRef.id);

        // 1️⃣ TeacherVideoCollection
        const videoSnap = await getDocs(collection(teacherDocRef, "TeacherVideoCollection"));
        teacherVideos = videoSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 2️⃣ TeacherReviews
        const reviewSnap = await getDocs(collection(teacherDocRef, "TeacherReviews"));
        teacherReviews = reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 3️⃣ TeacherGalleryCollection
        const gallerySnap = await getDocs(collection(teacherDocRef, "TeacherGalleryCollection"));
        teacherGalleryCollection = gallerySnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 4️⃣ Expert_Text_collection
        const expertSnap = await getDocs(collection(teacherDocRef, "Expert_Text_collection"));
        teacherExpertTexts = expertSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      subcollections: {
        videos: teacherVideos,
        reviews: teacherReviews,
        galleryCollection: teacherGalleryCollection,
        expertTexts: teacherExpertTexts,
      },
    };
  },
};
