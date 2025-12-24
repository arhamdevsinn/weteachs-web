"use client";
import { useEffect, useState,useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase/config";
import { useAuth } from "@/src/hooks/useAuth";
import { UserProfileAPI } from "@/src/lib/api/userProfile";
import { onAuthStateChanged, User } from "firebase/auth";

// export const useRequireCompleteProfile = () => {
//   const redirectTo = "/create-profile"
//   // const { user, loading } = useAuth();
//   // const [user, setUser] = useState<User | null>(null);

//   const [limboUser, setLimboUser] = useState<any | null>(null);
//   const [loadingLimbo, setLoadingLimbo] = useState(true);
//   const [error, setError] = useState<any | null>(null);
//   const router = useRouter();


//   const uid = auth.currentUser?.uid;
//   const isClient = typeof window !== 'undefined';
//   if (!isClient) {
//     return { limboUser: null, loadingLimbo: true, error: null };
//   }


//   useEffect(() => {
//     let mounted = true;

//     const fetchLimbo = async () => {
//       setLoadingLimbo(true);
//       setError(null);
//       try {
//         const uidFromUser = auth.currentUser?.uid;
//         const uidFromAuth = typeof window !== "undefined" && auth?.currentUser ? auth.currentUser.uid : null;
//         const uidFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//         const uid = uidFromUser || uidFromAuth || uidFromStorage;

//         if (!uid) {
//           if (mounted) setLimboUser(null);
//           return;
//         }

//         const p = await UserProfileAPI.getLimboUser(uid);
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
//   }, [uid]);

//   useEffect(() => {

//     if (!loadingLimbo) {
//       if (!limboUser?.signupcomplete || !limboUser?.signupcompletepage2) {
//         router.replace(redirectTo);
//       }
//     }
//   }, [loadingLimbo, limboUser, router, redirectTo]);

//   return { limboUser, loadingLimbo, error };
// }

export const useRequireCompleteProfile = () => {
  const redirectTo = "/create-profile";
  
  // ✅ ALL HOOKS CALLED UNCONDITIONALLY AT THE TOP
  
  // State hooks
  const [limboUser, setLimboUser] = useState<any | null>(null);
  const [loadingLimbo, setLoadingLimbo] = useState(true);
  const [error, setError] = useState<any | null>(null);
  
  // Router hook
  const router = useRouter();
  

  const mountedRef = useRef(true);


  const uid = typeof window !== 'undefined' ? auth.currentUser?.uid : null;
  

  
  useEffect(() => {
    mountedRef.current = true;
    
    const fetchLimbo = async () => {
      if (!mountedRef.current) return;
      
      setLoadingLimbo(true);
      setError(null);
      
      try {
        // Get UID from various sources
        const uidFromUser = auth.currentUser?.uid;
        const uidFromAuth = typeof window !== "undefined" && auth?.currentUser ? auth.currentUser.uid : null;
        const uidFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        const currentUid = uidFromUser || uidFromAuth || uidFromStorage;

        if (!currentUid) {
          if (mountedRef.current) setLimboUser(null);
          return;
        }

        const p = await UserProfileAPI.getLimboUser(currentUid);
        if (mountedRef.current) setLimboUser(p || null);
      } catch (err) {
        if (mountedRef.current) setError(err);
      } finally {
        if (mountedRef.current) setLoadingLimbo(false);
      }
    };

    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchLimbo();
    } else {
      // On server, set loading to false immediately
      setLoadingLimbo(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []); 

  useEffect(() => {

    if (typeof window === 'undefined') return;
    if (loadingLimbo) return;
    
    if (!limboUser?.signupcomplete || !limboUser?.signupcompletepage2) {
      router.replace(redirectTo);
    }
  }, [loadingLimbo, limboUser, router, redirectTo]);


  if (typeof window === 'undefined') {
    return { limboUser: null, loadingLimbo: true, error: null };
  }
  

  return { limboUser, loadingLimbo, error };
};

