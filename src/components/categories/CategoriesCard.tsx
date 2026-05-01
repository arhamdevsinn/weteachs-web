// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { getAllCategories } from "@/src/lib/api/categories";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { algoliasearch } from "algoliasearch";
import { auth } from "@/src/lib/firebase/config";
import SignupPromptDialog from "./SignupPromptDialog";
import { useRedditPixel } from "@/src/hooks/useRedditPixel";

const getAvatarFallbackUrl = () => "/cat5.jpeg";


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

// Category Card Component
const CategoryCard = ({ cat, index, openCategoryModal }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = !imageError && cat.image ? cat.image : getAvatarFallbackUrl(cat);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition h-full"
      onClick={() => openCategoryModal(cat)}
    >
      <motion.img
        src={imageSrc}
        alt={cat.title || "Category"}
        className="h-40 w-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onError={() => setImageError(true)}
      />

      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs uppercase tracking-wide text-primary font-medium">
          {cat.topic || "No topic"}
        </div>

        <div className="text-xl font-semibold mt-1 text-gray-800">
          {cat.title || "Untitled"}
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {cat.description || "No description available."}
        </p>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600 font-bold">
            ${cat.category_rate || 0} / 15 mins
          </p>
          <p className="text-sm text-gray-600">
            {cat.Language}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1 border-t text-xs text-gray-500">
          <span>❤️ {cat.category_rate || 0} likes</span>
          <span className="text-primary font-medium">
            {cat.teacher_name || "Unknown"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const CategoriesCard = ({ filterCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackSearch } = useRedditPixel();
  
  // Get uid for teacher profile features (optional - not needed for viewing categories)
  const uid = typeof window !== "undefined"
    ? localStorage.getItem("userId") || localStorage.getItem("user_id") || undefined
    : undefined;

  // Fetch teacher + categories from Firestore (only if uid exists)
  const {
    profile,
    categories,
    teacherDetails,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(uid);
  
  // local fetched list of all categories (independent fetch)
  const [allCategories, setAllCategories] = useState<[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const cats = await getAllCategories();
        console.log("Fetched all categories:", cats);
        if (mounted) {
          setAllCategories(cats);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load all categories:", err);
        if (mounted) {
          setError("Failed to load categories");
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Pagination state (client-side)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);

  // reset page when source changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allCategories, categories, searchQuery]);

  // Algolia state
  const [algoliaHits, setAlgoliaHits] = useState<[] | null>(null);
  const [algoliaTotal, setAlgoliaTotal] = useState<number | null>(null);
  const [algoliaPages, setAlgoliaPages] = useState<number | null>(null);
  const algoliaTimer = useRef<number | null>(null);
  const algoliaClientRef = useRef< | null>(null);
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
  const ALGOLIA_INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_CATEGORIES || "Categories";

  // initialize algolia client once (client-side only)
  useEffect(() => {
    if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) return;
    try {
      algoliaClientRef.current = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
    } catch (e) {
      console.warn("Algolia init failed", e);
    }
  }, []);

  // Perform Algolia search when query changes (debounced) or when paging changes while a query is active
  useEffect(() => {
    // only run Algolia search when query is non-empty and client configured
    if (!searchQuery || !algoliaClientRef.current) {
      setAlgoliaHits(null);
      setAlgoliaTotal(null);
      setAlgoliaPages(null);
      return;
    }

    // debounce
    if (algoliaTimer.current) {
      clearTimeout(algoliaTimer.current);
    }
    algoliaTimer.current = window.setTimeout(async () => {
      try {
        const index = algoliaClientRef.current.initIndex(ALGOLIA_INDEX);
        const res = await index.search(searchQuery, {
          page: Math.max(0, currentPage - 1),
          hitsPerPage: perPage,
        });
        setAlgoliaHits(res.hits || []);
        setAlgoliaTotal(res.nbHits ?? 0);
        setAlgoliaPages(res.nbPages ?? 1);

        // Track Reddit Search event after results are confirmed
        trackSearch(searchQuery, {
          itemCount: res.nbHits ?? 0,
          conversionId: `search_${Date.now()}`,
        });
      } catch (err) {
        console.error("Algolia search failed:", err);
        setAlgoliaHits([]);
        setAlgoliaTotal(0);
        setAlgoliaPages(1);
      }
    }, 300);

    return () => {
      if (algoliaTimer.current) clearTimeout(algoliaTimer.current);
    };
  }, [searchQuery, currentPage, perPage, ALGOLIA_INDEX]);

  console.log("categories", categories, teacherDetails, profile);
  // modal state for category detail (shadcn Dialog)
  // moved here so hooks run before any early returns (fixes Hooks order error)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [modalImageError, setModalImageError] = useState(false);
  const initialCategoryOpenedRef = useRef(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    // Check Firebase auth
    if (auth.currentUser) return true;
    
    // Check localStorage as fallback
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || localStorage.getItem("user_id");
      if (userId) return true;
    }
    
    return false;
  };

  const openCategoryModal = (cat) => {
    // Check authentication before opening modal
    setModalImageError(false);
    if (isAuthenticated()) {
      // User is logged in - show category details
      setSelectedCategory(cat);
      setOpen(true);
    } else {
      // User is not logged in - show signup prompt
      setSelectedCategory(cat);
      setShowSignupPrompt(true);
    }
  };

  const closeCategoryModal = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const closeSignupPrompt = () => {
    setShowSignupPrompt(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (!categoryId || loading || initialCategoryOpenedRef.current) return;

    const source =
      allCategories && allCategories.length > 0 ? allCategories : categories || [];
    const matchedCategory = source.find((cat) => cat.id === categoryId);

    if (matchedCategory) {
      initialCategoryOpenedRef.current = true;
      openCategoryModal(matchedCategory);
    }
  }, [allCategories, categories, loading, searchParams]);

  // Redirect to profile page once data is fetched successfully
  // React.useEffect(() => {
  //   if (!loading && teacherDetails && Object.keys(teacherDetails).length > 0) {
  //     router.push(`/profile?teacherId=${teacherDetails.id}`);
  //   }
  // }, [loading, teacherDetails, router]);

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
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const handleCreate = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setShowSignupPrompt(true);
      return;
    }
    
    // Check if user has teacher details
    if (!teacherDetails?.id) {
      console.log("Teacher ID not found - redirecting to create profile");
      router.push("/create-profile");
      return;
    }
    
    router.push(`/upload?teacherId=${teacherDetails.id}`);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-5 bg-gradient-to-r from-white to-gray-50 shadow-md border-b sticky top-0 z-20">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-4 md:hidden">
          {/* Title and Create Button Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5l8.485 8.485a2.121 2.121 0 002.121 0L21 7.5"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-gray-900">Categories</h1>
                <p className="text-xs text-gray-500">Manage categories</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white font-medium px-3 py-2 rounded-lg shadow-md text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
          </div>
          
          {/* Search Bar Row */}
          <div className="w-full">
            <div className="flex items-center bg-white border rounded-md px-3 py-2 shadow-sm">
              <Search className="text-gray-400 mr-2 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search categories..."
                className="border-0 focus:ring-0 outline-0 w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
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
              <h1 className="font-extrabold text-xl md:text-2xl text-gray-900">Categories</h1>
              <p className="text-xs md:text-sm text-gray-500">
                Manage and organize your product categories
              </p>
            </div>
          </div>

          {/* Search moved into header */}
          <div className="flex-1 px-6 max-w-2xl">
            <div className="flex items-center bg-white border rounded-md px-3 py-1 shadow-sm">
              <Search className="text-gray-400 mr-2" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search categories by title, topic, teacher..."
                className="border-0 focus:ring-0 outline-0 w-full"
              />
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
      </div>

      {/* Categories by Section */}
      <div className="p-6 space-y-8">
        {(() => {
          // Category titles to display
          const categoryTitles = [
            "New",
            "Arts",
            "Business & Entrepreneur",
            "Education",
            "Family",
            "Fashion & Beauty",
            "Finance & Investing",
            "Fitness",
            "Foods & Cooking",
            "Gaming",
            "Health & Wellness",
            "Home improvements & DIY",
            "Language & Communication",
            "Marketing & Social Media",
            "Mental Health & Mindfulness",
            "Music",
            "Pet Care & Training",
            "Relationships & Dating Advice",
            "Spirituality & Religion",
            "Technology",
            "Travel & Culture",
            "Random"
          ];

          // if Algolia supplied results (search active), use them
          const usingAlgolia = Array.isArray(algoliaHits);
          const rawSource = (allCategories && allCategories.length > 0) ? allCategories : (categories || []);

          // local filtering only applies when not using Algolia
          const source = usingAlgolia
            ? algoliaHits!
            : searchQuery
            ? rawSource.filter((cat) => {
                const q = searchQuery.toLowerCase();
                const hay =
                  ((cat.title || "") + " " + (cat.topic || "") + " " + (cat.description || "") + " " + (cat.teacher_name || "")+ " " + (cat.category_rate || "")).toLowerCase();
                return hay.includes(q);
              })
            : rawSource;

          // If a specific category is requested via prop or query param
          const activeCategoryFilter = filterCategory || searchParams.get("category");

          if (activeCategoryFilter) {
            const filteredSource = rawSource.filter((cat) => {
              const q = activeCategoryFilter.toLowerCase();
              const title = (cat.title || "").toLowerCase();
              const topic = (cat.topic || "").toLowerCase();
              return title === q || topic === q || title.startsWith(q) || q.startsWith(title);
            });

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
                    {activeCategoryFilter} Experts
                  </h2>
                  <span className="text-gray-500 font-medium">
                    {filteredSource.length} results
                  </span>
                </div>
                {filteredSource.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSource.map((cat, index) => (
                      <CategoryCard key={cat.id} cat={cat} index={index} openCategoryModal={openCategoryModal} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-500 font-medium">No experts found in this category yet.</p>
                    <button 
                      onClick={() => router.push('/categories')}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Browse all categories
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // If search is active, show filtered results in grid
          if (searchQuery && source.length > 0) {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {source.map((cat, index) => (
                  <CategoryCard key={cat.id} cat={cat} index={index} openCategoryModal={openCategoryModal} />
                ))}
              </div>
            );
          }

          if (searchQuery && source.length === 0) {
            return (
              <div className="col-span-full text-center text-gray-500 py-12">
                No categories found for "{searchQuery}".
              </div>
            );
          }

          // Group categories by title
          return categoryTitles.map((categoryTitle) => {
            const filtered = source.filter((cat) => {
              if (categoryTitle === "New") {
                // Show most recent 10 categories for "New"
                return true;
              }
              return cat.title === categoryTitle;
            });

            // For "New", get latest 10 by upload_time
            const categoriesForSection = categoryTitle === "New" 
              ? [...source]
                  .sort((a, b) => {
                    const aTime = a.upload_time?.seconds || 0;
                    const bTime = b.upload_time?.seconds || 0;
                    return bTime - aTime;
                  })
                  .slice(0, 10)
              : filtered;

            if (categoriesForSection.length === 0) return null;

            return (
              <div key={categoryTitle} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{categoryTitle}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const container = document.getElementById(`scroll-${categoryTitle}`);
                        if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById(`scroll-${categoryTitle}`);
                        if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Cards */}
                <div
                  id={`scroll-${categoryTitle}`}
                  className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {categoriesForSection.map((cat, index) => (
                    <div key={cat.id} className="flex-shrink-0 w-72 snap-start">
                      <CategoryCard cat={cat} index={index} openCategoryModal={openCategoryModal} />
                    </div>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Category Detail Dialog (shadcn) */}
      {selectedCategory && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCategory.title}</DialogTitle>
            </DialogHeader>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex items-center justify-center">
                <img
                  src={
                    !modalImageError && selectedCategory.image
                      ? selectedCategory.image
                      : getAvatarFallbackUrl(selectedCategory)
                  }
                  alt={selectedCategory.title}
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={() => setModalImageError(true)}
                />
              </div>

              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 mb-4">{selectedCategory.topic}</div>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {selectedCategory.description || "No description provided."}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <div className="font-bold text-gray-800">Rate</div>
                    <div>${selectedCategory.category_rate ?? "N/A"}/15 mins</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Language</div>
                    <div>{selectedCategory.Language || teacherDetails.language || "Any"}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Experience</div>
                    <div>{selectedCategory.ExperienceLevel || "—"}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Teacher</div>
                    <div>{selectedCategory.teacher_name || "Unknown"}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/profile?name=${selectedCategory.teacher.usernameT || ''}`)}
                    // onClick={() => {
                    //   // prefer already-resolved `teacher` object if present
                    //   const teacherObj =
                    //     selectedCategory.teacher ||
                    //     selectedCategory.teacher_ref ||
                    //     null;

                    //   try {
                    //     if (teacherObj) {
                    //       // store short-lived teacher object in sessionStorage
                    //       sessionStorage.setItem(
                    //         "view_expert_teacher",
                    //         JSON.stringify(teacherObj)
                    //       );
                    //     }
                    //   } catch (e) {
                    //     console.error("Failed to store teacher in sessionStorage", e);
                    //   }

                    //   // navigate with teacher id in query so page can fetch if needed
                    //   const teacherId =
                    //     (teacherObj && (teacherObj.id || teacherObj.uid)) ||
                    //     // fallback: try to extract from DocumentReference path
                    //     (selectedCategory.teacher_ref && selectedCategory.teacher_ref.id) ||
                    //     "";

                    //   if (teacherId) {
                    //     router.push(`/view-expert?teacherId=${teacherId}`);
                    //   } else {
                    //     // open view-expert without id — page should handle missing id
                    //     router.push(`/view-expert`);
                    //   }
                    // }}
                     className="bg-primary text-white px-4 py-2 rounded-md"
                   >
                     View Teacher
                   </button>
                 </div>
              </div>
            </div>

            <DialogFooter>
              <button
                className="px-4 py-2 text-sm text-gray-600"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Signup Prompt Dialog */}
      <SignupPromptDialog
        open={showSignupPrompt}
        onOpenChange={closeSignupPrompt}
        categoryName={selectedCategory?.title}
      />
    </div>
  );
};

export default CategoriesCard;
