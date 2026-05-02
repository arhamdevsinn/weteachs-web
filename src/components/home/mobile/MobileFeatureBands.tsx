"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const MobileFeatureBands = () => {
  return (
    <section className="bg-white">
      {/* Kicker */}
      <div className="px-4 pt-6 pb-2 text-center">
        <h2 className="text-[24px] font-black text-black">
          Talk to real people
        </h2>
        <p className="mt-2 text-[12px] font-medium text-gray-600 px-6">
          Get help tailored exactly to what you need, quickly and stress-free.
        </p>
      </div>

      {/* Learn as a Client Band */}
      <div className="mx-4 mb-8 mt-6 flex items-center gap-3 rounded-[12px] bg-secondary p-4 shadow-sm">
        <div className="relative h-[100px] w-[130px] shrink-0 overflow-hidden rounded-[8px] shadow-md">
          <Image
            src="/student.png"
            alt="Learn as a Client"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-black leading-tight text-black">
            For Hiring
          </h3>
          <p className="text-[11px] leading-snug text-gray-700">
            Imagine talking to AI—but it's a real person. Get the answers you need in minutes.
          </p>
          <Link
            href="/learn"
            className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[11px] font-black text-white transition hover:bg-green-900 shadow-md"
          >
            Start Here
            <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#6fbd58] text-[10px] leading-none text-white">
              ✓
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileFeatureBands;
