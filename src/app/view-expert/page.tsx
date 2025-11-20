// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import { Button } from "@/src/components/ui/button";

const ViewExpertPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const teacherId = params.get("teacherId");
  const [teacher, setTeacher] = useState< | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "gallery">("overview");

  useEffect(() => {
    // try read from sessionStorage first
    try {
      const stored = sessionStorage.getItem("view_expert_teacher");
      if (stored) {
        setTeacher(JSON.parse(stored));
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Failed to read teacher from sessionStorage", e);
    }

    // fallback: fetch teacher document by id if provided
    const load = async () => {
      if (!teacherId) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "LimboUserMode", teacherId);
        const snap = await getDoc(ref);
        if (snap.exists()) setTeacher({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Failed to fetch teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teacherId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="animate-pulse bg-white rounded-2xl shadow-md w-full max-w-4xl p-8" />
      </div>
    );

  if (!teacher)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-lg">
          <h2 className="text-xl font-semibold">Teacher not found</h2>
          <p className="text-sm text-gray-500 mt-2">This teacher profile could not be loaded.</p>
          <div className="mt-4">
            <Button onClick={() => router.push("/")}>Go home</Button>
          </div>
        </div>
      </div>
    );

  const avatar =
    teacher.teacher_profile_picture ||
    teacher.photo_url ||
    teacher.photoURL ||
    "/logo.png";

  return (
    <div className="bg-secondary min-h-screen py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-4 py-6">
          <div className="relative w-36 h-36 md:w-40 md:h-40 flex-shrink-0">
            <Image
              src={avatar}
              alt={teacher.usernameT || teacher.display_name || teacher.teacher_name || "Teacher"}
              fill
              className="rounded-full object-cover border-4 border-secondary shadow-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {teacher.usernameT || teacher.display_name || teacher.teacher_name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{teacher.bio_T || teacher.bio || ""}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="px-3 py-1 rounded-full bg-gray-100">{teacher.Language || teacher.Language || "Any"}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100">{teacher.ExperienceLevel || teacher.ExperienceLevel || "—"}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100">Rate: ${teacher.Live_Chat_rate ?? teacher.category_rate ?? "—"}/15min</span>
                  <span className={`px-3 py-1 rounded-full ${teacher.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {teacher.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Completed jobs</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Array.isArray(teacher.Number_of_completed_jobs) ? teacher.Number_of_completed_jobs.length : (teacher.Number_of_completed_jobs ?? 0)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => router.push(`/chat?teacherId=${teacher.id || teacher.uid}`)} className="bg-primary text-white">
                    Message
                  </Button>
                  <Button onClick={() => router.push(`/hire?teacherId=${teacher.id || teacher.uid}`)} className="border">
                    Hire
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-100">
              <nav className="flex gap-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 text-sm ${activeTab === "overview" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`pb-3 text-sm ${activeTab === "categories" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`pb-3 text-sm ${activeTab === "gallery" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
                >
                  Gallery
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 px-4">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-line">{teacher.bio_T || teacher.bio || "No bio provided."}</p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-500">Language</div>
                    <div className="font-medium">{teacher.Language || "Any"}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-500">Experience</div>
                    <div className="font-medium">{teacher.ExperienceLevel || "—"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Live chat rate</span>
                    <span className="font-medium">{teacher.Live_Chat_rate ? `$${teacher.Live_Chat_rate}` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total earned</span>
                    <span className="font-medium">{Array.isArray(teacher.Total_amount_earned) ? teacher.Total_amount_earned.reduce((a,b)=>a+b,0) : (teacher.Total_amount_earned ?? 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              {Array.isArray(teacher.cat_refs) && teacher.cat_refs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {teacher.cat_refs.map((ref: string, idx: number) => (
                    <div key={idx} className="p-3 border rounded-lg bg-white">
                      <div className="text-sm text-gray-700 break-all">{ref}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No categories listed.</div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Gallery</h3>
              {/* teacher may contain gallery arrays or you can fetch separately */}
              {Array.isArray(teacher.teacher_gallery_list) && teacher.teacher_gallery_list.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {teacher.teacher_gallery_list.map((src: string, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden border">
                      <img src={src} alt={`gallery-${i}`} className="w-full h-36 object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No gallery images.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewExpertPage;
