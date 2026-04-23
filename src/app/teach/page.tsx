"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";


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
    id: "teacher",
    badge: "For Experts",
    title: "Teacher FAQs",
    description: "Common questions for helpers, mentors, and experts on the platform.",
    items: teacherAndGuestFaqs,
  },

];
const Page: React.FC = () => {
   const [openFaqKey, setOpenFaqKey] = useState<string | null>(null); 
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
    
  
  return (
    <div className="bg-[radial-gradient(1200px_480px_at_10%_-10%,rgba(20,184,166,0.14),transparent),radial-gradient(900px_420px_at_90%_0%,rgba(59,130,246,0.12),transparent)] bg-gradient-to-b from-slate-50 via-white to-white text-gray-800">
      <section className="px-6 md:px-16 pt-14 pb-8">
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] p-8 md:p-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-24 h-60 w-60 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative">
            <p className="inline-flex mb-4 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              WeTeachs Guide
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Learn the platform. Start helping. Get hired.
            </h1>
            <p className="mt-4 max-w-3xl text-base md:text-lg text-slate-600">
              A complete walkthrough for both students and teachers, from your first step to real outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STEPS SECTION ================= */}
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
    <p className="text-lg font-semibold">Start helping today!</p>
    <p className="text-white/80">
      Turn what you’re good at into income!
    </p>
  </div>

  {/* ACTION CARDS */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12">
    {[
      "Assist",
      "Mentor",
      "Tutor",
      "Guide",
      "Help",
      "Teach",
      "Advise",
      "More!",
    ].map((item, i) => (
      <div
        key={i}
        className="bg-gradient-to-b from-secondary to-white text-primary text-lg md:text-xl font-semibold rounded-2xl p-8 text-center shadow-sm border border-primary/10 hover:-translate-y-1 hover:shadow-lg transition"
      >
        {item}
      </div>
    ))}
  </div>
  {/* PROFILE PREVIEW CARD */}
  <div className="bg-white rounded-2xl mx-auto w-full max-w-xl shadow-lg border border-slate-200 p-6 mb-12">
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
  </div>
  {exploreCategoriesCard}
  
  {/* STEP 3 */}
  <div className="bg-primary text-white rounded-2xl p-6 md:p-7 mb-8 shadow-lg">
    <h3 className="text-2xl font-bold">Step 3.</h3>
    <p className="text-lg font-semibold">Customize your profile</p>
    <p className="text-white/80">
      Stand out from the competition with a unique profile
    </p>
  </div>

  {/* IMAGES SECTION */}
  <div className="grid md:grid-cols-2 gap-6 mb-12">
    <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
      <img
        src="/help.jpeg"
        alt="Picture of a person"
        className="object-cover w-full h-full"
      />
    </div>

    <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
      <img
        src="/image.png"
        alt="Screenshot from web/app"
        className="object-cover w-full h-full"
      />
    </div>
  </div>

  {/* STEP 4 */}
  <div className="bg-primary text-white rounded-2xl p-6 md:p-7 shadow-lg">
    <h3 className="text-2xl font-bold">Step 4.</h3>
    <p className="text-lg font-semibold">GET HIRED!</p>
    <p className="text-white/80">
      The more Categories you have the better chance of getting hired
    </p>
  </div>
  </div>

</section>


    <Separator className="my-10 max-w-4xl mx-auto" />
 

      {/* <div>
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
                <img src="/student.png" alt="Student asking for expert guidance" className="w-full h-full object-cover min-h-[320px]" />
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
                <img src="/help.jpeg" alt="Helper providing one-on-one support" className="w-full h-full object-cover min-h-[280px]" />
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
        </div> */}

      <div>
        <div className="px-6 md:px-16 mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">For Experts</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Teacher Steps</h2>
        </div>
        <section className="px-6 md:px-16 py-14 bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <p className="text-sm font-semibold text-primary mb-3">For Experts & Teachers</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">How Do You Earn?</h2>
                  <p className="text-gray-700 mb-3">Getting started is simple.</p>
                  <p className="text-gray-700 mb-3">
                    Sign up for free and create your first category-this is how people find and hire you.
                  </p>
                  <p className="text-gray-700 mb-3">Think of a category as your skill or service. It can be anything:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Fitness advice</li>
                    <li>Cooking help</li>
                    <li>Boxing coaching</li>
                    <li>Resume reviews</li>
                    <li>Even hobbies like skateboarding</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    You can create multiple categories and customize each one with your own pricing, description, and focus.
                  </p>
                  <p className="text-gray-700 mt-2">The clearer your category, the easier it is for clients to choose you.</p>
                </CardContent>
              </Card>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white">
                <img src="/chat4.png" alt="Expert profile and earning opportunities" className="w-full h-full object-cover min-h-[320px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">How Do You Get Paid?</h3>
                  <p className="text-gray-700">We use Stripe to handle all payments a secure and trusted platform used worldwide.</p>
                  <p className="text-gray-700 mt-2">To start earning, simply connect your Stripe account.</p>
                  <p className="text-gray-700 mt-3">Once connected:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>You can receive payments directly</li>
                    <li>Transactions are safe and reliable</li>
                    <li>Payouts are handled automatically</li>
                  </ul>
                  <p className="text-gray-700 mt-4">After setup, you&apos;re officially ready to get hired.</p>
                </CardContent>
              </Card>

              <div className="rounded-2xl overflow-hidden shadow-lg border border-indigo-100 bg-white">
                <img src="/stripe.png" alt="Creator and payment setup visual" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 rounded-2xl shadow-lg border-orange-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What Do Helpers Do?</h3>
                  <p className="text-gray-700 mb-3">Helpers answer questions and give guidance based on their experience.</p>
                  <p className="text-gray-700 mb-3">People come to Weteachs when they want real answers from real people not generic advice.</p>
                  <p className="text-gray-700 font-semibold mb-2">Examples:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Someone struggling with their workout routine</li>
                    <li>Someone trying to improve their resume</li>
                    <li>Someone learning how to cook their first meal</li>
                    <li>Someone needing help starting a new skill</li>
                  </ul>
                  <p className="text-gray-700 mt-4">Instead of spending hours searching online, they can ask you directly.</p>
                  <p className="text-gray-700 mt-2">Your role is simple:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>Share what you know</li>
                    <li>Help someone move forward</li>
                    <li>Get paid for your time</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white">
                <img src="/how.png" alt="Teacher helping learners through categories" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <Card className="rounded-2xl shadow-lg border-0 bg-primary text-white">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Tips to Get Hired Faster</h3>
                <ul className="list-disc list-inside space-y-2 text-white/95">
                  <li>Be specific with your category (clear beats broad)</li>
                  <li>Set a fair starting price</li>
                  <li>Add a short description of what you help with</li>
                  <li>Stay active and respond quickly</li>
                </ul>
                <p className="text-white/90 mt-4">The more helpful and clear you are, the more clients you&apos;ll attract.</p>
              </CardContent>
            </Card>
          </div>
        </section>
         </div>
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
   <section className="px-6 md:px-16 py-20 text-center bg-primary text-white rounded-t-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold mb-4"
      >
        Start Teaching Today
      </motion.h2>
      <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
        Weteachs gives you the tools to share your skills, earn money, and
        build your reputation. Whether you’re looking for a side hustle or a
        full-time business — this is the place to start.
      </p>
      <Button
     
        size="lg"
        onClick={() => {
          window.open("/auth/signup", "_blank");
        }}
        variant="secondary"
        className="font-semibold text-primary bg-white hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl"
      >
         Sign Up & Start Teaching
      </Button>
    </section>
    
    </div>
  );
};

export default Page;
