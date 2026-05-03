"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const MobileFeatureBands = () => {
  return (
    <section className="bg-white">
      {/* Kicker */}
      <div className="px-4 pt-10 pb-4 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">OUR KNOWLEDGE NETWORK</p>
        <h2 className="text-[20px] font-black text-black">
          Empower Your Growth — Learn & Earn
        </h2>
      </div>

      {/* Learn as a Client Band */}
      <div className="mx-4 mb-6 mt-4 flex items-center gap-3 rounded-[12px] bg-[#EBF3EF] p-4 shadow-sm border border-primary/5">
        <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-[8px] shadow-sm">
          <Image
            src="/student.png"
            alt="For Hiring"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-black leading-tight text-[#1B4323]">
            For Hiring
          </h3>
          <p className="text-[11px] font-bold text-gray-600 leading-tight">
            Imagine talking to AI—but it's a real person. Get the answers you need in minutes.
          </p>
          <Link
            href="/auth/signup"
            className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#1B4323] px-4 py-1.5 text-[12px] font-black text-white transition shadow-md"
          >
            Start Here
            <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#6fbd58] text-[10px] leading-none text-white font-bold">
              ✓
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileFeatureBands;
