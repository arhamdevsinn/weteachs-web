"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const examples = [
  {
    title: "Arts",
    image: "/art 1.png",
    desc: "Simplify concept and help students for inspire creative learning with knowledge.",
    expert: "Pooja Jain",
  },
  {
    title: "Education",
    image: "/education 1.png",
    desc: "Personalized physics teaching for middle and high school students.",
    expert: "The pythagorean",
  },
  {
    title: "Family",
    image: "/Family Icon.png",
    desc: "Expert guidance on parenting and family dynamics.",
    expert: "John Doe",
  },
];

const MobileExamplesSection = () => {
  return (
    <section className="bg-white px-4 py-10">
      <div className="flex items-center justify-between border-y-2 border-red-500 py-4 mb-8">
         <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {examples.map((ex, i) => (
                <div key={i} className="min-w-[120px] h-[160px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
                    <img src={ex.image} alt={ex.title} className="w-full h-full object-cover" />
                </div>
            ))}
         </div>
         <h2 className="text-[48px] font-black text-red-500 px-4">Examples</h2>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link href="/explore" className="text-red-500 font-black text-[18px] hover:underline">
          Explore Page
        </Link>
        <Link href="/categories" className="flex items-center gap-2 bg-[#22542F] text-white px-6 py-3 rounded-full font-black text-[16px]">
          Ask an expert anything
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
};

export default MobileExamplesSection;
