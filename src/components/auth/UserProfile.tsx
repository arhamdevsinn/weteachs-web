// @ts-nocheck
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import Link from 'next/link';
import { toast } from "sonner";
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

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('images');

  // const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('userId') || undefined;

  const {
    profile,
    teacherDetails,
    gallery,
    categories,
    loading: dataLoading,
    error: dataError,
  } = useUserProfile(uid);
  console.log('UserProfile data:', { profile, teacherDetails, gallery, categories, dataError });
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
const [open, setOpen] = useState(false);
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

  if (dataError || !profile) {
    return (
      <div className="bg-secondary min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{dataError || 'Profile not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
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
        <div className='text-gray-600'>
          {profile.email}
        </div>
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
        <button className="bg-primary hover:from-green-800 hover:to-primary text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all transform hover:-translate-y-1">
          Profile Settings
        </button>
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
 <Link href="/categories?userId={uid}"><Button className='my-5'>Categories</Button></Link> 
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
      {['Services', 'Portfolio', 'Testimonials', 'Resources', 'Contact'].map((item, index) => (
        <a 
          key={index} 
          href="#" 
          className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm"
        >
          {item}
        </a>
      ))}
    </div> */}


  
  <div className="text-sm py-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
    ✨ Recent Work Samples
  </h2>

  {gallery && gallery.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {gallery.map((url, index) => (
        <div
          key={index}
          className="relative group rounded-xl overflow-hidden shadow-md bg-white"
        >
          <Image
            src={url}
            alt={`Gallery image ${index + 1}`}
            width={500}
            height={500}
            className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="text-gray-500 text-center py-10 flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 mb-3 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7l9-4 9 4-9 4-9-4zm0 7l9 4 9-4M3 7v10"
        />
      </svg>
      <p>No images uploaded yet.</p>
    </div>
  )}
</div>
  </div>
        </div>
    
  
  );
};

export default UserProfile;