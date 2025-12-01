import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Footer from "../components/layout/Footer";
// 1. Import Metadata type from next
import type { Metadata } from 'next';

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

// 3. Export the metadata object
export const metadata: Metadata = {
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
      {/* ⚠️ NOTE: You should remove the <head> element here! 
         Next.js automatically handles it using the exported metadata. */}
      {/* <head>
        <title>WeTeachs</title> 
        <meta name="theme-color" content="#2b683a" />
        <link rel="icon" href="/logo.png" type="image/png+xml" />
      </head> */}
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