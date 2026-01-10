"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Earn as an Expert",
    description:
      "Monetize your expertise with freedom. Offer personalized 1-on-1 sessions via video, voice, or chat — and earn instantly for every minute you teach.",
    image: "/expert.png",
    buttonText: "Start Freelancing",
    accent: "from-primary to-primary",
    reverse: false,
    onClick: () =>
      window.open("/teach", "_blank", "noopener,noreferrer"),
  },
  {
    id: 2,
    title: "Learn as a Student",
    description:
      "Find verified experts, book flexible sessions, and gain real-world insights that accelerate your learning journey — anytime, anywhere.",
    image: "/student.png",
    buttonText: "Start Learning",
    accent: "from-primary to-primary",
    reverse: true,
    onClick: () =>
      window.open("/learn", "_blank", "noopener,noreferrer"),
  },
  {
    id: 3,
    title: "For Content Creators",
    description:
      "Unify all your online presence — YouTube, TikTok, Instagram — into a professional digital portfolio to grow and engage your audience seamlessly.",
    image: "/creator.png",
    buttonText: "Create Now",
    accent: "from-primary to-primary",
    reverse: false,
    onClick: () =>
      window.open("/how-to-weteachs", "_blank", "noopener,noreferrer"),
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center pt-20 pb-10"
      >
        <h2 className="text-sm md:text-base uppercase tracking-[0.25em] text-primary font-semibold">
          Turn Knowledge Into Income
        </h2>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900">
          Empower Your Growth —{" "}
          <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            Learn & Earn
          </span>
        </h1>
      </motion.div>

      {/* Features */}
      {features.map((feature, index) => (
        <div
          key={feature.id}
          className={`relative py-20 md:py-28 bg-secondary  ${
            index !== features.length - 1 ? "border-b border-gray-700" : ""
          }`}
        >
          {/* Floating Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute left-1/3 top-1/3 w-[350px] h-[350px] bg-green-300/20 rounded-full blur-3xl"
            />
          </div>

          <div
            className={`container mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-16 items-center ${
              feature.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE SIDE */}
            <motion.div
              initial={{ opacity: 0, x: feature.reverse ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative flex justify-center ${
                feature.reverse ? "order-2 md:order-1" : ""
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Image  priority={true}
                  src={feature.image}
                  alt={feature.title}
                  width={550}
                  height={400}
                  className="rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/50"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-green-300/10 rounded-[2rem] blur-xl" />
              </motion.div>
            </motion.div>

            {/* TEXT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: feature.reverse ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className={`space-y-6 ${
                feature.reverse ? "order-1 md:order-2" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                {feature.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span
                  className={`bg-gradient-to-r ${feature.accent} bg-clip-text text-transparent`}
                >
                  {feature.title.split(" ").slice(-1)}
                </span>
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed max-w-lg">
                {feature.description}
              </p>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button
                  onClick={feature.onClick}
                  className="rounded-full px-10 py-6 text-lg font-semibold bg-primary text-white shadow-lg hover:shadow-emerald-300/50 transition-all"
                >
                  {feature.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;
