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
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { Upload, User } from "lucide-react";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";

const StudentDialog = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [preview, setPreview] = useState("/placeholder-avatar.png");
    const [loading, setLoading] = useState(false);
    const db = getFirestore();
    const storage = getStorage();

    const [formData, setFormData] = useState({
        display_name: "",
        bio_S: "",
        birthday: "",
        Howd_you_here_of_us: "",
        imageFile: null,
    });

    const { userId } = useUserIdFromUrl();

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, imageFile: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

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

            const studentRef = doc(db, "StudentDetails", userId);
            const studentData = {
                Language: "Eng",
                bio_S: formData.bio_S || "",
                created_time_t: serverTimestamp(),
                iSAvailable: false,
                isOnline: true,
                limbo_ref: `/LimboUserMode/${userId}`,
                student: true,
                student_profile_picture: photoURL,
                usernameS: formData.display_name,
            };

            await setDoc(studentRef, studentData, { merge: true });

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
                    isStudent: true,
                    photo_url: photoURL,
                    signupcomplete: true,
                    signupcompletepage2: true,
                    student_ref: studentRef.path,
                    uid: userId,
                },
                { merge: true }
            );

            toast.success("Profile created successfully!");
            setOpenProfile(false);
        } catch (err) {
            console.error("Error creating student profile:", err);
            toast.error("Error creating student profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpenProfile(true)}
                className="bg-primary text-white font-semibold px-6 py-2 rounded-full transition"
            >
                Become a Student
            </Button>

            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
                <DialogContent className="max-w-md bg-white rounded-xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center font-semibold">
                            Create Student Profile
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-500">
                            Fill your details to become a student.
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
                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        />
                        <Input
                            placeholder="Bio"
                            onChange={(e) => setFormData({ ...formData, bio_S: e.target.value })}
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
        </>
    );
};

export default StudentDialog;
