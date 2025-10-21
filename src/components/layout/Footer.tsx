"use client";
import React from "react";
import Image from "next/image";

const Footer = () => {
  const socialLinks = [
    {
      name: "facebook",
      url: "https://www.facebook.com/people/WeTeach/61561924566303/#",
      icon: (
        <path
          fill="currentColor"
          d="M18.896 2H5.104A3.104 3.104 0 002 5.104v13.792A3.104 3.104 0 005.104 22H12v-7h-2v-2h2v-1.5C12 8.57 13.57 7 15.5 7H18v2h-2c-.55 0-1 .45-1 1V13h3l-.5 2H15v7h3.896A3.104 3.104 0 0022 18.896V5.104A3.104 3.104 0 0018.896 2z"
        />
      ),
    },
    {
      name: "twitter",
      url: "https://x.com/weteachs",
      icon: (
        <path
          fill="currentColor"
          d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 001.88-2.37 8.61 8.61 0 01-2.73 1.05A4.27 4.27 0 0011 8.09a12.12 12.12 0 01-8.8-4.46A4.22 4.22 0 003.1 9c-.68-.02-1.32-.21-1.88-.52v.05A4.27 4.27 0 004.26 13a4.27 4.27 0 01-1.92.07A4.28 4.28 0 006.7 16a8.56 8.56 0 01-5.3 1.82A9 9 0 002 18a12.08 12.08 0 006.55 1.92c7.87 0 12.17-6.52 12.17-12.17v-.56A8.67 8.67 0 0022.46 6z"
        />
      ),
    },
    {
      name: "instagram",
      url: "https://www.instagram.com/weteachs/#",
      icon: (
        <path
      fill="currentColor"
      d="M7.5 2A5.5 5.5 0 002 7.5v9A5.5 5.5 0 007.5 22h9a5.5 5.5 0 005.5-5.5v-9A5.5 5.5 0 0016.5 2h-9zm9 2A3.5 3.5 0 0120 7.5v9A3.5 3.5 0 0116.5 20h-9A3.5 3.5 0 014 16.5v-9A3.5 3.5 0 017.5 4h9zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-.5a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      ),
    },
    {
      name: "github",
      url: "https://github.com/",
      icon: (
        <path
          fill="currentColor"
          d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.93-.63.07-.61.07-.61 1.02.07 1.53 1.03 1.53 1.03.88 1.52 2.34 1.09 2.9.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.12-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0112 6.85a9.6 9.6 0 012.5.34c1.9-1.29 2.75-1.02 2.75-1.02.56 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0012 2z"
        />
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827] text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
          {/* Column 1 */}
          <div>
            <div className="flex items-center mb-5 gap-2">
              <Image src="/logo.png" width={40} height={40} alt="logo" />
              <h3 className="text-xl font-bold text-white">WeTeachs</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting learners and experts through interactive sessions,
              personalized growth, and a thriving global community.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
              Company
            </h4>
            <ul className="space-y-3 text-gray-400">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy-policy", label: "Privacy Policy" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
              Follow Us
            </h4>
            <div className="flex space-x-4 mt-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-[var(--primary)] transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
              Get the App
            </h4>
<div className="flex gap-2">
  <a
    href="https://play.google.com/store/apps/details?id=com.weteachappneww.app"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      src="/play-store.png"
      width={110}
      height={50}
      alt="Play Store"
      className="hover:scale-105 transition-transform"
    />
  </a>

  <a
    href="https://apps.apple.com/us/app/weteachs/id6502515880"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      src="/app-store.png"
      width={110}
      height={50}
      alt="App Store"
      className="hover:scale-105 transition-transform"
    />
  </a>
</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">WeTeachs</span> — All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
