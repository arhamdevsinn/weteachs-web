"use client";
import React, { useState } from "react";
import Image from "next/image";

type Tab = "hiring" | "earning";

const hiringCards = [
  {
    image: "/chat.png",
    title: "Start with a free chat",
    text: "Connect with an expert, ask questions, and see if it's the right fit—no commitment required.",
  },
  {
    image: "/verify.png",
    title: "Your payment stays protected",
    text: "Funds aren't released until the work is completed, giving you confidence every step of the way.",
  },
  {
    image: "/real.png",
    title: "Work with trusted experts",
    text: "Every helper is vetted so you can confidently choose the right person for your needs.",
  },
];

const earningCards = [
  {
    image: "/dollar-sign.png",
    title: "Turn your skills into income",
    text: "Get discovered by clients and start earning on your own terms.",
  },
  {
    image: "/clock.png",
    title: "You set the rules",
    text: "Offer services however you want — hourly, fixed, or custom.",
  },
  {
    image: "/chat.png",
    title: "Connect with clients instantly",
    text: "Chat in real time, answer questions, and build trust before starting the work.",
  },
];

const MobileHowItWorks = () => {
  const [activeTab, setActiveTab] = useState<Tab>("hiring");
  const cards = activeTab === "hiring" ? hiringCards : earningCards;

  return (
    <section className="bg-white px-4 pb-8 pt-6">
      {/* Title */}
      <h2 className="mb-5 text-center text-[26px] font-black text-black">
        How it works
      </h2>

      {/* Tab Toggle */}
      <div className="mb-5 flex rounded-[10px] border border-gray-300 overflow-hidden">
        <button
          onClick={() => setActiveTab("hiring")}
          className={`flex-1 py-2.5 text-[14px] font-semibold transition-colors ${activeTab === "hiring"
            ? "bg-white text-black border-2 border-black rounded-[10px] shadow"
            : "bg-white text-gray-500"
            }`}
        >
          For Hiring
        </button>
        <button
          onClick={() => setActiveTab("earning")}
          className={`flex-1 py-2.5 text-[14px] font-semibold transition-colors ${activeTab === "earning"
            ? "bg-white text-black border-2 border-black rounded-[10px] shadow"
            : "bg-white text-gray-500"
            }`}
        >
          For Earning
        </button>
      </div>

      {/* Scrollable Cards Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex w-[220px] shrink-0 snap-start flex-col rounded-[8px] border border-gray-300 bg-white pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
          >
            <div className="relative h-[150px] w-full overflow-hidden rounded-t-[8px] bg-gray-50">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="px-3 pt-3">
              <h3 className="text-[13px] font-black leading-tight text-black">
                {card.title}
              </h3>
              <p className="mt-1 text-[11px] leading-snug text-gray-600">
                {card.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MobileHowItWorks;
