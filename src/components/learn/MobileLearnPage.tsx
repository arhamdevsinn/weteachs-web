// @ts-nocheck
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { RecentCategory } from "@/src/lib/api/recentCategories";

/* ─────────────────── static data ─────────────────── */

const categoryPills = [
  { label: "Education", href: "/categories/education" },
  { label: "Fitness", href: "/fitness" },
  { label: "Foods", href: "/categories/foods" },
  { label: "Arts", href: "/categories/arts" },
];

const howItWorksSteps = [
  {
    step: "1.",
    image: "/question.png",
    title: "Search your topic",
    desc: "Find people who know exactly what you need.",
  },
  {
    step: "2.",
    image: "/verify.png",
    title: "Choose your Expert",
    desc: "Browse profiles, reviews, and experience.",
  },
  {
    step: "3.",
    image: "/chat.png",
    title: "Get answers",
    desc: "Chat in real time and get the help you need.",
  },
];

const questions = [
  "\u201cHow do I start a small online business?\u201d",
  "\u201cWhat\u2019s the smartest way to invest my money right now?\u201d",
  "\u201cCan you review my resume and suggest improvements?\u201d",
  "\u201cWhat\u2019s the best way to learn guitar as a beginner?\u201d",
  "\u201cHow do I fix this error in my code?\u201d",
  "\u201cWhat should I do to improve my credit score?\u201d",
  "\u201cHow can I train my dog to stop barking?\u201d",
  "\u201cWhat\u2019s the best workout plan for beginners?\u201d",
  "\u201cCan you help me plan a trip to Japan?\u201d",
  "\u201cHow do I grow my Instagram or TikTok account?\u201d",
];

const studentFaqs = [
  {
    question: "How fast will I get a response?",
    answer: "Most questions are answered quickly, depending on the helper you choose.",
  },
  {
    question: "What if I don\u2019t like the answer?",
    answer:
      "You can choose who to ask based on their category and experience. You have the option to freely chat before hiring your helper.",
  },
  {
    question: "Do I have to commit to anything?",
    answer: "No. You only pay for each session at a time. Hire someone for as low as 15 minutes.",
  },
  {
    question: "Can I ask follow-up questions?",
    answer: "You can always chat with your helper in the free chat.",
  },
  {
    question: "How do I know who to choose?",
    answer: "You can browse helpers based on their category, pricing, and what they offer.",
  },
];

/* ─────────────────── props ─────────────────── */

interface MobileLearnPageProps {
  categories: RecentCategory[];
  loadingCategories: boolean;
  user: any;
}

/* ─────────────────── component ─────────────────── */

