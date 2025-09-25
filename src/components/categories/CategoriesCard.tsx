"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  

  const {
    categories,
    teacherDetails,
    loading: dataLoading,
    error: dataError,
  } = useUserProfile(uid);
  console.log(categories)

  if (dataError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading categories: {dataError}
      </div>
    );
  }
  const teacherId = teacherDetails?.id || null;
  const handleCreate = () => {
    if (!teacherId) {
      console.error("Teacher ID not found from teacher_ref");
      return;
    }
    router.push(`/upload?teacherId=${teacherId}`);
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button className="text-2xl">☰</button>
          <input
            type="text"
            placeholder="Search categories..."
            className="border px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
         <button
          onClick={handleCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition"
        >
          + Create
        </button>
      </div>
      {/* Grid of Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dataLoading ? (
          // Skeleton while loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : categories?.length > 0 ? (
          categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition"
            >
              {/* Image */}
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

              {/* Content */}
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
