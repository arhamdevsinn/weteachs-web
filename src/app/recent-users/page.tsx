"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { UserCard, UserCardSkeleton } from "@/src/components/home/UserCard";
import { getRecentUsers, RecentUser } from "@/src/lib/api/recentUsers";
import { useRouter } from "next/navigation";

export default function RecentUsersPage() {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "teachers" | "students">("all");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const recentUsers = await getRecentUsers(20);
        setUsers(recentUsers);
        setFilteredUsers(recentUsers);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...users];

    // Apply type filter
    if (filterType === "teachers") {
      result = result.filter((user) => user.isTeacher);
    } else if (filterType === "students") {
      result = result.filter((user) => !user.isTeacher);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, filterType, users]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-green-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white hover:bg-white/20 mb-6 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <Users className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Recent Members
              </h1>
            </div>
            <p className="text-lg text-green-50 max-w-2xl">
              Explore all our newest community members, educators, and learners
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, category, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 rounded-lg border-gray-300 focus:border-primary"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-500" />
              <Button
                onClick={() => setFilterType("all")}
                variant={filterType === "all" ? "default" : "outline"}
                className={`rounded-full ${
                  filterType === "all" ? "bg-primary hover:bg-green-800" : ""
                }`}
              >
                All
              </Button>
              <Button
                onClick={() => setFilterType("teachers")}
                variant={filterType === "teachers" ? "default" : "outline"}
                className={`rounded-full ${
                  filterType === "teachers" ? "bg-primary hover:bg-green-800" : ""
                }`}
              >
                Teachers
              </Button>
              <Button
                onClick={() => setFilterType("students")}
                variant={filterType === "students" ? "default" : "outline"}
                className={`rounded-full ${
                  filterType === "students" ? "bg-primary hover:bg-green-800" : ""
                }`}
              >
                Students
              </Button>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} members
            </div>
          )}
        </motion.div>

        {/* Users Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(20)].map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user, index) => (
              <UserCard key={user.id} user={user} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
