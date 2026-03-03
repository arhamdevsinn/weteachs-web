"use client";
import React from "react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hi.jpeg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex  px-20 py-24 flex-col justify-end items-center gap-8">

        <div className="flex flex-wrap  gap-6">
          
          <Button
            onClick={() => window.open("/auth/signup", "_blank")}
            className="bg-primary text-white hover:bg-primary 
                       rounded-full px-8 py-6 text-lg 
                       shadow-lg transition-transform hover:scale-105"
          >
            Become a Helper
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open("/categories", "_blank")}
            className="border-white text-primary 
                       hover:bg-white hover:text-black 
                       rounded-full px-8 py-6 text-lg 
                       shadow-md transition-transform hover:scale-105"
          >
            Ask a Question
          </Button>

        </div>
      </div>
    </section>
  );
};

export default Hero;