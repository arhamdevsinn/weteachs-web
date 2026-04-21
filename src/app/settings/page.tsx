// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { db, storage } from "@/src/lib/firebase/config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton"; // added import

const SettingsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const paramUserId = searchParams.get("userId") || searchParams.get("uid");
  const storedId =
    typeof window !== "undefined"
      ? paramUserId ||
        localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        user?.uid ||
        null
      : null;

  const { profile, teacherDetails, loading: profileLoading } = useUserProfile(storedId || undefined);

  // form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [localStripeAccountId, setLocalStripeAccountId] = useState("");
  const [localStripeChargesEnabled, setLocalStripeChargesEnabled] = useState(false);
  const [stripeErrorMessage, setStripeErrorMessage] = useState("");
  const [stripeActionUrl, setStripeActionUrl] = useState("");

  const profileName = displayName || profile?.display_name || profile?.displayName || "Your profile";
  const existingStripeAccountId =
    teacherDetails?.stripeAccountID ||
    profile?.stripeAccountID ||
    teacherDetails?.stripeAccountId ||
    profile?.stripeAccountId ||
    teacherDetails?.stripe_id ||
    profile?.stripe_id ||
    "";
  const stripeAccountId = localStripeAccountId || existingStripeAccountId;
  const existingStripeChargesEnabled = Boolean(
    teacherDetails?.stripeChargesEnabled ||
      profile?.stripeChargesEnabled ||
      teacherDetails?.charges_enabled ||
      profile?.charges_enabled
  );
  const stripeChargesEnabled = localStripeAccountId ? localStripeChargesEnabled : existingStripeChargesEnabled;
  const isStripeConnected = Boolean(stripeAccountId);
  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  // prefill when profile loaded
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || profile.displayName || "");
    setEmail(profile.email || "");
    setBio(teacherDetails?.bio_T || profile.bio || "");
    setWebsite(teacherDetails?.website || profile.website || "");
    setInstagram(teacherDetails?.Instagram || "");
    setFacebook(teacherDetails?.Facebook || "");
    setTiktok(teacherDetails?.Tiktok || "");
    setYoutube(teacherDetails?.youtube || "");
    setIsTeacher(Boolean(profile.isTeacher || profile.isTeacher === true || profile.isTeacher === "true" || profile.isTeacher));
    setPhotoPreview(profile.photo_url || null);
  }, [profile, teacherDetails]);

  useEffect(() => {
    if (existingStripeAccountId) {
      setLocalStripeAccountId(existingStripeAccountId);
      setLocalStripeChargesEnabled(existingStripeChargesEnabled);
    }
  }, [existingStripeAccountId, existingStripeChargesEnabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPhotoPreview(url);
    }
  };

  const handleSave = async () => {
    if (!storedId) {
      toast.error("User id not found. Cannot save profile.");
      return;
    }
    setSaving(true);
    try {
      // upload photo if present
      let photoURL = profile?.photo_url || "";
      if (photoFile) {
        const sRef = storageRef(storage, `users/${storedId}/profile_${Date.now()}_${photoFile.name}`);
        await uploadBytes(sRef, photoFile);
        photoURL = await getDownloadURL(sRef);
      }

      // update limbo user doc (assumes LimboUserMode collection)
      const limboDoc = doc(db, "LimboUserMode", storedId);
      const limboPayload = {
        display_name: displayName,
        email,
        photo_url: photoURL,
      };

      await updateDoc(limboDoc, limboPayload).catch(() => {

      });

      if (isTeacher) {
        const teacherDoc = doc(db, "TeacherDetails", teacherDetails?.id || storedId);
        const teacherPayload = {
          bio_T: bio,
          website,
        };
        if (instagram) teacherPayload.Instagram = instagram;
        if (facebook) teacherPayload.Facebook = facebook;
        if (tiktok) teacherPayload.Tiktok = tiktok;
        if (youtube) teacherPayload.youtube = youtube;

        await updateDoc(teacherDoc, teacherPayload).catch(() => {
          // ignore if teacher doc missing
        });
      }

      toast.success("Profile updated successfully");
      // refresh / navigate back to profile
      router.push("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Replace the simple loading fallback with skeletons
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 space-y-6 animate-pulse">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-5 w-3/4 rounded-md mb-3" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-5 w-3/4 rounded-md mb-3" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-5 w-1/4 rounded-md mb-3" />
              <Skeleton className="h-36 w-full rounded-md" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edit Profile</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-40 flex-shrink-0 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden border border-gray-200 mb-3">
              {photoPreview ? (
                // next/image requires static dimensions; using img for preview simplicity
                // (you can swap to Next.js Image if you prefer)
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Photo
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm text-primary underline">
              Change Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Display Name</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Bio (Expert)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-3 border rounded resize-none h-28"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Instagram</label>
                <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Facebook</label>
                <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">TikTok</label>
                <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">YouTube</label>
                <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    <CreditCard className="h-3.5 w-3.5" />
                    Stripe payouts
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Connect Stripe</h3>
                    <p className="text-sm text-slate-600">
                      Set up your payout profile and review your current Stripe connection status.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    {isStripeConnected
                      ? stripeChargesEnabled
                        ? `Connected and enabled: ${stripeAccountId}`
                        : `Connected: ${stripeAccountId}`
                      : "Not connected yet"}
                  </div>
                </div>

                <Button type="button" className="min-w-40" onClick={() => router.push(`/stripe?userId=${encodeURIComponent(storedId || "")}`)}>
                  Connect Stripe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
