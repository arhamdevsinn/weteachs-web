// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare, Check, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import InfoCard from "@/src/components/common/InfoCard";
import MobileFinancePage from "@/src/components/finance/MobileFinancePage";

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
            src="/Finance page.png"
            alt="/Finance page.png"
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
                  <Link href="/signup" className="inline-block bg-[#1B4323] text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-[#112a16] shadow-xl transition-all">
                    Find an Expert
                  </Link>
                  <p className="text-xs text-red-600 mt-3 font-bold uppercase tracking-widest">(sign up page)</p>
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
                "“How do I get my first customers?”",
                "“Can you review my financial strategy?”",
                "“How should I price my product?”",
                "“Why isn't my business growing?”",
                "“How do I improve my sales?”"
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
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12">
          {/* Pricing Card */}
          <div className="bg-white rounded-[32px] p-12 shadow-2xl border border-gray-100 flex flex-col h-full">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 block">Starting Pricing</span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[64px] font-black text-black tracking-tighter leading-none">$5/hr +</span>
            </div>
            <p className="text-lg font-bold text-gray-500 mb-10">As low as $1/15min with <span className="text-blue-600 font-black underline decoration-4 underline-offset-8">Stripe</span></p>

            <div className="flex gap-4 mb-10">
              <div className="bg-green-50 text-green-700 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest border border-green-100 flex-1 text-center">Flexible sessions</div>
              <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest border border-blue-100 flex-1 text-center">No long-term contract</div>
            </div>

            <div className="space-y-6 mt-auto">
              <h4 className="text-2xl font-black text-black">“Real professionals”</h4>
              <ul className="space-y-4">
                {[
                  "Pay per session—no retainers",
                  "Get quick answers or deeper guidance",
                  "Work with experts on your terms",
                  "No long-term contracts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[17px] font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="https://stripe.com" className="block text-xs text-blue-600 font-black hover:underline mt-8 tracking-widest uppercase opacity-40">Link to Stripe.com</Link>
            </div>
          </div>

          {/* Transformation Card */}
          <div className="bg-[#EBF3EF] rounded-[32px] p-12 border border-primary/10 shadow-2xl flex flex-col h-full">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 block">Sign up page</span>
            <h3 className="text-[40px] md:text-[48px] font-black text-black mb-10 leading-[1.1] tracking-tighter">Ready to Start Your Transformation?</h3>

            <div className="bg-white rounded-2xl p-6 mb-10 shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer transition-all hover:shadow-md">
              <span className="text-xl font-black text-gray-400 uppercase tracking-tighter">No Commitment</span>
              <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" size={28} />
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-xl font-bold text-gray-800">
                <ShieldCheck className="text-primary" size={28} />
                <span>Beginner Friendly</span>
              </div>
              <div className="flex items-center gap-4 text-xl font-bold text-gray-800">
                <ShieldCheck className="text-primary" size={28} />
                <span>“real insights”</span>
              </div>
              <div className="flex items-center gap-4 text-xl font-bold text-gray-800">
                <ShieldCheck className="text-primary" size={28} />
                <span>Real Coaches</span>
              </div>
              <p className="text-xl font-bold text-gray-500 italic mt-4">Explore different styles and perspectives</p>
            </div>

            <div className="mt-auto">
              <Link href="/signup" className="block w-full bg-[#1B4323] text-white py-6 rounded-2xl font-black text-2xl hover:bg-[#112a16] transition transform hover:scale-[1.02] shadow-2xl text-center">
                Get help now
              </Link>
              <div className="flex justify-center items-center mt-5">
                <p className="text-sm text-gray-400 tracking-tighter italic text-center">Create your account and pick the <span className="font-black text-gray-900 not-italic uppercase">finance</span> support that matches your needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              { q: "What kind of business advice can I get?", a: "You can get help with strategy, marketing, sales, pricing, and growth." },
              { q: "Is this only for established businesses?", a: "No, you can get help whether you're starting out or scaling." },
              { q: "Can I validate a business idea?", a: "Yes, experts can give feedback and help you evaluate your idea." },
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
          <Link href="/clients" className="relative z-10 inline-block bg-white text-[#1B4323] px-16 py-5 rounded-full font-black text-2xl shadow-2xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all">
            Learn more
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
