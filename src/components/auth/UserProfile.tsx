// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import Link from 'next/link';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { div } from 'framer-motion/client';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedSection, setSelectedSection] = useState("all");
  

  // const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('userId') || undefined;

  const {
    profile,
    teacherDetails,
    gallery,
    categories,
      subcollections,
    loading: dataLoading,
    error: dataError,
  } = useUserProfile(uid);
  console.log('UserProfile data:', { profile, teacherDetails, gallery, categories, subcollections, dataError });
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
const [open, setOpen] = useState(false);
 const router = useRouter();

const handleSettingsClick = () => {
  router.push("/settings", {
    state: { userImg: profile.photo_url || "/profile.photo_url" },
  });
};
  const handleClick = () => {
    if (!teacherDetails?.id) {
      console.error("Teacher ID not available");
      return;
    }
    router.push(`/categories?userId=${uid}&teacherId=${teacherDetails.id}`);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setOpen(false); // close dialog
    toast.success("Profile link copied successfully!");
  };

  // Calculate average rating and number of filled stars
  const ratings = teacherDetails?.rating ?? [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;
  const filledStars = Math.round(averageRating);
   useEffect(() => {
    if (!dataLoading && (dataError || !profile)) {
      router.push("/create-profile");
    }
  }, [dataLoading, dataError, profile, router]);

  if (dataLoading) {
    return (
      <div className="bg-secondary min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   if (dataError || !profile) {
  //     // Redirect to create-profile page
  //     router.push('/create-profile');
  //   }
  // }, [dataError, profile, router]);

  if (dataError || !profile) {
    // Optionally, show a loading spinner while redirecting
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
          src={profile.photo_url || "/profile.photo_url"}
          alt="profile"
          width={160}
          height={160}
          className="rounded-full border-4 border-secondary shadow-lg relative"
        />
      </div>
      <div className="text-center md:text-left">
        <div className="text-primary font-bold text-2xl md:text-3xl mb-1">
          {profile.display_name || "Your Name"}
        {profile.isTeacher && (
          <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full font-semibold">Teacher</span>
        )}
          {profile.isStudent && (
          <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full font-semibold">Student</span>
        )}
         
        </div>
        {/* <div className='text-gray-600'>
          {profile.email}
        </div> */}
        <div className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Available now (0/15min)
        </div>
        <div className="text-gray-600 mb-1">Languages: English</div>
        <div className="bg-secondary text-primary text-sm px-3 py-1 rounded-full inline-block mt-2">
<span className='font-semibold'>  Joining Date:</span> {profile.created_time?.seconds
    ? new Date(profile.created_time.seconds * 1000).toLocaleDateString("en-US", {
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
    {profile.isTeacher && (
    <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-6 mt-4">
      <div className="flex flex-col items-center">
       <Link
        href={{
          pathname: "/settings",
          query: { userImg: profile.photo_url || "/profile.photo_url" },
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
            <span className="text-2xl">{teacherDetails?.Number_of_completed_jobs || 42}</span>
          </div>
          {/* <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-md">
            +5
          </div> */}
        </div>
        <div className="text-md mt-3 text-gray-700 font-medium">Completed Jobs</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-primary w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          <span className="text-xl">${teacherDetails?.Total_amount_earned || '248.50'}</span>
        </div>
        <div className="text-md mt-3 text-gray-700 font-medium">Total Earned</div>
      </div>
      
    </div>
      )}

    {/* Socials */}
   <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-6 mt-6 text-sm">
  <div className="text-gray-700 font-medium mb-2 sm:mb-0">Connect with me:</div>
  <div className="flex gap-4 text-2xl">
    {teacherDetails?.Instagram && (
      <Link
        href={`https://www.instagram.com/${teacherDetails.Instagram}`}
      >
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
      </Link>
    )}

    {teacherDetails?.Facebook && (
      <Link
        href={`https://www.facebook.com/${teacherDetails.Facebook}`}
      >
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
      </Link>
    )}

    {teacherDetails?.Tiktok && (
      <Link
        href={`https://www.tiktok.com/${teacherDetails.Tiktok}`}
      >
        <Image src="/social-media.png" alt="tiktok" width={24} height={24} />
      </Link>
    )}

    {teacherDetails?.youtube && (
      <Link
        href={`https://www.youtube.com/${teacherDetails.youtube}`}
      >
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </Link>
    )}
  </div>
</div>


    {/* Website and Heart */}
    <div className="flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <span className="text-black font-bold mr-2">{teacherDetails?.website || 'https://yourwebsite.com'}</span>
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
<div>
   <Button className="my-5" onClick={handleClick}>
      Categories
    </Button>
</div>
    {/* About Me */}
    <div className="mt-6 p-4 bg-secondary rounded-xl">
      <div className="font-bold text-lg text-gray-800 mb-2">About Me</div>
      <div className="text-gray-700">
        {teacherDetails?.bio_T || "No bio set yet. Add your expertise and experience!"}
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
          {teacherDetails?.section_1_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {teacherDetails?.section_2_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {teacherDetails?.section_3_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {teacherDetails?.section_4_name}
        </a>
          <a 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm">
          {teacherDetails?.section_5_name}
        </a>
    </div> */}


  
<div className="text-sm py-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
    <span className="text-primary text-3xl">✨</span> Recent Work Samples
  </h2>

  {/* Section & Tabs Header */}
  <div className=" border-gray-200 pt-2">
    {/* Section Filter */}
    <div className="flex flex-wrap gap-3 justify-start mb-6">
      {[
        { key: "all", label: "All" },
        { key: "section_1", label: teacherDetails?.section_1_name },
        { key: "section_2", label: teacherDetails?.section_2_name },
        { key: "section_3", label: teacherDetails?.section_3_name },
        { key: "section_4", label: teacherDetails?.section_4_name },
        { key: "section_5", label: teacherDetails?.section_5_name },
      ]
        .filter((s) => s.label)
        .map((section) => (
          <button
            key={section.key}
            onClick={() => setSelectedSection(section.key)}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium shadow-sm transition-all duration-300 ${
              selectedSection === section.key
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
          className={`relative w-full pb-2 px-2 font-semibold transition-all ${
            activeTab === tab.key
              ? "text-primary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary"
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
        {gallery && gallery.length > 0 ? (
          (() => {
            const filtered = gallery.filter((img) =>
              selectedSection === "all" ? true : img[selectedSection]
            );
            return filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.map((url, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={url.image_url || url}
                      alt={`Gallery ${i + 1}`}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      View Image
                    </div>
                  </div>
                ))}
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
  </div>
        </div>
    
  
  );
};

export default UserProfile;