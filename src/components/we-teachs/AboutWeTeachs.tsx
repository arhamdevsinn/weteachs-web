"use client";
import React from "react";
import Image from "next/image";

const AboutWeTeachs = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-16">
      {/* ====== Heading ====== */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-gray-900">
          About WeTeachs
        </h2>
        <div className="mt-3 h-[1px] bg-gray-300 w-full max-w-5xl mx-auto" />
      </div>

      <div className="flex justify-center mb-10">
        <Image  priority={true}
          src="/about.png" 
          alt="WeTeachs Students Illustration"
          width={800}
          height={500}
          className="rounded-lg shadow-md border border-gray-200"
        />
      </div>
      <h3 className="text-center text-lg md:text-xl font-medium text-gray-800 mb-6">
        Students
      </h3>

      <div className="max-w-3xl mx-auto text-center text-gray-700 leading-relaxed space-y-6 text-[15px]">
        <p>
          Students is a term we use for people needing guidance from our Experts. As a Student we made
          it as simple as possible for your process of problem solving. Considering you are already
          irritated from whatever problem you came here to solve, we want to fix that ASAP!
        </p>

        <p>
          Sign up and browse from our wide range of categories created by our Experts to get help with:
          Answering questions, lending a hand, sharing your expertise, or maybe just a quick video
          call. How can they help you, you ask? Using our video calling and messaging features you can
          talk directly with your Expert or show them your problem — perfect for visual learners!
        </p>
      </div>
    </section>
  );
};

export default AboutWeTeachs;
