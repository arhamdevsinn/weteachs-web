// @ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import PricingTransformation from "../common/PricingTransformation";

const MobileFinancePage = ({ user }) => {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative w-full">
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            src="/Finance mobile page.png"
            alt="Finance Guidance"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
      </section>

      {/* ── How Does It Work? ── */}
      <section className="px-3 pt-10 pb-8 bg-white">
        <h2 className="text-[32px] font-black text-black text-center mb-8 tracking-tight">How Does It Work?</h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/finance 2.png" alt="Find Expert" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Find the Right Expert</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Search for professionals with experience in your area or challenge.</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/chat.png" alt="Conversation" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Start a Conversation ⭐</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Ask questions, get insights, and see if they're the right fit—no commitment.</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/finance 1.png" alt="Take Action" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Take Action with Confidence</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight mb-2">Use expert advice to make smarter decisions and move forward.</p>
            <Link href="/categories" className="block w-full bg-[#265A32] text-white text-[9px] font-black py-2 rounded-[4px] leading-tight mt-auto">
              Get Finance Advice
            </Link>
          </div>
        </div>
      </section>

      {/* ── Everything You Need ── */}
      <section className="px-5 py-8 bg-[#F9FBFA]">
        <div className="grid grid-cols-2 gap-5 items-start">
          <div>
            <h2 className="text-[15px] font-black text-black leading-tight mb-4">
              Everything You Need to Move Your Finance Forward
            </h2>
            <ul className="space-y-2.5">
              {[
                "Advice on strategy, growth, and execution",
                "Market analysis and customer acquisition insights",
                "Help validating ideas and financial plans",
                "Feedback on products, pricing, and positioning",
                "Guidance from experienced professionals",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] font-bold text-gray-700 leading-tight">
                  <span className="text-primary mt-1 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src="/Finance page 2.jpg"
              alt="Finance supplies"
              className="w-full h-[180px] object-cover rounded-[16px] shadow-lg border-2 border-white"
            />
          </div>
        </div>
      </section>

      {/* ── Why try out Weteachs? ── */}
      <section className="px-3 py-8 bg-white">
        <h2 className="text-[18px] font-black text-black text-center mb-6 uppercase tracking-tighter">Why try out Weteachs?</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { title: "1-on-1 Finance Advice", desc: "Get direct insights tailored to your specific situation." },
            { title: "Find Experts Across Industries", desc: "Connect with people who've solved similar challenges." },
            { title: "No Long-Term Commitment", desc: "Start with a conversation and continue only if it's valuable.", cta: true },
          ].map((box, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-[8px] border border-gray-200 bg-white shadow-sm p-3 h-full">
              <h4 className="text-[9px] font-black text-black uppercase leading-tight mb-2">{box.title}</h4>
              <p className="text-[8px] text-gray-500 font-bold leading-tight mb-3">{box.desc}</p>
              {box.cta && (
                <div className="mt-auto w-full">
                  <Link href="/categories" className="block w-full bg-[#1B4323] text-white text-[9px] font-black py-2 rounded-[4px]">
                    Find an Expert
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Green Banner ── */}
      <section className="bg-[#1B4323] text-white px-6 py-10 text-center">
        <h2 className="text-[17px] font-black leading-tight mb-3">Talk to the Right Person Before You Make Your Next Move</h2>
        <p className="text-[12px] text-white/85 font-bold leading-snug">
          Affordable sessions, real-world experience, and fast access to insights—so you can act with clarity.
        </p>
      </section>

      {/* ── What are people asking? ── */}
      <section className="px-5 py-10 bg-white">
        <div className="grid grid-cols-2 gap-5 items-center">
          <div>
            <img
              src="/Finance page.jpg"
              alt="Expert working"
              className="w-full h-[220px] object-cover rounded-[20px] shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-black mb-4 leading-tight">What are people asking?</h2>
            <div className="space-y-2.5">
              {[
                "“Is this a good investment idea?”",
                "“How do I build a budget that works?”",
                "“Can you review my financial strategy?”",
                "“How should I save for my future?”",
                "“Why isn't my money growing?”",
                "“How do I manage my taxes better?”"
              ].map((q, i) => (
                <p key={i} className="text-[11px] text-gray-700 italic font-bold leading-tight">{q}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing + Transformation ── */}
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

      <section className="bg-[#1B4323] text-white px-6 py-12">
        <div className="flex flex-col divide-y divide-white/20">
          {[
            { title: "What do you want help with?", desc: "Find an expert who understands your challenge." },
            { title: "Start a conversation", desc: "Ask questions and get real insight." },
            { title: "Move forward with confidence", desc: "Make decisions backed by experience." },
          ].map((item, i) => (
            <div key={i} className="py-8 first:pt-0 last:pb-0">
              <h4 className="text-[18px] font-black mb-2 uppercase leading-tight tracking-tight">{item.title}</h4>
              <p className="text-[13px] text-white/80 font-bold leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ── FAQ Section ── */}
      <section className="py-12 px-5 bg-white text-center">
        <h2 className="text-[28px] font-black text-black mb-2 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-[13px] text-gray-500 font-bold mb-8">Clear answers to help you start with confidence.</p>

        <div className="space-y-3 text-left">
          {[
            { q: "What kind of financial advice can I get?", a: "You can get help with budgeting, investing, tax strategies, and financial planning." },
            { q: "Is this only for wealthy individuals?", a: "Not at all. Experts can help you manage your money at any income level." },
            { q: "Can I get help with my taxes?", a: "Yes, you can find experts who specialize in tax planning and preparation." },
            { q: "How do I know the advice is reliable?", a: "You can review expert profiles and start with a conversation before committing." },
            { q: "Can I get ongoing support?", a: "Yes, you can continue working with an expert if it's valuable." }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-[14px] font-black text-black text-left"
              >
                <span>{item.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-[13px] font-bold text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner Section ── */}
      {user ? null :
        <section className="py-12 px-5 text-center">
          <h2 className="text-[32px] font-black text-black mb-8 tracking-tight">Get help your way</h2>
          <div className="bg-[#1B4323] rounded-2xl p-8 shadow-xl">
            <h3 className="text-[20px] font-black text-white mb-6 leading-tight">Hire the top knowledgeble Experts</h3>
            <Link href="/auth/signup" className="inline-block bg-white text-[#1B4323] px-10 py-3 rounded-full font-black text-lg shadow-lg hover:bg-gray-100 transition-all">
              Join Now
            </Link>
            <div className="mt-4">
            </div>
          </div>
        </section>
      }


    </div>
  );
};

export default MobileFinancePage;
