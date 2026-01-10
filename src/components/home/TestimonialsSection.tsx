"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Susan",
    role: "Educational Expert",
    date: "Jan 29, 2025",
    review:
      "I set up categories for resume writing and interview coaching, and within a week I had my first few bookings. The interface is smooth and communication with students is super easy.",
    img: "/review-1.png",
  },
  {
    name: "Eddma",
    role: "Student",
    date: "Feb 12, 2025",
    review:
      "I’ve been using WeTeachs to practice conversational Spanish with a native speaker twice a week. It feels way more personal and effective than an app or textbook.",
    img: "/review-2.png",
  },
  {
    name: "Jarrod",
    role: "Music Expert",
    date: "Mar 1, 2025",
    review:
      "I’m a full-time music marketer, and WeTeachs lets me offer short educational sessions and mentorship tutorials for everyone. It’s seamless, and I love helping up-and-coming musicians.",
    img: "/review-3.png",
  },
  {
    name: "Crissy",
    role: "Love to Cook!",
    date: "May 16, 2025",
    review:
      "Finally did my first job — can’t wait to be hired again! The platform makes everything easy and fun.",
    img: "/review-4.png",
  },
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const visible = 2;

  const handleNext = () => {
    if (index + visible < testimonials.length) {
      setIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-16 text-gray-900"
      >
        Hear From Our{" "}
        <span className="text-transparent bg-clip-text bg-primary">Happy Customers</span>
        ✨
      </motion.h2>

      {/* Cards Carousel */}
      <div className="relative flex items-center justify-center gap-6 px-6">
        {/* Prev Button */}
        <Button
          onClick={handlePrev}
          disabled={index === 0}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-primary text-white hover:bg-primary/80 disabled:opacity-30"
        >
          <ChevronLeft />
        </Button>

        <div className="overflow-hidden w-full max-w-4xl">
          <motion.div
            key={index}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center gap-10"
          >
            {testimonials.slice(index, index + visible).map((t, i) => (
              <motion.div
                key={i}
                className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[300px] text-center border border-gray-100 transition-all hover:shadow-2xl"
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <div className="flex justify-center mb-4">
                  <Image  priority={true}
                    src={t.img}
                    alt={t.name}
                    width={90}
                    height={90}
                    className="rounded-full border-4 border-secondary shadow-md"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{t.role}</h3>
                <p className="text-gray-600 mt-4 leading-relaxed italic">“{t.review}”</p>
                <p className="text-sm text-gray-400 mt-6">
                  — {t.name}, {t.date}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={index + visible >= testimonials.length}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary text-white hover:bg-primary/80 disabled:opacity-30"
        >
          <ChevronRight size={172} />
        </Button>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary to-transparent" />
    </section>
  );
};

export default TestimonialsSection;
