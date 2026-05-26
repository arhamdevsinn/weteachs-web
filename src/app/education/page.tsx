// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import InfoCard from "@/src/components/common/InfoCard";
import PricingTransformation from "@/src/components/common/PricingTransformation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

const EducationPage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ── Section 1: Hero ── */}
      <section className="relative px-4 pt-6 pb-8 md:pt-14 md:pb-24 max-w-[1180px] mx-auto">
        <div className="relative aspect-[1.45/1] md:aspect-[1.91/1] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
          <img
            src="/education page.png"
            alt="Expert Guidance"
            className="h-full w-full object-cover"
          />

        </div>
      </section>

      {/* ── Section 2: How Does It Work? ── */}
      <section className="py-8 px-6 md:py-16 max-w-[1000px] mx-auto text-center">
        <h2 className="text-[36px] md:text-[54px] font-black text-black mb-6 md:mb-14 tracking-tight">
          How Does It Work?
        </h2>
        <div className="mx-auto grid max-w-[1120px] gap-5 px-0 py-4 md:grid-cols-3 md:gap-12 md:px-6 md:py-16">
          {[
            {
              image: "/education 2.png",
              title: "Search for Your Topic",
              text: "Find tutors and experts who understand the subject you need help with.",
            },
            {
              image: "/chat.png",
              title: "Start a Chat ⭐",
              text: "Ask questions, share your work, and get clear explanations—no commitment.",
            },
            {
              image: "/education 1.png",
              title: "Learn and Improve",
              text: "Work 1-on-1 with an expert to understand concepts and build confidence.",
              cta: "Find a Tutor",
              ctaHref: "/explore"
            }
          ].map((item, i) => (

            <InfoCard
              image={item.image}
              title={item.title}
              text={item.text}
              cta={item.cta}
              ctaHref={item.ctaHref}
            />
          ))}
        </div>
      </section>

      {/* ── Section 3: Everything You Need ── */}
      <section className="py-20 bg-[#F9FBFA]">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-[32px] md:text-[44px] font-black text-black leading-tight">
              Everything You Need<br />to Learn Better
            </h2>
            <ul className="space-y-5">
              {[
                "Step-by-step explanations that make sense",
                "Help with homework and assignments",
                "Test prep and study strategies",
                "Support tailored to your level",
                "Learn at your own pace"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-bold text-[#3D4B41]">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[32px] blur-2xl group-hover:bg-primary/10 transition-all" />
            <img
              src="/Education page 2.jpg"
              alt="Learning context"
              className="relative rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* ── Section 4: Why try out Weteachs? ── */}
      <section className="py-20 px-6 max-w-[1100px] mx-auto text-center">
        <h2 className="text-[28px] md:text-[36px] font-black text-black mb-12">Why try out Weteachs?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "1 on 1 Learning Support", desc: "Get personalized help focused on your specific questions and goals." },
            { title: "Find the Right Tutor for You", desc: "Browse different subjects and teaching styles to match how you learn best." },
            { title: "No Pressure, Just Progress", desc: "Start with a chat and continue only if it helps." }
          ].map((box, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[180px]">
              <h4 className="font-black text-[17px] mb-3">{box.title}</h4>
              <p className="text-gray-500 text-sm font-medium">{box.desc}</p>
              {i === 2 && (
                <div className="mt-6 w-full">
                  <Link href="/learn" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-black text-base hover:bg-primary/90 transition shadow-md">
                    Learn step-by-step
                  </Link>

                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Banner ── */}
      <section className="bg-primary text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[32px] md:text-[44px] font-black mb-6">Talk to the Right Person for What You're Learning</h2>
          <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
            Affordable sessions, quick help, and a wide range of subjects—designed for students at any level.
          </p>
        </div>
      </section>

      {/* ── Section 6: What are people asking? ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img src="/Education page.jpg" alt="Person learning" className="rounded-[40px] shadow-2xl w-full h-[450px] object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="text-[36px] md:text-[52px] font-black text-black leading-tight">What are people asking?</h2>
            <div className="space-y-4">
              {[
                "“Can you explain this math problem step by step?”",
                "“Can you review my essay and suggest improvements?”",
                "“I don't understand this concept—can you break it down?”",
                "“Can you help me study for an upcoming test?”",
                "“Can you quiz me on this topic?”",
                "“What's the easiest way to learn this subject?”"
              ].map((q, i) => (
                <p key={i} className="text-lg md:text-2xl font-bold text-gray-700 leading-tight italic">
                  {q}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Pricing & Transformation ── */}
      <PricingTransformation
        subText="Create you account and pick the educational support that matches your needs"
        badges={["Flexible sessions", "No long-term contract", "Tutors & Mentors"]}
        pricingPoints={[
          "No long-term commitment",
          "Pay only for the help you need",
          "Real tutors and subject experts",
          "Start small and continue anytime"
        ]}
        transformationPoints={[
          "Beginner Friendly",
          "Clear explanations",
          "Learn at your own pace",
        ]}
        buttonText="Get help now"
        buttonHref="/about"
      />

      {/* ── Section 8: Info ── */}

      <section className="bg-[#1B4323] text-white py-16 px-6">
        <div className="max-w-[1000px] mx-auto space-y-0 divide-y divide-white/10">
          {[
            { title: "What do you need help with?", desc: "Find a tutor who can explain it clearly." },
            { title: "Chat with them", desc: "Ask questions and see if it's the right fit." },
            { title: "Learn with confidence", desc: "Get the support you need to improve and succeed." }
          ].map((item, i) => (
            <div key={i} className="py-10 first:pt-0 last:pb-0">
              <h4 className="text-2xl md:text-3xl font-black mb-3">{item.title}</h4>
              <p className="text-lg md:text-xl text-white/80 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ── Section 9: FAQ Section ── */}
      <section className="py-24 px-6 bg-[#FDFDFD]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Support</span>
            <h2 className="text-[40px] md:text-[54px] font-black text-black leading-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 font-bold mt-2">Clear answers to help you start with confidence.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I get help with homework or assignments?",
                a: "Yes, experts can guide you through problems and help you understand the material."
              },
              {
                q: "Will they just give me the answers?",
                a: "No—experts focus on explaining concepts so you actually learn and improve."
              },
              {
                q: "What subjects are available?",
                a: "You can find help in math, science, writing, coding, languages, and more."
              },
              {
                q: "Is this suitable for all levels?",
                a: "Yes, from school-level topics to advanced subjects."
              },
              {
                q: "Can I prepare for exams here?",
                a: "Absolutely. You can get study help, explanations, and test preparation support."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-bold text-gray-900">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-primary transition-transform group-open:rotate-180">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L7 11L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 10: Join Now CTA ── */}
      {
        user ? null :
          <section className="pb-24 px-6">
            <div className="max-w-[1100px] mx-auto text-center">
              <h2 className="text-[40px] md:text-[54px] font-black text-black mb-10">Get help your way</h2>
              <div className="bg-[#1B4323] rounded-[24px] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                <h3 className="text-3xl md:text-5xl font-black text-white mb-10 relative z-10">
                  Hire the top knowledgeable Experts
                </h3>
                <Link
                  href="/auth/signup"
                  className="inline-block bg-white text-[#1B4323] px-10 py-4 rounded-[12px] font-black text-xl md:text-2xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl relative z-10"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </section>
      }

    </div>
  );
};

export default EducationPage;
