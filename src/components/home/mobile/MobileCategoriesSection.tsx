"use client";
import React from "react";
import Link from "next/link";

// Inline SVG icons matching the design exactly
const FitnessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M6 8H5a4 4 0 0 0 0 8h1" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <rect x="7" y="5" width="10" height="14" rx="2" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <path d="M12 12v4" />
    <path d="M10 14h4" />
  </svg>
);

const EducationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ArtIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.7-1.6h2c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2z" />
    <circle cx="7.5" cy="10.5" r=".5" fill="#1B4323" />
    <circle cx="10.5" cy="7.5" r=".5" fill="#1B4323" />
    <circle cx="13.5" cy="10.5" r=".5" fill="#1B4323" />
  </svg>
);

const FinanceIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const TechnologyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="1.5" fill="#1B4323" />
  </svg>
);

const MoreIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B4323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.5 6h-7L12 2zM12 22l-3.5-6h7L12 22zM2 12l6-3.5v7L2 12zM22 12l-6 3.5v-7L22 12z" />
    <circle cx="12" cy="12" r="1" fill="#1B4323" />
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
    <section className="bg-white px-4 pb-14 pt-10">
      <h2 className="mb-10 text-center text-[24px] font-black text-black">
        Real Ways People Get Help
      </h2>

      <div className="mx-auto max-w-[400px]">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
          {categories.map(({ label, Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between rounded-[12px] border border-gray-300 bg-white px-4 py-4 shadow-[6px_6px_15px_rgba(0,0,0,0.15)] transition-all active:scale-95 active:shadow-sm hover:border-primary"
            >
              <span className="text-[18px] font-black text-black">{label}</span>
              <div className="flex h-10 w-10 items-center justify-center -rotate-12">
                <Icon />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/categories"
            className="flex w-[180px] items-center justify-between rounded-[12px] border border-gray-300 bg-white px-5 py-4 shadow-[6px_6px_15px_rgba(0,0,0,0.15)] transition-all active:scale-95 active:shadow-sm hover:border-primary"
          >
            <span className="text-[18px] font-black text-black">More!</span>
            <div className="flex h-10 w-10 items-center justify-center rotate-12">
              <MoreIcon />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileCategoriesSection;
