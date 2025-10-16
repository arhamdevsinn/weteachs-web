"use client";
import { Suspense } from "react";
import { useUserIdFromUrl } from "@/src/hooks/useUserIdFromUrl";

function DashboardContent() {
  const { userId, } = useUserIdFromUrl();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {userId}</p>
  
        <p className="text-red-500">⚠️ Invalid user ID in URL</p>
    
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading user info...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
