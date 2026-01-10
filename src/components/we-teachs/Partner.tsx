"use client";
import React from "react";
import Image from "next/image";

const partners = [
  { src: "/partner-1.png", alt: "Partner 1" },
  { src: "/partner-2.png", alt: "Partner 2" },
  { src: "/jarrod.png", alt: "King of the Jungle" },
];

const Partners = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-16">
      {/* Heading */}
      <div className="text-left mb-8 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-gray-900">
          About Our Team
        </h2>
        <div className="mt-3 h-[1px] bg-gray-300 w-full" />
      </div>

      {/* Team Founder Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 max-w-5xl mx-auto">
        <div className="flex-shrink-0">
          <Image  priority={true}
            src="/isaiah.png"
            alt="Isaiah Joseph"
            width={350}
            height={350}
            className="rounded-lg shadow-md border border-gray-200 object-cover"
          />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <h3 className="text-2xl font-medium text-gray-900 mb-2">Isaiah Joseph</h3>
          <p className="text-gray-700 mb-6">
            Hello,<br />
            This is a message from me! Thanks for signing up and even reading this, one of my goals for WeTeachs is to give everyone the opportunity to earn some extra cash easily & digitally. Moving into the age of the complete technology takeover with Ai, I wanted to transition in a different direction.<br />
            Giving the 1 on 1 real person to person experience everyone needs.
          </p>
          <a
            href="/team"
            className="bg-green-900 text-white px-10 py-3 rounded-full font-medium text-lg shadow hover:bg-green-800 transition"
          >
            TEAM
          </a>
        </div>
      </div>

      {/* Partners Section */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-center text-2xl font-semibold text-green-900 mb-8">
          Our Partners
        </h3>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {partners.map((p, idx) => (
            <Image  priority={true}
              key={idx}
              src={p.src}
              alt={p.alt}
              width={120}
              height={120}
              className="rounded shadow border border-gray-200 bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;