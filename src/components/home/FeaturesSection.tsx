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
  audience,
  action,
  description,
  href,
}: {
  image: string;
  kicker: string;
  audience: string;
  action: string;
  description: string;
  href: string;
}) {
  return (
    <section className="mx-auto max-w-[1120px] bg-secondary px-6 py-8 sm:px-12">
      <div className="grid items-center gap-8 md:grid-cols-[0.85fr_0.9fr_1.15fr]">
        <div className="flex justify-center">
          <Image
            src={image}
            alt=""
            width={190}
            height={150}
            className="h-[150px] w-[190px] rounded-[4px] object-cover shadow-[0_12px_22px_rgba(0,0,0,0.22)]"
          />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-[22px] font-black leading-tight text-black sm:text-[26px]">
            {kicker}
          </h3>
          <p className="mx-auto mt-3 max-w-[280px] text-[10px] font-semibold leading-tight text-gray-700 md:mx-0">
            {description}
          </p>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <a
              href={href}
                className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-black text-white transition hover:bg-green-900"
            >
              Learn More
            </a>
            <div className="text-center md:text-left">
              {/* <h2 className="text-[28px] font-black leading-tight text-black sm:text-[34px]">
            {audience}
          </h2> */}
              <p className="mt-6 flex items-center justify-center gap-2 text-[30px] font-normal leading-none text-normal sm:text-[24px] md:justify-start">
                {action}
                <span className="flex size-8 items-center justify-center rounded-[4px] bg-[#6fbd58] text-[24px] leading-none text-white">
                  ✓
                </span>
              </p>
            </div>
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
    <article className="flex min-h-[360px] flex-col items-center justify-between rounded-[6px] border border-gray-700 bg-white px-5 pb-3 pt-8 text-center shadow-[14px_14px_20px_rgba(0,0,0,0.25)]">
      <div>
        <Image
          src={image}
          alt=""
          width={220}
          height={170}
          className="mx-auto h-[170px] w-[220px] object-contain"
        />
        <h3 className="mt-4 text-base font-black leading-tight text-black">
          {title}
        </h3>
        <p className="mx-auto mt-1 max-w-[260px] text-[15px] leading-tight text-gray-800">
          {text}
        </p>
      </div>
      {cta && (
        <a
          href={cta === "Ask Experts" ? "/categories" : "/teach"}
          className="mt-5 flex h-[54px] w-full items-center justify-center rounded-[6px] bg-primary text-[27px] font-black leading-none text-white transition hover:bg-green-900"
        >
          {cta}
        </a>
      )}
    </article>
  );
}

const FeaturesSection = () => {
  return (
    <section className="bg-white pb-12">
      <div className="mx-auto mb-7 max-w-[900px] border-t border-gray-200 pt-5 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.35em] text-gray-700">
          Turn Knowledge Into Income
        </p>
        <h2 className="mt-2 text-lg font-black text-black">
          Empower Your Growth - Learn & Earn
        </h2>
      </div>

      <FeatureBand
        image="/student.png"
        kicker="Learn as a Client"
        audience="For Hiring"
        action="Start Here"
        description="Imagine talking to AI-but it's a real person. Get help tailored exactly to what you need, quickly and stress-free."
        href="/learn"
      />

      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-16 md:grid-cols-3">
        {clientCards.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </div>

      <FeatureBand
        image="/expert.png"
        kicker="Earn as an Helper"
        audience="For Earning"
        action="Find Out How"
        description="Earn by chatting with people who need your skills. Set your own rates, times, and topics-it's that simple."
        href="/teach"
      />

      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 pt-10 md:grid-cols-3">
        {helperCards.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
