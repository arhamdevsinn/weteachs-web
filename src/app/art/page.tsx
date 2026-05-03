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

const ArtPage = () => {
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
      <section className="relative px-4 pt-10 pb-16 md:pt-14 md:pb-24 max-w-[1180px] mx-auto">
        <div className="relative aspect-[1.45/1] md:aspect-[1.91/1] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
          <img
            src={isMobile ? "/art page mobile.png" : "/art page.png"}
            alt="Art Expert Guidance"
            className="h-full w-full object-cover"
          />

        </div>
      </section>

      {/* ── Section 2: How Does It Work? ── */}
      <section className="py-16 px-6 max-w-[1000px] mx-auto text-center">
        <h2 className="text-[36px] md:text-[54px] font-black text-black mb-14 tracking-tight">
          How Does It Work?
        </h2>
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-16 md:grid-cols-3">
          {[
            {
              image: "/art 2.png",
              title: "Find Your Creative Match",
              text: "Browse artists by style, medium, or skill level rino someone wne understands your vision.",
            },
            {
              image: "/chat.png",
              title: "stara conversation",
              text: "nat with an artist, snare your work, ask questions, and get nonest feedback-no pressure.",
            },
            {
              image: "/art 1.png",
              title: "Grow Your Skills",
              text: "Have a 1 on 1 chat or video call with your own expert",
              cta: "Find an Artist",
              ctaHref: "/categories"
            }
          ].map((item, i) => (

            <InfoCard
              image={item.image}
              title={item.title}
              text={item.text}
              cta={item.cta}
              ctaHref={item.ctaHref}
              horizontalOnMobile={true}
            />
          ))}
        </div>
      </section>

      {/* ── Section 3: Everything You Need ── */}
      <section className="py-20 bg-[#F9FBFA]">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-[32px] md:text-[44px] font-black text-black leading-tight">
              Everything You Need <br />to Improve Your Art
            </h2>
            <ul className="space-y-5">
              {[
                "Personalizer feedback on vour work",
                "Step-by-step guidance on techniques",
                "Help developing your style and ideas",
                "Support from real working artists",
                "Flexible sessions that fit your schedule"
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
              src="/Art page 2.jpg"
              alt="Art context"
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
            { title: "Grow Your Skills", desc: "Have a 1 on 1 chat or video call with your own expert" },
            { title: "Find Your Style Faster", desc: "Work with artists across different styles and mediums." },
            { title: "No Pressure, Just Progress", desc: "Start with a quick chat-continue only if it's the right fit." }
          ].map((box, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[180px]">
              <h4 className="font-black text-[17px] mb-3">{box.title}</h4>
              <p className="text-gray-500 text-sm font-medium">{box.desc}</p>
              {i === 2 && (
                <div className="mt-6 w-full">
                  <Link href="/learn" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-black text-base hover:bg-primary/90 transition shadow-md">
                    Learn more
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
          <h2 className="text-[32px] md:text-[44px] font-black mb-6">Talk to the Right Artist for Your Creative Journey</h2>
          <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
            Affordable sessions, real feedback, and a wide range of creative experts-designed for artists at any level.
          </p>
        </div>
      </section>

      {/* ── Section 6: What are people asking? ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img src="/Art page 1.jpg" alt="Person creating art" className="rounded-[40px] shadow-2xl w-full h-[450px] object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="text-[36px] md:text-[52px] font-black text-black leading-tight">What are people asking?</h2>
            <div className="space-y-4">
              {[
                "“Can you critique my artwork?”",
                "“How can I improve my shading and lighting?”",
                "“What's the best way to develop my style?”",
                "“Can you help me with digital painting techniques?”",
                "“How do I price my artwork?”",
                "“What should I improve in this design?”"
              ].map((q, i) => (
                <p key={i} className="text-lg md:text-xl  text-gray-700 leading-tight italic">
                  {q}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Pricing & Transformation ── */}

      <PricingTransformation
        subText="Create your account and pick the creative support that matches your vision"
        badges={["Flexible sessions", "No long-term contract", "Real artists & creators"]}
        pricingPoints={[
          "No long-term commitment",
          "Pay only for the help you need",
          "Explore different styles and mentors"
        ]}
        transformationPoints={[
          "Beginner Friendly",
          "Explore different styles and perspectives",
          "Real coaches"
        ]}
        buttonText="Start Creating"
        buttonHref="/auth/signup"
      />

      {/* ── Section 8: Quote Section ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl font-black text-black leading-tight">An Artist in Your Corner</h3>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-[600px] mx-auto">
              Get feedback, direction, and creative support—whenever inspiration strikes.
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 9: Info ── */}
      <section className="bg-[#1B4323] text-white py-16 px-6">
        <div className="max-w-[1000px] mx-auto space-y-0 divide-y divide-white/10">
          {[
            { title: "What do you want to create?", desc: "Find an artst we can nep bring your ideas to life." },
            { title: "Chat with them", desc: "Share your work, get feedback, and see if it's the right fit." },
            { title: "Work together", desc: "Flexible sessions. Real guidance. Your creativity, leveled up." }
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
                q: "Can I get feedback on my artwork?",
                a: "Yes, you can share your work and get honest, constructive feedback from experienced artists."
              },
              {
                q: "What types of art can I get help with?",
                a: "You can find experts in illustration, painting, digital art, design, crafts, and more."
              },
              {
                q: "Are these professional artists?",
                a: "Our experts include working artists, designers, and skilled creatives with real experience."
              },
              {
                q: "Do I need to be experienced to use this?",
                a: "Not at all. Whether you're a beginner or advanced, you can get help at your level."
              },
              {
                q: "Can I learn techniques or just get critiques?",
                a: "Both. You can ask for technique guidance, style development, or detailed critiques."
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
              <div className="bg-[#1B4323] rounded-[24px] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                <h3 className="text-3xl md:text-5xl font-black text-white mb-10 relative z-10">
                  Hire the top knowledgeble Experts
                </h3>
                <Link
                  href="/categories"
                  className="inline-block bg-white text-[#1B4323] px-10 py-4 rounded-[12px] font-black text-xl md:text-2xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl relative z-10"
                >
                  Get Creative Help
                </Link>

              </div>
            </div>
          </section>
      }

    </div>
  );
};

export default ArtPage;
