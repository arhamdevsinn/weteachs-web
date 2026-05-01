// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";

const MobileEducationPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] overflow-hidden">
          <img
            src="/Education page.jpg"
            alt="Artist"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
            <h1 className="text-[26px] font-black text-white leading-[1.15] tracking-tight">
              Talk to an Artist Who<br />Sees What Others<br />Miss
            </h1>
            <p className="text-[12px] text-white/90 font-medium mt-3 max-w-[280px] leading-snug">
              Chat with experienced artists for feedback, techniques, and creative guidance—whenever you need it.
            </p>
          </div>
        </div>
      </section>

      {/* ── How Does It Work? ── */}
      <section className="px-3 pt-8 pb-6 bg-white">
        <h2 className="text-[26px] font-black text-black text-center mb-6 tracking-tight">How Does It Work?</h2>
        {/* 3 columns side by side */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center">
            <div className="w-full h-[80px] flex items-center justify-center overflow-hidden rounded-[4px] mb-2">
              <img src="/education 2.png" alt="Creative Match" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-[9px] font-black text-black uppercase leading-tight mb-1">Find Your Creative Match</h3>
            <p className="text-[8px] text-gray-600 leading-tight">Browse artists by style, medium, or skill level. Find someone who understands your vision.</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center">
            <div className="w-full h-[80px] flex items-center justify-center mb-2">
              <img src="/chat.png" alt="Conversation" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[9px] font-black text-black uppercase leading-tight mb-1">Start a Conversation</h3>
            <p className="text-[8px] text-gray-600 leading-tight">Chat with an artist, share your work, ask questions, and get honest feedback—no pressure.</p>
          </div>

          {/* Card 3 with CTA */}
          <div className="flex flex-col items-center rounded-[8px] border border-gray-300 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)] p-2 text-center">
            <div className="w-full h-[80px] flex items-center justify-center mb-2">
              <img src="/education 1.png" alt="Grow Skills" className="w-[60px] h-[60px] object-contain" />
            </div>
            <h3 className="text-[9px] font-black text-black uppercase leading-tight mb-1">Grow Your Skills</h3>
            <p className="text-[8px] text-gray-600 leading-tight mb-2">Have a 1 on 1 chat or video call with your own expert</p>
            <Link href="/explore" className="block w-full bg-[#265A32] text-white text-[9px] font-black py-2 rounded-[4px] leading-tight">
              Find an Artist
            </Link>
          </div>
        </div>
      </section>

      {/* ── Everything You Need ── */}
      <section className="px-4 py-6 bg-[#F9FBFA]">
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <h2 className="text-[14px] font-black text-black leading-tight mb-3">
              Everything You Need<br />to Improve Your Art
            </h2>
            <ul className="space-y-2">
              {[
                "Personalized feedback on your work",
                "Step-by-step guidance on techniques",
                "Help developing your style and ideas",
                "Support from real working artists",
                "Flexible sessions that fit your schedule",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] font-semibold text-gray-700 leading-tight">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src="/Education page 2.jpg"
              alt="Art supplies"
              className="w-full h-[150px] object-cover rounded-[10px] shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ── Why try out Weteachs? ── */}
      <section className="px-3 py-6 bg-white">
        <h2 className="text-[16px] font-black text-black text-center mb-5 tracking-tight">Why try out Weteachs?</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { title: "Grow Your Skills", desc: "Have a 1 on 1 chat or video call with your own expert." },
            { title: "Find Your Style Faster", desc: "Work with artists across different styles and mediums." },
            { title: "No Pressure, Just Progress", desc: "Start with a quick chat—continue only if it's the right fit.", cta: true },
          ].map((box, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-[8px] border border-gray-200 bg-white shadow-sm p-2">
              <h4 className="text-[9px] font-black text-black uppercase leading-tight mb-1">{box.title}</h4>
              <p className="text-[8px] text-gray-500 leading-tight mb-2">{box.desc}</p>
              {box.cta && (
                <>
                  <Link href="/clients" className="block w-full bg-[#1B4323] text-white text-[9px] font-black py-1.5 rounded-[4px]">
                    Learn more
                  </Link>
                  <p className="text-[7px] text-red-600 mt-1 font-bold">(Clients page)</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Green Banner ── */}
      <section className="bg-[#1B4323] text-white px-5 py-7 text-center">
        <h2 className="text-[15px] font-black leading-tight mb-2">Talk to the Right Artist for Your Creative Journey</h2>
        <p className="text-[11px] text-white/85 font-medium leading-snug">
          Affordable sessions, real feedback, and a wide range of creative experts—designed for artists at any level.
        </p>
      </section>

      {/* ── What are people asking? ── */}
      <section className="px-4 py-6 bg-white">
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <img
              src="/Education page.jpg"
              alt="Artist working"
              className="w-full h-[200px] object-cover rounded-[12px] shadow-md"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-black text-black mb-3 leading-tight">What are people asking?</h2>
            <div className="space-y-2">
              {[
                '"Can you critique my artwork?"',
                '"How can I improve my shading and lighting?"',
                '"What\'s the best way to develop my style?"',
                '"Can you help me with digital painting techniques?"',
                '"How do I price my artwork?"',
              ].map((q, i) => (
                <p key={i} className="text-[10px] text-gray-700 italic leading-tight">{q}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing + Transformation ── */}
      <section className="px-3 py-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          {/* Pricing Card */}
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-md p-3">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting Pricing</p>
            <p className="text-[22px] font-black text-black leading-none mb-1">$5/hr +</p>
            <p className="text-[8px] text-gray-500 mb-2 leading-snug">
              As low as $1/15min with{" "}
              <span className="text-blue-600 font-black underline">Stripe</span>
            </p>
            <div className="flex flex-col gap-1 mb-3">
              <span className="text-[8px] bg-green-50 text-green-700 border border-green-100 rounded-[4px] px-1.5 py-0.5 font-black text-center uppercase">Flexible sessions</span>
              <span className="text-[8px] bg-blue-50 text-blue-700 border border-blue-100 rounded-[4px] px-1.5 py-0.5 font-black text-center uppercase">No long-term contract</span>
            </div>
            <p className="text-[9px] font-black text-black mb-2">Real artists &amp; creators</p>
            <ul className="space-y-1.5">
              {[
                "No long-term commitment",
                "Pay only for the help you need",
                "Explore different styles and mentors",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[8px] text-gray-700 font-semibold leading-tight">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={8} strokeWidth={3} className="text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="https://stripe.com" className="text-[8px] text-blue-600 font-black mt-2 block hover:underline uppercase tracking-tight">
              Link to Stripe.com
            </Link>
          </div>

          {/* Transformation Card */}
          <div className="bg-[#EBF3EF] rounded-[10px] border border-primary/10 shadow-md p-3">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Sign up page</p>
            <h3 className="text-[13px] font-black text-black leading-tight mb-3">Ready to Start Your Transformation?</h3>
            <div className="bg-white rounded-[6px] px-2 py-1.5 flex items-center justify-between mb-3 border border-gray-100 shadow-sm">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight">No Commitment</span>
              <ArrowRight size={12} className="text-primary" />
            </div>
            <div className="space-y-2 mb-4">
              {[
                "Beginner Friendly",
                "Clear explanations",
                "Learn at your own pace",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-gray-800">
                  <ShieldCheck size={12} className="text-primary shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
              <p className="text-[8px] text-gray-500 italic mt-1 leading-tight">Explore different styles and perspectives</p>
            </div>
            <Link href="/auth/signup" className="block w-full bg-[#1B4323] text-white text-[10px] font-black py-2.5 rounded-[6px] text-center hover:bg-[#112a16] transition-colors shadow-md">
              Sign up now
            </Link>
            <p className="text-[7px] text-gray-400 text-center mt-2 italic">
              Create your account and pick the creative support that matches your needs
            </p>
            <p className="text-[7px] text-red-500 text-center mt-0.5 font-bold">Change text to "creative"</p>
          </div>
        </div>
      </section>

      {/* ── Quote Section ── */}
      <section className="px-5 py-10 bg-white">
        <div className="grid grid-cols-2 gap-4 items-start">
          {/* Quote */}
          <div className="flex flex-col items-start">
            <div className="border-2 border-black rounded-[8px] p-3 mb-2 -rotate-1 inline-block">
              <p className="text-[18px] font-black text-black italic leading-tight">
                "A coach in<br />your pocket!"
              </p>
            </div>
          </div>

          {/* Corner */}
          <div>
            <h3 className="text-[14px] font-black text-black leading-tight mb-2">An Artist in Your Corner</h3>
            <p className="text-[10px] text-gray-500 font-medium leading-snug mb-3">
              Get feedback, direction, and creative support—whenever inspiration strikes.
            </p>
            <div className="bg-[#F5F8F6] rounded-[8px] p-3 border border-primary/10">
              <p className="text-[10px] font-bold text-[#265A32] leading-snug">
                Coaching designed to help you master concepts, build skills, and stay consistent — even with a busy schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Info ── */}
      <section className="bg-[#1B4323] text-white px-5 py-10">
        <div className="flex flex-col divide-y divide-white/20">
          {[
            { title: "What do you want to create?", desc: "Find an artist who can help bring your ideas to life." },
            { title: "Chat with them", desc: "Share your work, get feedback, and see if it's the right fit." },
            { title: "Work together", desc: "Flexible sessions. Real guidance. Your creativity, leveled up." },
          ].map((item, i) => (
            <div key={i} className="py-5 first:pt-0 last:pb-0">
              <h4 className="text-[14px] font-black mb-1 leading-tight">{item.title}</h4>
              <p className="text-[11px] text-white/80 font-medium leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MobileEducationPage;
