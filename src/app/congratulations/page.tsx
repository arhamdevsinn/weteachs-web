// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Head from "next/head";


const CongratulationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isExpert = searchParams.get('expert') === 'true';
  const isAfterCategory = searchParams.get('category') === 'true';
  // copy from sign up form for conversion tracking - will need to be updated to be more accurate and not duplicated across pages
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
            'send_to': 'AW-11114959066/zQ2fCKqRt-EbENqhg7Qp',
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

  useEffect(() => {
    //     // Add Google Analytics conversion script
    // const script = document.createElement('script');
    // script.innerHTML = `
    //   gtag('event', 'conversion', {'send_to': 'AW-11114959066/JckvCPnY6-8bENqhg7Qp'});
    //   fbq('track', 'CompleteRegistration');
    // `;
    // document.head.appendChild(script);


    if (typeof window === "undefined") return;
    // return () => {
    //   // Cleanup script on unmount
    //   if (script.parentNode) {
    //     script.parentNode.removeChild(script);
    //   }
    // };

    // Track Google Ads conversion
    // if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11114959066/zQ2fCKqRt-EbENqhg7Qp',
        'value': 0.27,
        'currency': 'USD'
      });
    // }

    window.gtag?.("event", "conversion", {
      send_to: "AW-11114959066/JckvCPnY6-8bENqhg7Qp",
    });
    window.fbq?.("track", "CompleteRegistration");
    window.rdt?.("track", "CompleteRegistration");
  }, []);

  const handleContinue = () => {
    if (isExpert && !isAfterCategory) {
      // Expert after profile creation - should not happen on this page anymore
      // but keeping for safety
      router.back();
    } else if (isExpert && isAfterCategory) {
      // Expert after category creation
      router.push('/profile');
    } else {
      // Student after profile creation
      // router.back();
      router.push('/profile');
    }
  };

  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#E8ECE4] via-white to-[#E8ECE4]/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              {/* <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div> */}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-2">
            {isExpert && isAfterCategory ? "Your expert profile is now complete!" : "Your profile has been created successfully!"}
          </p>

          <p className="text-gray-500 mb-8">
            {isExpert
              ? (isAfterCategory
                ? "Welcome to WeTeachs! You're now ready to start teaching and connecting with students."
                : "Welcome to WeTeachs! You're now ready to set up your expertise category."
              )
              : "Welcome to WeTeachs! You're now ready to start your learning journey."
            }
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/learn" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                Start Exploring
              </Button>
            </Link>

            <Button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              {isExpert
                ? (isAfterCategory ? "Go to Profile" : "Continue Setup")
                : "Continue"
              }
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Check out our{" "}
              <Link href="/faq" className="text-primary hover:underline">
                FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CongratulationsPage;
