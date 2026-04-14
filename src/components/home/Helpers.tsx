import React from "react";
import Image from "next/image";
import { Bot } from "lucide-react";


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
    <section className="bg-gray-100 px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-8 text-center text-4xl font-bold text-primary sm:mb-12 sm:text-5xl">
          Helpers
        </h2>

        <div className="space-y-6">
          {helpersData.map((item, index) => {
            const Icon = item.imageSrc ? null : Bot; // Default icon if no imageSrc provided
            return (
              <div
                key={index}
                className="flex min-h-[190px] items-stretch overflow-hidden rounded-xl border border-primary/20 bg-primary/25 shadow-sm sm:min-h-[220px]"
              >
                {/* Left Icon Box */}
                <div className="flex w-[42%] min-w-[130px] flex-col items-center justify-center bg-primary/20 px-3 py-5 text-center sm:w-56 sm:px-6 sm:py-6">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      width={78}
                      height={78}
                      className="mb-3 h-[78px] w-[78px] object-contain sm:mb-4"
                    />
                  ) : (
                    Icon && <Icon size={50} className="mb-4 text-black" />
                  )}
                  <p className="text-md font-semibold leading-tight text-black sm:text-xl">
                    {item.title}
                  </p>
                </div>

                {/* Right Content */}
                <div className="flex flex-1 items-center justify-center border-l border-primary/15 p-2 text-center sm:p-8 ">
                  <p className="max-w-[15ch] text-md leading-tight text-gray-800 sm:max-w-[16ch] sm:text-2xl">
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