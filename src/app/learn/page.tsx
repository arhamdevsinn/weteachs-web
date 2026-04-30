// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { getRecentCategories, RecentCategory } from "@/src/lib/api/recentCategories";
import { motion } from "framer-motion";
import { BookOpen, Users, Clock, DollarSign, Video, Star } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  id: string;
  badge: string;
  title: string;
  description: string;
  items: FaqItem[];
};
const studentFaqs = [
  {
    question: "How fast will i get a response?",
    answer:
      "Most questions are answered quickly, depending on the helper you choose.",
  },
  {
    question: "What if i don't like the answer?",
    answer:
      "You can choose who to ask based on their category and experience. You have the option to freely chat before hiring your helper.",
  },
  {
    question: "Do i have to commit to anything?",
    answer:
      "No. You only pay for each session at a time. Hire someone for as low as 15 minutes",
  },
  {
    question: "Can i ask follow-up questions?",
    answer:
      "You can always chat with your helper in the free chat.",
  },
  {
    question: "How do i know who to choose?",
    answer:
      "You can browse helpers based on their category, pricing, and what they offer.",
  },
];
const faqSections: FaqSection[] = [
  {
    id: "student",
    badge: "For Learners",
    title: "Student FAQs",
    description: "Everything students need to know before hiring and chatting.",
    items: studentFaqs,
  },
];

const newHowItWorks = [
  {
    step: "1.",
    image: "/question.png",
    title: "Search your topic",
    desc: "Find experts who understand your problem.",
  },
  {
    step: "2.",
    image: "/verify.png",
    title: "Start a chat ⭐",
    desc: "Ask questions and see if they're the right fit—no commitment",
  },
  {
    step: "3.",
    image: "/chat.png",
    title: "Work with your expert",
    desc: "Get clear answers and real guidance.",
  },
];

const newQuestions = [
  "“How do I start a small online business?”",
  "“What's the smartest way to invest my money right now?”",
  "“Can you review my resume and suggest improvements?”",
  "“What's the best way to learn guitar as a beginner?”",
  "“How do I fix this error in my code?”",
  "“What should I do to improve my credit score?”",
  "“How can I train my dog to stop barking?”",
  "“What's the best workout plan for beginners?”",
  "“Can you help me plan a trip to Japan?”",
  "“How do I grow my Instagram or TikTok account?”",
];

const newExpertCategories = [
  { name: "Education" },
  { name: "Family" },
  { name: "Ex" },
  { name: "Ex" },
  { name: "Ex" },
];

