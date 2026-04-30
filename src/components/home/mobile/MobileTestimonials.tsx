"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Susan",
    role: "Educational Expert",
    date: "Jan 29, 2025",
    review:
      "I set up categories for resume writing and interview coaching, and within a week I had my first few bookings. The interface is smooth and communication with students is super easy.",
    img: "/review-1.png",
  },
  {
    name: "Eddma",
    role: "Student",
    date: "Feb 12, 2025",
    review:
      "I've been using WeTeachs to practice conversational Spanish with a native speaker twice a week. It feels way more personal and effective than an app or textbook.",
    img: "/review-2.png",
  },
  {
    name: "Jarrod",
    role: "Music Expert",
    date: "Mar 1, 2025",
    review:
      "I'm a full-time music marketer, and WeTeachs lets me offer short educational sessions and mentorship tutorials for everyone. It's seamless.",
    img: "/review-3.png",
  },
  {
    name: "Crissy",
    role: "Love to Cook!",
    date: "May 16, 2025",
    review:
      "Finally did my first job — can't wait to be hired again! The platform makes everything easy and fun.",
    img: "/review-4.png",
  },
];

const MobileTestimonials = () => {
  const [index, setIndex] = useState(0);
  const visible = 2;

  const handleNext = () => {
    if (index + visible < testimonials.length) setIndex((p) => p + 1);
  };
  const handlePrev = () => {
    if (index > 0) setIndex((p) => p - 1);
  };

  return (
    <section className="bg-white px-4 py-6">
      <h2 className="mb-5 text-center text-[22px] font-extrabold text-gray-900">
        Hear From Our{" "}
        <span className="text-primary">Happy Customers</span> ✨
      </h2>

      {/* Cards row with prev/next arrows */}
      <div className="relative flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={index === 0}
          aria-label="Previous"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Cards */}
        <div className="flex flex-1 gap-3 overflow-hidden">
          {testimonials.slice(index, index + visible).map((t) => (
            <div
              key={t.name}
              className="flex flex-1 flex-col items-center rounded-[10px] border border-gray-100 bg-white p-4 shadow-md text-center"
            >
              <Image
                src={t.img}
                alt={t.name}
                width={56}
                height={56}
                className="mb-2 rounded-full border-2 border-secondary object-cover"
              />
              <h3 className="text-[12px] font-bold text-gray-800">{t.role}</h3>
              <p className="mt-2 text-[10px] italic leading-snug text-gray-600">
                "{t.review}"
              </p>
              <p className="mt-3 text-[10px] text-gray-400">
                — {t.name}, {t.date}
              </p>
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={index + visible >= testimonials.length}
          aria-label="Next"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default MobileTestimonials;
