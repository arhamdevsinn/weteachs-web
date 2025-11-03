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
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/about.jpg"
          alt="About us"
          fill
          className="object-cover brightness-75 scale-105 animate-pulse-slow"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 text-center text-white px-6"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md"
            variants={fadeUp}
          >
            About Us
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed"
            variants={fadeUp}
            custom={0.3}
          >
            Helping you take control of your financial future with fast,
            flexible, and friendly support.
          </motion.p>
        </motion.div>
      </div>
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
