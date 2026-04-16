// @ts-nocheck
"use client";

import React, {useState} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Partners from "@/src/components/we-teachs/Partner";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

const Page = () => {
      const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-[#22542f] px-5 py-10 md:px-10 md:py-14 lg:px-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Learn Page</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">How Weteachs Works?</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              A platform that connects clients with experts through personalized guidance, structured plans, and ongoing support in one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl bg-[#e6ece6] px-7 text-lg font-bold text-[#22542f] hover:bg-white">
                <a href="/teach">Helpers &gt;</a>
              </Button>
              <Button asChild size="lg" className="h-12 rounded-xl bg-[#e6ece6] px-7 text-lg font-bold text-[#22542f] hover:bg-white">
                <a href="/learn">Clients &gt;</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <div className="overflow-hidden rounded-3xl border border-white/20 shadow-xl sm:col-span-1">
              <Image
                priority={true}
                src="/chat-video.png"
                alt="Using phone to chat with a helper"
                width={1000}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
            {/* <div className="overflow-hidden rounded-3xl border border-white/20 shadow-xl sm:col-span-1">
              <Image
                priority={true}
                src="/image2.png"
                alt="Client receiving guidance at home"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div> */}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f2f3f2] px-5 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl space-y-7">
          {[
            {
              src: "/learn5.png",
              alt: "Choose earn or learn on app",
              title: "Step 1: Get Started",
              subtitle: "Choose Your Path",
              body: "Sign up as Client to get help, assistance, guidance or your problem solved. Helpers can chat with people and help answer their questions.",
            },
            {
              src: "/learn6.png",
              alt: "User chatting on phone",
              title: "Step 2: Get Connected",
              subtitle: "",
              body: "With our built-in chat, you have the option for free conversations beforehand.",
            },
            {
              src: "/learn7.png",
              alt: "One on one session concept",
              title: "Step 3: Personalized Experience",
              subtitle: "",
              body: "With 1 on 1 sessions, each job is tailored specifically for you.",
            },
                {
              src: "/learn8.png",
              alt: "One on one session concept",
              title: "Step 4: Ongoing Support",
              subtitle: "",
              body: " Constant updates, feedback, accountability from everyone involved is a high priority.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
              className="grid items-center gap-6 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm md:grid-cols-[320px_1fr] md:gap-8 md:p-5"
            >
              <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-slate-300 bg-white">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={500}
                  height={100}
                  className="h-[400px] w-full object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black text-slate-900 md:text-4xl">{item.title}</h3>
                {item.subtitle ? (
                  <p className="mt-2 text-2xl font-medium text-slate-800 md:text-3xl">{item.subtitle}</p>
                ) : null}
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-800">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className=" px-5 pb-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">

          <div className="mt-10 grid gap-6  md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm"
            >
              <h4 className="text-3xl font-black text-slate-900">For Helpers</h4>
              <li className="mt-3 text-xl leading-relaxed text-slate-800">Manage clients in one place</li>
              <li className="text-xl leading-relaxed text-slate-800">Deliver structured programs</li>
              <li className="text-xl leading-relaxed text-slate-800">Communicate easily</li>
              <li className="text-xl leading-relaxed text-slate-800">Scale their business</li>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm"
            >
              <h4 className="text-3xl font-black text-slate-900">For Clients</h4>
              <li className="mt-3 text-xl leading-relaxed text-slate-800">Get matched with experts</li>
              <li className="text-xl leading-relaxed text-slate-800">Receive personalized plans</li>
              <li className="text-xl leading-relaxed text-slate-800">Track progress</li>
              <li className="text-xl leading-relaxed text-slate-800">Stay accountable</li>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mt-12 max-w-5xl text-center"
          >
            <p className="text-2xl font-black leading-relaxed text-slate-900 md:text-2xl">
              WeTeachs is a platform where clients get personalized support from experts whether it&apos;s fitness, coaching, or other services. Try our easy-to-use app.
              <a href="/download" className="ml-2 text-blue-600 underline underline-offset-4">click here to Download</a>
            </p>
          </motion.div>
        </div>

        <div className="mt-10 bg-[#22542f] px-5 py-10 text-center text-white md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-2xl font-black md:text-4xl">WeTeachs can be used for:</h3>
            <ul className="mt-4 space-y-2 text-xl  md:text-2xl">
              {[
                "Fitness coaching",
                "Business coaching",
                "Skill-based teaching",
                "Mentorship programs",
                "Learning skills",
                "Solving problems",
                "Structured guidance",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f3f2] px-5 py-14 text-center md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-2xl font-black tracking-tight text-slate-900 md:text-4xl"
          >
            What makes us unique?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.04 }}
            className="mx-auto mt-4 max-w-2xl"
          >
            <p className="text-xl font-medium text-slate-800 md:text-2xl">Focus on universal features:</p>
            <ul className="mt-2 space-y-1 text-xl  text-slate-900 md:text-2xl">
              {[
                "All-in-one dashboard",
                "Built-in communication",
                "Progress tracking",
                "Customizable plans",
                "Real-time updates",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <div className="mt-10 grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md"
            >
              <Image
                src="/hero5.png"
                alt="Weteachs platform overview"
                width={1200}
                height={700}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
              className="space-y-3 text-3xl font-medium text-slate-900 md:text-2xl"
            >
              <p>Not just content - real interaction</p>
              <p>Not generic - personalized systems</p>
              <p>Not fragmented - everything in one place</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mt-12 max-w-4xl"
          >
            <h3 className="text-4xl font-black text-slate-900 md:text-5xl">FAQ</h3>

            <div className="mt-6 space-y-3 text-left text-slate-900">
              {[
                {
                  q: "How do I get started?",
                  a: "Sign up as either a Helper or Client.",
                },
                {
                  q: "Can I switch between client and expert?",
                  a: "No, you will need 2 accounts.",
                },
                {
                  q: "Is everything done inside the app?",
                  a: "Yes, everything is done on the platform.",
                },
                {
                  q: "How is this different from other platforms?",
                  a: "We offer short sessions, a wide variety of choices, and unique features.",
                },
                {
                  q: "Do I need technical skills?",
                  a: "As a Helper you only need skills in your particular hobby or talents.",
                },
              ].map((item, index) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm transition open:border-[#22542f] open:shadow-md"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none pr-8 text-xl font-black text-slate-900 marker:content-none md:text-2xl">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-lg leading-relaxed text-slate-700 md:text-xl">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-2xl font-black text-slate-900 md:text-3xl">Ready to get started with WeTeachs?</p>
              <Button asChild className="mt-5 h-12 rounded-xl bg-[#22542f] px-10 text-xl font-bold text-white hover:bg-[#1b4626] md:h-14 md:text-2xl">
                <a href="/auth/signup">Join Now</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 px-6 text-center">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            We’re Here to Help — Just Like Our Experts
          </motion.h2>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            Life doesn&apos;t always follow a schedule — and sometimes, you need
            extra cash, fast. Whether it’s for something fun, a surprise expense,
            or peace of mind, we’ve got you covered.
          </motion.p>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.4}
          >
            As a growing team, we’re passionate about making financial support
            and knowledge accessible to everyone. Our goal is simple: to put
            money in your pocket quickly, safely, and hassle-free.
          </motion.p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-primary to-primary/70 mx-auto mb-12 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {[
            {
              title: "Our Mission",
              desc: "We believe everyone deserves access to financial peace of mind. That’s why we’re building smarter, faster, and more transparent solutions that empower confident financial choices — for today and tomorrow.",
            },
            {
              title: "Our Vision",
              desc: "We envision a world where financial stress no longer limits opportunity — where innovation and empathy bridge the gap between people and possibility.",
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              className="mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.3}
            >
              <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                {section.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {section.desc}
              </p>
            </motion.div>
          ))}
          <motion.h3
            className="text-3xl font-semibold mb-8 text-gray-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            What We Stand For
          </motion.h3>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust",
                desc: "Your trust is our top priority. We’re transparent, reliable, and fully committed to your financial well-being.",
              },
              {
                title: "Innovation",
                desc: "We harness technology to simplify your experience, delivering fast, modern, and secure financial support.",
              },
              {
                title: "Empathy",
                desc: "We understand life’s ups and downs — our solutions are built with compassion and real-world insight.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                className="p-6 border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <h4 className="font-semibold text-xl text-primary mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        <Partners/>
          <motion.div
            className="mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Let’s Grow Together 🌱
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Whether you’re seeking support, guidance, or a reliable partner to
              take your next step — we’re here every step of the way.
            </p>

              <Button
     
        size="lg"
        onClick={() => {
          setMenuOpen(false);
          window.open("/contact", "_blank");
        }}
        >  Get in Touch</Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;
