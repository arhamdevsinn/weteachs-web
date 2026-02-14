// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
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
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  collection,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
// import { checkIfProfileExists } from "@/src/lib/api/userProfile";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";
import { UserProfileAPI } from "@/src/lib/api/userProfile";

const ExpertDialog = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [preview, setPreview] = useState("/placeholder-avatar.png");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const { userId } = useUserIdFromUrl();

  const { user } = useAuth();

  const [limboUser, setLimboUser] = useState< | null>(null);
  const [limboLoading, setLimboLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadLimbo = async () => {
      const uid = user?.uid || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
      if (!uid) return;
      setLimboLoading(true);
      try {
        const l = await UserProfileAPI.getLimboUser(uid);
        if (!mounted) return;
        setLimboUser(l || null);

      } catch (err) {
        console.warn("Failed to load limbo user:", err);
      } finally {
        if (mounted) setLimboLoading(false);
      }
    };

    
    loadLimbo();
    return () => {
      mounted = false;
    };
  }, [userId, user]);

  // === Image Preview ===
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, forCategory = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (forCategory) setCategoryData((prev) => ({ ...prev, imageFile: file }));
      else setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // === Validation Helpers ===
  const validateProfile = () => {
    if (!formData.display_name.trim()) return "Display name is required.";
    if (!formData.bio_T.trim()) return "Bio is required.";
    if (!formData.birthday.trim()) return "Birthday is required.";
    if (!formData.Howd_you_here_of_us) return "Please select how you heard about us.";
    if (!formData.imageFile) return "Please upload a profile picture.";
    return null;
  };

  const validateCategory = () => {
    if (!categoryData.title.trim()) return "Title is required.";
    if (!categoryData.topic.trim()) return "Topic is required.";
    if (!categoryData.description.trim()) return "Description is required.";
    // Handle category_rate as string or number
    if (
      categoryData.category_rate === undefined ||
      categoryData.category_rate === null ||
      (typeof categoryData.category_rate === "string" && !categoryData.category_rate.trim()) ||
      (typeof categoryData.category_rate === "number" && isNaN(categoryData.category_rate))
    ) {
      return "Rate is required.";
    }
    if (!categoryData.ExperienceLevel) return "Please select an experience level.";
    if (!categoryData.Language.trim()) return "Language is required.";
    if (!categoryData.imageFile) return "Please upload a category image.";
    return null;
  };

  useEffect(() => {
    const verifyProfileStatus = async () => {
      if (!userId) return;

      const exists = await checkIfProfileExists(userId);
      if (exists) {
        // ✅ Profile exists → Skip profile dialog, maybe go directly to category or close both
        setOpenProfile(false);
        setOpenCategory(false);
        localStorage.setItem("profileCreated", "true");
      } else {
        // 🟢 No profile yet → Open profile creation dialog
        setOpenProfile(true);
      }
    };

    verifyProfileStatus();
  }, [userId]);

  // === 🟣 Submit Teacher Profile ===
  const handleProfileSubmit = async () => {
    const validationError = validateProfile();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!userId) return toast.error("User ID not found. Please log in.");

    try {
      setLoading(true);
      // ensure usernameT (display_name) is unique among TeacherDetails
      const usernameToCheck = formData.display_name.trim();
      if (usernameToCheck) {
        const usernameQuery = query(
          collection(db, "TeacherDetails"),
          where("usernameT", "==", usernameToCheck)
        );
        const usernameSnap = await getDocs(usernameQuery);
        if (!usernameSnap.empty) {
          const other = usernameSnap.docs.find((d) => d.id !== userId);
          if (other) {
            setLoading(false);
            toast.error("Display name already in use. Choose another name.");
            return;
          }
        }
      }
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
        bio_T: formData.bio_T,
        cat_refs: [],
        created_time_t: serverTimestamp(),
        iSAvailable: false,
        isOnline: true,
        limbo_ref: doc(db, "LimboUserMode", userId),
        teacher: true,
        teacher_profile_picture: photoURL,
        usernameT: formData.display_name,
      };

      await setDoc(teacherRef, teacherData, { merge: true });
      const payload = {

        Birthday: new Date(formData.birthday),
        Howd_you_here_of_us: formData.Howd_you_here_of_us,
        Popup: false,
        Pre_testers: false,
        bio_set: true,
        created_time: serverTimestamp(),
        display_name: formData.display_name,
        isTeacher: true,
        photo_url: photoURL,
        signupcomplete: true,
        signupcompletepage2: false,
        teacher_ref: teacherRef,

      };
      if (!limboUser && user?.email) {
        payload.email = user.email;
        payload.uid = userId;
      }
      const limboRef = doc(db, "LimboUserMode", userId);
      await setDoc(
        limboRef,
        payload,
        { merge: true }
      );

      localStorage.setItem("profileCreated", "true");
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

  // === 🟡 Submit Category ===
  const handleCategorySubmit = async () => {
    const validationError = validateCategory();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!userId) return toast.error("User ID missing");

    try {
      setLoading(true);
      let imageURL = preview;

      if (categoryData.imageFile) {
        const storageRef = ref(storage, `users/${userId}/uploads/${categoryData.imageFile.name}`);
        await uploadBytes(storageRef, categoryData.imageFile);
        imageURL = await getDownloadURL(storageRef);
      }

      const categoryRef = await addDoc(collection(db, "Categories"), {
        ExperienceLevel: categoryData.ExperienceLevel,
        Language: categoryData.Language,
        category_rate: Number(categoryData.category_rate),
        description: categoryData.description,
        image: imageURL,
        teacher_name: formData.display_name,
        teacher_ref: doc(db, "TeacherDetails", userId),
        title: categoryData.title,
        topic: categoryData.topic,
        upload_time: serverTimestamp(),
        who_created_ref: doc(db, `LimboUserMode/${userId}`),
      });

      const teacherRef = doc(db, "TeacherDetails", userId);
      await setDoc(teacherRef, {
        cat_refs: arrayUnion(categoryRef.path),
      }, { merge: true });

      const limboRef = doc(db, "LimboUserMode", userId);
      await setDoc(
        limboRef,
        {

          signupcompletepage2: true,

        },
        { merge: true }
      );
      toast.success("Category created successfully!");
      setOpenCategory(false);
      router.push('/congratulations?expert=true&category=true');
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
        onClick={() => {
          if (limboUser && limboUser?.signupcomplete == true) {
            setOpenCategory(true);
          } else {
            setOpenProfile(true);
          }

        }}
        className="bg-primary text-white font-semibold px-6 py-2 rounded-full transition"
      >
        Become an Expert
      </Button>

      {/* === Profile Dialog === */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile} >
        <DialogContent className="max-w-md bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-center font-semibold">
              Create Teacher Profile
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Fill your details to become an expert.
            </DialogDescription>
          </DialogHeader>

          {/* Upload Image */}
          <div className="flex flex-col items-center mt-6 space-y-3">
            <label
              htmlFor="profile-upload"
              className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-primary/40 shadow-md flex items-center justify-center cursor-pointer transition-all hover:border-primary"
            >
              {preview && preview !== "/placeholder-avatar.png" ? (
                <img src={preview} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                  <User className="w-14 h-14 text-gray-400 mb-2" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                <Upload className="text-white w-6 h-6 mb-1" />
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md">
                  Change Photo
                </span>
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e)}
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Click or drag to upload your profile picture
            </p>
          </div>

          {/* Profile Fields */}
          <div className="space-y-3 mt-4">
            <label className="text-sm font-medium text-gray-700">Display Name</label>
            <Input
              placeholder="Your display name"
              onChange={(e) =>
                setFormData({ ...formData, display_name: e.target.value, usernameT: e.target.value })
              }
            />

            <label className="text-sm font-medium text-gray-700">Bio</label>
            <Input
              placeholder="Write a short bio"
              onChange={(e) => setFormData({ ...formData, bio_T: e.target.value })}
            />

            <label className="text-sm font-medium text-gray-700">Birthday</label>
            <Input
              type="date"
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />

            <label className="text-sm font-medium text-gray-700">
              How did you hear about us?
            </label>
            <Select
              onValueChange={(val) => setFormData({ ...formData, Howd_you_here_of_us: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
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
      <Dialog open={openCategory} onOpenChange={setOpenCategory} className="z-50 w-full">
  <DialogContent className="max-w-auto bg-white rounded-xl p-10 shadow-lg">
          <div className="flex flex-row gap-8">
            {/* Live Preview Card */}
            <div className="flex-1 min-w-[280px] max-w-[340px] bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="bg-gradient-to-r from-green-200 to-green-400 h-40 rounded-lg mb-6 flex items-center justify-center">
                {categoryData.imageFile ? (
                  <img src={URL.createObjectURL(categoryData.imageFile)} alt="Preview" className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm" />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h4 className="text-xl font-bold text-green-700">{categoryData.topic || "Topic (Math)"}</h4>
              <p className="text-gray-600">{categoryData.title || "Category (Education)"}</p>
              <p className="text-gray-600 mb-4">{categoryData.description || "Description (I can help you with algebra)"}</p>
              <div className="flex justify-between text-sm text-gray-700">
                <span>${categoryData.category_rate || 3} / 15min</span>
                <span>{categoryData.ExperienceLevel || "Level (Advanced)"}</span>
                <span>{categoryData.Language || "Language (English)"}</span>
              </div>
            </div>
            {/* Form Section */}
            <div className="flex-[2]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-primary">
                  Create Category
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Fill in details to create a new category for your expert profile.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <label className="text-sm font-medium text-gray-700">Category Title</label>
                <Input
                  placeholder="Title"
                  value={categoryData.title}
                  onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
                />
                <label className="text-sm font-medium text-gray-700">Topic</label>
                <Input
                  placeholder="Topic"
                  value={categoryData.topic}
                  onChange={(e) => setCategoryData({ ...categoryData, topic: e.target.value })}
                />
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  placeholder="Description"
                  value={categoryData.description}
                  onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                />
                <label className="text-sm font-medium text-gray-700">Rate (USD)</label>
                <Input
                  type="number"
                  min={3}
                  placeholder="Rate"
                  value={categoryData.category_rate}
                  onChange={(e) => {
                    const val = Math.max(3, Number(e.target.value));
                    setCategoryData({ ...categoryData, category_rate: val });
                  }}
                />
                <label className="text-sm font-medium text-gray-700">Experience Level</label>
                <Select
                  value={categoryData.ExperienceLevel}
                  onValueChange={(val) => setCategoryData({ ...categoryData, ExperienceLevel: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <label className="text-sm font-medium text-gray-700">Language</label>
                <Input
                  placeholder="Language (e.g. English)"
                  value={categoryData.Language}
                  onChange={(e) => setCategoryData({ ...categoryData, Language: e.target.value })}
                />
                <label className="text-sm font-medium text-gray-700">Upload Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e, true)}
                  className="text-sm"
                />
                {/* {categoryData.imageFile && (
                  <div className="mt-3 flex justify-center">
                    <div className="relative group">
                      <img src={URL.createObjectURL(categoryData.imageFile)} alt="Preview" className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm" />
                      <button
                        onClick={() => {
                          setCategoryData({ ...categoryData, imageFile: null });
                        }}
                        className="absolute top-1 right-1 bg-white text-red-500 rounded-full shadow p-1 hover:bg-red-100"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )} */}
              </div>
              <Button
                className="w-full mt-5 bg-primary text-white hover:bg-primary/90"
                onClick={handleCategorySubmit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpertDialog;
