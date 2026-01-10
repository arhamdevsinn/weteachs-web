// @ts-nocheck
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { RecentCategory } from "@/src/lib/api/recentCategories";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  category: RecentCategory;
  index?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to categories page with this category highlighted or filtered
    router.push(`/categories?categoryId=${category.id}`);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={category.category_image_url || "/sample.png"}
          alt={category.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top Section - Date */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(category.upload_time)}</span>
          </div>
        </div>

        {/* Bottom Section - Category Info */}
        <div className="space-y-3">
          {/* Category Name */}
          <h3 className="text-white font-bold text-2xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {category.title}
          </h3>

          {/* Description */}
          {category.description && (
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Teacher Info */}
          {category.teacher_name && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 w-fit">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={category.teacher_photo_url || "/pro.png"}
                  alt={category.teacher_name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <span className="text-white text-xs font-medium">
                {category.teacher_name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </motion.div>
  );
};

// Skeleton loader for category card
export const CategoryCardSkeleton = () => (
  <div className="h-80 rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
    <div className="h-full w-full bg-gradient-to-t from-gray-300 to-gray-200"></div>
  </div>
);
