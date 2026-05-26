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

const BusinessPage = () => {
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
            src={isMobile ? "/business page mobile.png" : "/business page.png"}
            alt="Business Expert Guidance"
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
              image: "/business 2.png",
              title: "Find the Right Expert",
              text: "Search for professionals with exoerence in vour area oi challenge.",
            },
            {
              image: "/chat.png",
              title: "Start a Conversation ⭐",
              text: "Ask questions, get insights, and see if they're the right fit—no commitment.",
            },
            {
              image: "/business 1.png",
              title: "Take Action with Confidence",
              text: "Use expert advice to make smarter decisions and move forward.",
              cta: "Get Business Advice",
              ctaHref: "/categories"
            }
          ].map((item, i) => (
            <InfoCard
              key={i}
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
              Everything You Need<br />to Move Your Business Forward
            </h2>
            <ul className="space-y-5">
              {[
                "Advice on strategy, growth, and execution",
                "Marketing and customer acquisition insights",
                "Help validating ideas and business plans",
                "Feedback on products, pricing, and positioning",
                "Guidance from experienced professionals"
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
              src="/Business page 2.jpg"
              alt="Business context"
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
            { title: "1-on-1 Business Advice", desc: "Get direct insights tailored to your specific situation." },
            { title: "Find Experts Across Industries", desc: "Connect with people who've solved similar challenges." },
            { title: "No Long-Term Commitment", desc: "Start with a conversation and continue only if it's valuable." }
          ].map((box, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[180px]">
              <h4 className="font-black text-[17px] mb-3">{box.title}</h4>
              <p className="text-gray-500 text-sm font-medium">{box.desc}</p>
              {i === 2 && (
                <div className="mt-6 w-full">
                  <Link href="/auth/signup" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-black text-base hover:bg-primary/90 transition shadow-md">
                    Find an Expert
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
          <h2 className="text-[32px] md:text-[44px] font-black mb-6">Talk to the Right Person Before You Make Your Next Move</h2>
          <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
            Affordable sessions, real-world experience, and fast access to insights—so you can act with clarity.
          </p>
        </div>
      </section>

      {/* ── Section 6: What are people asking? ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img src="/Business page 1.jpg" alt="Business consultation" className="rounded-[40px] shadow-2xl w-full h-[450px] object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="text-[36px] md:text-[52px] font-black text-black leading-tight">What are people asking?</h2>
            <div className="space-y-4">
              {[
                "“Is this a good business idea?”",
                "“How do I get my first customers?”",
                "“Can you review my marketing strategy?”",
                "“How should I price my product?”",
                "“Why isn't my business growing?”",
                "“How do I improve my sales?”"
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
      {/* <PricingTransformation
        subText=""
        badges={[]}
        pricingPoints={[

        ]}
        transformationPoints={[

        ]}
        buttonText=""
        buttonHref=""
      /> */}
      <PricingTransformation
        subText="Create your account and pick the support that matches your business"
        badges={["Flexible sessions", "No long-term contract", "Real professionals"]}
        pricingPoints={[
          "Pay per session—no retainers",
          "Get quick answers or deeper guidance",
          "Work with experts on your terms",
          "No long-term contracts"
        ]}
        transformationPoints={[
          "Beginner Friendly",
          "Real insights",
          "Real Coaches",
        ]}
        buttonText="Get help now"
        buttonHref="/about"
      />


      {/* ── Section 8: Quote Section ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl font-black text-black leading-tight">An Expert in Your Corner</h3>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-[600px] mx-auto">
              Get insight, feedback, and direction—whenever you need it.
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 9: Info ── */}
      <section className="bg-[#1B4323] text-white py-16 px-6">
        <div className="max-w-[1000px] mx-auto space-y-0 divide-y divide-white/10">
          {[
            { title: "What do you need help with?", desc: "Find an expert who understands your challenge." },
            { title: "Start a conversation", desc: "Ask questions and get real insight." },
            { title: "Move forward with confidence", desc: "Make decisions backed by experience." }
          ].map((item, i) => (
            <div key={i} className="py-10 first:pt-0 last:pb-0">
              <h4 className="text-2xl md:text-3xl font-black mb-3">{item.title}</h4>
              <p className="text-lg md:text-xl text-white/80 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 10: FAQ Section ── */}
      <section className="py-24 px-6 bg-[#FDFDFD]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-[40px] md:text-[54px] font-black text-black leading-tight mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: "What kind of business advice can I get?",
                a: "You can get help with strategy, marketing, sales, pricing, and growth."
              },
              {
                q: "Is this only for established businesses?",
                a: "No, you can get help whether you're starting out or scaling."
              },
              {
                q: "Can I validate a business idea?",
                a: "Yes, experts can give feedback and help you evaluate your idea."
              },
              {
                q: "How do I know the advice is reliable?",
                a: "You can review expert profiles and start with a conversation before committing."
              },
              {
                q: "Can I get ongoing support?",
                a: "Yes, you can continue working with an expert if it's valuable."
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

      {/* ── Section 11: Join CTA ── */}
      {user ? null : (
        <section className="pb-24 px-6">
          <div className="max-w-[1100px] mx-auto text-center">
            <div className="bg-[#1B4323] rounded-[24px] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-10 relative z-10">
                Hire the top knowledgeable Experts
              </h3>
              <Link
                href="/learn"
                className="inline-block bg-white text-[#1B4323] px-10 py-4 rounded-[12px] font-black text-xl md:text-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl relative z-10"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BusinessPage;
