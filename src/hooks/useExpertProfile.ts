// @ts-nocheck
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "@/src/lib/firebase/config";

export const useExpertProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Uploads a file to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const filePath = `experts/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // 🔹 Creates a new expert profile
  const createExpertProfile = async (profileData: {
    display_name: string;
    bio: string;
    Birthday: string;
    Howd_you_here_of_us: string;
    imageFile?: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      let imageUrl = "";
      if (profileData.imageFile) {
        imageUrl = await uploadImage(profileData.imageFile);
      }

      const expertRef = doc(db, "experts", user.uid);
      await setDoc(expertRef, {
        uid: user.uid,
        display_name: profileData.display_name,
        bio: profileData.bio,
        Birthday: profileData.Birthday,
        Howd_you_here_of_us: profileData.Howd_you_here_of_us,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      return { success: true, expertId: user.uid };
    } catch (err) {
      console.error("Profile creation failed:", err);
      setError(err.message || "An unknown error occurred");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Updates existing expert profile
  const updateExpertProfile = async (updates: {
    display_name?: string;
    bio?: string;
    Birthday?: string;
    Howd_you_here_of_us?: string;
    imageFile?: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const expertRef = doc(db, "experts", user.uid);
      const expertSnap = await getDoc(expertRef);
      if (!expertSnap.exists()) throw new Error("Expert profile not found");

      let imageUrl = expertSnap.data().imageUrl || "";
      if (updates.imageFile) {
        imageUrl = await uploadImage(updates.imageFile);
      }

      const updateData = {
        ...(updates.display_name && { display_name: updates.display_name }),
        ...(updates.bio && { bio: updates.bio }),
        ...(updates.Birthday && { Birthday: updates.Birthday }),
        ...(updates.Howd_you_here_of_us && { Howd_you_here_of_us: updates.Howd_you_here_of_us }),
        ...(imageUrl && { imageUrl }),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(expertRef, updateData);

      return { success: true };
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.message || "An unknown error occurred");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createExpertProfile, updateExpertProfile, loading, error };
};
