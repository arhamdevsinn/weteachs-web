"use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "@/src/lib/firebase/config";
// import { useAuth } from "@/src/hooks/useAuth";
// import { UserProfileAPI } from "@/src/lib/api/userProfile";

// export const useRequireCompleteProfile =() => {
//   const redirectTo = "/create-profile"
//   const { user, loading } = useAuth();
//   const [limboUser, setLimboUser] = useState<any | null>(null);
//   const [loadingLimbo, setLoadingLimbo] = useState(true);
//   const [error, setError] = useState<any | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     let mounted = true;

//     const fetchLimbo = async () => {
//       setLoadingLimbo(true);
//       setError(null);
//       try {
//         const uidFromUser = user?.uid;
//         const uidFromAuth = typeof window !== "undefined" && auth?.currentUser ? auth.currentUser.uid : null;
//         const uidFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//         const uid = uidFromUser || uidFromAuth || uidFromStorage;

//         if (!uid) {
//           if (mounted) setLimboUser(null);
//           return;
//         }

//         const p = await UserProfileAPI.getProfile(uid);
//         if (mounted) setLimboUser(p || null);
//       } catch (err) {
//         if (mounted) setError(err);
//       } finally {
//         if (mounted) setLoadingLimbo(false);
//       }
//     };

//     fetchLimbo();
//     return () => {
//       mounted = false;
//     };
//   }, [user]);

//   useEffect(() => {
//     if (!loadingLimbo) {
//       if (!limboUser?.signupcomplete|| !limboUser?.signupcompletepage2) {
//         router.replace(redirectTo);
//       }
//     }
//   }, [loadingLimbo, limboUser, router, redirectTo]);

//   return { limboUser, loadingLimbo, error };
// }
