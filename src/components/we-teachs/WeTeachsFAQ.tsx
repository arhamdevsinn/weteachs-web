"use client";
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const publicFaqs = [
  {
    question: "What is WeTeachs?",
    answer:
      "WeTeachs is a mobile application that users can sign up as either an Expert who are there to Teach, Help, Mentor, Assist, Guide anything of that nature! By doing so you will earn based off your own Rates, Lengths & Topics.",
  },
  {
    question: "What is an Expert?",
    answer:
      "Signing up as an Expert will allow you to be hired to answer questions, lend advice, mentor, help, tutor or anything of that nature through video calling and chat messaging.",
  },
  {
    question: "What is a Student",
    answer:
      "Students are the learners of the platform, signing up allows you to fully browse through are Experts created search engine to hire the perfect person for your unique situation.",
  },
  {
    question: "How do I Help others?",
    answer:
      "Experts help through video calling or chatting with students helping them solve ANY problem they have come across.",
  },
  {
    question: "Is WeTeachs free to use?",
    answer: "Yes, WeTeachs is completely free to use for Experts.",
  },
  {
    question: "Can I earn income?",
    answer:
      "Yes, you are a freelancer. Create your own profile and sell your knowledge. Our mobile app allows you to set up your very own Knowledge shop! Good at cooking? Why not earn income by teaching others? Good at computers too? Teach that also? Wait your also good at golf? There is no limit to how many different things you can help with.",
  },
  {
    question: "How do i make money?",
    answer:
      "Signing up as an Expert allows you to earn by helping others through video call or chat messaging! During your sign up process you will be prompted to create your first category. Categories are how you will be found and hired so don't skimp out on them!",
  },
  {
    question: "Money?",
    answer:
      "We are currently using Stripe for all transactions. Experts and Students are both prompted to create their own business profile on stripe giving your own online business a place for your income to go to.For users who do not have Stripe available in your area you can still sign up and create a profile. We will be implementing PayPal in the upcoming months set for ( July 20th 2025)",
  },
  {
    question: "What do i need to qualify?",
    answer:
      "With any knowledge, skill, talent or even profession turn that into a custom category with its own rate, topic & language. Just sign up as an Expert! Tip: The more categories the chances of getting hired",
  },
  {
    question: "What is a Category?",
    answer:
      "A Category is what an Expert uses to get hired, create multiple categories with different topics to increase your chances of getting hired! You create categories to be found by Students. Whatever you are good at from cleaning, computers, relationships, music you can help others learn those things and earn while doing so.",
  },
];

const teacherAndGuestFaqs = [
  {
    question: "When do i get my first client?",
    answer:
      "Most Helpers get their first questions shortly after setting up a clear category and fair price.",
  },
  {
    question: "Do i need to be an Expert?",
    answer:
      "No. If you can help someone solve a problem or answer a question clearly, you can earn.",
  },
  {
    question: "How much can i charge?",
    answer:
      "You set your own prices. Many helpers start low to get their first clients, then increase over time.",
  },
  {
    question: "What if i don't get clients right away?",
    answer:
      "Make sure your category is clear multiple categories to increase visibility",
  },
  {
    question: "What kind of questions will i receive?",
    answer:
      "Anything related to your category from beginner questions to more detailed advice.",
  },
];

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

const faqSections: FaqSection[] = [
  {
    id: "general",
    badge: "Overview",
    title: "General FAQs",
    description: "Core information about WeTeachs, how it works, and getting started.",
    items: publicFaqs,
  },
  {
    id: "teacher",
    badge: "For Experts",
    title: "Teacher FAQs",
    description: "Common questions for helpers, mentors, and experts on the platform.",
    items: teacherAndGuestFaqs,
  },
  {
    id: "student",
    badge: "For Learners",
    title: "Student FAQs",
    description: "Everything students need to know before hiring and chatting.",
    items: studentFaqs,
  },
];

const WeTeachsFAQ = () => {
  const [openFaqKey, setOpenFaqKey] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#45ba61] bg-gradient-to-b from-slate-50 via-white to-[#45ba61] p-6 shadow-[0_24px_80px_-40px_rgba(2,6,23,0.55)] sm:p-10">
        <div className="mb-8 border-b border-[#45ba61] pb-7">
          <p className="mb-3 inline-flex items-center rounded-full border border-[#45ba61] bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#265A32]">
            Help Center
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Find quick answers about how WeTeachs works for both students and experts. Still need help? Email{" "}
            <a href="mailto:weteachat@gmail.com" className="font-medium text-[#265A32] underline decoration-[#45ba61] underline-offset-4 hover:text-[#265A32]">
              weteachat@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="space-y-6">
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
                      className={`rounded-xl border px-4 py-3 transition-colors sm:px-5 ${
                        isOpen
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
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isOpen ? "bg-cyan-100 text-[#265A32]" : "bg-[#45ba61] text-white"
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
      </div>
    </section>
  );
};

export default WeTeachsFAQ;