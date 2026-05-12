"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const MobileHelperBand = () => {
  return (
    <section className="bg-white">
      {/* For Earning Band */}
      <div className="mx-4 mb-8 mt-6 flex items-center gap-3 rounded-[12px] bg-[#EBF3EF] p-4 shadow-sm border border-primary/5">
        <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-[8px] shadow-sm">
          <Image
            src="/expert.png"
            alt="For Earning"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-black leading-tight text-[#1B4323]">
            For Earning
          </h3>
          <p className="text-[11px] font-bold text-gray-600 leading-tight">
            Earn by chatting with people who need your skills. Set your own rates, times, and topics—it's that simple.
          </p>
          <Link
            // href="/auth/signup"
            href="/learn"
            className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#1B4323] px-4 py-1.5 text-[12px] font-black text-white transition shadow-md"
          >
            Find Out How
            <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#6fbd58] text-[10px] leading-none text-white font-bold">
              ✓
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileHelperBand;
