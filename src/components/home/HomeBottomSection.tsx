"use client";

import Link from "next/link";
import { BookOpen, Clock, DollarSign, Star, Users, Video } from "lucide-react";
import TestimonialsSection from "./TestimonialsSection";
import { useAuth } from "@/src/hooks/useAuth";

const uniqueItems = [
  {
    icon: DollarSign,
    title: "Affordable Sessions",
    desc: "Get started for as little as $3.",
  },
  {
    icon: Clock,
    title: "Fast & Flexible",
    desc: "Book quick 15-minute sessions or longer hourly lessons.",
  },
  {
    icon: Users,
    title: "Direct Access",
    desc: "Learn from real people, not pre-recorded videos.",
  },
  {
    icon: Video,
    title: "Endless Topics",
    desc: "Explore categories across every niche.",
  },
  {
    icon: Star,
    title: "Interactive Community",
    desc: "Join groups, forums, and leaderboards to connect and grow.",
  },
  {
    icon: BookOpen,
    title: "Learn Anything",
    desc: "From academics to art, business to hobbies - it's all here.",
  },
];

const HomeBottomSection = () => {
  const { user } = useAuth();
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-[920px] px-6 py-16 text-center">
        <h2 className="text-[30px] font-black leading-tight text-black">
          What Makes <span className="text-primary">Weteachs</span> Unique?
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-sm font-medium leading-relaxed text-gray-600">
          Learning shouldn't be complicated or expensive. Connect with real
          Experts who are ready to guide you in any skill you want to grow.
        </p>

        <div className="mx-auto mt-10 grid max-w-[700px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[8px] border border-gray-100 bg-white px-5 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="text-sm font-black leading-tight text-black">
                  {item.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[170px] text-xs font-medium leading-snug text-gray-600">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <TestimonialsSection />
      {user ? null : (
        <div className="mx-auto mt-24 max-w-[760px] px-6">
          <div className="flex flex-col items-center justify-between rounded-[16px] bg-primary px-8 py-12 text-center text-white shadow-xl transition-transform hover:scale-[1.02]">
            <h2 className="text-[32px] font-black leading-tight sm:text-[40px]">
              Hire the top knowledgeable Experts
            </h2>

            <Link
              href="/auth/signup"
              className="mt-10 inline-flex rounded-[12px] bg-white px-12 py-4 text-[22px] font-black leading-none text-primary transition hover:bg-secondary"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBottomSection;
