"use client";

import Image from "next/image";
import Link from "next/link";
import { Apple, Check, Flame, Salad, TrendingUp, Users, Clock3, CircleHelp } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const benefits = [
  "Personalized workout plans tailored to your goals",
  "Simple nutrition guidance (no extreme dieting)",
  "Progress tracking so you stay motivated",
  "Direct support & accountability from real coaches",
  "Built for busy schedules",
];

const valueCards = [
  {
    title: "1 on 1 consultations",
    description:
      "Chat or video call with the person for you. Explore through categories and find the coach who fits your needs.",
    cta: "Learn More",
    href: "/learn",
  },
  {
    title: "The Perfect Helper for you",
    description:
      "Tell them your goal with multiple options to choose from. All you need is one helper that can solve your problem.",
    cta: "Explore Categories",
    href: "/categories",
  },
  {
    title: "Get support at every turn",
    description:
      "With short or long sessions, chat when you are ready and never feel commitment pressure.",
    cta: "Helpers page",
    href: "/teach",
  },
];

const faqItems = [
  {
    question: "Do I need a gym?",
    answer: "No. Your plan can be done at home or in a gym based on your setup.",
  },
  {
    question: "Is this good for beginners?",
    answer: "Yes. We customize workouts, pace, and coaching to your current fitness level.",
  },
  {
    question: "How much time do I need each week?",
    answer: "Most plans are 30-45 minutes per session, around 3-5 sessions per week.",
  },
  {
    question: "Will I get nutrition help too?",
    answer: "Yes. You get practical nutrition guidance focused on consistency, not extreme dieting.",
  },
  {
    question: "Can I switch coaches if needed?",
    answer: "Yes. You can chat with different helpers and choose the coach that fits you best.",
  },
];

