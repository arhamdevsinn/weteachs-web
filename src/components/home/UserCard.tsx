// @ts-nocheck
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import { RecentUser } from "@/src/lib/api/recentUsers";
import { useRouter } from "next/navigation";

interface UserCardProps {
  user: RecentUser;
  index?: number;
}

export const UserCard: React.FC<UserCardProps> = ({ user, index = 0 }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/profile?name=${user.name}`);
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
          src={user.profileImageUrl || "/pro.png"}
          alt={user.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top Section - Date and Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(user.createdAt)}</span>
          </div>
          {user.isTeacher && user.rating && user.rating > 0 && (
            <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-2.5 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-gray-900" />
              <span className="text-xs font-bold">{user.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Bottom Section - User Info */}
        <div className="space-y-2">
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {user.isTeacher && (
              <span className="text-[10px] uppercase font-bold text-white tracking-wider bg-primary/90 backdrop-blur-sm px-2.5 py-1 rounded">
                Teacher
              </span>
            )}
            {user.categoryName && (
              <span className="text-[10px] uppercase font-bold text-white tracking-wider bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                {user.categoryName}
              </span>
            )}
          </div>

          {/* User Name */}
          <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {user.name}
          </h3>

          {/* Bio */}
          {user.bio && (
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </motion.div>
  );
};

// Skeleton loader for user card
export const UserCardSkeleton = () => (
  <div className="h-80 rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
    <div className="h-full w-full bg-gradient-to-t from-gray-300 to-gray-200"></div>
  </div>
);
