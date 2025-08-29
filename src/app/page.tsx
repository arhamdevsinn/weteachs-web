"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
        const router = useRouter()
        const handleMoveToProfile = () => {
      router.push("/profile")
    }
  return (
   <div className='flex px-20 py-10'>
    <button onClick={handleMoveToProfile} className="bg-primary  text-white font-bold py-2 px-4 rounded">
      Move to Profile Page
    </button>
   </div>
  );
}
