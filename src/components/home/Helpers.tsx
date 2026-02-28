import React from "react";
import { Clock, Smartphone, DollarSign, Search } from "lucide-react";

const helpersData = [
  {
    icon: Clock,
    title: "Answer When You’re Available",
    description: "No Fixed Schedule Required",
  },
  {
    icon: Smartphone,
    title: "Work From Your Phone",
    description: "Help from anywhere, anytime.",
  },
  {
    icon: DollarSign,
    title: "Set Your Own Price",
    description: "Charge what your knowledge is worth",
  },
  {
    icon: Search,
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
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center bg-primary/30 border border-primary/20 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Left Icon Box */}
                <div className="w-48 bg-primary/20 flex flex-col items-center justify-center p-6 text-center">
                  <Icon size={50} className="mb-4 text-black" />
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