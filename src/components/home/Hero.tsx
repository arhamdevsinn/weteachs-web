"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const quickCategories = [
    "Arts",
    "Education",
    "Category",
    "Category",
    "Category",
    "Category",
    "Category",
  ];

  const examples = [
    { title: "Arts", image: "/sample.png" },
    { title: "Education", image: "/sample1.png" },
    { title: "Family", image: "/sample2.png" },
  ];

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

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {quickCategories.map((category, index) => (
              <a
                key={`${category}-${index}`}
                href={`/categories?category=${encodeURIComponent(category.toLowerCase())}`}
                className="group overflow-hidden rounded-[7px] bg-primary shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5"
              >
                <div className="flex h-[78px] flex-col justify-between px-3 py-2">
                  <span className="text-left text-lg font-normal leading-none text-white">
                    {category}
                  </span>
                  <span className="self-end text-[8px] font-semibold text-white/80">
                    Name
                  </span>
                </div>
                <img
                  src={category === "Education" ? "/sample1.png" : "/sample.png"}
                  alt=""
                  className="h-[76px] w-full object-cover"
                />
              </a>
            ))}
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
