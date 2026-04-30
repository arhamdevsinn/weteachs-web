"use client";
import React from "react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Responsive Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {/* md and up */}
        <img
          src="/home_image.png"
          alt="Hero Background"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* sm to md */}
        <img
          src="/hi2.png"
          alt="Hero Background"
          className="hidden sm:block md:hidden w-full h-full object-cover"
        />
        {/* below sm */}
        <img
          src="/hi3.png"
          alt="Hero Background"
          className="block sm:hidden w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex px-4 md:px-20 py-24 flex-col justify-end items-center gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <Button
            onClick={() => window.open("/auth/signup", "_blank")}
            className="bg-primary text-white hover:bg-primary w-auto rounded-full px-8 py-6 text-lg shadow-lg transition-transform hover:scale-105"
          >
            Become a Helper
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/categories", "_blank")}
            className="border-white text-primary hover:bg-white hover:text-black rounded-full px-8 py-6 text-lg shadow-md transition-transform hover:scale-105"
          >
            Ask a Question
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;