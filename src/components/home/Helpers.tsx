import React from "react";
import { Clock, Smartphone, DollarSign, Search } from "lucide-react";
import Image from "next/image";
import { MessageCircle, Settings, Bot } from "lucide-react";


const helpersData = [
  {
    imageSrc: "/clock.png",
    title: "Answer When You’re Available",
    description: "No Fixed Schedule Required",
  },
  {
    imageSrc: "/smartphone.png",
    title: "Work From Your Phone",
    description: "Help from anywhere, anytime.",
  },
  {
    imageSrc: "/dollar-sign.png",
    title: "Set Your Own Price",
    description: "Charge what your knowledge is worth",
  },
  {
    imageSrc: "/search.png",
    title: "Turn Your Knowledge Into Income",
    description:
      "Get paid to answer real questions helping others.",
  },
];

const Helpers = () => {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-primary mb-12">
          Helpers
        </h2>

        <div className="space-y-6">
          {helpersData.map((item, index) => {
            const Icon = item.imageSrc ? null : Bot; // Default icon if no imageSrc provided
            return (
              <div
                key={index}
                className="flex items-center bg-primary/30 border border-primary/20 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Left Icon Box */}
                <div className="w-48 bg-primary/20 flex flex-col items-center justify-center p-6 text-center">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="mb-4"
                    />
                  ) : (
                    Icon && <Icon size={50} className="mb-4 text-black" />
                  )}
                  <p className="font-semibold text-black">
                    {item.title}
                  </p>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-8 text-center">
                  <p className="text-2xl text-gray-800">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Helpers;