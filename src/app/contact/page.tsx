"use client";

import React from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-secondary to-primary/10 flex flex-col items-center py-20 px-6">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Contact Us
          </h1>
          <div className="mx-auto w-28 h-[3px] bg-primary rounded-full"></div>
          <p className="text-gray-600 mt-3">
            We&apos;d love to hear from you! Reach out and let&apos;s connect.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Drop us a line
            </h2>

            <div className="space-y-5">
              <Input type="text" placeholder="Your Name" className="bg-white" />
              <Input type="email" placeholder="Your Email*" className="bg-white" />
              <Textarea placeholder="Your Message" rows={5} className="bg-white" />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-2 text-lg">
                Send Message
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center bg-white/60 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-gray-100 space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              The <span className="text-primary">WeTeachs</span> team is here to help you 
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Whether you have questions, suggestions, or just want to say hi —
              we&apos;re happy to chat. Reach out anytime!
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="text-primary" />
                <span>weteachchat@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="text-primary" />
                <span>00000000000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-primary" />
                <span>Usa, USA</span>
              </div>
            </div>
          </motion.div>
        </div>
        <p className="text-xs text-gray-500 mt-12 text-center">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            className="underline hover:text-primary"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            className="underline hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
    </div>
  );
};

export default Page;