const Page = () => {
  const [openFaqKey, setOpenFaqKey] = useState<string | null>(null);
  const [categories, setCategories] = useState<RecentCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getRecentCategories(7);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const exploreCategoriesCard = (
    <Link href="/categories" className="block mb-10 group">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-7 text-white shadow-lg ring-1 ring-white/20"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Discover</p>
            <h3 className="text-3xl font-extrabold leading-tight">Explore Categories</h3>
            <p className="mt-2 text-base md:text-lg font-medium text-white/95">
              Find your niche and see what others are teaching right now.
            </p>
            <p className="mt-1 text-sm md:text-base text-white/80">
              Browse popular topics, spot demand, and shape your own unique offer.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition group-hover:bg-white/25">
            Browse now
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      {/* <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-primary/90 to-primary text-white">


        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          📘 Learn Anything on <span className="text-secondary">Weteachs</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.3}
          className="max-w-2xl text-lg md:text-xl text-gray-100 leading-relaxed"
        >
          Instantly connect with real people ready to help you master any skill — from cooking to coding, fitness to freelancing.
        </motion.p>
      </section> */}
      <div className="mx-auto max-w-[1180px] px-4 pb-8 pt-10 sm:px-6 lg:pt-14">
        <div className="relative aspect-[1.45/1] w-full overflow-hidden rounded-[8px] bg-gray-200 shadow-[0_0_0_1px_rgba(0,0,0,0.16)] sm:aspect-[1.75/1] lg:aspect-[1.91/1]">
          <picture>
            <source media="(min-width: 768px)" srcSet="/learn_image.png" />
            <source media="(min-width: 480px)" srcSet="/hi2.png" />
            <img
              src="/learn_image.png"
              alt="A person smiling while talking with an expert on a laptop"
              className="h-full w-full object-cover"
            />
          </picture>

          <div className="absolute inset-0 bg-black/20" />


        </div>
      </div>

      {/* New Learn Page Design Sections */}
      <div className="w-full pb-20">
        {/* How Does It Work? */}
        <section className="py-12 px-6 max-w-[900px] mx-auto text-center">
          <h2 className="text-[40px] md:text-[48px] font-black text-black mb-10">
            How Does It Work?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {newHowItWorks.map((item, i) => (
              <div key={i} className="relative bg-[#9fbfa4] rounded-sm p-4 text-center shadow-[4px_4px_10px_rgba(0,0,0,0.2)] border-2 border-[#1B4323] flex flex-col items-center">
                <span className="absolute top-2 left-3 text-[22px] font-bold text-white drop-shadow-sm">{item.step}</span>
                <div className="h-[140px] w-full flex items-center justify-center mt-2 mb-2">
                  <img src={item.image} alt={item.title} width={120} height={120} className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" />
                </div>
                <h3 className="text-white font-bold text-[16px] leading-tight drop-shadow-sm">{item.title}</h3>
                <p className="text-white/95 mt-1 text-[13px] font-medium leading-snug drop-shadow-sm px-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-start max-w-[900px] mx-auto">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-[#1B4323] text-white px-6 py-2.5 rounded-full font-bold text-[17px] hover:bg-[#112a16] transition shadow-md">
              Get Started <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>
        </section>

        {/* What Can You Ask? */}
        <section className="py-10 bg-white">
          <div className="text-center mb-6 px-6">
            <h2 className="text-[32px] md:text-[38px] font-black text-black">What Can You Ask?</h2>
          </div>

          {/* Non-scrollable list */}
          <div className="max-w-[700px] mx-auto px-6">
            <div className="flex flex-col gap-3">
              {newQuestions.map((q, i) => (
                <div key={i} className="bg-white rounded-full px-6 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 text-center w-full">
                  <span className="text-gray-800 font-semibold text-[15px]">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who are the Experts? */}
        <section className="py-12 px-6 max-w-[1000px] mx-auto">
          <h2 className="text-[32px] md:text-[38px] font-black text-black mb-6 text-center md:text-left">Who are the Experts?</h2>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {loadingCategories
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[154px] animate-pulse rounded-[7px] bg-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  />
                ))
              : categories.map((category) => {
                  const title =
                    category.title || category.category_name || "Category";
                  const teacherName = category.teacher_name || "Name";

                  return (
                    <a
                      key={category.id}
                      href={`/categories?categoryId=${encodeURIComponent(category.id)}`}
                      className="group overflow-hidden rounded-[7px] bg-primary shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5"
                    >
                      <div className="flex h-[78px] flex-col justify-between px-3 py-2">
                        <span className="line-clamp-1 text-left text-lg font-normal leading-none text-white">
                          {title}
                        </span>
                        <span className="line-clamp-1 self-end text-[8px] font-semibold text-white/80">
                          {teacherName}
                        </span>
                      </div>
                      <img
                        src={category.category_image_url || "/sample.png"}
                        alt={title}
                        className="h-[76px] w-full object-cover"
                      />
                    </a>
                  );
                })}
          </div>

          <div className="flex justify-end mt-2">
            <Link href="/explore" className="inline-flex items-center gap-2 bg-[#1B4323] text-white px-6 py-2.5 rounded-full font-bold text-[16px] hover:bg-[#112a16] transition shadow-md">
              Ask Now <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Text Area */}
          <div className="mt-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <h3 className="text-[26px] md:text-[32px] font-black text-black shrink-0">“Experts”</h3>
            <div className="flex-1">
              <p className="text-[19px] md:text-[22px] text-[#5c7a6b] mb-6 font-medium">
                Helpers are real people with experience in specific areas.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 text-[17px] font-bold text-black mb-8">
                <div>
                  <ul className="space-y-3 list-disc list-outside ml-5 text-[#5c7a6b] font-medium">
                    <li>Fitness coaches</li>
                    <li>Students and Graduates</li>
                    <li>Hobbyists and Specialists</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3 list-disc list-outside ml-5 text-black">
                    <li>Industry professionals</li>
                    <li>Experienced freelancers</li>
                    <li>Skilled specialists and creators</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-1 text-[18px] text-[#5c7a6b] font-medium">
                <p>People who've already solved the problem you have.</p>
                <p>No bots. No generic responses.</p>
                <p>Just real people helping you move forward.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Stripe */}
        <section className="py-12 px-6 max-w-[850px] mx-auto grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#113118] rounded-[16px] p-8 flex flex-col justify-between min-h-[260px] shadow-xl">
            <div>
              <h3 className="text-[28px] text-white font-bold mb-4">Pricing</h3>
              <div className="text-[48px] text-white font-black transform -rotate-3 leading-none mt-2" style={{ fontFamily: 'cursive' }}>
                15MIN - 1HR
              </div>
            </div>
            <p className="text-white text-[18px] font-bold mt-10 leading-snug">
              Pay per session—quick questions or deeper help.
            </p>
          </div>

          <div className="bg-[#3e63dd] rounded-[16px] p-8 flex flex-col justify-between min-h-[260px] shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-[100px] font-black text-white/10 leading-none select-none">
              Stripe
            </div>
            <h3 className="text-[28px] text-white font-bold mb-4 relative z-10">Stripe</h3>
            <p className="text-white text-[18px] font-bold mt-auto leading-snug relative z-10 pr-4">
              Your payments are protected and securely handled by Stripe.
            </p>
          </div>
        </section>
      </div>

      <section className="px-6 md:px-16 py-14">
        <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-6 md:p-8 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Creator Journey</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Start Learning In 4 Steps</h2>
          </div>

          {/* STEP 1 */}
          <div className="bg-primary text-white rounded-2xl p-6 md:p-7 mb-6 shadow-lg">
            <h3 className="text-2xl font-bold">Step 1.</h3>
            <p className="text-lg font-semibold">Create your free account</p>
            <p className="text-white/80">Sign up in minutes</p>
          </div>

          {/* STEP 2 */}
          <div className="bg-primary text-white rounded-2xl p-6 md:p-7 mb-8 shadow-lg">
            <h3 className="text-2xl font-bold">Step 2.</h3>
            <p className="text-lg font-semibold">What do you need help with?</p>
            <p className="text-white/80">
              Browse through Helpers to find exactly who you need.
            </p>
          </div>

          {/* ACTION CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12">
            {[
              { label: "Cooking" },
              { label: "Fitness", href: "/fitness" },
              { label: "Education" },
              { label: "Gaming" },
              { label: "Sports" },
              { label: "Business" },
              { label: "Health" },
              { label: "Art" },
            ].map((item, i) => {
              const tileClasses = "bg-gradient-to-b from-secondary to-white text-primary text-lg md:text-xl font-semibold rounded-2xl p-8 text-center shadow-sm border border-primary/10 hover:-translate-y-1 hover:shadow-lg transition block";

              if (item.href) {
                return (
                  <Link key={i} href={item.href} className={tileClasses}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={i} className={tileClasses}>
                  {item.label}
                </div>
              );
            })}
          </div>
          {/* PROFILE PREVIEW CARD */}
          {/* <div className="bg-white rounded-2xl mx-auto w-full max-w-xl shadow-lg border border-slate-200 p-6 mb-12">
    <div className="rounded-lg mb-6 overflow-hidden flex items-center justify-center bg-green-200 ">
      <img
        src="/helper-categpry.jpg"
        alt="Helper Category"
        className="object-cover w-full h-full "
      />
      
    </div>

    <h4 className="text-xl font-bold text-green-700">
      Topic (Math)
    </h4>
    <p className="text-gray-600">Category (Education)</p>
    <p className="text-gray-600 mb-4">
      Description (I can help you with algebra)
    </p>

    <div className="flex justify-between text-sm text-gray-700">
      <span>$3 / 15min</span>
      <span>Expertise Level (Advanced)</span>
      <span>Helper Name</span>
    </div>
  </div> */}
          {exploreCategoriesCard}

          {/* STEP 3 */}
          <div className="bg-primary text-white rounded-2xl p-6 md:p-7 mb-8 shadow-lg">
            <h3 className="text-2xl font-bold">Step 3.</h3>
            <p className="text-lg font-semibold">Chat with them.</p>
            <p className="text-white/80">
              Chat with your Helper to see if they are the right fit for you.
            </p>
          </div>

          {/* IMAGES SECTION */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
              <img
                src="/help2.jpeg"
                alt="Picture of a person"
                className="object-cover w-full h-full"
              />
            </div>

            <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
              <img
                src="/image2.png"
                alt="Screenshot from web/app"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-primary text-white rounded-2xl p-6 md:p-7 shadow-lg">
            <h3 className="text-2xl font-bold">Step 4.</h3>
            <p className="text-lg font-semibold">Hire them.</p>
            <p className="text-white/80">
              Chat with your Helper to see if they are the right fit for you.
            </p>
          </div>
        </div>

      </section>
      <div>
        <div className="px-6 md:px-16 mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">For Learners</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Student Steps</h2>
        </div>


        <section className="px-6 md:px-16 py-14 bg-gradient-to-b from-white via-emerald-50/30 to-cyan-50/40">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8">
                  <p className="text-sm font-semibold text-primary mb-3">For Students</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How Does It Work?</h2>
                  <p className="text-lg text-gray-700 mb-4">Getting help is simple.</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 font-medium">
                    <li>Ask a question</li>
                    <li>Choose a helper</li>
                    <li>Get a real answer-fast</li>
                  </ol>
                  <p className="text-gray-700 mt-4">No long-term commitments. No endless searching.</p>
                </CardContent>
              </Card>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-emerald-100 bg-white">
                <img src="/learn10.png" alt="Student asking for expert guidance" className="w-full h-full object-cover min-h-[320px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-emerald-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What Can You Ask?</h3>
                  <p className="text-gray-700 mb-3">You can ask about anything you need help with.</p>
                  <p className="text-gray-700 font-semibold mb-2">Common examples:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>"Why am I not losing weight?"</li>
                    <li>"How do I start boxing as a beginner?"</li>
                    <li>"Can you review my resume?"</li>
                    <li>"How do I stay consistent with the gym?"</li>
                    <li>"What&apos;s the best way to learn this skill?"</li>
                  </ul>
                  <p className="text-gray-700 mt-4">If someone out there knows it-you can ask it.</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-cyan-100 bg-gradient-to-br from-cyan-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Why Not Just Use Google or YouTube?</h3>
                  <p className="text-gray-700 mb-3">
                    Because they give you general answers, Weteachs gives you personalized answers.
                  </p>
                  <p className="text-gray-700 mb-2">Instead of watching multiple videos or reading articles, you can:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask your exact situation</li>
                    <li>Get a direct response</li>
                    <li>Save time and confusion</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 rounded-2xl shadow-lg border-green-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Who Are the Helpers?</h3>
                  <p className="text-gray-700 mb-3">Helpers are real people with experience in specific areas.</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Fitness coaches</li>
                    <li>Students and Graduates</li>
                    <li>Hobbyists and Specialists</li>
                  </ul>
                  <p className="text-gray-700 mt-4">People who&apos;ve already solved the problem you have.</p>
                  <p className="text-gray-700 mt-2">No bots. No generic responses.</p>
                  <p className="text-gray-700">Just real people helping you move forward.</p>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-green-100 bg-white">
                <img src="/learn11.png" alt="Helper providing one-on-one support" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-amber-100 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">How Much Does It Cost?</h3>
                  <p className="text-gray-700">Each helper sets their own price.</p>
                  <p className="text-gray-700">Many questions start at just a few dollars.</p>
                  <p className="text-gray-700">You only pay for what you need no subscriptions required.</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-primary/20 bg-primary text-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold mb-3">Why Use Weteachs?</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/95">
                    <li>Get answers faster</li>
                    <li>Learn from real people</li>
                    <li>Skip the trial and error</li>
                    <li>Get help specific to YOU</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>
      </div>

      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
        >
          What Makes <span className="text-primary">Weteachs</span> Unique?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={0.3}
          className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Learning shouldn’t be complicated or expensive. Connect with real Experts who are ready to guide you in any skill you want to grow.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
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
              desc: "From academics to art, business to hobbies — it’s all here.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <item.icon className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-20 px-6 bg-white border-t border-gray-100 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
        >
          How Does It Work?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={0.3}
          className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Learning is simple and fun — just follow these steps:
        </motion.p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          {[
            "Create Your Free Account – Sign up in minutes.",
            "Explore Categories – Browse skills, topics, and Experts.",
            "Choose an Expert – Find the perfect match for your needs.",
            "Book a Session – Start with a quick 15-minute or hourly lesson.",
            "Learn & Grow – Gain knowledge and track your progress.",
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition"
            >
              <span className="text-primary font-semibold text-lg">
                Step {i + 1}.
              </span>
              <p className="text-gray-700 mt-1">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-20 px-6 text-center bg-gradient-to-b from-gray-50 to-white">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
        >
          What Can You Learn?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={0.3}
          className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Pretty much anything! Our learners come here for:
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            "Academic help & tutoring",
            "Fitness & health coaching",
            "Career & business mentoring",
            "Creative skills (art, music, design)",
            "Everyday hobbies (cooking, gaming, photography)",
            "And more — if you can dream it, you can learn it here!",
          ].map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-gray-700 font-medium">{topic}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <div className="space-y-6 p-6">
        {faqSections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-[#45ba61] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#45ba61] pb-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#265A32]">
                  {section.badge}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{section.description}</p>
              </div>
              <span className="rounded-full bg-[#45ba61] px-3 py-1 text-xs font-medium text-white">
                {section.items.length} questions
              </span>
            </div>

            <div className="space-y-3">
              {section.items.map((faq, idx) => {
                const itemKey = `${section.id}-${idx}`;
                const isOpen = openFaqKey === itemKey;

                return (
                  <div
                    key={itemKey}
                    className={`rounded-xl border px-4 py-3 transition-colors sm:px-5 ${isOpen
                      ? "border-[#45ba61] bg-cyan-50/60"
                      : "border-[#45ba61] bg-white hover:border-[#45ba61] hover:bg-cyan-50/30"
                      }`}
                  >
                    <button
                      className="flex w-full items-center justify-between gap-4 text-left"
                      onClick={() => setOpenFaqKey(isOpen ? null : itemKey)}
                      aria-expanded={isOpen}
                    >
                      <span className={`text-sm font-medium sm:text-base ${isOpen ? "text-[#265A32]" : "text-slate-800"}`}>
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-cyan-100 text-[#265A32]" : "bg-[#45ba61] text-white"
                          }`}
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 border-t border-[#45ba61]/70 pt-3 text-sm leading-6 text-slate-700 whitespace-pre-line">
                        {faq.answer || <span className="italic text-slate-400">Answer coming soon...</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      {!user && (
        <>
          <section className="py-20 px-6 text-center bg-gradient-to-r from-primary to-primary/80 text-white">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Start Learning Today 🎓
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              custom={0.3}
              className="text-lg text-gray-100 mb-10 max-w-3xl mx-auto"
            >
              Your next skill, mentor, or breakthrough is just a session away.
              Weteachs makes it easy, affordable, and fun to learn anything, anywhere.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              size="lg"
              onClick={() => {
                setMenuOpen(false);
                window.open("/auth/signup", "_blank");
              }}
              className="bg-white text-primary font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Sign Up & Find Your Expert
            </motion.button>

          </section>
        </>
      )}
    </div>
  );
};

export default Page;
