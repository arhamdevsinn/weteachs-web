"use client";
import React from "react";
import Image from "next/image";

const HowToWeTeachs = () => {
  return (
    <section className="bg-white py-6 px-6 md:px-16">
      {/* ===== Heading ===== */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-gray-900 uppercase">
          How to WeTeachs
        </h2>
        <div className="mt-3 h-[1px] bg-gray-300 w-full max-w-5xl mx-auto" />
      </div>


      <div className="flex flex-col md:flex-row items-center justify-center  mb-16">
        <Image  priority={true}
          src="/how.png"
          alt="WeTeachs Profile Screen"
          width={600}
          height={400}
          className="rounded-xl shadow-lg border border-gray-200"
        />
      </div>

      {/* ===== Subheading ===== */}
      <h3 className="text-center text-lg md:text-xl font-medium text-gray-800 mb-6">
        Sign up completed now to start educating
      </h3>

      {/* ===== Description Paragraphs ===== */}
      <div className="max-w-3xl mx-auto text-center text-gray-700 leading-relaxed space-y-6 text-[15px]">
        <p>
          As an Expert you are signing up to help educate, teach, tutor or even assist anyone who may
          need help. This isn&apos;t a job, you are a freelancer selling your knowledge through chat
          messaging or video calling to everyday people having small problems throughout their life.
        </p>

        <p>
          When creating your first profile you will have the option to input your very first rate,
          this will be used as your default price for any jobs that you do not specify the amount.
          Next up once you have filled out any information, you connect or create your Stripe account.
        </p>

        <p>
          We use Stripe for our payment process to keep everything secure and quick.{" "}
          <a
            href="https://stripe.com"
            className="text-primary underline hover:text-green-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe.com
          </a>
        </p>

        <p>
          You are almost done! Next up create your first custom category, based off whatever you want:
          Cooking, Cleaning, Fitness, Gaming, Parenting, Education, Technology, Music, Transportation,
          Anything!
        </p>

        <p>
          On WeTeachs you are not limited to teaching just one of your skills either, you can create
          completely different categories based on your own skills, talents or hobbies. Now that you
          have joined the community of Experts, kick back and relax while waiting for your first
          student to hire you for your advice, knowledge, expertise or maybe they just need a hand
          with something. As low as 15min quick sessions or maybe an hour long, the varieties of
          possibilities are endless.
        </p>

        <p className="font-medium">Start helping today!</p>
      </div>

      {/* ===== Button ===== */}
      <div className="flex justify-center mt-10">
        <button className="bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-green-700 transition-all duration-300 shadow-md">
          Download Now
        </button>
      </div>
    </section>
  );
};

export default HowToWeTeachs;
