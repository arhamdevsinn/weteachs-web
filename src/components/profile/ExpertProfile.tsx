// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { Upload, User } from "lucide-react";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";

const ExpertDialog = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [preview, setPreview] = useState("/placeholder-avatar.png");
  const [loading, setLoading] = useState(false);
  // const { userId } = useUserIdFromUrl();

  const db = getFirestore();
  const storage = getStorage();


  const [formData, setFormData] = useState({
    display_name: "",
    bio_T: "",
    birthday: "",
    Howd_you_here_of_us: "",
    imageFile: null as File | null,
    usernameT: "",
  });

  const [categoryData, setCategoryData] = useState({
    title: "",
    topic: "",
    description: "",
    category_rate: "",
    ExperienceLevel: "",
    Language: "",
    imageFile: null as File | null,
  });

  // === Preview upload ===
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, forCategory = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (forCategory) setCategoryData((prev) => ({ ...prev, imageFile: file }));
      else setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const { userId, usernameT, isTeacher } = useUserIdFromUrl();
  // === Submit teacher profile ===
const handleProfileSubmit = async () => {
  if (!userId) return toast.error("User ID not found. Please log in.");

  try {
    setLoading(true);
    let photoURL = preview;

    if (formData.imageFile) {
      const storageRef = ref(storage, `users/${userId}/uploads/${formData.imageFile.name}`);
      await uploadBytes(storageRef, formData.imageFile);
      photoURL = await getDownloadURL(storageRef);
    }

    const teacherRef = doc(db, "TeacherDetails", userId);
    const teacherData = {
      Language: categoryData.Language || "Eng",
      Live_Chat_rate: categoryData.category_rate || 0,
      Number_of_completed_jobs: [0, 0],
      Total_amount_earned: [0, 0],
      bio_T: formData.bio_T || "",
      cat_refs: [],
      created_time_t: serverTimestamp(),
      iSAvailable: false,
      isOnline: true,
      limbo_ref: `/LimboUserMode/${userId}`,
      teacher: true,
      teacher_profile_picture: photoURL,
      usernameT: formData.display_name, 
    };

    await setDoc(teacherRef, teacherData, { merge: true });

    const limboRef = doc(db, "LimboUserMode", userId);
    await setDoc(
      limboRef,
      {
        Birthday: formData.birthday ? new Date(formData.birthday) : null,
        Howd_you_here_of_us: formData.Howd_you_here_of_us,
        Popup: false,
        Pre_testers: false,
        bio_set: true,
        created_time: serverTimestamp(),
        display_name: formData.display_name,
        isTeacher: true,
        photo_url: photoURL,
        signupcomplete: true,
        signupcompletepage2: true,
        teacher_ref: teacherRef.path,
        uid: userId,
      },
      { merge: true }
    );

    toast.success("Profile created successfully!");
    setOpenProfile(false);
    setOpenCategory(true);
  } catch (err) {
    console.error("Error creating teacher profile:", err);
    toast.error("Error creating teacher profile");
  } finally {
    setLoading(false);
  }
};


  // === Submit category ===
  const handleCategorySubmit = async () => {
    if (!userId) return toast.error("User ID missing");

    try {
      setLoading(true);
      let imageURL = preview;

      if (categoryData.imageFile) {
        const storageRef = ref(storage, `users/${userId}/uploads/${categoryData.imageFile.name}`);
        await uploadBytes(storageRef, categoryData.imageFile);
        imageURL = await getDownloadURL(storageRef);
      }

      // ✅ Create category doc
      const categoryRef = await addDoc(collection(db, "Categories"), {
        ExperienceLevel: categoryData.ExperienceLevel,
        Language: categoryData.Language,
        category_rate: Number(categoryData.category_rate),
        description: categoryData.description,
        image: imageURL,
        teacher_name: formData.display_name,
        teacher_ref: `/TeacherDetails/${userId}`,
        title: categoryData.title,
        topic: categoryData.topic,
        upload_time: serverTimestamp(),
        who_created_ref: `/LimboUserMode/${userId}`,
      });

      // ✅ Append new category to TeacherDetails
      const teacherRef = doc(db, "TeacherDetails", userId);
      await setDoc(
        teacherRef,
        { cat_refs: arrayUnion(categoryRef.path) },
        { merge: true }
      );

      toast.success("Category created successfully!");
      // router.push('/profile?{usernameT}')
      setOpenCategory(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpenProfile(true)}
        className="bg-primary text-white font-semibold px-6 py-2 rounded-full  transition"
      >
        Become an Expert
      </Button>

      {/* === Profile Dialog === */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent className="max-w-md bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-center font-semibold">
              Create Teacher Profile
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Fill your details to become an expert.
            </DialogDescription>
          </DialogHeader>
<div className="flex flex-col items-center mt-6 space-y-3">
  <label
    htmlFor="profile-upload"
    className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-primary/40 shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg"
    tabIndex={0}
    aria-label="Upload profile picture"
  >
    {preview && preview !== "/placeholder-avatar.png" ? (
      <img
        src={preview}
        alt="Profile"
        className="object-cover w-full h-full rounded-full transition-transform duration-300 group-hover:scale-105"
      />
    ) : (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
        <User className="w-14 h-14 text-gray-400 mb-2" /> {/* Show User icon */}
      </div>
    )}
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
      <Upload className="text-white w-6 h-6 mb-1 animate-bounce" />
      <span className="bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md mt-1">
        Change Photo
      </span>
    </div>
    <input
      id="profile-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImage}
    />
  </label>
  <p className="text-xs text-gray-500 text-center">
    Click or drag to upload your profile picture
  </p>
</div>

          <div className="space-y-3 mt-4">
            <Input
              placeholder="Display Name"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_name: e.target.value,
                  usernameT: e.target.value, // ✅ auto-sync usernameT
                })
              }
            />
            <Input
              placeholder="Bio"
              onChange={(e) => setFormData({ ...formData, bio_T: e.target.value })}
            />
            <Input
              type="date"
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
            <Select
              onValueChange={(val) => setFormData({ ...formData, Howd_you_here_of_us: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="How did you hear about us?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Reddit">Reddit</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full mt-5 bg-primary text-white"
            onClick={handleProfileSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* === Category Dialog === */}
      <Dialog open={openCategory} onOpenChange={setOpenCategory}>
        <DialogContent className="max-w-md bg-white rounded-xl p-6">
          <DialogHeader>
       <DialogTitle className="text-xl text-center font-semibold">
        Create Category
      </DialogTitle>
      <DialogDescription className="text-center text-gray-500">
        Fill in details to create a new category for your expert profile.
      </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Input
              placeholder="Title"
              onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
            />
            <Input
              placeholder="Topic"
              onChange={(e) => setCategoryData({ ...categoryData, topic: e.target.value })}
            />
            <Input
              placeholder="Description"
              onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
            />
            <Input
              placeholder="Rate (USD)"
              type="number"
              onChange={(e) => setCategoryData({ ...categoryData, category_rate: e.target.value })}
            />
            <Select
              onValueChange={(val) => setCategoryData({ ...categoryData, ExperienceLevel: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Language"
              onChange={(e) => setCategoryData({ ...categoryData, Language: e.target.value })}
            />
            <label className="text-sm font-medium text-gray-600">Upload Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImage(e, true)} />
          </div>

          <Button
            className="w-full mt-5 bg-primary text-white"
            onClick={handleCategorySubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpertDialog;
