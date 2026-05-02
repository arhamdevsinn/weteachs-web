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

const FinanceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    <path d="M16 3l4 4-4 4" />
  </svg>
);

const TechnologyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MoreIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22542F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.5 6h-7L12 2zM12 22l-3.5-6h7L12 22zM2 12l6-3.5v7L2 12zM22 12l-6 3.5v-7L22 12z" />
  </svg>
);

const categories = [
  { label: "Fitness", Icon: FitnessIcon, href: "/fitness" },
  { label: "Business", Icon: BusinessIcon, href: "/business" },
  { label: "Education", Icon: EducationIcon, href: "/education" },
  { label: "Art", Icon: ArtIcon, href: "/art" },
  { label: "Finance", Icon: FinanceIcon, href: "/finance" },
  { label: "Technology", Icon: TechnologyIcon, href: "/technology" },
];

const MobileCategoriesSection = () => {
  return (
    <section className="bg-white px-2 pb-12 pt-8">
      <h2 className="mb-8 text-center text-[22px] font-black text-black">
        Real Ways People Get Help
      </h2>

      <div className="mx-auto max-w-[360px] px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {categories.map(({ label, Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between rounded-[12px] border border-gray-100 bg-white px-4 py-3.5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-transform active:scale-95"
            >
              <span className="text-[16px] font-black text-black">{label}</span>
              <div className="scale-110"><Icon /></div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link
            href="/categories"
            className="flex w-[160px] items-center justify-between rounded-[12px] border border-gray-100 bg-white px-5 py-3.5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-transform active:scale-95"
          >
            <span className="text-[16px] font-black text-black">More!</span>
            <div className="scale-110"><MoreIcon /></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileCategoriesSection;