const MobileLearnPage = ({ categories, loadingCategories, user }: MobileLearnPageProps) => {
  const [openFaqKey, setOpenFaqKey] = useState<string | null>(null);
  const [howStep, setHowStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q) {
      router.push(`/categories/${encodeURIComponent(q.trim().toLowerCase())}`);
    }
  };

  const scrollCards = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ── Hero ── */}
      <section className="relative w-full h-[340px]">
        <img
          src="/client_image_mobile.png"
          alt="Learn with Weteachs"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />


        {/* Search + pills at bottom */}
        {/* <div className="absolute bottom-4 left-0 w-full px-4 flex flex-col gap-2">
          <form
            onSubmit={handleSubmit}
            className="flex h-[38px] w-full items-center overflow-hidden rounded-[6px] bg-white shadow-lg border border-gray-200"
          >
            <input
              name="q"
              placeholder="Search"
              className="min-w-0 flex-1 px-3 text-[14px] text-gray-800 outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="flex h-full w-[38px] items-center justify-center text-gray-600"
            >
              <Search size={18} strokeWidth={1.8} />
            </button>
          </form>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {categoryPills.map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="flex shrink-0 items-center gap-1 rounded-[4px] border border-white/80 bg-transparent px-2 py-0.5 text-[9px] font-semibold text-white hover:bg-white/20"
              >
                {pill.label}
                <ChevronRight size={12} strokeWidth={3} className="text-white" />
              </Link>
            ))}
          </div>
        </div> */}
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

      {/* ── How Does It Work? ── */}
      <section className="bg-white px-4 pt-8 pb-6">
        <h2 className="text-[26px] font-black text-black mb-5 text-center">How Does It Work?</h2>

        {/* Horizontal scrollable step cards */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
        >
          {howItWorksSteps.map((item, i) => (
            <article
              key={i}
              className="relative flex-shrink-0 w-[190px] snap-center rounded-[10px] bg-[#9fbfa4] border-2 border-[#1B4323] shadow-[3px_3px_8px_rgba(0,0,0,0.18)] p-3 flex flex-col items-center text-center"
            >
              <span className="absolute top-2 left-2.5 text-[18px] font-bold text-white drop-shadow">{item.step}</span>
              <div className="h-[110px] w-full flex items-center justify-center mt-3 mb-2">
                <img src={item.image} alt={item.title} className="h-[95px] w-[95px] object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]" />
              </div>
              <h3 className="text-white font-bold text-[13px] leading-tight drop-shadow">{item.title}</h3>
              <p className="text-white/90 text-[11px] font-medium mt-1 leading-snug px-1">{item.desc}</p>
            </article>
          ))}
        </div>

        {/* Get Started + arrows */}
        {
          user ? null :
            <div className="flex items-center justify-between mt-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-[#1B4323] text-white px-5 py-2 rounded-full font-bold text-[14px] shadow-md"
              >
                Get Started <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCards("left")}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollCards("right")}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
        }
      </section>

      {/* ── What Can You Ask? ── (scrollable on mobile) */}
      <section className="bg-white pt-4 pb-6">
        <h2 className="text-[22px] font-black text-black mb-4 px-4">What Can You Ask?</h2>
        <div className="px-4 flex flex-col gap-2 ">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-full px-5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.09)] border border-gray-100 text-center"
            >
              <span className="text-gray-800 font-semibold text-[13px]">{q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who are the Experts? (Category cards) ── */}
      <section className="px-4 pt-4 pb-6">
        <h2 className="text-[22px] font-black text-black mb-4">Who are the Experts?</h2>

        {/* Horizontal scrollable category grid */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
          {loadingCategories
            ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[130px] h-[154px] rounded-[7px] bg-gray-200 animate-pulse shadow"
              />
            ))
            : categories.map((category) => {
              const title = category.title || category.category_name || "Category";
              const teacherName = category.teacher_name || "Name";
              return (
                <a
                  key={category.id}
                  href={`/categories?categoryId=${encodeURIComponent(category.id)}`}
                  className="flex-shrink-0 w-[130px] overflow-hidden rounded-[7px] bg-primary shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5"
                >
                  <div className="flex h-[70px] flex-col justify-between px-2.5 py-2">
                    <span className="line-clamp-2 text-left text-[14px] font-normal leading-tight text-white">
                      {title}
                    </span>
                    <span className="line-clamp-1 self-end text-[8px] font-semibold text-white/80">
                      {teacherName}
                    </span>
                  </div>
                  <img
                    src={category.category_image_url || "/sample.png"}
                    alt={title}
                    className="h-[70px] w-full object-cover"
                  />
                </a>
              );
            })}
        </div>

        {/* Ask Now button */}
        <div className="flex justify-end mt-3">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#1B4323] text-white px-5 py-2 rounded-full font-bold text-[14px] shadow-md"
          >
            Ask Now <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* ── Experts text block ── */}
      <section className="px-4 pt-2 pb-8">
        <p className="text-[16px] text-[#5c7a6b] mb-4 font-medium">
          Experts are real people with experience in specific areas.
        </p>
        <ul className="space-y-2 list-disc list-outside ml-5 text-[#5c7a6b] font-bold text-[15px] mb-5">
          <li>Industry professionals</li>
          <li>Experienced freelancers</li>
          <li>Skilled specialists and creators</li>
        </ul>
        <div className="space-y-1 text-[15px] text-[#5c7a6b] font-medium">
          <p>People who've already solved the problem you have.</p>
          <p>No bots. No generic responses.</p>
          <p>Just real people helping you move forward.</p>
        </div>
      </section>

      {/* ── Pricing & Stripe ── */}
      <section className="px-4 pb-8 grid grid-cols-2 gap-3">
        <div className="bg-[#113118] rounded-[14px] p-5 flex flex-col justify-between min-h-[200px] shadow-lg">
          <div>
            <h3 className="text-[20px] text-white font-bold mb-3">Pricing</h3>
            <div
              className="text-[32px] text-white font-black transform -rotate-3 leading-none"
              style={{ fontFamily: "cursive" }}
            >
              15MIN–1HR
            </div>
          </div>
          <p className="text-white text-[13px] font-bold mt-6 leading-snug">
            Pay per session—quick questions or deeper help.
          </p>
        </div>

        <Link
          href="https://stripe.com"
          target="_blank"
          className="bg-[#3e63dd] rounded-[14px] p-5 flex flex-col justify-between min-h-[200px] shadow-lg relative overflow-hidden group"
        >
          <div className="absolute -right-3 -bottom-3 text-[70px] font-black text-white/10 leading-none select-none transition-transform group-hover:scale-110">
            Stripe
          </div>
          <h3 className="text-[20px] text-white font-bold mb-3 relative z-10">Stripe</h3>
          <p className="text-white text-[13px] font-bold mt-auto leading-snug relative z-10">
            Your payments are protected and securely handled by Stripe.
          </p>
        </Link>
      </section>

      {/* ── Student FAQs ── */}
      <section className="px-4 pb-10">
        <div className="rounded-2xl border border-[#45ba61] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-2 border-b border-[#45ba61] pb-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#265A32]">
                For Learners
              </p>
              <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Student FAQs</h3>
              <p className="mt-1 text-[12px] text-slate-600">
                Everything students need to know before hiring and chatting.
              </p>
            </div>
            <span className="rounded-full bg-[#45ba61] px-2.5 py-1 text-[10px] font-medium text-white whitespace-nowrap">
              {studentFaqs.length} questions
            </span>
          </div>

          <div className="space-y-2.5">
            {studentFaqs.map((faq, idx) => {
              const key = `mobile-faq-${idx}`;
              const isOpen = openFaqKey === key;
              return (
                <div
                  key={key}
                  className={`rounded-xl border px-4 py-3 transition-colors ${isOpen
                    ? "border-[#45ba61] bg-cyan-50/60"
                    : "border-[#45ba61] bg-white hover:bg-cyan-50/30"
                    }`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-3 text-left"
                    onClick={() => setOpenFaqKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <span className={`text-[13px] font-medium ${isOpen ? "text-[#265A32]" : "text-slate-800"}`}>
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-cyan-100 text-[#265A32]" : "bg-[#45ba61] text-white"
                        }`}
                    >
                      {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 border-t border-[#45ba61]/70 pt-2.5 text-[12px] leading-5 text-slate-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Start Learning Today CTA (only for guests) ── */}
      {!user && (
        <section className="px-4 pb-10">
          <div className="bg-[#1B4323] rounded-2xl px-6 py-8 text-center shadow-xl">
            <h2 className="text-[24px] font-bold text-white mb-2">Start Learning Today 🎓</h2>
            <p className="text-white/80 text-[13px] mb-5 leading-relaxed">
              Your next skill, mentor, or breakthrough is just a session away.
              Weteachs makes it easy, affordable, and fun to learn anything, anywhere.
            </p>
            <a
              href="/auth/signup"
              className="inline-block bg-white text-[#1B4323] font-bold px-6 py-2.5 rounded-full shadow-md text-[14px] hover:shadow-lg transition"
            >
              Sign Up &amp; Find Your Expert
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default MobileLearnPage;
