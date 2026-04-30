"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const MobileFeatureBands = () => {
  return (
    <section className="bg-white">
      {/* Kicker */}
      <div className="px-4 pt-4 pb-2 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
          Turn Knowledge Into Income
        </p>
        <p className="mt-1 text-[15px] font-black text-black">
          Empower Your Growth &mdash; Learn &amp; Earn
        </p>
      </div>

      {/* Learn as a Client Band */}
      <div className="mx-4 mb-3 mt-4 flex items-center gap-3 rounded-[8px] bg-secondary p-3">
        <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-[6px] shadow-md">
          <Image
            src="/student.png"
            alt="Learn as a Client"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-black leading-tight text-black">
            Learn as a{" "}
            <span className="text-primary">Client</span>
          </h3>
          <p className="text-[10px] leading-snug text-gray-700">
            Imagine talking to AI—but it's a real person. Get help tailored exactly to what you need quickly and stress-free.
          </p>
          <Link
            href="/learn"
            className="mt-1 w-fit rounded-full bg-primary px-4 py-1.5 text-[10px] font-black text-white transition hover:bg-green-900"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Earn as a Helper Band */}
      <div className="mx-4 mb-6 flex items-center gap-3 rounded-[8px] bg-secondary p-3">
        <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-[6px] shadow-md">
          <Image
            src="/expert.png"
            alt="Earn as a Helper"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-black leading-tight text-black">
            Earn as an{" "}
            <span className="text-primary">Helper</span>
          </h3>
          <p className="text-[10px] leading-snug text-gray-700">
            Earn by chatting with people who need your skills. Set your own rates, times, and topics—it's that simple.
          </p>
          <Link
            href="/teach"
            className="mt-1 w-fit rounded-full bg-primary px-4 py-1.5 text-[10px] font-black text-white transition hover:bg-green-900"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileFeatureBands;
