"use client";

import Image from "next/image";

const clientCards = [
  {
    image: "/chat.png",
    title: "Start with a free chat",
    text: "Talk to an expert, ask questions, and see if it's the right fit-no commitment.",
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
  },
];

const helperCards = [
  {
    image: "/dollar-sign.png",
    title: "Turn your skills into income",
    text: "Get discovered by clients and start earning on your terms.",
  },
  {
    image: "/clock.png",
    title: "You set the rules",
    text: "Offer services however you want-hourly, fixed, or custom.",
  },
  {
    image: "/chat.png",
    title: "Connect with clients instantly",
    text: "Chat in real time, answer questions, and build trust before starting the work.",
    cta: "Start earning",
  },
];

function FeatureBand({
  image,
  kicker,
  action,
  description,
  href,
}: {
  image: string;
  kicker: string;
  action: string;
  description: string;
  href: string;
}) {
  return (
    <section className="mx-auto mt-16 max-w-[1140px] rounded-[32px] bg-[#EBF3EF] px-10 py-12 shadow-sm border border-primary/5">
      <div className="grid items-center gap-16 md:grid-cols-[1fr_1.8fr]">
        <div className="flex justify-center">
          <div className="relative h-[260px] w-full max-w-[340px] overflow-hidden rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-[36px] font-black leading-tight text-primary">
            {kicker}
          </h3>
          <p className="mt-5 max-w-[540px] text-[17px] font-medium leading-relaxed text-gray-700">
            {description}
          </p>

          <div className="mt-10 flex justify-center md:justify-start">
            <a
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-[19px] font-black text-white transition hover:bg-green-900 shadow-[0_12px_24px_rgba(34,84,47,0.25)]"
            >
              {action}
              <span className="flex size-6 items-center justify-center rounded-[5px] bg-[#6fbd58] text-[16px] leading-none text-white font-bold">
                ✓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  image,
  title,
  text,
  cta,
}: {
  image: string;
  title: string;
  text: string;
  cta?: string;
}) {
  return (
    <article className="group flex min-h-[460px] flex-col items-center rounded-[24px] border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)]">
      <div className="flex h-[240px] w-full items-center justify-center rounded-t-[24px] bg-[#f8fafc] p-12 transition-colors group-hover:bg-[#f1f5f9]">
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-8 pb-10 pt-8 text-center">
        <h3 className="text-[20px] font-black leading-tight text-black">
          {title}
        </h3>
        <p className="mx-auto mt-4 mb-8 max-w-[240px] text-[15px] font-medium leading-relaxed text-gray-500">
          {text}
        </p>

        {cta && (
          <div className="mt-auto">
            <a
              href={cta === "Ask Experts" ? "/categories" : "/auth/signup"}
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-primary px-10 text-[18px] font-black leading-none text-white transition hover:bg-green-900 shadow-[0_10px_20px_rgba(34,84,47,0.2)] rounded-[24px]"
            >
              {cta}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

const FeaturesSection = () => {
  return (
    <section className="bg-white pb-32">
      {/* <div className="mx-auto mb-12 max-w-[900px] border-t border-gray-200 pt-20 text-center">
        <h2 className="mt-2 text-[52px] font-black tracking-tight text-black">
          How Does It Work?
        </h2>
      </div> */}
      <div className="px-4 pt-10 pb-4 text-center">
        <p className="text-[20px] font-bold text-gray-400 uppercase tracking-widest mb-1">OUR KNOWLEDGE NETWORK</p>
        <h2 className="text-[40px] font-black text-black">
          Empower Your Growth — Learn & Earn
        </h2>
      </div>
      {/* Hiring Section */}
      <div className="space-y-16">
        <FeatureBand
          image="/student.png"
          kicker="For Hiring"
          action="Start Here"
          description="Imagine talking to AI—but it's a real person. Get help tailored exactly to what you need, quickly and stress-free."
          href="/auth/signup"
        />

        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-3">
          {clientCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      {/* Earning Section */}
      <div className="mt-32 space-y-16">
        <FeatureBand
          image="/expert.png"
          kicker="For Earning"
          action="Find Out How"
          description="Earn by chatting with people who need your skills. Set your own rates, times, and topics. It's that simple."
          href="/auth/signup"
        />

        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-3">
          {helperCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
