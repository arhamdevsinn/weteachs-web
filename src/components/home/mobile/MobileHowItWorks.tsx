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
      <div className="mx-auto mb-10 flex max-w-[320px] rounded-[10px] border-2 border-black bg-white p-1">
        <button
          onClick={() => setActiveTab("hiring")}
          className={`flex-1 rounded-[8px] py-2.5 text-[15px] font-bold transition-all ${activeTab === "hiring" ? "bg-black text-white" : "bg-transparent text-gray-700"
            }`}
        >
          For Hiring
        </button>
        <button
          onClick={() => setActiveTab("earning")}
          className={`flex-1 rounded-[8px] py-2.5 text-[15px] font-bold transition-all ${activeTab === "earning" ? "bg-black text-white" : "bg-transparent text-gray-700"
            }`}
        >
          For Earning
        </button>
      </div>

      {/* Scrollable Cards Row */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none snap-x snap-mandatory">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex w-[260px] shrink-0 snap-center flex-col rounded-[16px] border border-gray-100 bg-white pb-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.98]"
          >
            <div className="relative h-[180px] w-full overflow-hidden rounded-t-[16px] bg-gray-50/50 flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col px-5 pt-5 text-center">
              <h3 className="text-[15px] font-black leading-tight text-black">
                {card.title}
              </h3>
              <p className="mx-auto mt-2 mb-6 max-w-[220px] text-[13px] font-bold leading-tight text-gray-500">
                {card.text}
              </p>

              {card.cta && (
                <Link
                  href={card.ctaHref}
                  className="mt-auto flex w-full items-center justify-center rounded-[8px] bg-[#22542F] py-3.5 text-[16px] font-black text-white shadow-lg transition active:scale-95"
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
