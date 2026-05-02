"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const hiringCards = [
  {
    image: "/chat.png",
    title: "Start with a free chat",
    text: "Talk to an expert, ask questions, and see if it's the right fit—no commitment.",
  },
  {
    image: "/verify.png",
    title: "Your payment stays protected",
    text: "Only pay when you're ready. Your payment is protected every step of the way.",
  },
  {
    image: "/real.png",
    title: "Work with trusted experts",
    text: "Every expert is vetted so you can confidently choose the right person for your needs.",
    cta: "Ask Experts",
    ctaHref: "/categories"
  },
];

const earningCards = [
  {
    image: "/dollar-sign.png",
    title: "Turn your skills into income",
    text: "Get discovered by clients and start earning on your terms.",
  },
  {
    image: "/clock.png",
    title: "You set the rules",
    text: "Offer services however you want—hourly, fixed, or custom.",
  },
  {
    image: "/chat.png",
    title: "Connect with clients instantly",
    text: "Chat in real time, answer questions, and build trust before starting the work.",
    cta: "Start earning",
    ctaHref: "/auth/signup"
  },
];

const MobileHowItWorks = () => {
  const [activeTab, setActiveTab] = useState<"hiring" | "earning">("hiring");

  const cards = activeTab === "hiring" ? hiringCards : earningCards;

  return (
    <section className="bg-white px-4 pb-12 pt-6">
      {/* Title */}
      <h2 className="mb-6 text-center text-[26px] font-black text-black">
        How it works
      </h2>

      {/* Tabs */}
      <div className="mx-auto mb-10 flex max-w-[320px] rounded-[10px] border-2 border-primary bg-white p-1">
        <button
          onClick={() => setActiveTab("hiring")}
          className={`flex-1 rounded-[8px] py-2.5 text-[15px] font-bold transition-all ${
            activeTab === "hiring" ? "bg-primary text-white" : "bg-transparent text-gray-700"
          }`}
        >
          For Hiring
        </button>
        <button
          onClick={() => setActiveTab("earning")}
          className={`flex-1 rounded-[8px] py-2.5 text-[15px] font-bold transition-all ${
            activeTab === "earning" ? "bg-primary text-white" : "bg-transparent text-gray-700"
          }`}
        >
          For Earning
        </button>
      </div>

      {/* Scrollable Cards Row */}
      <div className="flex gap-5 overflow-x-auto pb-10 pt-4 px-4 scrollbar-none snap-x snap-mandatory">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="flex w-[280px] shrink-0 snap-center flex-col rounded-[24px] border border-gray-100 bg-white pb-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98]"
          >
            <div className="relative h-[200px] w-full overflow-hidden rounded-t-[24px] bg-[#f8fafc] flex items-center justify-center p-10">
              {/* Step Badge */}
              <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-black text-[12px] font-black text-white shadow-md">
                {index + 1}
              </div>
              
              <div className="relative w-full h-full">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <div className="flex flex-1 flex-col px-6 pt-6 text-center">
              <h3 className="text-[17px] font-black leading-tight text-black">
                {card.title}
              </h3>
              <p className="mx-auto mt-3 mb-8 max-w-[220px] text-[14px] font-medium leading-relaxed text-gray-500">
                {card.text}
              </p>
              
              {card.cta && (
                <Link
                  href={card.ctaHref}
                  className="mt-auto flex w-full items-center justify-center rounded-[12px] bg-[#22542F] py-4 text-[17px] font-black text-white shadow-[0_10px_20px_rgba(34,84,47,0.2)] transition active:scale-95"
                >
                  {card.cta}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MobileHowItWorks;
