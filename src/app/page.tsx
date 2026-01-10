// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/src/hooks/useAuth';
// import UserProfile from '../components/auth/UserProfile';

// export default function HomePage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/auth/login');
//     }
//   }, [loading, user, router]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {user && <UserProfile />}
//     </div>
//   );
// }
"use client"
import HeroSection from "@/src/components/home/HeroSection";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import { RecentUsersSection } from "@/src/components/home/RecentUsersSection";
import { RecentCategoriesSection } from "@/src/components/home/RecentCategoriesSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <RecentUsersSection />
      <FeaturesSection/>
      <RecentCategoriesSection />
      <TestimonialsSection />
    </main>
  );
}
