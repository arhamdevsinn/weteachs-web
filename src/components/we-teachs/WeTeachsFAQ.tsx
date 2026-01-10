"use client";
import React, { useState } from "react";

const faqs = [
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
    answer: "We are currently using Stripe for all transactions. Experts and Students are both prompted to create their own business profile on stripe giving your own online business a place for your income to go to.For users who do not have Stripe available in your area you can still sign up and create a profile. We will be implementing PayPal in the upcoming months set for ( July 20th 2025)",
  },
  {
    question: "What do i need to qualify?",
    answer: "With any knowledge, skill, talent or even profession turn that into a custom category with its own rate, topic & language. Just sign up as an Expert! Tip: The more categories the chances of getting hired",
  },
  {
    question: "What is a Category?",
    answer: "A Category is what an Expert uses to get hired, create multiple categories with different topics to increase your chances of getting hired! You create categories to be found by Students. Whatever you are good at from cleaning, computers, relationships, music you can help others learn those things and earn while doing so.",
  },
];

const WeTeachsFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-2 uppercase">
        Frequently Asked Questions
      </h2>
      <p className="mb-8 text-gray-600 text-sm">
        Please reach us at <a href="mailto:weteachsaat@gmail.com" className="text-primary underline">weteachsaat@gmail.com</a> if you cannot find an answer to your question.
      </p>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-4">
            <button
              className="w-full text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className={`font-medium text-gray-900 ${openIndex === idx ? "text-primary" : ""}`}>
                {faq.question}
              </span>
              <span className="ml-2 text-primary text-xl">
                {openIndex === idx ? "▲" : "▼"}
              </span>
            </button>
            {openIndex === idx && (
              <div className="mt-2 text-gray-700 text-sm whitespace-pre-line">
                {faq.answer || <span className="italic text-gray-400">Answer coming soon...</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeTeachsFAQ;