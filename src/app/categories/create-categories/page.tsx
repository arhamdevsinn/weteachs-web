// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import ImageUploader from "@/src/components/categories/ImageUploader";
import { useCreateCategory } from "@/src/hooks/useCreateCategory";
import TeacherGallery from "@/src/components/TeacherGallery";
import { useSearchParams } from "next/navigation";

const CreateCategory = () => {
  const [loading, setLoading] = useState(true);
  const { createCategory, loading: apiLoading, error, success } = useCreateCategory();
      const searchParams = useSearchParams();
    const teacherId = searchParams.get("teacherId");

  const [formData, setFormData] = useState({
    category: "",
    experienceLevel: "",
    topic: "",
    description: "",
    rate: "",
    language: "",
    image: "",
  });

  // simulate skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(teacherId, formData);
      
      alert("Category created ✅");
    } catch (err) {
      console.error("Failed to create:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary w-full text-white flex justify-center items-center p-4 shadow">
        <h1 className="text-xl font-semibold">Create Category</h1>
      </header>

      <main className="flex-grow flex justify-center p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
          {loading ? (
            // Skeleton
            <div className="animate-pulse space-y-6">
              <div className="h-40 w-full bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-green-200 rounded-lg"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <Image  priority={true}Uploader
                  onUpload={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a Category</option>
                  <option>Arts</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>Fitness</option>
                  <option>Food & Cooking</option>
                  <option>Health & Wealth</option>
                  <option>Pet Care & Training</option>
                  <option>Technology</option>
                  <option>Travel & Culture</option>
                  <option>Random</option>
                  <option>Spirituality & Religion</option>
                  <option>Language & Communication</option>
                  <option>Relationship & Dating Advice</option>
                  <option>Finance & Investing</option>
                  <option>Fashion & Beauty</option>
                  <option>Mental Health & Mindfulness</option>
                  <option>Business & Entrepreneur</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceLevel: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>

              {/* Topic */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Topic
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ex: Flutterflow, Yoga, Pizza"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Write something about this category..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Rate */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Category Rate
                </label>
                <input
                  type="text"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="$USD / 15 min"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Language Spoken
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="Ex: English, Urdu, Spanish"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={apiLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  {apiLoading ? "Posting..." : "POST"}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-600 text-sm mt-2">Created ✅</p>}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateCategory;
