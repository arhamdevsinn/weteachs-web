"use client";
import React from "react";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categoryPills = [
  { label: "Education", href: "/categories/education" },
  { label: "Fitness", href: "/fitness" },
  { label: "Foods", href: "/categories/foods" },
  { label: "Arts", href: "/categories/arts" },
];

const MobileHero = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q) {
      router.push(`/categories/${encodeURIComponent(q.trim().toLowerCase())}`);
    }
  };

  return (
    <section className="relative w-full h-[340px] sm:h-[400px]">
      {/* Full-width Hero Image */}
      <img
        src="/home_image.png"
        alt="A person smiling while talking with an expert on a laptop"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10" />



      {/* Bottom Overlay - Search and Pills */}
      <div className="absolute bottom-5 left-0 w-full px-4 flex flex-col gap-2">
        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex h-[36px] w-[300px] items-center overflow-hidden rounded-[6px] bg-white shadow-lg"
        >
          <input
            name="q"
            aria-label="Search"
            placeholder="Search"
            className="min-w-0 flex-1 px-3 text-[14px] text-gray-800 outline-none placeholder:text-gray-800"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-full w-[36px] items-center justify-center text-black hover:bg-gray-50"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {categoryPills.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="flex shrink-0 items-center gap-1.5 rounded-[3px] border-[1.5px] border-white bg-transparent px-1 py-0.5 text-[8px]  text-white transition hover:bg-white/20"
            >
              {pill.label}
              <ChevronRight size={16} strokeWidth={3} className="text-white" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
