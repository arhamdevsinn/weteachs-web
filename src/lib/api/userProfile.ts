// @ts-nocheck
import { db } from "@/src/lib/firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const UserProfileAPI = {

  getProfile: async (uid: string) => {
    const userDocRef = doc(db, "LimboUserMode", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) throw new Error("Profile not found");

    const profileData = userSnap.data();
    let teacherDetails = null;
    let gallery: [] = [];
    let categories: [] = [];
    let teacherVideos: [] = [];
    let teacherReviews: [] = [];
    let teacherGalleryCollection: [] = [];
    let teacherExpertTexts: [] = [];

    if (profileData.isTeacher && profileData.teacher_ref) {
      const teacherRef =
        typeof profileData.teacher_ref === "string"
          ? doc(
              db,
              profileData.teacher_ref.startsWith("/")
                ? profileData.teacher_ref.slice(1)
                : profileData.teacher_ref
            )
          : profileData.teacher_ref;

      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        teacherDetails = { id: teacherRef.id, ...teacherSnap.data() };

        // Fetch category data
        if (Array.isArray(teacherDetails.cat_refs)) {
          const catDocs = await Promise.all(
            teacherDetails.cat_refs.map(async (catRefPath) => {
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
              return catSnap.exists()
                ? { id: catRef.id, ...catSnap.data() }
                : null;
            })
          );
          categories = catDocs.filter(Boolean);
        }

        // Fetch gallery list
        if (teacherDetails.teacher_gallery) {
          const galleryRef =
            typeof teacherDetails.teacher_gallery === "string"
              ? doc(
                  db,
                  teacherDetails.teacher_gallery.startsWith("/")
                    ? teacherDetails.teacher_gallery.slice(1)
                    : teacherDetails.teacher_gallery
                )
              : teacherDetails.teacher_gallery;

          const galleryDocSnap = await getDoc(galleryRef);
          if (galleryDocSnap.exists()) {
            const data = galleryDocSnap.data();
            if (Array.isArray(data.teacher_gallery_list)) {
              gallery = data.teacher_gallery_list;
            }
          }
        }

        // Fetch subcollections
        const teacherDocRef = doc(db, "TeacherDetails", teacherRef.id);
        const [videoSnap, reviewSnap, gallerySnap, expertSnap] =
          await Promise.all([
            getDocs(collection(teacherDocRef, "TeacherVideoCollection")),
            getDocs(collection(teacherDocRef, "TeacherReviews")),
            getDocs(collection(teacherDocRef, "TeacherGalleryCollection")),
            getDocs(collection(teacherDocRef, "Expert_Text_collection")),
          ]);

        teacherVideos = videoSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        teacherReviews = reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        teacherGalleryCollection = gallerySnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        teacherExpertTexts = expertSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
      }
    }

    return {
      profile: { ...profileData, uid },
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

async getTeacherByUsername(usernameT: string) {
  const teacherQuery = query(
    collection(db, "TeacherDetails"),
    where("usernameT", "==", usernameT)
  );

  const querySnapshot = await getDocs(teacherQuery);
  if (querySnapshot.empty) throw new Error("No teacher found");

  const teacherDoc = querySnapshot.docs[0];
  const teacherData = { id: teacherDoc.id, ...teacherDoc.data() };

  // ---------- Profile (limbo_ref) ----------
  let userProfile = null;
  if (teacherData.limbo_ref) {
    let limboRef;
    if (typeof teacherData.limbo_ref === "string") {
      limboRef = doc(db, teacherData.limbo_ref.replace(/^\//, ""));
    } else if (
      typeof teacherData.limbo_ref === "object" &&
      "path" in teacherData.limbo_ref
    ) {
      limboRef = teacherData.limbo_ref;
    }

    if (limboRef) {
      const limboSnap = await getDoc(limboRef);
      if (limboSnap.exists()) {
        userProfile = { id: limboRef.id, ...limboSnap.data() };
      }
    }
  }

  // ---------- Categories ----------
  let categories: [] = [];
  if (Array.isArray(teacherData.cat_refs)) {
    const catDocs = await Promise.all(
      teacherData.cat_refs.map(async (refPath) => {
        let ref;
        if (typeof refPath === "string") {
          ref = doc(db, refPath.replace(/^\//, ""));
        } else if (typeof refPath === "object" && "path" in refPath) {
          ref = refPath;
        } else return null;

        const snap = await getDoc(ref);
        return snap.exists() ? { id: ref.id, ...snap.data() } : null;
      })
    );
    categories = catDocs.filter(Boolean);
  }

  // ---------- Subcollections ----------
  const teacherDocRef = doc(db, "TeacherDetails", teacherData.id);

  const [videoSnap, reviewSnap, gallerySnap, expertSnap] = await Promise.all([
    getDocs(collection(teacherDocRef, "TeacherVideoCollection")),
    getDocs(collection(teacherDocRef, "TeacherReviews")),
    getDocs(collection(teacherDocRef, "TeacherGalleryCollection")),
    getDocs(collection(teacherDocRef, "Expert_Text_collection")),
  ]);

  const teacherVideos = videoSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const teacherReviews = reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const teacherGalleryCollection = gallerySnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
  const teacherExpertTexts = expertSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    teacher: teacherData,
    userProfile,
    categories,
    subcollections: {
      videos: teacherVideos,
      reviews: teacherReviews,
      galleryCollection: teacherGalleryCollection,
      expertTexts: teacherExpertTexts,
    },
  };
}

};
