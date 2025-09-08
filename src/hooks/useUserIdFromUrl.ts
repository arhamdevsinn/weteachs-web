"use client";
import { useSearchParams } from 'next/navigation';
import { useAuth } from './useAuth';

export const useUserIdFromUrl = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const userIdFromUrl = searchParams.get('userId');
  const currentUserId = user?.uid;

  // Validate that the user ID in URL matches the logged-in user
  const isValidUserId = userIdFromUrl === currentUserId;

  return {
    userId: isValidUserId ? userIdFromUrl : currentUserId,
    isValidUserId,
    userIdFromUrl,
    currentUserId
  };
};