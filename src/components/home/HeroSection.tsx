"use client";

import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-green-50  to-white">
      {/* Subtle floating shapes / glow effect */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200/40 blur-3xl rounded-full mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full mix-blend-multiply animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* ==== TEXT SECTION ==== */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Master Your <span className="text-primary">Skills</span>.<br />
            Build Your <span className="bg-primary bg-clip-text text-transparent">Future</span>.<br />
            All in One Place.
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg">
            Learn, grow, and share knowledge effortlessly. Whether you teach or learn, 
            we bring everything together for your growth journey.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
  <Button
    onClick={() =>
      window.open(
        "https://play.google.com/store/apps/details?id=com.weteachappneww.app",
        "_blank",
        "noopener,noreferrer"
      )
    }
    className="bg-primary text-white hover:bg-green-800 rounded-full px-8 py-6 text-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
  >
    Download for Android
  </Button>
  <Button
    variant="outline"
    onClick={() =>
      window.open(
        "https://apps.apple.com/us/app/weteachs/id6502515880",
        "_blank",
        "noopener,noreferrer"
      )
    }
    className="border-green-700 text-green-800 hover:bg-green-100 rounded-full px-8 py-6 text-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105"
  >
    Get on iOS
  </Button>
</div>

        </motion.div>

        {/* ==== IMAGE SECTION ==== */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Image
              src="/hero.png"
              alt="Learning app preview"
              width={520}
              height={400}
              className="rounded-3xl shadow-2xl border border-gray-100"
            />
          </motion.div>

          {/* Glow Behind Image */}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
