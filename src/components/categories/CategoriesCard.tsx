// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { getAllCategories } from "@/src/lib/api/categories";
import { Input } from "@/src/components/ui/input";
import {
  ArrowUpDown,
  DollarSign,
  Filter,
  Search,
  X,
} from "lucide-react";
import { algoliasearch } from "algoliasearch";
import { auth, db } from "@/src/lib/firebase/config";
import SignupPromptDialog from "./SignupPromptDialog";
import { useRedditPixel } from "@/src/hooks/useRedditPixel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { sendCategoryLikeEmail } from "@/src/lib/api/brevoEmail";

const PAGE_SIZE = 10; // items to reveal each scroll trigger

const CATEGORY_FILTERS = [
  "All",
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
  "Random",
];

const PRICE_OPTIONS = [
  { label: "Any price", value: "all" },
  { label: "Under $25", value: "under-25" },
  { label: "$25 - $50", value: "25-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100+", value: "100-plus" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

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
const CategoryCard = ({
  cat,
  index,
  openCategoryModal,
  onToggleLike,
  likingCategoryId,
}) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = !imageError && cat.image ? cat.image : getAvatarFallbackUrl();
  const categoryLikeCount = Number(cat.likes ?? cat.liked_user_ref?.length ?? 0);
  const isLiking = likingCategoryId === cat.id;
  const isLikedByCurrentUser = Boolean(cat.isLikedByCurrentUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.32, ease: "easeOut" }}
      className="bg-white rounded-[12px] shadow-sm border-2 border-transparent hover:border-green-500 hover:shadow-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 relative z-0 hover:z-10 hover:scale-105 group h-full"
      onClick={() => openCategoryModal(cat)}
    >
      <div className="relative h-[160px] w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={cat.title || "Category"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <button
          type="button"
          onClick={(event) => onToggleLike(event, cat)}
          disabled={isLiking}
          className={`absolute top-2 right-2 backdrop-blur-sm px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm border transition-colors ${
            isLikedByCurrentUser
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-white/90 border-gray-200 text-gray-700"
          } ${isLiking ? "opacity-60 cursor-not-allowed" : "hover:bg-white"}`}
          aria-label="Toggle like"
        >
          <span className="text-red-500">❤️</span> {categoryLikeCount}
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[16px] font-bold text-gray-900 mb-1 line-clamp-1">
          {cat.title || "Untitled"}
        </h3>

        <div className="flex items-center gap-1 mb-2 text-gray-800 text-[11px]">
          {cat.rating ? (
            <span>
              {"★".repeat(cat.rating)}
            </span>
          ) : null}
          {cat.teacher_name &&
            <span className="text-[12px] text-gray-500  font-medium truncate">
              {cat.teacher_name || "Unknown"}
            </span>}
        </div>

        <div className="text-[13px] text-gray-500 mb-2 line-clamp-1">
          {cat.topic || "No topic"} • {cat.Language || "English"}
        </div>

        <p className="text-[13px] text-gray-500 mb-4 line-clamp-2 flex-1">
          {cat.description || "No description available."}
        </p>

        <div className="flex flex-col items-start gap-3 mt-auto">
          <div className="text-[15px] font-bold text-gray-900">
            $ {cat.category_rate || 0} <span className="text-[13px] font-normal text-gray-600">/ 15 mins</span>
          </div>

          <button className="text-green-500 border border-green-200 bg-white rounded-[6px] px-4 py-1.5 text-[13px] font-medium group-hover:bg-green-50 group-hover:border-green-400 transition-colors w-max">
            View more
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CategoriesCard = ({ filterCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");
  const [mobileTabCategory, setMobileTabCategory] = useState("All");
  const [tabPageStates, setTabPageStates] = useState({ "All": PAGE_SIZE });
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackSearch } = useRedditPixel();

  const uid =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || localStorage.getItem("user_id") || undefined
      : undefined;

  const { profile, categories, teacherDetails, loading: profileLoading } = useUserProfile(uid);

  const getRefId = (ref) => {
    if (!ref) return "";
    if (typeof ref === "string") {
      const parts = ref.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    }
    if (typeof ref === "object" && ref.id) return ref.id;
    if (typeof ref === "object" && ref.path) {
      const parts = ref.path.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    }
    return "";
  };

  const getDocRefFromValue = (value) => {
    if (!value) return null;
    if (typeof value === "object" && value.path) return value;
    if (typeof value === "string") {
      const parts = value.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return doc(db, parts[0], ...parts.slice(1));
      }
    }
    return null;
  };

  const getCategoryCreatorContact = async (categoryItem) => {
    const creatorRef = getDocRefFromValue(categoryItem?.who_created_ref);
    if (creatorRef) {
      const creatorSnap = await getDoc(creatorRef);
      if (creatorSnap.exists()) {
        const creatorData = creatorSnap.data();
        return {
          uid: creatorSnap.id,
          email: creatorData?.email || creatorData?.contact_email || "",
          name:
            creatorData?.display_name ||
            creatorData?.displayName ||
            creatorData?.name ||
            "WeTeachs Creator",
        };
      }
    }

    const teacherLimboRef = getDocRefFromValue(
      categoryItem?.teacher?.limbo_ref || categoryItem?.teacher?.limboRef
    );
    if (teacherLimboRef) {
      const teacherLimboSnap = await getDoc(teacherLimboRef);
      if (teacherLimboSnap.exists()) {
        const teacherLimboData = teacherLimboSnap.data();
        return {
          uid: teacherLimboSnap.id,
          email: teacherLimboData?.email || teacherLimboData?.contact_email || "",
          name:
            teacherLimboData?.display_name ||
            teacherLimboData?.displayName ||
            teacherLimboData?.name ||
            "WeTeachs Creator",
        };
      }
    }

    return {
      uid: "",
      email: categoryItem?.teacher?.limbo?.email || categoryItem?.teacher?.email || "",
      name: categoryItem?.teacher_name || "WeTeachs Creator",
    };
  };

  const normalizeCategoryLikeMeta = (categoryItem) => {
    const likedRefs = Array.isArray(categoryItem?.liked_user_ref)
      ? categoryItem.liked_user_ref
      : Array.isArray(categoryItem?.Liked_user_ref)
        ? categoryItem.Liked_user_ref
        : [];

    const likes =
      typeof categoryItem?.likes === "number"
        ? categoryItem.likes
        : likedRefs.length;

    const isLikedByCurrentUser = Boolean(
      uid && likedRefs.some((ref) => getRefId(ref) === uid)
    );

    return {
      ...categoryItem,
      likes,
      isLikedByCurrentUser,
    };
  };

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
        if (mounted) {
          setAllCategories((cats || []).map(normalizeCategoryLikeMeta));
          setLoading(false);
        }
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

  useSentinel(catSentinelRef, () => {
    if (filterCategory) {
      setCatVisible((v) => v + PAGE_SIZE);
    } else {
      loadMoreForTab(mobileTabCategory);
    }
  });
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
  const [likingCategoryId, setLikingCategoryId] = useState(null);
  const initialOpened = useRef(false);

  const isAuthenticated = () => {
    if (auth.currentUser) return true;
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId") || localStorage.getItem("user_id");
      if (id) return true;
    }
    return false;
  };

  const loadMoreForTab = (tabName) => {
    setTabPageStates((prev) => ({
      ...prev,
      [tabName]: (prev[tabName] || PAGE_SIZE) + PAGE_SIZE,
    }));
  };

  const getTabVisibleCount = (tabName) => {
    return tabPageStates[tabName] || PAGE_SIZE;
  };

  const openCategoryModal = (cat) => {
    setModalImageError(false);
    if (isAuthenticated()) { setSelectedCategory(cat); setOpen(true); }
    else { setSelectedCategory(cat); setShowSignupPrompt(true); }
  };

  const handleToggleLike = async (event, cat) => {
    event.stopPropagation();

    if (!uid) {
      setShowSignupPrompt(true);
      return;
    }
    if (!cat?.id || likingCategoryId) return;

    try {
      setLikingCategoryId(cat.id);

      const categoryRef = doc(db, "Categories", cat.id);
      const userRef = doc(db, "LimboUserMode", uid);

      const nextLikeState = await runTransaction(db, async (transaction) => {
        const categorySnap = await transaction.get(categoryRef);
        if (!categorySnap.exists()) throw new Error("Category not found");

        const categoryData = categorySnap.data();
        const likedRefs = Array.isArray(categoryData?.liked_user_ref)
          ? categoryData.liked_user_ref
          : Array.isArray(categoryData?.Liked_user_ref)
            ? categoryData.Liked_user_ref
            : [];
        const likeFieldName = Array.isArray(categoryData?.liked_user_ref)
          ? "liked_user_ref"
          : Array.isArray(categoryData?.Liked_user_ref)
            ? "Liked_user_ref"
            : "liked_user_ref";

        const alreadyLiked = likedRefs.some((ref) => getRefId(ref) === uid);
        const updatedCount = alreadyLiked
          ? Math.max(0, likedRefs.length - 1)
          : likedRefs.length + 1;

        transaction.update(categoryRef, {
          [likeFieldName]: alreadyLiked
            ? arrayRemove(userRef)
            : arrayUnion(userRef),
        });

        return {
          likes: updatedCount,
          isLikedByCurrentUser: !alreadyLiked,
        };
      });

      setAllCategories((prev) =>
        (prev || []).map((item) =>
          item.id === cat.id
            ? {
                ...item,
                likes: nextLikeState.likes,
                isLikedByCurrentUser: nextLikeState.isLikedByCurrentUser,
              }
            : item
        )
      );

      setSelectedCategory((prev) =>
        prev && prev.id === cat.id
          ? {
              ...prev,
              likes: nextLikeState.likes,
              isLikedByCurrentUser: nextLikeState.isLikedByCurrentUser,
            }
          : prev
      );

      if (nextLikeState.isLikedByCurrentUser) {
        const creatorContact = await getCategoryCreatorContact(cat);
        if (creatorContact?.email && creatorContact.uid !== uid) {
          const likerName =
            profile?.display_name ||
            profile?.displayName ||
            profile?.name ||
            "A WeTeachs user";
          const categoryTitle = cat.title || "Untitled category";
          const dashboardLink = `${window.location.origin}/categories?categoryId=${encodeURIComponent(cat.id)}`;

          await sendCategoryLikeEmail({
            to: creatorContact.email,
            recipientName: creatorContact.name,
            likerName,
            categoryTitle,
            dashboardLink,
          }).catch((emailError) => {
            console.warn("Failed to send category like email:", emailError);
          });
        }
      }
    } catch (error) {
      console.error("Failed to toggle category like:", error);
    } finally {
      setLikingCategoryId(null);
    }
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

  const getPriceValue = (item) => {
    const price = Number(item?.category_rate ?? item?.price ?? item?.rate);
    return Number.isFinite(price) ? price : 0;
  };

  const filterByTopic = (src, topic) => {
    if (!topic || topic === "all") return src;
    const q = topic.toLowerCase();
    return src.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const itemTopic = (item.topic || "").toLowerCase();
      return title === q || itemTopic === q || title.includes(q) || itemTopic.includes(q);
    });
  };

  const filterByPrice = (src, priceRange) => {
    if (!priceRange || priceRange === "all") return src;
    return src.filter((item) => {
      const price = getPriceValue(item);
      if (priceRange === "under-25") return price < 25;
      if (priceRange === "25-50") return price >= 25 && price < 50;
      if (priceRange === "50-100") return price >= 50 && price < 100;
      if (priceRange === "100-plus") return price >= 100;
      return true;
    });
  };

  const sortResults = (src) => {
    const next = [...src];
    if (sortBy === "price-asc") {
      next.sort((a, b) => getPriceValue(a) - getPriceValue(b));
    } else if (sortBy === "price-desc") {
      next.sort((a, b) => getPriceValue(b) - getPriceValue(a));
    } else {
      next.sort((a, b) => (b.upload_time?.seconds || 0) - (a.upload_time?.seconds || 0));
    }
    return next;
  };

  const applyBrowseFilters = (src) => {
    const activeTopic = filterCategory || topicFilter;
    let next = filterByTopic(src, activeTopic);
    next = filterByPrice(next, priceFilter);
    return sortResults(next);
  };

  const clearBrowseFilters = () => {
    setTopicFilter("all");
    setSortBy("newest");
    setPriceFilter("all");
  };

  const hasActiveFilters = topicFilter !== "all" || sortBy !== "newest" || priceFilter !== "all";

  const activeTopicLabel = filterCategory || topicFilter;
  const filteredSource = applyBrowseFilters(rawSource);

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
              {activeTopicLabel && activeTopicLabel !== "all" ? `${activeTopicLabel} Experts` : "Explore"}
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
          {!filterCategory && (
            <div className="grid grid-cols-3 gap-2">
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 px-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_FILTERS.map((option) => (
                    <SelectItem key={option} value={option === "All" ? "all" : option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white border-gray-200 px-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Sort" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 px-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Price" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {PRICE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearBrowseFilters}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 justify-self-start"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="shrink-0">
            <h1 className="font-extrabold text-xl md:text-2xl text-gray-900 capitalize">
              {activeTopicLabel && activeTopicLabel !== "all" ? `${activeTopicLabel} Experts` : "Explore"}
            </h1>
            <p className="text-xs text-gray-500">
              {activeTopicLabel && activeTopicLabel !== "all" ? `Browse all ${activeTopicLabel} experts` : "Manage and discover categories"}
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            + Create Category
          </button>
        </div>
        <div className="hidden md:flex items-center justify-between pt-4 md:pt-6 justify-center md:justify-center">
          <div className="flex flex-wrap flex-1 flex-row items-center justify-center">
            <div className="w-full max-w-xl py-4">
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
            {!filterCategory && (
              <div className="flex  flex-wrap items-center justify-center 2 px-2 gap-2">
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger height="h-13" className="w-auto bg-white border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Filter" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_FILTERS.map((option) => (
                      <SelectItem key={option} value={option === "All" ? "all" : option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger height="h-13" className="w-[170px] bg-white border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Sort" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger height="h-13" className="w-[150px] bg-white border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Price" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearBrowseFilters}
                    className="shrink-0 h-13 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">

        {/* ══ BRANCH 1: Specific category (e.g. /categories/education) ══ */}
        {filterCategory && !searchQuery ? (() => {
          const all = filterByCategory(filteredSource, filterCategory);
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
                        <CategoryCard
                          key={cat.id}
                          cat={cat}
                          index={i}
                          openCategoryModal={openCategoryModal}
                          onToggleLike={handleToggleLike}
                          likingCategoryId={likingCategoryId}
                        />
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
            const localFiltered = filterBySearch(filteredSource, searchQuery);
            const source = usingAlgolia ? applyBrowseFilters(algoliaHits) : localFiltered.slice(0, searchVisible);
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
                    <CategoryCard
                      key={cat.id}
                      cat={cat}
                      index={i}
                      openCategoryModal={openCategoryModal}
                      onToggleLike={handleToggleLike}
                      likingCategoryId={likingCategoryId}
                    />
                  ))}
                </div>
                {hasMore && <LoaderDots sentinelRef={searchSentinelRef} />}
              </div>
            );
          })()

            /* ══ BRANCH 3: General home view ══ */
            : (() => {
              const categoryTitles = CATEGORY_FILTERS;
              const selectedItems = 
                mobileTabCategory === "All"
                  ? filteredSource
                  : filteredSource.filter((c) => c.title === mobileTabCategory || c.topic === mobileTabCategory);
              const visibleItems = selectedItems.slice(0, catVisible);
              const hasMore = selectedItems.length > catVisible;

              return (
                <>
                  {/* Mobile: Tabs + Single Column */}
                  <div className="md:hidden space-y-4">
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {categoryTitles.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setMobileTabCategory(cat);
                            if (!tabPageStates[cat]) {
                              setTabPageStates((prev) => ({ ...prev, [cat]: PAGE_SIZE }));
                            }
                          }}
                          className={`shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                            mobileTabCategory === cat
                              ? "bg-primary text-white shadow-md"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-primary"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Single Column Cards - Vertical Scroll with Per-Tab Pagination */}
                    <div className="space-y-4">
                      {(() => {
                        const tabVisibleCount = getTabVisibleCount(mobileTabCategory);
                        const tabItems = selectedItems.slice(0, tabVisibleCount);
                        const tabHasMore = selectedItems.length > tabVisibleCount;

                        return tabItems.length > 0 ? (
                          <>
                            <AnimatePresence>
                              {tabItems.map((cat, i) => (
                                <div key={cat.id} className="w-full">
                                  <CategoryCard
                                    cat={cat}
                                    index={i}
                                    openCategoryModal={openCategoryModal}
                                    onToggleLike={handleToggleLike}
                                    likingCategoryId={likingCategoryId}
                                  />
                                </div>
                              ))}
                            </AnimatePresence>
                            {tabHasMore && (
                              <div ref={catSentinelRef} className="h-24 flex items-center justify-center">
                                <LoaderDots sentinelRef={undefined} />
                              </div>
                            )}
                            {!tabHasMore && tabItems.length > 0 && (
                              <p className="text-center text-gray-400 text-sm py-6">✓ All cards loaded</p>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-lg text-gray-500 font-medium">No categories found in {mobileTabCategory}</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Desktop: Horizontal Sections */}
                  <div className="hidden md:block space-y-8">
                    {(() => {
                      const desktopTitles = ["New", ...CATEGORY_FILTERS.slice(1)];
                      return desktopTitles.map((title) => {
                        const items =
                          title === "New"
                            ? filteredSource.slice(0, 10)
                            : filteredSource.filter((c) => c.title === title || c.topic === title);

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
                                  <CategoryCard
                                    cat={cat}
                                    index={i}
                                    openCategoryModal={openCategoryModal}
                                    onToggleLike={handleToggleLike}
                                    likingCategoryId={likingCategoryId}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              );
            })()}
      </div>

      {/* ── Detail Dialog ── */}
      {selectedCategory && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-4xl overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pr-8 text-left">
              <DialogTitle className="text-xl leading-tight sm:text-2xl">{selectedCategory.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
              <div className="md:col-span-1 flex items-center justify-center">
                <img
                  src={!modalImageError && selectedCategory.image ? selectedCategory.image : getAvatarFallbackUrl()}
                  alt={selectedCategory.title}
                  className="h-44 w-full rounded-lg border object-cover sm:h-48"
                  onError={() => setModalImageError(true)}
                />
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 mb-4">{selectedCategory.topic}</div>
                <p className="mb-4 max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-6 text-gray-700 sm:max-h-none sm:text-base sm:leading-7">
                  {selectedCategory.description || "No description provided."}
                </p>
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <div><div className="font-bold text-gray-800">Rate</div><div>${selectedCategory.category_rate ?? "N/A"}/15 mins</div></div>
                  <div><div className="font-medium text-gray-800">Language</div><div>{selectedCategory.Language || teacherDetails?.language || "Any"}</div></div>
                  <div><div className="font-medium text-gray-800">Experience</div><div>{selectedCategory.ExperienceLevel || "—"}</div></div>
                  <div><div className="font-medium text-gray-800">Teacher</div><div>{selectedCategory.teacher_name || "Unknown"}</div></div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/profile?name=${selectedCategory.teacher?.usernameT || ""}`)}
                    className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 sm:w-auto sm:py-2"
                  >
                    View Teacher
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:hidden">
              <button className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600" onClick={() => setOpen(false)}>
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