export default function FitnessPage() {
  return (
    <main className="bg-[#f1f3f2] text-slate-900">
      <section className="bg-[#22542f] px-5 py-8 md:px-10 lg:px-16 lg:py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-gradient-to-r from-[#22542f] via-[#2a6a38] to-[#22542f] p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.75)] md:p-8">
          <div className="mb-6 flex items-center justify-between text-white/90">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase">Fitness Page</p>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase">Nav Bar</p>
          </div>

          <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white md:text-5xl">
                Transform Your Body Without Guesswork
              </h1>
              <p className="mt-2 text-lg font-semibold text-white/90 md:text-xl">
                Personalized Workouts & Nutrition
              </p>
              <p className="mt-2 text-base font-medium text-white/85">Chat with the perfect Helper</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-3 rounded-xl font-medium bg-[#e6ece6] px-4 py-2 text-lg  text-[#22542f] transition hover:scale-[1.02]"
                >
                  Client View
                  {/* <span className="text-2xl">&gt;</span> */}
                </Link>
                <Link
                  href="/auth/login"
                  className="text-lg font-semibold text-white underline decoration-white/70 underline-offset-4"
                >
                  Log in
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-xl">
              <Image
                src="/help3.png"
                alt="Person doing a workout at home"
                width={800}
                height={540}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black md:text-5xl">Everything You Need to Succeed</h2>
            <ul className="mt-6 space-y-3 text-lg font-semibold">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  {benefit.includes("workout") ? (
                    <Flame className="mt-1 h-5 w-5 text-orange-500" />
                  ) : benefit.includes("nutrition") ? (
                    <Salad className="mt-1 h-5 w-5 text-green-600" />
                  ) : benefit.includes("Progress") ? (
                    <TrendingUp className="mt-1 h-5 w-5 text-rose-500" />
                  ) : benefit.includes("support") ? (
                    <Users className="mt-1 h-5 w-5 text-sky-600" />
                  ) : (
                    <Clock3 className="mt-1 h-5 w-5 text-slate-700" />
                  )}
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-lg">
            <Image
              src="/help4.jpeg"
              alt="Coach demonstrating a fitness routine"
              width={800}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-black">Why try out Weteachs?</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="flex h-full flex-col justify-between border-2 border-slate-800 bg-white p-5 shadow-[8px_8px_0_#d3d8d4]"
              >
                <div>
                  <h3 className="text-2xl font-extrabold">{card.title}</h3>
                  <p className="mt-3 text-base font-medium text-slate-700">{card.description}</p>
                </div>
                <Link
                  href={card.href}
                  className="mt-6 text-3xl font-black tracking-tight text-red-600 hover:text-red-700"
                >
                  <Button className="bg-primary text-white w-full">{card.cta}</Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/20 bg-[#22542f] px-5 py-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black text-white md:text-5xl">
            Talk to the perfect person fit for what you need help with.
          </h2>
          <p className="mt-3 text-xl font-semibold text-white/90 md:text-3xl">
            Low pricing, quick conversations, varieties of choices, ease of use.
          </p>
          <p className="mt-6 text-lg font-bold text-white/90">
            Whether you&apos;re a beginner or looking to level up, we make fitness simple, fun, and results driven!
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-white/10">
              <Image
                src="/sample1.png"
                alt="Transformation inspired fitness visual"
                width={700}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-white/10">
              <Image
                src="/sample2.png"
                alt="Fitness progress concept"
                width={700}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eef2ec_0%,#ffffff_45%,#e6ede4_100%)] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.35)] md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
            <div className="rounded-[1.75rem] bg-white/80 p-7 shadow-sm ring-1 ring-black/5 backdrop-blur-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22542f]">Starting Pricing</p>
              <h2 className="mt-3 text-5xl font-black leading-none text-slate-900 md:text-6xl">$5/hr +</h2>
              <p className="mt-4 text-lg font-semibold text-slate-700 md:text-xl">
                As low as $3 / 15min.{' '}
                <Link href="/hire" className="font-bold text-blue-700 underline decoration-blue-700/30 underline-offset-4">
                  Stripe
                </Link>
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#22542f]/10 px-4 py-2 text-sm font-bold text-[#22542f]">Flexible sessions</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">No long-term contract</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Real coaches</span>
              </div>

              <div className="mt-8 space-y-3 text-base font-semibold text-slate-700">
                {[
                  "Pay only for the session you need",
                  "Choose a coach that fits your goals",
                  "Start small and scale when ready",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22542f] text-sm text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#e6ece6] p-7 shadow-sm ring-1 ring-black/5 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Sign up page</p>
              <h3 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Ready to Start Your Transformation?
              </h3>

              <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-2xl font-extrabold text-[#22542f] shadow-inner">
                No Commitment &nbsp; &gt;
              </p>

              <div className="mt-5 space-y-3 text-lg font-bold text-slate-900">
                {["Beginner Friendly", "No Gym Required", "Real Coaches"].map((point) => (
                  <p key={point} className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>

              <Button asChild className="mt-8 h-12 w-full rounded-full bg-[#22542f] px-6 text-base font-bold text-white shadow-lg transition hover:bg-[#1b4224] hover:shadow-xl">
                <Link href="/auth/signup">Sign up now</Link>
              </Button>

              <p className="mt-4 text-center text-sm font-medium text-slate-600">
                Create your account and pick the fitness support that matches your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <span className="mb-5 h-1.5 w-20 rounded-full bg-[#22542f]" />
            <blockquote className="text-balance text-3xl font-black italic leading-tight tracking-tight text-slate-900 md:text-7xl">
              <span className="text-[#22542f]">&ldquo;</span> A coach in your pocket! <span className="text-[#22542f]">&rdquo;</span>
            </blockquote>
          </div>
          <p className="mx-auto mt-16 max-w-4xl text-2xl font-medium md:text-2xl">
            Coaching designed to help you lose fat, build strength, and stay consistent - even with a busy schedule.
          </p>
        </div>
      </section>

      <section className="space-y-3 px-5 pb-12 md:px-10 lg:px-16">
        <div className="bg-[#22542f] px-6 py-7 text-center text-white">
          <p className="text-2xl font-bold">What would you like to change?</p>
          <p className="text-xl font-medium text-white/90">Find a Coach that can help solve your needs</p>
        </div>
        <div className="bg-[#22542f] px-6 py-7 text-center text-white">
          <p className="text-2xl font-bold">Chat with them.</p>
          <p className="text-xl font-medium text-white/90">Chat with your Helper to see if they are the right fit for you</p>
        </div>
        <div className="bg-[#22542f] px-6 py-7 text-center text-white">
          <p className="text-2xl font-bold">Hire them.</p>
          <p className="text-xl font-medium text-white/90">Short. Cheap. Flexible. Chat or Video Call.</p>
        </div>
      </section>

      <section className="px-5 pb-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#22542f]">Support</p>
          <h2 className="mt-2 text-center text-4xl font-black md:text-5xl">Frequently Asked Questions</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base font-medium text-slate-600 md:text-lg">
            Clear answers to help you start with confidence.
          </p>

          <div className="mt-8 space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition open:border-[#22542f] open:shadow-md"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg  text-slate-900 marker:content-none md:text-xl">
                  {item.question}
                </summary>
                <p className="mt-3 text-base  leading-relaxed text-slate-700 md:text-lg">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-6xl font-black text-center">Get help your way</h2>
          {/* 
          <div className="mt-8 flex flex-col items-center justify-between gap-5 border-x-4 border-slate-900 px-5 py-6 md:flex-row">
            <Link href="/download" className="text-5xl font-black tracking-tight">
              Download App -&gt;
            </Link>

            <div className="flex items-center gap-4">
              <Apple className="h-24 w-24" />
              <div className="overflow-hidden rounded-2xl">
                <Image src="/android.png" alt="Android app" width={96} height={96} className="h-24 w-24 object-cover" />
              </div>
            </div>
          </div> */}
          <div className="mt-8 flex flex-col items-center justify-center gap-5  px-5 py-6 md:flex-row">
            <a
              href="https://play.google.com/store/apps/details?id=com.weteachappneww.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image priority={true}
                src="/play-store.png"
                width={110}
                height={50}
                alt="Play Store"
                className="hover:scale-105 transition-transform"
              />
            </a>

            <a
              href="https://apps.apple.com/us/app/weteachs/id6502515880"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image priority={true}
                src="/app-store.png"
                width={110}
                height={50}
                alt="App Store"
                className="hover:scale-105 transition-transform"
              />
            </a>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
            <CircleHelp className="h-4 w-4" />
            Need help choosing? Start with a free chat, then decide.
          </p>
        </div>
      </section>
    </main>
  );
}
