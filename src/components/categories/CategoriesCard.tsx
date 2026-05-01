// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
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

const PAGE_SIZE = 10; // items to reveal each scroll trigger

const getAvatarFallbackUrl = () => "/cat5.jpeg";

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse flex flex-col space-y-3">
    <div className="bg-gray-200 h-40 w-full rounded-md" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-200 rounded w-full" />
    <div className="h-3 bg-gray-200 rounded w-1/3 mt-auto" />
  </div>
);

// ─── Loader Dots ───────────────────────────────────────────────────────────────
const LoaderDots = ({ sentinelRef }) => (
  <div ref={sentinelRef} className="h-24 flex items-center justify-center">
    <div className="flex space-x-2">
      {[0, 0.18, 0.36].map((delay, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  </div>
);

// ─── Category Card ─────────────────────────────────────────────────────────────
const CategoryCard = ({ cat, index, openCategoryModal }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = !imageError && cat.image ? cat.image : getAvatarFallbackUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.32, ease: "easeOut" }}
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
          <p className="text-sm text-gray-600">{cat.Language}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1 border-t text-xs text-gray-500">
          <span>❤️ {cat.category_rate || 0} likes</span>
          <span className="text-primary font-medium">{cat.teacher_name || "Unknown"}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CategoriesCard = ({ filterCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackSearch } = useRedditPixel();

  const uid =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || localStorage.getItem("user_id") || undefined
      : undefined;

  const { profile, categories, teacherDetails, loading: profileLoading } = useUserProfile(uid);

  // ── All categories (Firestore) ───────────────────────────────────────────────
  const [allCategories, setAllCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const cats = await getAllCategories();
        if (mounted) { setAllCategories(cats); setLoading(false); }
      } catch {
        if (mounted) { setError("Failed to load categories"); setLoading(false); }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Infinite scroll: how many items are visible in the CATEGORY view ─────────
  const [catVisible, setCatVisible] = useState(PAGE_SIZE);
  const catSentinelRef = useRef(null);

  // Reset when category changes
  useEffect(() => { setCatVisible(PAGE_SIZE); }, [filterCategory]);

  // ── Infinite scroll: how many items are visible in the SEARCH view ───────────
  const [searchVisible, setSearchVisible] = useState(PAGE_SIZE);
  const searchSentinelRef = useRef(null);

  // Reset when query changes
  useEffect(() => { setSearchVisible(PAGE_SIZE); }, [searchQuery]);

  // ── Algolia (search only) ────────────────────────────────────────────────────
  const [algoliaHits, setAlgoliaHits] = useState(null);
  const [algoliaTotal, setAlgoliaTotal] = useState(null);
  const [algoliaPage, setAlgoliaPage] = useState(1);
  const [algoliaTotalPages, setAlgoliaTotalPages] = useState(null);
  const algoliaTimer = useRef(null);
  const algoliaClientRef = useRef(null);

  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
  const ALGOLIA_INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_CATEGORIES || "Categories";

  useEffect(() => {
    if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) return;
    try { algoliaClientRef.current = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY); }
    catch (e) { console.warn("Algolia init failed", e); }
  }, []);

  useEffect(() => { setAlgoliaPage(1); setAlgoliaHits(null); }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery || !algoliaClientRef.current) {
      setAlgoliaHits(null); setAlgoliaTotal(null); setAlgoliaTotalPages(null); return;
    }
    if (algoliaTimer.current) clearTimeout(algoliaTimer.current);
    algoliaTimer.current = window.setTimeout(async () => {
      try {
        const idx = algoliaClientRef.current.initIndex(ALGOLIA_INDEX);
        const res = await idx.search(searchQuery, { page: algoliaPage - 1, hitsPerPage: PAGE_SIZE });
        setAlgoliaHits((prev) =>
          algoliaPage === 1 ? (res.hits || []) : [...(prev || []), ...(res.hits || [])]
        );
        setAlgoliaTotal(res.nbHits ?? 0);
        setAlgoliaTotalPages(res.nbPages ?? 1);
        trackSearch(searchQuery, { itemCount: res.nbHits ?? 0, conversionId: `search_${Date.now()}` });
      } catch {
        if (algoliaPage === 1) { setAlgoliaHits([]); setAlgoliaTotal(0); setAlgoliaTotalPages(1); }
      }
    }, 300);
    return () => { if (algoliaTimer.current) clearTimeout(algoliaTimer.current); };
  }, [searchQuery, algoliaPage, ALGOLIA_INDEX]);

  // ── Intersection Observer factory ────────────────────────────────────────────
  const useSentinel = (sentinelRef, onIntersect) => {
    useEffect(() => {
      const el = sentinelRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onIntersect(); },
        { threshold: 0.1, rootMargin: "120px" }
      );
      obs.observe(el);
      return () => obs.disconnect();
    });
  };

  useSentinel(catSentinelRef, () => setCatVisible((v) => v + PAGE_SIZE));
  useSentinel(searchSentinelRef, () => {
    const usingAlgolia = Array.isArray(algoliaHits);
    if (usingAlgolia) {
      if (algoliaPage < (algoliaTotalPages || 1)) setAlgoliaPage((p) => p + 1);
    } else {
      setSearchVisible((v) => v + PAGE_SIZE);
    }
  });

  // ── Modal ────────────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [modalImageError, setModalImageError] = useState(false);
  const initialOpened = useRef(false);

  const isAuthenticated = () => {
    if (auth.currentUser) return true;
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId") || localStorage.getItem("user_id");
      if (id) return true;
    }
    return false;
  };

  const openCategoryModal = (cat) => {
    setModalImageError(false);
    if (isAuthenticated()) { setSelectedCategory(cat); setOpen(true); }
    else { setSelectedCategory(cat); setShowSignupPrompt(true); }
  };

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (!categoryId || loading || initialOpened.current) return;
    const src = allCategories?.length ? allCategories : categories || [];
    const match = src.find((c) => c.id === categoryId);
    if (match) { initialOpened.current = true; openCategoryModal(match); }
  }, [allCategories, categories, loading, searchParams]);

  const handleCreate = () => {
    if (!isAuthenticated()) { setShowSignupPrompt(true); return; }
    if (!teacherDetails?.id) { router.push("/create-profile"); return; }
    router.push(`/upload?teacherId=${teacherDetails.id}`);
  };

  // ── Loading / Error states ───────────────────────────────────────────────────
  if (error) return (
    <div className="p-6 text-center text-red-500">Error: {error}</div>
  );

  if (loading) return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  const rawSource = allCategories?.length ? allCategories : categories || [];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const filterByCategory = (src, cat) => {
    const q = cat.toLowerCase();
    return src.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const topic = (item.topic || "").toLowerCase();
      return title === q || topic === q || title.startsWith(q) || q.startsWith(title);
    });
  };

  const filterBySearch = (src, query) => {
    const q = query.toLowerCase();
    return src.filter((item) => {
      const hay = `${item.title || ""} ${item.topic || ""} ${item.description || ""} ${item.teacher_name || ""}`.toLowerCase();
      return hay.includes(q);
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-secondary">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="px-4 md:px-8 py-4 md:py-5 bg-gradient-to-r from-white to-gray-50 shadow-md border-b sticky top-[68px] md:top-[120px] z-20">
        {/* Mobile */}
        <div className="flex flex-col space-y-3 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="font-extrabold text-lg text-gray-900 capitalize">
              {filterCategory ? `${filterCategory} Experts` : "Categories"}
            </h1>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white font-medium px-3 py-2 rounded-lg shadow-md text-sm"
            >
              + Create
            </button>
          </div>
          <div className="flex items-center bg-white border rounded-md px-3 py-2 shadow-sm">
            <Search className="text-gray-400 mr-2 w-4 h-4 flex-shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="border-0 focus:ring-0 outline-0 w-full text-sm"
            />
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="shrink-0">
            <h1 className="font-extrabold text-xl md:text-2xl text-gray-900 capitalize">
              {filterCategory ? `${filterCategory} Experts` : "Categories"}
            </h1>
            <p className="text-xs text-gray-500">
              {filterCategory ? `Browse all ${filterCategory} experts` : "Manage and discover categories"}
            </p>
          </div>
          <div className="flex-1 max-w-xl">
            <div className="flex items-center bg-white border rounded-md px-3 py-1.5 shadow-sm">
              <Search className="text-gray-400 mr-2 w-4 h-4 flex-shrink-0" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, topic, teacher..."
                className="border-0 focus:ring-0 outline-0 w-full"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            + Create Category
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">

        {/* ══ BRANCH 1: Specific category (e.g. /categories/education) ══ */}
        {filterCategory && !searchQuery ? (() => {
          const all = filterByCategory(rawSource, filterCategory);
          const visible = all.slice(0, catVisible);
          const hasMore = all.length > catVisible;

          return (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 font-medium">
                {all.length} experts found
              </p>

              {all.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {visible.map((cat, i) => (
                        <CategoryCard key={cat.id} cat={cat} index={i} openCategoryModal={openCategoryModal} />
                      ))}
                    </AnimatePresence>
                  </div>
                  {hasMore && <LoaderDots sentinelRef={catSentinelRef} />}
                  {!hasMore && (
                    <p className="text-center text-gray-400 text-sm py-6">
                      ✓ All {all.length} experts loaded
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xl text-gray-500 font-medium">No experts found in this category yet.</p>
                  <button onClick={() => router.push("/categories")} className="mt-4 text-primary font-bold hover:underline">
                    Browse all categories
                  </button>
                </div>
              )}
            </div>
          );
        })()

        /* ══ BRANCH 2: Search results ══ */
        : searchQuery ? (() => {
          const usingAlgolia = Array.isArray(algoliaHits);
          const localFiltered = filterBySearch(rawSource, searchQuery);
          const source = usingAlgolia ? algoliaHits : localFiltered.slice(0, searchVisible);
          const hasMore = usingAlgolia
            ? algoliaPage < (algoliaTotalPages || 1)
            : localFiltered.length > searchVisible;

          if (source.length === 0) return (
            <div className="text-center text-gray-500 py-16">
              No results for &ldquo;{searchQuery}&rdquo;.
            </div>
          );

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {source.map((cat, i) => (
                  <CategoryCard key={cat.id} cat={cat} index={i} openCategoryModal={openCategoryModal} />
                ))}
              </div>
              {hasMore && <LoaderDots sentinelRef={searchSentinelRef} />}
            </div>
          );
        })()

        /* ══ BRANCH 3: General home view (horizontal sections) ══ */
        : (() => {
          const categoryTitles = [
            "New", "Arts", "Business & Entrepreneur", "Education", "Family",
            "Fashion & Beauty", "Finance & Investing", "Fitness", "Foods & Cooking",
            "Gaming", "Health & Wellness", "Home improvements & DIY",
            "Language & Communication", "Marketing & Social Media",
            "Mental Health & Mindfulness", "Music", "Pet Care & Training",
            "Relationships & Dating Advice", "Spirituality & Religion",
            "Technology", "Travel & Culture", "Random",
          ];

          return (
            <div className="space-y-8">
              {categoryTitles.map((title) => {
                const items =
                  title === "New"
                    ? [...rawSource].sort((a, b) => (b.upload_time?.seconds || 0) - (a.upload_time?.seconds || 0)).slice(0, 10)
                    : rawSource.filter((c) => c.title === title);

                if (items.length === 0) return null;

                return (
                  <div key={title} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => document.getElementById(`scroll-${title}`)?.scrollBy({ left: -300, behavior: "smooth" })}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600 text-sm"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={() => document.getElementById(`scroll-${title}`)?.scrollBy({ left: 300, behavior: "smooth" })}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600 text-sm"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                    <div
                      id={`scroll-${title}`}
                      className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    >
                      {items.map((cat, i) => (
                        <div key={cat.id} className="flex-shrink-0 w-72 snap-start">
                          <CategoryCard cat={cat} index={i} openCategoryModal={openCategoryModal} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ── Detail Dialog ── */}
      {selectedCategory && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCategory.title}</DialogTitle>
            </DialogHeader>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex items-center justify-center">
                <img
                  src={!modalImageError && selectedCategory.image ? selectedCategory.image : getAvatarFallbackUrl()}
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
                  <div><div className="font-bold text-gray-800">Rate</div><div>${selectedCategory.category_rate ?? "N/A"}/15 mins</div></div>
                  <div><div className="font-medium text-gray-800">Language</div><div>{selectedCategory.Language || teacherDetails?.language || "Any"}</div></div>
                  <div><div className="font-medium text-gray-800">Experience</div><div>{selectedCategory.ExperienceLevel || "—"}</div></div>
                  <div><div className="font-medium text-gray-800">Teacher</div><div>{selectedCategory.teacher_name || "Unknown"}</div></div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/profile?name=${selectedCategory.teacher?.usernameT || ""}`)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
                  >
                    View Teacher
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <button className="px-4 py-2 text-sm text-gray-600" onClick={() => setOpen(false)}>
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Signup Prompt ── */}
      <SignupPromptDialog
        open={showSignupPrompt}
        onOpenChange={() => { setShowSignupPrompt(false); setSelectedCategory(null); }}
        categoryName={selectedCategory?.title}
      />
    </div>
  );
};

export default CategoriesCard;
