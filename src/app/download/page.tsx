"use client";
import Image from "next/image";
import React from "react";

const DownloadPage = () => {
  return (
    <div className="container mx-auto  min-h-screen bg-white px-6 py-16">
     <h1 className="text-4xl font-bold text-center text-primary mb-12">
            For get more features, download our mobile app!
        </h1>

    <div className=" flex items-center justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">

        {/* LEFT — iOS */}
        <a
          href="https://apps.apple.com/us/app/weteachs/id6502515880"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg block"
        >
          <Image  priority={true}
            src="/apple.jpg" // replace with actual image path
            alt="iOS App"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h2 className="text-white font-bold text-3xl md:text-4xl leading-tight">
              THE BEST APP <br /> FOR CREATORS <br />
              TO CONNECT & <br /> GROW
            </h2>
          </div>
        </a>

        {/* RIGHT — Google Play */}
        <a
          href="https://play.google.com/store/apps/details?id=com.weteachappneww.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg block"
        >
          <Image  priority={true}
            src="/android.png" // replace with actual image path
            alt="Google Play"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h2 className="text-white font-bold text-4xl tracking-wide">
              GOOGLE PLAY
            </h2>
          </div>
        </a>

      </div>
    </div>
     </div>
  );
};

export default DownloadPage;
