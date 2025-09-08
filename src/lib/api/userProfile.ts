import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config"; // adjust path as needed

export const UserProfileAPI = {
  getProfile: async (uid: string) => {
    const userDocRef = doc(db, "LimboUserMode", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      throw new Error("Profile not found");
    }

    const profileData = userSnap.data();

    // Optionally resolve teacher details from the reference
    let teacherDetails = null;
    if (profileData.isTeacher && profileData.teacher_ref) {
      const teacherRef = profileData.teacher_ref;
      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        teacherDetails = teacherSnap.data();
      }
    }

    return {
      profile: {
        ...profileData,
        uid,
      },
      teacherDetails,
    };
  }
};
