// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '@/src/lib/firebase/config';
import { toast } from 'sonner';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import { UserProfileData, TeacherDetails, Category } from '@/src/types/firebase';
import { useRouter } from 'next/navigation';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [subcollections, setSubcollections] = useState({
    videos: [],
    reviews: [],
    galleryCollection: [],
    expertTexts: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();
  const storage = getStorage();
  const router = useRouter();

  // 🔹 Upload helper
  const uploadImage = async (file: File, userId: string): Promise<string> => {
    const storageRef = ref(storage, `users/${userId}/uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // 🔹 Fetch Profile (existing)
  const fetchProfile = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const { profile, teacherDetails, gallery, categories, subcollections } =
        await UserProfileAPI.getProfile(uid);

      setProfile(profile);
      setTeacherDetails(teacherDetails);
      setGallery(gallery);
      setCategories(categories);
      setSubcollections(subcollections);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProfile(null);
      setTeacherDetails(null);
      setGallery([]);
      setSubcollections({
        videos: [],
        reviews: [],
        galleryCollection: [],
        expertTexts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create Teacher Profile
  const createTeacherProfile = async (data: {
    display_name: string;
    usernameT: string;
    bio_T: string;
    birthday: string;
    Howd_you_here_of_us: string;
    imageFile?: File | null;
  }) => {
    const user = auth.currentUser;
    if (!user) return toast.error("User not authenticated");

    try {
      setLoading(true);

      // Check if profile already exists
      const alreadyExists = await checkIfProfileExists(user.uid);
      if (alreadyExists) {
        toast.info("Profile already created — skipping form.");
        return;
      }

      let photoURL = "";
      if (data.imageFile) {
        photoURL = await uploadImage(data.imageFile, user.uid);
      }

      // ✅ TeacherDetails
      const teacherRef = doc(db, "TeacherDetails", user.uid);
      const teacherData = {
        Language: "Eng",
        Live_Chat_rate: 25,
        Number_of_completed_jobs: [0, 0],
        Total_amount_earned: [0, 0],
        bio_T: data.bio_T || "",
        cat_refs: [],
        created_time_t: serverTimestamp(),
        iSAvailable: false,
        isOnline: true,
        limbo_ref: `/LimboUserMode/${user.uid}`,
        teacher: true,
        teacher_profile_picture: photoURL,
        usernameT: data.usernameT || data.display_name,
      };
      await setDoc(teacherRef, teacherData, { merge: true });

      // ✅ LimboUserMode
      const limboRef = doc(db, "LimboUserMode", user.uid);
      await setDoc(
        limboRef,
        {
          Birthday: data.birthday ? new Date(data.birthday) : null,
          Howd_you_here_of_us: data.Howd_you_here_of_us,
          Popup: false,
          Pre_testers: false,
          bio_set: true,
          created_time: serverTimestamp(),
          display_name: data.display_name,
          isTeacher: true,
          photo_url: photoURL,
          signupcomplete: true,
          signupcompletepage2: true,
          teacher_ref: teacherRef.path,
          uid: user.uid,
        },
        { merge: true }
      );

      toast.success("Profile created successfully!");
      await fetchProfile(); // Refresh after creation
    } catch (err) {
      console.error("Error creating teacher profile:", err);
      toast.error("Error creating teacher profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Check if profile already exists
  const checkIfProfileExists = async (userId: string) => {
    const teacherRef = doc(db, "TeacherDetails", userId);
    const teacherSnap = await getDoc(teacherRef);
    return teacherSnap.exists(); // ✅ returns true if profile exists
  };

  // 🔹 Create Category
  const createCategory = async (data: {
    title: string;
    topic: string;
    description: string;
    category_rate: string;
    ExperienceLevel: string;
    Language: string;
    imageFile?: File | null;
  }) => {
    const user = auth.currentUser;
    if (!user) return toast.error("User not authenticated");

    try {
      setLoading(true);

      let imageURL = "";
      if (data.imageFile) {
        imageURL = await uploadImage(data.imageFile, user.uid);
      }

      // ✅ Add category doc
      const categoryRef = await addDoc(collection(db, "Categories"), {
        ExperienceLevel: data.ExperienceLevel,
        Language: data.Language,
        category_rate: Number(data.category_rate),
        description: data.description,
        image: imageURL,
        teacher_name: profile?.display_name || "",
        teacher_ref: `/TeacherDetails/${user.uid}`,
        title: data.title,
        topic: data.topic,
        upload_time: serverTimestamp(),
        who_created_ref: `/LimboUserMode/${user.uid}`,
      });

      // ✅ Append to teacher
      const teacherRef = doc(db, "TeacherDetails", user.uid);
      await setDoc(teacherRef, { cat_refs: arrayUnion(categoryRef.path) }, { merge: true });

      toast.success("Category created successfully!");
      await fetchProfile(); // Refresh after category creation
      router.push('/profile');
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get teacher by username
  const getTeacherByUsername = async (usernameT: string) => {
    try {
      const teacherRef = collection(db, "TeacherDetails");
      const q = query(teacherRef, where("usernameT", "==", usernameT));
      const snap = await getDocs(q);

      if (snap.empty) throw new Error("Teacher not found");

      const teacherDoc = snap.docs[0];
      const teacherData = { id: teacherDoc.id, ...teacherDoc.data() };

      let profileData = null;
      if (teacherData.limbo_ref) {
        const limboDocRef = doc(db, teacherData.limbo_ref);
        const limboSnap = await getDoc(limboDocRef);
        if (limboSnap.exists()) {
          profileData = { id: limboDocRef.id, ...limboSnap.data() };
        }
      }

      return { teacherDetails: teacherData, profile: profileData };
    } catch (error) {
      console.error("Error fetching teacher by username:", error);
      throw error;
    }
  };

    // 🔹 Get student by username
  const getStudentByUsername = async (usernameT: string) => {
    try {
      const studentRef = collection(db, "StudentDetails");
      const q = query(studentRef, where("usernameT", "==", usernameT));
      const snap = await getDocs(q);

      if (snap.empty) throw new Error("Student not found");

      const studentDoc = snap.docs[0];
      const studentData = { id: studentDoc.id, ...studentDoc.data() };

      let profileData = null;
      if (studentData.limbo_ref) {
        const limboDocRef = doc(db, studentData.limbo_ref);
        const limboSnap = await getDoc(limboDocRef);
        if (limboSnap.exists()) {
          profileData = { id: limboDocRef.id, ...limboSnap.data() };
        }
      }

      return { studentDetails: studentData, profile: profileData };
    } catch (error) {
      console.error("Error fetching student by username:", error);
      throw error;
    }
  };

  // 🔹 Auto-fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [uid]);

  return {
    profile,
    teacherDetails,
    gallery,
    categories,
    subcollections,
    loading,
    error,
    createTeacherProfile,
    createCategory,
    checkIfProfileExists, 
    refreshData: fetchProfile,
    getTeacherByUsername,
  };
};
