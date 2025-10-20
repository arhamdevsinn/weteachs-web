"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Susan",
    role: "Educational Expert",
    date: "Jan 29, 2025",
    review:
      "I set up categories for resume writing and interview coaching — the system is intuitive and connects me with real learners instantly!",
    img: "/t1.jpg",
  },
  {
    name: "Eddma",
    role: "Student",
    date: "Feb 12, 2025",
    review:
      "I've been using WeTeachs to practice conversational Spanish. My confidence has skyrocketed thanks to the incredible mentors here!",
    img: "/t2.jpg",
  },
  {
    name: "Jarrod",
    role: "Music Expert",
    date: "Mar 1, 2025",
    review:
      "I'm a full-time music marketer, and WeTeachs lets me share quick lessons while building my online presence — love the flexibility!",
    img: "/t3.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Decorative background blur circles */}
      {/* <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary rounded-full blur-3xl" /> */}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-16 text-gray-900"
      >
        Hear From Our{" "}
        <span className="text-transparent bg-clip-text bg-primary ">
          Happy Customers
        </span>
        ✨
      </motion.h2>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-10 px-6 relative z-10">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-sm text-center border border-gray-100 transition-all hover:shadow-2xl"
          >
            {/* Floating stars */}
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              ★★★★★
            </motion.div>

            <div className="flex justify-center mb-4">
              <Image
                src={t.img}
                alt={t.name}
                width={90}
                height={90}
                className="rounded-full border-4 border-secondary shadow-md"
              />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{t.role}</h3>
            <p className="text-gray-600 mt-4 leading-relaxed italic">
              “{t.review}”
            </p>
            <p className="text-sm text-gray-400 mt-6">
              — {t.name}, {t.date}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary to-transparent" />
    </section>
  );
};

export default TestimonialsSection;
