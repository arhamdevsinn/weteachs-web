// "use client";
// import { useEffect, useState } from "react";
// import { fetchLeaderboardUsers } from "@/src/utils/communityData";
// import { Card, CardContent } from "@/src/components/ui/card";
// import Image from "next/image";

// export default function LeaderboardPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadLeaderboard = async () => {
//       console.log("🔄 Fetching leaderboard data...");
//       setLoading(true);
//       try {
//         const data = await fetchLeaderboardUsers();
//         console.log("✅ Leaderboard data received:", data.length);
//         setUsers(data);
//       } catch (err) {
//         console.error("💥 Error loading leaderboard:", err);
//       } finally {
//         console.log("🏁 Finished loading leaderboard.");
//         setLoading(false);
//       }
//     };
//     loadLeaderboard();
//   }, []);

//   if (loading) {
//     console.log("⏳ Loading state active...");
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-green-700 font-medium">Loading leaderboard...</p>
//         </div>
//       </div>
//     );
//   }

//   console.log("✅ Rendering leaderboard:", users);

//   return (
//     <section className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-green-900 text-center mb-8">
//           🌟 Top 100 Users
//         </h1>

//         {users.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No leaderboard data found.
//           </p>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {users.map((user, index) => (
//               <Card
//                 key={user.id}
//                 className="cursor-pointer hover:shadow-lg border border-green-200 transition-all bg-white rounded-2xl"
//               >
//                 <CardContent className="flex items-center justify-between p-4">
//                   <div className="flex items-center gap-4">
//                     <Image  priority={true}
//                       src={user.photo || "/default-avatar.png"}
//                       alt={user.name}
//                       width={50}
//                       height={50}
//                       className="rounded-full border border-green-300 object-cover"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-gray-800">
//                         {user.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">{user.role}</p>
//                     </div>
//                   </div>
//                   <span className="text-green-800 font-semibold">
//                     ⭐ {user.reputation}
//                   </span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <h1> Development in progress......</h1>
    </div>
  )
}

export default page
