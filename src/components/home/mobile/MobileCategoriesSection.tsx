"use client";
import React from "react";
import Link from "next/link";

// Inline SVG icons matching the design exactly
const FitnessIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01M17.5 17.5h.01" />
    <path d="M3 9.5h2m14 0h2M3 14.5h2m14 0h2" />
    <rect x="6" y="9" width="12" height="6" rx="2" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const EducationIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ArtIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="#22542F" />
    <circle cx="17.5" cy="10.5" r=".5" fill="#22542F" />
    <circle cx="8.5" cy="7.5" r=".5" fill="#22542F" />
    <circle cx="6.5" cy="12.5" r=".5" fill="#22542F" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const FoodsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const HealthIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const FamilyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MoreIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="9" height="9" rx="2" />
    <rect x="13" y="2" width="9" height="9" rx="2" />
    <rect x="2" y="13" width="9" height="9" rx="2" />
    <rect x="13" y="13" width="9" height="9" rx="2" />
  </svg>
);

const categories = [
  { label: "Fitness", Icon: FitnessIcon, href: "/fitness" },
  { label: "Business", Icon: BusinessIcon, href: "/categories/business" },
  { label: "Education", Icon: EducationIcon, href: "/categories/education" },
  { label: "Art", Icon: ArtIcon, href: "/categories/art" },
  { label: "Foods", Icon: FoodsIcon, href: "/categories/foods" },
  { label: "Health", Icon: HealthIcon, href: "/categories/health" },
  { label: "Family", Icon: FamilyIcon, href: "/categories/family" },
  { label: "More!", Icon: MoreIcon, href: "/categories" },
];

const MobileCategoriesSection = () => {
  return (
    <section className="bg-white px-2 pb-8 pt-5">
      <h2 className="mb-6 text-center text-[19px] font-bold text-black">
        Real Ways People Get Help
      </h2>

      <div className="mx-auto max-w-[340px] px-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {categories.map(({ label, Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between rounded-[8px] border border-gray-100 bg-white px-3 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform active:scale-95 hover:border-primary hover:shadow-[0_6px_14px_rgba(0,0,0,0.15)]"
            >
              <span className="text-[14px] font-bold text-black">{label}</span>
              <div className="scale-90"><Icon /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>

  );
};

export default MobileCategoriesSection;
