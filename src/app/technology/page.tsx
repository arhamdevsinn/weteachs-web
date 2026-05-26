// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare, Check, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import InfoCard from "@/src/components/common/InfoCard";
import MobileTechnologyPage from "@/src/components/technology/MobileTechnologyPage";
import PricingTransformation from "@/src/components/common/PricingTransformation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

const TechnologyPage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // if (isMobile) {
  //   return <MobileTechnologyPage user={user} />;
  // }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ── Section 1: Hero ── */}
      <section className="relative px-4 pt-6 pb-8 md:pt-14 md:pb-24 max-w-[1180px] mx-auto text-center">
        <div className="relative aspect-[1.45/1] md:aspect-[1.91/1] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xl border-4 border-white">
          <img
            src="/technology page.png"
            alt="Technology Guidance"
            className="h-full w-full object-cover brightness-[0.7]"
          />

        </div>
      </section>

      {/* ── Section 2: How Does It Work? ── */}
      <section className="py-8 px-6 md:py-16 max-w-[1200px] mx-auto text-center">
        <h2 className="text-[44px] md:text-[72px] font-black text-black mb-6 md:mb-16 tracking-tight">
          How Does It Work?
        </h2>
        <div className="grid grid-cols-1 gap-5 px-0 md:grid-cols-3 md:gap-12 md:px-4">
          {[
            {
              image: "/tech 2.png",
              title: "Search Your Problem",
              text: "Find experts who understand your tech stack or issue.",
            },
            {
              image: "/chat.png",
              title: "Start a Chat ⭐",
              text: "Explain your problem, share code or details, and get immediate guidance.",
            },
            {
              image: "/tech 1.png",
              title: "Fix It and Move Forward",
              text: "Solve issues faster and keep your project on track.",
              cta: "Solve My Problem",
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
              Everything You Need to Solve<br />Tech Challenges
            </h2>
            <ul className="space-y-5">
              {[
                "Debugging help and error explanations",
                "Guidance on tools, frameworks, and best practices",
                "Help with projects and architecture decisions",
                "Code reviews and optimization tips",
                "Real solutions from experienced developers"
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
              src="/Technology page 2.jpg"
              alt="Tech context"
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
            { title: "1-on-1 Technical Help", desc: "Get direct answers tailored to your exact issue." },
            { title: "Find Experts in Your Stack", desc: "From beginners to advanced systems, find the right fit." },
            { title: "No Endless Searching", desc: "Skip forums and get straight to a solution." }
          ].map((box, i) => (
            <div key={i} className="bg-white p-10 rounded-[12px] border border-black/80 shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center justify-between min-h-[300px]">
              <h4 className="font-black text-xl mb-4 uppercase tracking-tight leading-tight">{box.title}</h4>
              <p className="text-gray-500 text-base font-bold leading-relaxed">{box.desc}</p>
              {i === 2 && (
                <div className="mt-8 w-full">
                  <Link href="/categories" className="inline-block bg-[#1B4323] text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-[#112a16] shadow-xl transition-all">
                    Find a Developer
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Banner ── */}
      <section className="bg-[#1B4323] text-white py-20 px-6 text-center">
        <h2 className="text-[32px] md:text-[44px] font-black mb-6 leading-tight">Get Unstuck Without Wasting Hours</h2>
        <p className="text-lg md:text-2xl text-white/80 font-medium max-w-4xl mx-auto">
          Fast, reliable help from real developers—so you can solve problems and keep building.
        </p>
      </section>

      {/* ── Section 6: What are people asking? ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img src="/Technology page.jpg" alt="Developer desk" className="rounded-[40px] shadow-2xl w-full h-[450px] object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-8 text-center md:text-left">
            <h2 className="text-[36px] md:text-[52px] font-black text-black leading-tight">What are people asking?</h2>
            <div className="space-y-4">
              {[
                "“Why is this code not working?”",
                "“Can you help me debug this error?”",
                "“What's the best way to build this feature?”",
                "“How do I improve my app's performance?”",
                "“Which tech stack should I use?”",
                "“Can you review my code?”"
              ].map((q, i) => (
                <p key={i} className="text-xl md:text-xl text-gray-700 italic leading-snug">
                  {q}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Pricing & Transformation ── */}
      <PricingTransformation
        subText="Create your account and pick the tech support that matches your needs"
        badges={["Flexible sessions", "No long-term contract", "Real developers"]}
        pricingPoints={[
          "Pay per session",
          "Solve quick issues or dive deeper",
          "No long-term commitment",
          "Get help exactly when you need it"
        ]}
        transformationPoints={[
          "Beginner Friendly",
          "Real solutions",
          "Real Coaches",
          "Real Coaches",
          "Explore different styles and perspectives",
        ]}
        buttonText="Get help now"
        buttonHref="/about"
      />


      {/* ── Section 8: Footer Info Boxes ── */}
      <section className="bg-[#112a16] text-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto space-y-0 divide-y divide-white/10">
          {[
            { title: "Stuck on something?", desc: "Find someone who can help." },
            { title: "Start a chat", desc: "Explain your issue and get real solutions." },
            { title: "Build with confidence", desc: "Move forward without roadblocks." }
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
              { q: "What kind of tech help can I get?", a: "You can get help with coding, debugging, tools, systems, and technical concepts." },
              { q: "Can I share my code or errors?", a: "Yes, you can share details so experts can better understand and help solve your issue." },
              { q: "How fast can I get help?", a: "You can connect with experts quickly and start getting answers right away." },
              { q: "Is this for beginners or advanced users?", a: "Both—whether you’re learning or working on complex systems." },
              { q: "Can I get help choosing tools or tech stacks?", a: "Yes, experts can guide you based on your project and goals." }
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
      {
        user ? null :
          <section className="py-24 px-6 text-center">
            <h2 className="text-[44px] md:text-[64px] font-black text-black mb-16 tracking-tighter">Get help your way</h2>
            <div className="max-w-[1000px] mx-auto bg-[#1B4323] rounded-[40px] p-20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              <h3 className="text-[32px] md:text-[48px] font-black text-white mb-10 leading-tight relative z-10">Hire the top knowledgeble Experts</h3>
              <Link href="/auth/signup" className="relative z-10 inline-block bg-white text-[#1B4323] px-10 py-4 rounded-full font-black text-xl shadow-2xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all">
                Join Now
              </Link>
            </div>
          </section>
      }


    </div>
  );
};

export default TechnologyPage;
