"use client";
import Image from "next/image";
import React, { useEffect } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

const DownloadPage = () => {
  useEffect(() => {
    // Add conversion tracking script
    const script = document.createElement('script');
    script.innerHTML = `
      function gtag_report_conversion(url) {
        var callback = function () {
          if (typeof(url) != 'undefined') {
            window.location = url;
          }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-11114959066/EXsuCK2Rt-EbENqhg7Qp',
            'value': 0.27,
            'currency': 'USD',
            'event_callback': callback
        });
        return false;
      }
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleDownloadClick = (url: string) => {
    // Track conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11114959066/EXsuCK2Rt-EbENqhg7Qp',
        'value': 0.27,
        'currency': 'USD'
      });
    }
    
    // Open the app store link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto  min-h-screen bg-white px-6 py-16">
     <h1 className="text-4xl font-bold text-center text-primary mb-12">
            For get more features, download our mobile app!
        </h1>

    <div className=" flex items-center justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">

        {/* LEFT — iOS */}
        <div
          onClick={() => handleDownloadClick("https://apps.apple.com/us/app/weteachs/id6502515880")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDownloadClick("https://apps.apple.com/us/app/weteachs/id6502515880");
            }
          }}
          aria-label="Download on the App Store"
          className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
        >
          <Image  priority={true}
            src="/apple.jpg"
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
        </div>

        {/* RIGHT — Google Play */}
        <div
          onClick={() => handleDownloadClick("https://play.google.com/store/apps/details?id=com.weteachappneww.app")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDownloadClick("https://play.google.com/store/apps/details?id=com.weteachappneww.app");
            }
          }}
          aria-label="Get it on Google Play"
          className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
        >
          <Image  priority={true}
            src="/android.png"
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
        </div>

      </div>
    </div>
     </div>
  );
};

export default DownloadPage;
