// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserProfileAPI } from "@/src/lib/api/userProfile";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import { log } from "console";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("images");
  const [selectedSection, setSelectedSection] = useState("all");
  const [fallbackTeacher, setFallbackTeacher] = useState(null);
  const [fallbackProfile, setFallbackProfile] = useState(null);
  const [fallbackCategories, setFallbackCategories] = useState([]);
  const [loadingFallback, setLoadingFallback] = useState(false);
  const { user } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  //  const storedId =
  //    typeof window !== "undefined"
  //      ? localStorage.getItem("user_id") || localStorage.getItem("userId")
  //      : null;

  //  const {
  //    profile,
  //    displayTeacher,
  //    gallery,
  //    categories,
  //    subcollections,
  //    loading: dataLoading,
  //    error: dataError,
  //  } = useUserProfile(storedId);
  //  console.log('UserProfile data:', { profile, displayTeacher, gallery, categories, subcollections, dataError });
  //
  //  const usernameT = searchParams.get("name");
  //  console.log("usernameT:", usernameT);
  //  
  //  useEffect(() => {
  //    const fetchFallbackTeacher = async () => {
  //      try {
  //        setLoadingFallback(true);
  //
  //        const { teacher, userProfile, categories, subcollections } =
  //          await UserProfileAPI.getTeacherByUsername(usernameT);
  //
  //        console.log("Fetched public teacher:", teacher, userProfile, categories, subcollections);
  //        setFallbackTeacher(teacher);
  //        setFallbackProfile(userProfile);
  //        setFallbackCategories(categories);
  //
  //        // ✅ Temporarily store userId (only if user authenticated)
  //        if (!user) {
  //          if (userProfile?.uid) {
  //            localStorage.setItem("user_id", userProfile.uid);
  //            console.log("✅ Stored uid:", userProfile.uid);
  //          } else if (userProfile?.id) {
  //            localStorage.setItem("user_id", userProfile.id);
  //            console.log("✅ Stored uid (from id):", userProfile.id);
  //          }
  //        }
  //        else {
  //          console.log("🧹 No authenticated user — clearing stored user_id");
  //          localStorage.removeItem("user_id");
  //          localStorage.removeItem("userId");
  //        }
  //      } catch (err) {
  //        console.error("❌ Error fetching fallback teacher:", err);
  //        toast.error("No teacher found for this username.");
  //      } finally {
  //        setLoadingFallback(false);
  //      }
  //    };
  //
  //    // ✅ Fetch only if no stored ID but a username is present
  //    if (usernameT) {
  //      fetchFallbackTeacher();
  //    }
  //
  //    // 🧹 Cleanup when route changes or component unmounts
  //    // return () => {
  //    //   console.log("🧹 Cleaning up: removing userId from localStorage");
  //    //   localStorage.removeItem("user_id");
  //    // };
  //  }, [storedId, usernameT, user]);

  // always use username from query param to fetch profile (no localStorage checks)
  const usernameT = searchParams.get("name");
  // guard to ensure we fetch only once per username value
  const fetchedForRef = useRef<string | null>(null);

  // current name param (stable alias) and request id ref used in the effect below
  const nameParam = usernameT;
  const currentReqRef = useRef<number | null>(null);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<>(null);
  const [subcollectionsData, setSubcollectionsData] = useState<>({});

  useEffect(() => {
    const username = nameParam;
    if (!username) return;
    console.log("Fetching profile for username:", username);

    // clear previous display while fetching new profile so old profile doesn't flash back
    setFallbackTeacher(null);
    console.log("Cleared previous teacher data.");
    setFallbackProfile(null);
    setFallbackCategories([]);
    setSubcollectionsData({});
    setDataError(null);
     setDataLoading(true);
    console.log("Cleared previous profile data.");

    const reqId = Date.now();
    currentReqRef.current = reqId;
    let mounted = true;
    setDataLoading(true);

    (async () => {
      try {
        const res = await UserProfileAPI.getProfileByUsername(username);

        // ignore if component unmounted or a newer request started
        if (!mounted || currentReqRef.current !== reqId) return;

        if (res.role === "teacher") {
          setFallbackTeacher(res.teacherDetails || res.teacher || null);
          setFallbackProfile(res.profile || res.userProfile || null);
          setFallbackCategories(res.categories || []);
          setSubcollectionsData(res.subcollections || {});
        } else if (res.role === "student") {
          setFallbackTeacher(null);
          setFallbackProfile(res.profile || res.userProfile || null);
          setFallbackCategories([]);
          setSubcollectionsData(res.subcollections || {});
        } else {
          throw new Error("Profile not found");
        }
      } catch (err) {
        if (currentReqRef.current === reqId) {
          console.error("Error fetching profile by username:", err);
          setDataError(err);
          toast.error("No profile found for this username.");
        }
      } finally {
        if (mounted && currentReqRef.current === reqId) setDataLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [nameParam]);

  const handleSettingsClick = () => {
    router.push("/settings", {
      state: { userImg: fallbackProfile?.photo_url || "/profile.photo_url" },
    });
  };
  const handleClick = () => {
    if (!fallbackTeacher?.id) {
      console.error("Teacher ID not available");
      return;
    }
    router.push(`/categories?teacherId=${fallbackTeacher.id}`);
  };
  const ratings = (fallbackTeacher?.rating ?? []);
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
  const filledStars = Math.round(averageRating);

  // useEffect(() => {
  //   if (!dataLoading && (dataError || !fallbackProfile)) {
  //     // don't auto-redirect for public profile view — show friendly message instead
  //     // router.push("/create-profile");
  //   }
  // }, [dataLoading, dataError, fallbackProfile, router]);

  // always render using fetched username data (no storedId logic)
  const displayTeacher = fallbackTeacher;
  const displayProfile = fallbackProfile;
  const displayCategories = fallbackCategories;
  const subcollections = subcollectionsData;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const [open, setOpen] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setOpen(false);
    toast.success("Profile link copied successfully!");
  };

  if (dataLoading || loadingFallback) {
    return (
      <div className="bg-secondary min-h-screen py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-7xl mx-auto animate-pulse">
          <div className="flex flex-col md:flex-row items-center gap-6 px-4 py-6">
            <div className="relative">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
          </div>

          <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-6 mt-4">
            <Skeleton className="h-28 w-full md:h-28 md:w-full rounded-lg" />
            <Skeleton className="h-28 w-full md:h-28 md:w-full rounded-lg" />
            <Skeleton className="h-28 w-full md:h-28 md:w-full rounded-lg" />
          </div>

          <div className="mt-6 p-4 bg-secondary rounded-xl">
            <Skeleton className="h-5 w-1/4 rounded-md mb-3" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-5/6 rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          <div className="mt-8">
            <Skeleton className="h-6 w-1/3 rounded-md mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayTeacher && !displayProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-gray-700 text-lg">No teacher found for this username.</p>
      </div>
    );
  }


  if (dataError || !displayProfile) {
    console.log("dfsf", dataError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <p className="text-gray-700 text-lg">Redirecting to profile setup...</p>
      </div>
    );
  }


  return (
    <div className="bg-secondary min-h-screen py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-7xl mx-auto">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-4 py-6">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-secondary to-secondary rounded-full opacity-20"></div>
            <Image
              src={displayProfile.photo_url || user}
              alt="profile"
              width={160}
              height={160}
              className="rounded-full border-4 border-secondary shadow-lg relative"
            />
          </div>
          <div className="text-center md:text-left  w-full">
            <div className="md:flex-row  md:justify-between flex  flex-col w-full items-center ">
              <div className="text-primary font-bold text-2xl md:text-3xl mb-1">
                {displayProfile.display_name || "Your Name"}
                {displayProfile.isTeacher && (
                  <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full font-semibold">Teacher</span>
                )}
                {displayProfile.isStudent && (
                  <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full font-semibold">Student</span>
                )}

              </div>
              {displayProfile.isTeacher && (
                <div className="mt-4">
                  <Button
                    onClick={() => router.push('/download')}
                    className="px-12 py-3 "
                  >
                    Hire
                  </Button>
                </div>
              )}
            </div>
            {/* <div className='text-gray-600'>
          {profile.email}
        </div> */}
            <div className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Available now
              {displayProfile.isTeacher && (
                <span className="text-gray-600 font-medium">.   ${displayTeacher?.Live_Chat_rate}/15 min</span>
              )}
            </div>
            <div className="text-gray-600 mb-1">Languages: English</div>
            <div className="bg-secondary text-primary text-sm px-3 py-1 rounded-full inline-block mt-2">
              <span className='font-semibold'>  Joining Date:</span> {displayProfile.created_time?.seconds
                ? new Date(displayProfile.created_time.seconds * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "Unknown"}
            </div>
            {/* )} */}
          </div>
        </div>


        {/* Stats / Settings */}
        {displayProfile.isTeacher && (
          <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-6 mt-4">
            <div className="flex flex-col items-center">
              <Link
                href={{
                  pathname: "/settings",
                  query: { userImg: displayProfile.photo_url || "/profile.photo_url" },
                }}
              >
                <button className="bg-primary hover:from-green-800 hover:to-primary text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all transform hover:-translate-y-1">
                  Profile Settings
                </button>
              </Link>
              <div className="flex gap-1 mt-4 text-amber-400 text-xl">
                {'★'.repeat(filledStars)}
                <span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span>
                <span className="text-gray-600 text-sm ml-1 self-center">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-primary w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  <span className="text-2xl">{displayTeacher?.Number_of_completed_jobs || 42}</span>
                </div>
                {/* <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-md">
            +5
          </div> */}
              </div>
              <div className="text-md mt-3 text-gray-700 font-medium">Completed Jobs</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <span className="text-xl">${displayTeacher?.Total_amount_earned || '248.50'}</span>
              </div>
              <div className="text-md mt-3 text-gray-700 font-medium">Total Earned</div>
            </div>

          </div>
        )}

        {/* Socials */}
        {displayProfile.isTeacher && (
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-6 mt-6 text-sm">
            <div className="text-gray-700 font-medium mb-2 sm:mb-0">Connect with me:</div>
            <div className="flex gap-4 text-2xl">
              {displayTeacher?.Instagram && (
                <Link
                  href={`https://www.instagram.com/${displayTeacher.Instagram}`}
                >
                  <Image src="/instagram.png" alt="instagram" width={24} height={24} />
                </Link>
              )}

              {displayTeacher?.Facebook && (
                <Link
                  href={`https://www.facebook.com/${displayTeacher.Facebook}`}
                >
                  <Image src="/facebook.png" alt="facebook" width={24} height={24} />
                </Link>
              )}

              {displayTeacher?.Tiktok && (
                <Link
                  href={`https://www.tiktok.com/${displayTeacher.Tiktok}`}
                >
                  <Image src="/social-media.png" alt="tiktok" width={24} height={24} />
                </Link>
              )}

              {displayTeacher?.youtube && (
                <Link
                  href={`https://www.youtube.com/${displayTeacher.youtube}`}
                >
                  <Image src="/youtube.png" alt="youtube" width={24} height={24} />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Website and Heart */}
        {displayProfile.isTeacher && (
          <div className="flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-black font-bold mr-2">{displayTeacher?.website || 'https://yourwebsite.com'}</span>
              <span className="text-blue-500 text-xs bg-blue-100 px-2 py-1 rounded">Verified</span>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="text-xl transition-transform hover:scale-110 active:scale-95">
                  <Image src="/share.png" alt="share" width={20} height={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Profile</DialogTitle>
                  <DialogDescription>
                    Copy the link below and share it with others.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input value={shareUrl} readOnly />
                  <Button onClick={handleCopy}>Copy</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {/* {profile.isTeacher && (
<div>
   <Button className="my-5" onClick={handleClick}>
      Categories
    </Button>
</div>  
       )} */}
        {/* About Me */}
        <div className="mt-6 p-4 bg-secondary rounded-xl">
          <div className="font-bold text-lg text-gray-800 mb-2">About Me</div>
          <div className="text-gray-700">
            {displayTeacher?.bio_T || "No bio set yet. Add your expertise and experience!"}
          </div>
          {/* <div className="text-primary font-semibold cursor-pointer mt-2 inline-block hover:underline">
        Read more
      </div> */}
        </div>

        {/* Sections */}
        {/* <div className="mt-6 flex flex-wrap gap-3 justify-start">
        <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {displayTeacher?.section_1_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {displayTeacher?.section_2_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {displayTeacher?.section_3_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {displayTeacher?.section_4_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {displayTeacher?.section_5_name}
        </a>
    </div> */}


        {displayProfile.isTeacher && (
          <div className="text-sm py-8 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-primary text-3xl">✨</span> Recent Work Samples
            </h2>

            {/* Section & Tabs Header */}
            <div className=" border-gray-200 pt-2">
              {/* Section Filter */}
              <div className="flex flex-wrap gap-3 justify-start mb-6">
                {[
                  { key: "all", label: "All" },
                  { key: "section_1", label: displayTeacher?.section_1_name },
                  { key: "section_2", label: displayTeacher?.section_2_name },
                  { key: "section_3", label: displayTeacher?.section_3_name },
                  { key: "section_4", label: displayTeacher?.section_4_name },
                  { key: "section_5", label: displayTeacher?.section_5_name },
                ]
                  .filter((s) => s.label)
                  .map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setSelectedSection(section.key)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium shadow-sm transition-all duration-300 ${selectedSection === section.key
                        ? "bg-primary text-white shadow-md scale-105"
                        : "bg-white text-primary border-primary hover:bg-primary/5"
                        }`}
                    >
                      {section.label}
                    </button>
                  ))}
              </div>

              {/* Tabs (Images, Videos, Info) */}
              <div className="flex w-full justify-center mb-6 border-b border-gray-100">
                {[
                  { key: "images", label: "Images" },
                  { key: "videos", label: "Videos" },
                  { key: "info", label: "Info" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative w-full pb-2 p-2 font-semibold transition-all ${activeTab === tab.key
                      ? "text-primary  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* === IMAGES TAB === */}
            {activeTab === "images" && (
  <div className="animate-fadeIn">
    {subcollections?.galleryCollection && subcollections.galleryCollection.length > 0 ? (
      (() => {
        const filtered = subcollections.galleryCollection.filter((item) => {
          const hasImage = item?.image_gallery && item.image_gallery.trim() !== "";
          if (!hasImage) return false;

          return selectedSection === "all" ? true : item[selectedSection];
        });

        return filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item, i) => {
              const likeCount = Array.isArray(item.likes_ref) ? item.likes_ref.length : 0;

              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300 border"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden group">
                    <Image
                      src={item.image_gallery}
                      alt={item.Title || `Gallery ${i + 1}`}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                      {item.Title || "Untitled"}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.Description || "No description provided."}
                    </p>

                    {/* Likes */}
                    <div className="flex items-center text-sm text-gray-700 font-medium">
                      ❤️ {likeCount} Likes
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No images found.</p>
        );
      })()
    ) : (
      <p className="text-gray-500 text-center py-10">No images uploaded yet.</p>
    )}
  </div>
)}
              {/* === VIDEOS TAB === */}
              {activeTab === "videos" && (
                <div className="space-y-6 animate-fadeIn">
                  {subcollections.videos?.length ? (
                    (() => {
                      const filtered = subcollections.videos.filter((v) =>
                        selectedSection === "all" ? true : v[selectedSection]
                      );
                      return filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {filtered.map((video, i) => (
                            <div
                              key={i}
                              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                              <video
                                src={video.video_gallery}
                                poster={video.thumbnail_url || "/video-placeholder.png"}
                                controls
                                className="w-full h-48 object-cover rounded-t-xl"
                              />
                              <div className="p-4">
                                <p className="font-semibold text-gray-900">
                                  {video.Title || "Untitled Video"}
                                </p>
                                {video.Description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {video.Description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-10">
                          No videos found for this section.
                        </p>
                      );
                    })()
                  ) : (
                    <p className="text-gray-500 text-center py-10">No videos uploaded yet.</p>
                  )}
                </div>
              )}

              {/* === INFO TAB === */}
              {activeTab === "info" && (
                <div className="text-gray-700 space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    🧠 Expert Texts
                  </h3>

                  {subcollections?.expertTexts?.length ? (
                    (() => {
                      const filtered = subcollections.expertTexts.filter((t) =>
                        selectedSection === "all" ? true : t[selectedSection]
                      );
                      return filtered.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filtered.map((text, i) => (
                            <li
                              key={i}
                              className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <p className="font-semibold text-lg text-gray-900 mb-2">
                                {text.Title || "Untitled"}
                              </p>
                              {text.Description && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                  {text.Description}
                                </p>
                              )}
                              {text.Link && (
                                <a
                                  href={
                                    text.Link.startsWith("http")
                                      ? text.Link
                                      : `https://${text.Link}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                                >
                                  🔗 Visit Link
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-center py-10">
                          No expert texts found for this section.
                        </p>
                      );
                    })()
                  ) : (
                    <p className="text-gray-500 text-center py-10">
                      No expert texts available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {displayProfile.isStudent && !user && (
        <div className="flex flex-col items-center justify-center w-full py-10 px-6 mt-8 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-lg border border-gray-100">
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-primary text-center mb-3 tracking-tight">
            Get More Features on Our Mobile App!
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            Learn anytime, anywhere. Stay connected with teachers and classmates on the go with our official mobile app.
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {/* Android */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.weteachappneww.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/play-store.png"
                  width={140}
                  height={60}
                  alt="Play Store"
                  className="hover:scale-105 transition-transform drop-shadow-md"
                />
              </a>
              {/* 
        <Button
          onClick={() =>
            window.open(
              "https://play.google.com/store/apps/details?id=com.weteachappneww.app",
              "_blank",
              "noopener,noreferrer"
            )
          }
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full px-8 py-4 text-base shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3.5 2.5a1 1 0 0 0-1 1v17a1 1 0 0 0 1.514.857l14.486-8.5a1 1 0 0 0 0-1.714l-14.486-8.5a1 1 0 0 0-.514-.143z" />
          </svg>
          Download for Android
        </Button> */}
            </div>

            {/* iOS */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://apps.apple.com/us/app/weteachs/id6502515880"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/app-store.png"
                  width={140}
                  height={60}
                  alt="App Store"
                  className="hover:scale-105 transition-transform drop-shadow-md"
                />
              </a>

              {/* <Button
          variant="outline"
          onClick={() =>
            window.open(
              "https://apps.apple.com/us/app/weteachs/id6502515880",
              "_blank",
              "noopener,noreferrer"
            )
          }
          className="border-gray-400 text-gray-800 hover:bg-gray-100 rounded-full px-8 py-4 text-base shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16.365 1.43c.34.392.616.87.81 1.43-.418.25-.97.596-1.6.596-.653 0-1.367-.356-1.8-.596a3.68 3.68 0 0 1 .733-1.43c.367-.392.9-.86 1.67-.86.74 0 1.26.448 1.187.86zM12 4.5c1.31 0 2.582.644 3.366 1.748C16.19 7.488 17 9.158 17 10.79c0 1.582-.598 3.14-1.57 4.244C14.88 16.232 13.68 17 12 17s-2.882-.768-3.43-1.966C7.598 13.93 7 12.372 7 10.79c0-1.632.81-3.302 1.634-4.542C9.418 5.144 10.69 4.5 12 4.5z" />
          </svg>
          Get on iOS
        </Button> */}
            </div>
          </div>

          {/* Decorative line */}
          <div className="w-24 h-[3px] bg-gradient-to-r from-primary to-blue-600 mt-8 rounded-full"></div>
        </div>
      )}

    </div>


  );
};

export default UserProfile;