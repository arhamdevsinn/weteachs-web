"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 border-l-4 border-green-900 pl-6"
        >
          <h1 className="text-4xl md:text-5xl font-semibold leading-snug text-green-900">
            All Your Skills. <br />
            All Your Content. <br />
            All in One Place.
          </h1>

          <div className="flex gap-4 pt-4">
            <Button className="bg-green-900 text-white hover:bg-green-800 rounded-full px-8 py-6 text-lg">
              Android
            </Button>
            <Button
              variant="outline"
              className="border-green-900 text-green-900 hover:bg-green-50 rounded-full px-8 py-6 text-lg"
            >
              iOS
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <Image
            src="/hero.png" 
            alt="Learning app preview"
            width={500}
            height={350}
            className="rounded-xl shadow-md"
          />
        </motion.div>
      </div>

      {/* ====== Divider Section (like screenshot bottom) ====== */}
      <div className="w-full text-center border-t border-gray-300 pt-10 mt-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="tracking-[0.2em] text-sm md:text-base text-gray-700 font-semibold uppercase"
        >
          Turn Knowledge Into Paid Sessions
        </motion.h2>
      </div>
    </section>
  );
};

export default Page;
