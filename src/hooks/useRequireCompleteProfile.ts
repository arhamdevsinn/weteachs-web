// @ts-nocheck
"use client";
import { useEffect, useState,useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase/config";
import { useAuth } from "@/src/hooks/useAuth";
import { UserProfileAPI } from "@/src/lib/api/userProfile";
import { onAuthStateChanged, User } from "firebase/auth";
import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants";
interface UseRequireCompleteProfileProps {
  username?: string|null;
}

export const useRequireCompleteProfile = ({ username }: UseRequireCompleteProfileProps = {}) => {

  const redirectTo = "/create-profile"
  // const { user, loading } = useAuth();
  // const [user, setUser] = useState<User | null>(null);

  const [loadingLimbo, setLoadingLimbo] = useState(true);
  const [error, setError] = useState< | null>(null);
  const router = useRouter();
  const [limboUser, setLimboUser] = useState< | null>(null);

  
  const uid = auth.currentUser?.uid;  
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    // Skip effect if not on client side
    if (!isClient) {
      return;
    }

    let mounted = true;

    const fetchLimbo = async () => {
      setLoadingLimbo(true);
      setError(null);
      try {
        const uidFromUser = auth.currentUser?.uid;
        const uidFromAuth = typeof window !== "undefined" && auth?.currentUser ? auth.currentUser.uid : null;
        const uidFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        const uid = uidFromUser || uidFromAuth || uidFromStorage;

        if (!uid) {
          if (mounted) setLimboUser(null);
          return;
        }

        const p = await UserProfileAPI.getLimboUser(uid);
        if (mounted) setLimboUser(p || null);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoadingLimbo(false);
      }
    };
  
    fetchLimbo();
    return () => {
      mounted = false;
    };
  }, [!username, isClient]);

  useEffect(() => {
    
    if (!loadingLimbo && !username) {
      if (!limboUser?.signupcomplete || !limboUser?.signupcompletepage2) {
        router.replace(redirectTo);
      }
    }
  }, [loadingLimbo, limboUser, router, redirectTo]);

  return { limboUser, loadingLimbo, error };
}



