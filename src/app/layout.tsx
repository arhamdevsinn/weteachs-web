
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Footer from "../components/layout/Footer";
// import Footer from "../components/layout/Footer";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"], // Available Ubuntu weights
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
  <title>WeTeachs</title>
  <meta name="theme-color" content="#2b683a" />
  <link rel="icon" href="/logo.png" type="image/png+xml" />
</head>
      <body
       className={`${ubuntu.className} w-screen min-h-screen`}
      >
         <Suspense fallback={<div>Loading...</div>}>
        <Header/>
       
        {children}
       <Toaster/>
        </Suspense>
        <Footer/>
      </body>
    </html>
  );
}
