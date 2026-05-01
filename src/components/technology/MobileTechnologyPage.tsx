// @ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const MobileTechnologyPage = ({ user }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative w-full">
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            src="/technology page.png"
            alt="Technology Guidance"
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
              <img src="/tech icon 1.png" alt="Search Problem" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Search Your Problem</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Find experts who understand your tech stack or issue.</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/chat.png" alt="Chat" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Start a Chat ⭐</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight">Explain your problem, share code or details, and get immediate guidance.</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center h-full">
            <div className="w-full h-[90px] flex items-center justify-center mb-2">
              <img src="/tech icon 2.png" alt="Fix It" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[10px] font-black text-black uppercase leading-tight mb-1">Fix It and Move Forward</h3>
            <p className="text-[8px] text-gray-600 font-bold leading-tight mb-2">Solve issues faster and keep your project on track.</p>
            <Link href="/explore" className="block w-full bg-[#265A32] text-white text-[9px] font-black py-2 rounded-[4px] leading-tight mt-auto">
              Solve My Problem
            </Link>
          </div>
        </div>
      </section>

      {/* ── Everything You Need ── */}
      <section className="px-5 py-8 bg-[#F9FBFA]">
        <div className="grid grid-cols-2 gap-5 items-start">
          <div>
            <h2 className="text-[15px] font-black text-black leading-tight mb-4">
              Everything You Need to Solve Tech Challenges
            </h2>
            <ul className="space-y-2.5">
              {[
                "Debugging help and error explanations",
                "Guidance on tools, frameworks, and best practices",
                "Help with projects and architecture decisions",
                "Code reviews and optimization tips",
                "Real solutions from experienced developers",
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
              src="/Technology page 2.jpg"
              alt="Tech context"
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
            { title: "1-on-1 Technical Help", desc: "Get direct answers tailored to your exact issue." },
            { title: "Find Experts in Your Stack", desc: "From beginners to advanced systems, find the right fit." },
            { title: "No Endless Searching", desc: "Skip forums and get straight to a solution.", cta: true },
          ].map((box, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-[8px] border border-gray-200 bg-white shadow-sm p-3 h-full">
              <h4 className="text-[9px] font-black text-black uppercase leading-tight mb-2">{box.title}</h4>
              <p className="text-[8px] text-gray-500 font-bold leading-tight mb-3">{box.desc}</p>
              {box.cta && (
                <div className="mt-auto w-full">
                  <Link href="/signup" className="block w-full bg-[#1B4323] text-white text-[9px] font-black py-2 rounded-[4px]">
                    Find a Developer
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Green Banner ── */}
      <section className="bg-[#1B4323] text-white px-6 py-10 text-center">
        <h2 className="text-[17px] font-black leading-tight mb-3">Get Unstuck Without Wasting Hours</h2>
        <p className="text-[12px] text-white/85 font-bold leading-snug">
          Fast, reliable help from real developers—so you can solve problems and keep building.
        </p>
      </section>

      {/* ── What are people asking? ── */}
      <section className="px-5 py-10 bg-white">
        <div className="grid grid-cols-2 gap-5 items-center">
          <div>
            <img
              src="/Technology page 3.jpg"
              alt="Server room"
              className="w-full h-[220px] object-cover rounded-[20px] shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-black mb-4 leading-tight">What are people asking?</h2>
            <div className="space-y-2.5">
              {[
                "“Why is this code not working?”",
                "“Can you help me debug this error?”",
                "“What's the best way to build this feature?”",
                "“How do I improve my app's performance?”",
                "“Which tech stack should I use?”",
                "“Can you review my code?”",
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
            <p className="text-[10px] font-black text-black mb-2.5 uppercase tracking-tighter">“Real developers”</p>
            <ul className="space-y-2">
              {[
                "Pay per session—no retainers",
                "Solve quick issues or dive deeper",
                "No long-term commitment",
                "Get help exactly when you need it",
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
                <span>“real solutions”</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-800">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>Real Coaches</span>
              </div>
              <p className="text-[10px] text-gray-500 italic mt-2 leading-tight">Explore different styles and perspectives</p>
            </div>
            <Link href="/signup" className="block w-full bg-[#1B4323] text-white text-[12px] font-black py-3 rounded-[8px] text-center hover:bg-[#112a16] transition-colors shadow-lg">
              Get help now
            </Link>
            <p className="text-[8px] text-gray-400 text-center mt-3 font-bold leading-tight">
              Create your account and pick the <span className="text-gray-600 uppercase font-black tracking-tighter">tech</span> support that matches your needs
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
            { q: "What kind of tech help can I get?", a: "You can get help with coding, debugging, tools, systems, and technical concepts." },
            { q: "Can I share my code or errors?", a: "Yes, you can share details so experts can better understand and help solve your issue." },
            { q: "How fast can I get help?", a: "You can connect with experts quickly and start getting answers right away." },
            { q: "Is this for beginners or advanced users?", a: "Both—whether you’re learning or working on complex systems." },
            { q: "Can I get help choosing tools or tech stacks?", a: "Yes, experts can guide you based on your project and goals." }
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
          <h3 className="text-[20px] font-black text-white mb-6 leading-tight">Hire the top knowledgeble Experts</h3>
          <Link href="/signup" className="inline-block bg-white text-[#1B4323] px-12 py-3 rounded-full font-black text-xl shadow-lg hover:bg-gray-100 transition-all">
            Join Now
          </Link>
          <div className="mt-4">
            {/* <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">(Sign up page)</p> */}
          </div>
        </div>
      </section>

      {/* ── Footer Info ── */}
      <section className="bg-[#1B4323] text-white px-6 py-12">
        <div className="flex flex-col divide-y divide-white/20">
          {[
            { title: "Stuck on something?", desc: "Find someone who can help." },
            { title: "Start a chat", desc: "Explain your issue and get real solutions." },
            { title: "Build with confidence", desc: "Move forward without roadblocks." },
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

export default MobileTechnologyPage;
