"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  getRecentCategories,
  RecentCategory,
} from "@/src/lib/api/recentCategories";

const Hero = () => {
  const [categories, setCategories] = useState<RecentCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const latestCategories = await getRecentCategories(7);
        setCategories(latestCategories);
      } catch (error) {
        console.error("Error loading latest categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="bg-white px-4 pb-8 pt-10 sm:px-6 lg:pt-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="relative aspect-[1.45/1] w-full overflow-hidden rounded-[8px] bg-gray-200 shadow-[0_0_0_1px_rgba(0,0,0,0.16)] sm:aspect-[1.75/1] lg:aspect-[1.91/1]">
          <picture>
            <source media="(min-width: 768px)" srcSet="/home_image.png" />
            <source media="(min-width: 480px)" srcSet="/hi2.png" />
            <img
              src="/hi3.png"
              alt="A person smiling while talking with an expert on a laptop"
              className="h-full w-full object-cover"
            />
          </picture>

          <div className="absolute inset-0 bg-black/20" />


        </div>

        <div className="mt-6 px-2 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[30px] font-normal leading-none text-black sm:text-[20px]">
              Real Ways People Get Help
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {loadingCategories
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-[320px] flex-col overflow-hidden rounded-2xl bg-gray-100 animate-pulse"
                  >
                    <div className="h-32 w-full bg-gray-200" />
                    <div className="flex flex-col p-4 space-y-3">
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                      <div className="h-5 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-full bg-gray-200 rounded pt-2" />
                    </div>
                  </div>
                ))
              : categories.map((category) => {
                  const title =
                    category.title || category.category_name || "Category";
                  const teacherName = category.teacher_name || "Name";

                  return (
                    <a
                      key={category.id}
                      href={`/categories?categoryId=${encodeURIComponent(category.id)}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)]"
                    >
                      {/* Image Container */}
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={category.category_image_url || "/sample.png"}
                          alt={title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col p-3 pt-4">
                        {/* Kicker */}
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4323]">
                          {category.category_name?.split(' ')[0] || "EXPERT"}
                        </span>
                        
                        {/* Title */}
                        <h3 className="mt-1 line-clamp-1 text-[16px] font-black leading-tight text-slate-900">
                          {title}
                        </h3>
                        
                        {/* Subtitle / Description */}
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-bold text-slate-400">
                          {category.description || "Expert guidance"}
                        </p>

                        {/* Price and Language Row */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[12px] font-black text-slate-700">$5 / 15 mins</span>
                          <span className="text-[10px] font-bold text-slate-400">English</span>
                        </div>

                        {/* Separator */}
                        <div className="my-3 h-[1px] w-full bg-slate-50" />

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <div className="flex shrink-0 items-center gap-1">
                            <span className="text-[10px]">❤️</span>
                            <span className="text-[10px] font-bold text-slate-400">15 likes</span>
                          </div>
                          <span className="truncate text-[10px] font-black text-[#1B4323]">
                            {teacherName}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
          </div>

          <div className="mt-8 flex items-center justify-end gap-8">
            <a
              href="/categories"
              className="flex h-[58px] items-center gap-3 rounded-full bg-primary px-8 text-center text-lg font-normal leading-tight text-white shadow-sm transition hover:bg-green-900"
            >
              <span>
                Ask an expert
                <br />
                anything
              </span>
              <ArrowRight size={34} strokeWidth={2.5} />
            </a>
          </div>

          {/* <div className="mt-8 flex items-center gap-5 border border-gray-300 px-5 py-5">
            <div className="flex gap-4">
              {examples.map((example) => (
                <img
                  key={example.title}
                  src={example.image}
                  alt={example.title}
                  className="h-[88px] w-[125px] rounded-[2px] object-cover shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                />
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
