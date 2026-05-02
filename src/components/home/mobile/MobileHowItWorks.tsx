import React from "react";
import Image from "next/image";

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

const MobileHowItWorks = () => {
  return (
    <section className="bg-white px-4 pb-8 pt-6">
      {/* Title */}
      <h2 className="mb-8 text-center text-[26px] font-black text-black">
        How it works
      </h2>

      {/* Scrollable Cards Row */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none snap-x snap-mandatory">
        {hiringCards.map((card) => (
          <article
            key={card.title}
            className="flex w-[240px] shrink-0 snap-center flex-col rounded-[12px] border border-gray-100 bg-white pb-5 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-transform active:scale-[0.98]"
          >
            <div className="relative h-[160px] w-full overflow-hidden rounded-t-[12px] bg-gray-50/50 flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="px-4 pt-4 text-center">
              <h3 className="text-[14px] font-black leading-tight text-black">
                {card.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[200px] text-[12px] leading-snug text-gray-600">
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
