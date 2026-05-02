"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";

const MobileBottomCTA = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="bg-white px-4 pb-12 pt-6">
      <div className="rounded-[12px] bg-primary px-4 py-10 text-center text-white shadow-lg">
        <h2 className="mx-auto max-w-[280px] text-[28px] font-bold leading-tight">
          Hire the top knowledgeable Experts
        </h2>
        <Link
          href="/auth/signup"
          className="mt-8 inline-flex rounded-[10px] bg-white px-10 py-3 text-[18px] font-bold leading-none text-primary transition active:scale-95"
        >
          Try the app
        </Link>
      </div>
    </section>
  );
};

export default MobileBottomCTA;
