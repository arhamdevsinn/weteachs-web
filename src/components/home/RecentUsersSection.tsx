"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { UserCard, UserCardSkeleton } from "./UserCard";
import { getRecentUsers, RecentUser } from "@/src/lib/api/recentUsers";
import { useRouter } from "next/navigation";

export const RecentUsersSection = () => {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const USERS_TO_FETCH = 8;
  const CARDS_PER_PAGE = 3; // Show 3 cards at a time

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const recentUsers = await getRecentUsers(20);
        setUsers(recentUsers.slice(0, USERS_TO_FETCH));
        console.log("Fetched recent users:", recentUsers.slice(0, USERS_TO_FETCH));
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / CARDS_PER_PAGE);
  const startIndex = currentPage * CARDS_PER_PAGE;
  const visibleUsers = users.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleViewAll = () => {
    router.push("/recent-users");
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Recently joined <span className="text-primary">Members</span>
            </h2>
            <p className="text-gray-600 text-base">
              Discover our newest community members
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                currentPage === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                currentPage === totalPages - 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Users Slider */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <>
            {/* Cards Grid with Animation */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserCard user={user} index={index} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentPage === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleViewAll}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-6 text-base font-semibold transition-all duration-300"
              >
                View All Members
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
