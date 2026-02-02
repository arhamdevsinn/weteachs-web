import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Footer from "../components/layout/Footer";
import React from "react";


const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "700"], // Available Poppins weights
});

// 2. Define your keywords as an array of strings
const KEYWORDS = [
  "hire online experts",
  "ask experts online",
  "get help from real people",
  "online tutoring and help",
  "chat with experts",
  "live expert advice online",
  "learn from real people",
  "online mentorship app",
  "human-powered knowledge platform",
  "best app to learn new skills",
  "Make money teaching online",
  "Earn money answering questions",
  "Become an online expert",
  "Sell your knowledge online",
  "How to monetize your expertise",
  "Best platform for online coaches",
  "Platform for creators to teach",
  "Get paid for your skills online",
  "Post your tutorials and guides online",
  "Create expert profile online",
  "Get answers from real people",
  "One one one help online",
  "Learn skills through chat or video",
  "Find experts for any topic",
  "Cooking advice from real people",
  "Fitness coaching online",
  "Ask professionals anything",
  "Community questions and answers",
  "Hot to guides from experts",
  "Real people. Real answers",
  "Not Ai actual human experts",
  "Get help instantly from someone who actually knows",
  "Teach learn or earn all in one place",
  "Your skills deserve a platform"
];

// 2. Export the metadata object
export const metadata = {
  title: 'WeTeachs - Real Experts, Real Answers | Teach, Learn, or Earn',
  description: 'Find and hire online experts for one-on-one help, mentorship, and instant human-powered answers. Learn from real people or earn by teaching your expertise online.',
  // Add the keywords property here
  keywords: KEYWORDS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>
        {/* <title>WeTeachs</title> 
        <meta name="theme-color" content="#2b683a" />
        <link rel="icon" href="/logo.png" type="image/png+xml" /> */}
       <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11114959066"></script>
        <script src="https://t.contentsquare.net/uxa/27feb494c51fc.js"></script>
     <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script> 
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11114959066');
          `,
          }}
        />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1412229196421285');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1412229196421285&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${poppins.className} w-screen min-h-screen`}>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}