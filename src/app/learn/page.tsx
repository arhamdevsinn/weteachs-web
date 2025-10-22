// @ts-nocheck
"use client";

import React, {useState} from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Clock, DollarSign, Video, Star } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

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
          const { user } = useAuth();
    
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
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
      </section>
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
