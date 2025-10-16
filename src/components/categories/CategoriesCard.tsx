// @ts-nocheck
"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";
import { motion } from "framer-motion";

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse flex flex-col space-y-3">
    <div className="bg-gray-200 h-40 w-full rounded-md"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mt-auto"></div>
  </div>
);

const CategoriesCard = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("userId") || undefined;
  const router = useRouter();
  const { userId } = useUserIdFromUrl();

  // Fetch teacher + categories from Firestore
  const {
    profile,
    categories,
    teacherDetails,
    loading,
    error,
  } = useUserProfile(userId);

  // Redirect to profile page once data is fetched successfully
  React.useEffect(() => {
    if (!loading && teacherDetails && Object.keys(teacherDetails).length > 0) {
      router.push(`/profile?teacherId=${teacherDetails.id}`);
    }
  }, [loading, teacherDetails, router]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading categories: {error.message || error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const handleCreate = () => {
    if (!teacherDetails?.id) {
      console.error("Teacher ID not found");
      return;
    }
    router.push(`/upload?teacherId=${teacherDetails.id}`);
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 shadow-md border-b sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5l8.485 8.485a2.121 2.121 0 002.121 0L21 7.5"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">
              Manage and organize your product categories
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Category
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.length > 0 ? (
          categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition"
            >
              {cat.image ? (
                <motion.img
                  src={cat.image}
                  alt={cat.title || "Category"}
                  className="h-40 w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="bg-gray-200 h-40 w-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs uppercase tracking-wide text-primary font-medium">
                  {cat.topic || "No topic"}
                </div>

                <div className="text-lg font-semibold mt-1 text-gray-800">
                  {cat.title || "Untitled"}
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {cat.description || "No description available."}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3 border-t text-xs text-gray-500">
                  <span>❤️ {cat.category_rate || 0} likes</span>
                  <span className="text-primary font-medium">
                    {cat.teacher_name || "Unknown"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesCard;
