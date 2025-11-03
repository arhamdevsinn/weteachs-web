// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/src/components/ui/button";
// import { Skeleton } from "@/src/components/ui/skeleton";
// import { useSearchParams } from "next/navigation";

// const settingsOptions = [
//   "Reviews",
//   "Edit",
//   "Payments",
//   "Connect Stripe",
//   "Withdraw PayPal",
//   "Help",
//   "Referrals",
// ];

// const SettingsPage: React.FC = () => {
//   const [loading, setLoading] = useState(true);
// const searchParams = useSearchParams();
// const userImg = searchParams.get("userImg") || "/profile.photo_url";
//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   const userImage = "https://i.pravatar.cc/150?img=32"; 

//   return (
//     <div className="w-full min-h-screen p-6 bg-gray-50 flex flex-col items-center">
//       <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-md p-6">
//         {/* User Image */}
//         <div className="flex justify-center mb-4">
//           {loading ? (
//             <Skeleton className="h-24 w-24 rounded-full" />
//           ) : (
//             <img
//               src={userImage}
//               alt="User"
//               className="h-24 w-24 rounded-full object-cover border-4 border-primary"
//             />
//           )}
//         </div>

//         <h2 className="text-center text-2xl font-bold text-primary mb-4">Settings</h2>
//         <hr className="mb-4 border-gray-300" />

//         <div className="space-y-3 w-full">
//           {settingsOptions.map((option) =>
//             loading ? (
//               <Skeleton key={option} className="h-14 w-full rounded-lg" />
//             ) : (
//               <div
//                 key={option}
//                 className="p-4 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer font-semibold text-gray-800 w-full"
//               >
//                 {option}
//               </div>
//             )
//           )}
//         </div>

//         <div className="mt-6 w-full">
//           {loading ? (
//             <Skeleton className="h-12 w-full rounded-lg" />
//           ) : (
//             <Button className="w-full bg-primary text-white hover:bg-primary/90">
//               Save Settings
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'> 
      <h1>In progress......</h1>
    </div>
  )
}

export default page
