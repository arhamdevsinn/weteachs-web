import React from "react";
import { Clock, MessageCircle, Settings, Bot } from "lucide-react";

const clientsData = [
  {
    icon: Clock,
    title: "Ask Questions",
    description: (
      <>
        No Subscriptions.
        <br />
        Pay only when you need help
      </>
    ),
  },
  {
    icon: MessageCircle,
    title: "Chat Or Video Call",
    description:
      "Message instantly or book a quick call. Your choice!",
  },
  {
    icon: Settings,
    title: "Personalized To Your Situation",
    description: (
      <>
        No general tips, real feedback for YOU!
        <br />
        Advice based on your exact situation
      </>
    ),
  },
  {
    icon: Bot,
    title: "Real Experts. No Bots.",
    description:
      "Talk to real people with real experience.",
  },
];

const Clients = () => {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h2 className="text-5xl font-bold text-center text-gray-500 mb-12">
          Clients
        </h2>

        {/* Cards */}
        <div className="space-y-6">
          {clientsData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center bg-gray-200 border border-gray-400 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Left Icon Section */}
                <div className="w-48 bg-gray-300 flex flex-col items-center justify-center p-6 text-center">
                  <Icon size={50} className="mb-4 text-black" />
                  <p className="font-semibold text-black">
                    {item.title}
                  </p>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-8 text-center">
                  <p className="text-2xl text-gray-800 leading-relaxed">
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

export default Clients;