// @ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const MobileBusinessPage = ({ user }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative w-full">
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            src="/business page mobile.png"
            alt="Business Guidance"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/20">
            <h1 className="text-[28px] font-black text-white leading-tight drop-shadow-lg">
              Your Competitive Edge<br />Is One Conversation Away
            </h1>
          </div>
        </div>
      </section>

      {/* ── How Does It Work? ── */}
      <section className="px-3 pt-10 pb-8 bg-white">
        <h2 className="text-[32px] font-black text-black text-center mb-8 tracking-tight">How Does It Work?</h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/business 2.png" alt="Find Expert" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Find the Right Expert</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Search for professionals with experience in your area.</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/chat.png" alt="Chat" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Start a Conversation ⭐</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Ask questions, get insights, and see if they're the right fit.</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/business 1.png" alt="Take Action" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Take Action with Confidence</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight mb-2">Use expert advice to make smarter decisions and move forward.</p>
            <Link href="/explore" className="block w-full bg-[#265A32] text-white text-[9px] font-black py-2 rounded-[4px] leading-tight mt-auto">
              Get Business Advice
            </Link>
          </div>
        </div>
      </section>

      {/* ── Everything You Need ── */}
      <section className="px-5 py-8 bg-[#F9FBFA]">
        <div className="grid grid-cols-2 gap-5 items-start">
          <div>
            <h2 className="text-[15px] font-black text-black leading-tight mb-4">
              Everything You Need to Move Your Business Forward
            </h2>
            <ul className="space-y-2.5">
              {[
                "Advice on strategy, growth, and execution",
                "Marketing and customer acquisition insights",
                "Help validating ideas and business plans",
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
              src="/Business page 2.jpg"
              alt="Business context"
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
            { title: "1-on-1 Business Advice", desc: "Get direct insights tailored to your specific situation." },
            { title: "Find Experts Across Industries", desc: "Connect with people who've solved similar challenges." },
            { title: "No Long-Term Commitment", desc: "Start with a conversation and continue only if it's valuable.", cta: true },
          ].map((box, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-[8px] border border-gray-200 bg-white shadow-sm p-3 h-full">
              <h4 className="text-[9px] font-black text-black uppercase leading-tight mb-2">{box.title}</h4>
              <p className="text-[8px] text-gray-500 font-bold leading-tight mb-3">{box.desc}</p>
              {box.cta && (
                <div className="mt-auto w-full">
                  <Link href="/signup" className="block w-full bg-[#1B4323] text-white text-[9px] font-black py-2 rounded-[4px]">
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
              src="/Business page.jpg"
              alt="Business consultation"
              className="w-full h-[220px] object-cover rounded-[20px] shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-black mb-4 leading-tight">What are people asking?</h2>
            <div className="space-y-2.5">
              {[
                "“Is this a good business idea?”",
                "“How do I get my first customers?”",
                "“Can you review my marketing strategy?”",
                "“How should I price my product?”",
                "“Why isn't my business growing?”",
                "“How do I improve my sales?”",
              ].map((q, i) => (
                <p key={i} className="text-[11px] text-gray-700 italic font-bold leading-tight">{q}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing + Transformation ── */}
      <section className="px-3 py-10 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          {/* Pricing Card */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-xl p-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Starting Pricing</p>
            <p className="text-[28px] font-black text-black leading-none mb-1.5">$5/hr +</p>
            <p className="text-[9px] text-gray-500 font-bold mb-4 leading-tight">
              As low as $1/15min with{" "}
              <span className="text-blue-600 font-black underline decoration-2 underline-offset-2">Stripe</span>
            </p>
            <div className="flex flex-col gap-1.5 mb-5">
              <span className="text-[8px] bg-green-50 text-green-700 border border-green-100 rounded-[4px] px-2 py-1 font-black text-center uppercase tracking-wider">Flexible sessions</span>
              <span className="text-[8px] bg-blue-50 text-blue-700 border border-blue-100 rounded-[4px] px-2 py-1 font-black text-center uppercase tracking-wider">No long-term contract</span>
            </div>
            <p className="text-[10px] font-black text-black mb-2.5 uppercase tracking-tighter">“Real professionals”</p>
            <ul className="space-y-2">
              {[
                "Pay per session—no retainers",
                "Get quick answers or deeper guidance",
                "Work with experts on your terms",
                "No long-term contracts",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[9px] text-gray-700 font-bold leading-tight">
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={4} className="text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Transformation Card */}
          <div className="bg-[#EBF3EF] rounded-[16px] border border-primary/10 shadow-xl p-4">
            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">SIGN UP PAGE</p>
            <h3 className="text-[15px] font-black text-black leading-tight mb-4">Ready to Start Your Transformation?</h3>
            <div className="bg-white rounded-[8px] px-3 py-2 flex items-center justify-between mb-4 border border-gray-50 shadow-sm">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">No Commitment</span>
              <ArrowRight size={16} className="text-primary" />
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-800">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>Beginner Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-800">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>“real insights”</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-800">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>Real Coaches</span>
              </div>
              <p className="text-[10px] text-gray-500 italic mt-2 leading-tight">Explore different styles and perspectives</p>
            </div>
            <Link href="/about" className="block w-full bg-[#1B4323] text-white text-[12px] font-black py-3 rounded-[8px] text-center hover:bg-[#112a16] transition-colors shadow-lg">
              Get help now
            </Link>
            <p className="text-[8px] text-gray-400 text-center mt-3 font-bold leading-tight">
              Create your account and pick the <span className="text-gray-600 uppercase font-black tracking-tighter">business</span> support that matches your needs
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-12 px-5 bg-white text-center">
        <h2 className="text-[28px] font-black text-black mb-2 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-[13px] text-gray-500 font-bold mb-8">Clear answers to help you start with confidence.</p>

        <div className="space-y-3 text-left">
          {[
            { q: "What kind of business advice can I get?", a: "You can get help with strategy, marketing, sales, pricing, and growth." },
            { q: "Is this only for established businesses?", a: "No, you can get help whether you're starting out or scaling." },
            { q: "Can I validate a business idea?", a: "Yes, experts can give feedback and help you evaluate your idea." },
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
      <section className="py-12 px-5 text-center">
        <h2 className="text-[32px] font-black text-black mb-8 tracking-tight">Get help your way</h2>
        <div className="bg-[#1B4323] rounded-2xl p-8 shadow-xl">
          <h3 className="text-[20px] font-black text-white mb-6 leading-tight">Hire the top knowledgeable Experts</h3>
          <Link href="/learn" className="inline-block bg-white text-[#1B4323] px-12 py-3 rounded-full font-black text-xl shadow-lg hover:bg-gray-100 transition-all">
            Learn more
          </Link>
        </div>
      </section>

      {/* ── Footer Info ── */}
      <section className="bg-[#1B4323] text-white px-6 py-12">
        <div className="flex flex-col divide-y divide-white/20">
          {[
            { title: "What do you need help with?", desc: "Find an expert who understands your challenge." },
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
    </div>
  );
};

export default MobileBusinessPage;
