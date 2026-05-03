// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare, Check, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import InfoCard from "@/src/components/common/InfoCard";
import MobileFinancePage from "@/src/components/finance/MobileFinancePage";
import PricingTransformation from "@/src/components/common/PricingTransformation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

const FinancePage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <MobileFinancePage user={user} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans overflow-x-hidden pt-6">


      {/* ── Section 1: Hero ── */}
      <section className="relative px-4 pb-16 md:pb-24 max-w-[1180px] mx-auto">
        <div className="relative aspect-[1.45/1] md:aspect-[1.91/1] w-full overflow-hidden rounded-[32px] bg-gray-100 shadow-2xl border-4 border-white">
          <img
            src={isMobile ? "/Finance mobile page.png" : "/Finance page.png"}
            alt="Finance Expert Guidance"
            className="h-full w-full object-cover brightness-[0.7]"
          />
        </div>
      </section>

      {/* ── Section 2: How Does It Work? ── */}
      <section className="py-16 px-6 max-w-[1200px] mx-auto text-center">
        <h2 className="text-[44px] md:text-[72px] font-black text-black mb-16 tracking-tight">
          How Does It Work?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {[
            {
              image: "/finance 2.png",
              title: "Find the Right Expert",
              text: "Search for professionals with experience in your area or challenge.",
            },
            {
              image: "/chat.png",
              title: "Start a Conversation ⭐",
              text: "Ask questions, get insights, and see if they're the right fit—no commitment.",
            },
            {
              image: "/finance 1.png",
              title: "Take Action with Confidence",
              text: "Use expert advice to make smarter decisions and move forward.",
              cta: "Get Finance Advice",
              ctaHref: "/explore"
            }
          ].map((item, i) => (
            <InfoCard
              key={i}
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
              Everything You Need to Move<br />Your Finances Forward
            </h2>
            <ul className="space-y-5">
              {[
                "Advice on strategy, growth, and execution",
                "Market analysis and customer acquisition insights",
                "Help validating ideas and financial plans",
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
              src="/Finance page 2.jpg"
              alt="Finance context"
              className="relative rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* ── Section 4: Why try out Weteachs? ── */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-[32px] md:text-[48px] font-black text-black mb-16 uppercase tracking-tighter">Why try out Weteachs?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          {[
            { title: "1-on-1 Finance Advice", desc: "Get direct insights tailored to your specific situation." },
            { title: "Find Experts Across Industries", desc: "Connect with people who've solved similar challenges." },
            { title: "No Long-Term Commitment", desc: "Start with a conversation and continue only if it's valuable." }
          ].map((box, i) => (
            <div key={i} className="bg-white p-10 rounded-[12px] border border-black/80 shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center justify-between min-h-[300px]">
              <h4 className="font-black text-xl mb-4 uppercase tracking-tight leading-tight">{box.title}</h4>
              <p className="text-gray-500 text-base font-bold leading-relaxed">{box.desc}</p>
              {i === 2 && (
                <div className="mt-8 w-full">
                  <Link href="/auth/signup" className="inline-block bg-[#1B4323] text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-[#112a16] shadow-xl transition-all">
                    Find an Expert
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Banner ── */}
      <section className="bg-[#1B4323] text-white py-20 px-6 text-center">
        <h2 className="text-[32px] md:text-[44px] font-black mb-6 leading-tight">Talk to the Right Person Before You Make Your Next Move</h2>
        <p className="text-lg md:text-2xl text-white/80 font-medium max-w-4xl mx-auto">
          Affordable sessions, real-world experience, and fast access to insights—so you can act with clarity.
        </p>
      </section>

      {/* ── Section 6: What are people asking? ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img src="/Finance page.jpg" alt="Person working" className="rounded-[40px] shadow-2xl w-full h-[450px] object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-8 text-center md:text-left">
            <h2 className="text-[36px] md:text-[52px] font-black text-black leading-tight">What are people asking?</h2>
            <div className="space-y-4">
              {[
                "“Is this a good investment idea?”",
                "“How do I build a budget that works?”",
                "“Can you review my financial strategy?”",
                "“How should I save for my future?”",
                "“Why isn't my money growing?”",
                "“How do I manage my taxes better?”"
              ].map((q, i) => (
                <p key={i} className="text-xl md:text-2xl font-bold text-gray-700 italic leading-snug">
                  {q}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Pricing & Transformation ── */}
      <PricingTransformation
        subText="Create your account and pick the finance support that matches your needs."
        badges={["Flexible sessions", "No long-term contract", "Real professionals"]}
        pricingPoints={[
          "Pay per session",
          "Get quick answers or deeper guidance",
          "Work with experts on your terms",
          "No long-term contracts"
        ]}
        transformationPoints={[
          "Beginner Friendly",
          "Real insights",
          "Real Coaches",
          "Explore different styles and perspectives"
        ]}
        buttonText="Get help now"
        buttonHref="/about"
      />


      <section className="bg-[#112a16] text-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto space-y-0 divide-y divide-white/10">
          {[
            { title: "What do you want help with?", desc: "Find an expert who understands your challenge." },
            { title: "Start a conversation", desc: "Ask questions and get real insight." },
            { title: "Move forward with confidence", desc: "Make decisions backed by experience." }
          ].map((item, i) => (
            <div key={i} className="py-12 first:pt-0 last:pb-0">
              <h4 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">{item.title}</h4>
              <p className="text-xl text-white/60 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[44px] md:text-[64px] font-black text-black mb-4 tracking-tighter">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-500 font-bold mb-16">Clear answers to help you start with confidence.</p>

          <div className="space-y-6 text-left">
            {[
              { q: "What kind of financial advice can I get?", a: "You can get help with budgeting, investing, tax strategies, and financial planning." },
              { q: "Is this only for wealthy individuals?", a: "Not at all. Experts can help you manage your money at any income level." },
              { q: "Can I get help with my taxes?", a: "Yes, you can find experts who specialize in tax planning and preparation." },
              { q: "How do I know the advice is reliable?", a: "You can review expert profiles and start with a conversation before committing." },
              { q: "Can I get ongoing support?", a: "Yes, you can continue working with an expert if it's valuable." }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-xl font-black text-black text-left hover:bg-gray-50 transition-colors"
                >
                  <span>{item.q}</span>
                  {openFaq === i ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 text-lg font-bold text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner Section ── */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-[44px] md:text-[64px] font-black text-black mb-16 tracking-tighter">Get help your way</h2>
        <div className="max-w-[1000px] mx-auto bg-[#1B4323] rounded-[40px] p-20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
          <h3 className="text-[32px] md:text-[48px] font-black text-white mb-10 leading-tight relative z-10">Hire the top knowledgeble Experts</h3>
          <Link href="/auth/signup" className="relative z-10 inline-block bg-white text-[#1B4323] px-10 py-4 rounded-full font-black text-xl shadow-2xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all">
            Join Now
          </Link>
          <div className="mt-8 relative z-10">
            {/* <p className="text-sm text-white/40 font-bold uppercase tracking-[0.3em]">(Clients page)</p> */}
          </div>
        </div>
      </section>



    </div>
  );
};

export default FinancePage;
