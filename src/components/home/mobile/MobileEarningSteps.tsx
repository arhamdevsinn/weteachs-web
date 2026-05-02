"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

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

const MobileEarningSteps = () => {
  return (
    <section className="bg-white px-4 pb-12">
      <div className="flex flex-col gap-6">
        {earningCards.map((card, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white">
             <div className="relative w-[180px] h-[150px] mb-6">
                <Image src={card.image} alt={card.title} fill className="object-contain" />
             </div>
             <div className="px-2">
               <h3 className="text-[16px] font-black text-black mb-2 leading-tight">{card.title}</h3>
               <p className="text-[13px] font-bold text-gray-500 leading-tight mb-6">{card.text}</p>
             </div>
             {card.cta && (
               <Link href={card.ctaHref} className="w-full bg-[#22542F] text-white py-4 rounded-[12px] font-black text-[18px] shadow-lg shadow-[#22542F]/20">
                 {card.cta}
               </Link>
             )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileEarningSteps;
