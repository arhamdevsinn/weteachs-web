"use client";
import React from "react";
import Image from "next/image";

const Footer = () => {
   const socialLinks = [
    {
      name: "facebook",
      url: "https://www.facebook.com/people/WeTeach/61561924566303/#",
      path: (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 
          2 12c0 4.991 3.657 9.128 8.438 
          9.878v-6.987h-2.54V12h2.54V9.797
          c0-2.506 1.492-3.89 3.777-3.89 
          1.094 0 2.238.195 2.238.195v2.46h-1.26
          c-1.243 0-1.63.771-1.63 1.562V12h2.773
          l-.443 2.89h-2.33v6.988
          C18.343 21.128 22 16.991 22 12z"
        />
      ),
    },
    {
      name: "twitter",
      url: "https://x.com/weteachs",
      path: (
        <path
          d="M8.29 20.251c7.547 0 11.675-6.253 
          11.675-11.675 0-.178 0-.355-.012-.53A8.348 
          8.348 0 0022 5.92a8.19 8.19 0 
          01-2.357.646 4.118 4.118 0 
          001.804-2.27 8.224 8.224 0 
          01-2.605.996A4.107 4.107 0 
          0011.69 8.9 11.65 11.65 0 
          013.233 4.613a4.106 4.106 0 
          001.27 5.477 4.072 4.072 0 
          01-1.205-.37v.052a4.105 
          4.105 0 003.292 4.022 4.095 4.095 0 
          01-1.853.07 4.108 4.108 0 
          003.834 2.85A8.233 8.233 0 
          012 18.407a11.616 11.616 0 
          006.29 1.84"
        />
      ),
    },
    {
      name: "instagram",
      url: "https://www.instagram.com/weteachs/#",
      path: (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 
          3.808.06 1.064.049 1.791.218 
          2.427.465a4.902 4.902 0 011.772 1.153 
          4.902 4.902 0 011.153 1.772c.247.636.416 
          1.363.465 2.427.048 1.067.06 1.407.06 
          4.123v.08c0 2.643-.012 2.987-.06 
          4.043-.049 1.064-.218 1.791-.465 
          2.427a4.902 4.902 0 01-1.153 
          1.772 4.902 4.902 0 01-1.772 1.153
          c-.636.247-1.363.416-2.427.465
          -1.067.048-1.407.06-4.123.06h-.08
          c-2.643 0-2.987-.012-4.043-.06
          -1.064-.049-1.791-.218-2.427-.465
          a4.902 4.902 0 01-1.772-1.153 
          4.902 4.902 0 01-1.153-1.772
          c-.247-.636-.416-1.363-.465-2.427
          -.047-1.024-.06-1.379-.06-3.808v-.63
          c0-2.43.013-2.784.06-3.808
          .049-1.064.218-1.791.465-2.427
          a4.902 4.902 0 011.153-1.772
          A4.902 4.902 0 015.45 2.525
          c.636-.247 1.363-.416 2.427-.465
          C8.901 2.013 9.256 2 11.685 2h.63z"
        />
      ),
    },
    {
      name: "github",
      url: "https://github.com/",
      path: (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 
          2 12.017c0 4.425 2.865 8.18 
          6.839 9.504.5.092.682-.217.682-.483 
          0-.237-.008-.868-.013-1.703
          -2.782.605-3.369-1.343-3.369-1.343
          -.454-1.158-1.11-1.466-1.11-1.466
          -.908-.62.069-.608.069-.608
          1.003.07 1.531 1.032 1.531 
          1.032.892 1.53 2.341 1.088 2.91.832
          .092-.647.35-1.088.636-1.338
          -2.22-.253-4.555-1.113-4.555-4.951
          0-1.093.39-1.988 1.029-2.688
          -.103-.253-.446-1.272.098-2.65 
          0 0 .84-.27 2.75 1.026A9.564 
          9.564 0 0112 6.844c.85.004 1.705.115 
          2.504.337 1.909-1.296 
          2.747-1.027 2.747-1.027.546 
          1.379.202 2.398.1 2.651.64.7 
          1.028 1.595 1.028 2.688 
          0 3.848-2.339 4.695-4.566 
          4.943.359.309.678.92.678 
          1.855 0 1.338-.012 2.419-.012 
          2.747 0 .268.18.58.688.482A10.019 
          10.019 0 0022 12.017C22 6.484 
          17.522 2 12 2z"
        />
      ),
    },
  ];
  return (
    <footer className="bg-[var(--primary)] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:pr-4">
            <div className="flex items-center mb-4 gap-2">
              <Image src="/logo.png" width={40} height={40} alt="logo" />
              <h3 className="text-xl font-bold text-[var(--secondary)]">WeTeachs</h3>
            </div>
            <p className="text-gray-100/80 mb-4">
              Connecting learners and experts through interactive sessions and community building.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-[var(--secondary)]/40 pb-2">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy-policy", label: "Privacy Policy" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-[var(--secondary)] hover:text-white transition-colors flex items-start"
                  >
                    <svg
                      className="h-5 w-5 mr-2 mt-0.5 text-[var(--secondary)]/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          i === 0
                            ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            : i === 1
                            ? "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        }
                      />
                    </svg>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
            <div>
      <h4 className="text-lg font-semibold mb-4 border-b border-[var(--secondary)]/40 pb-2">
        Social Media
      </h4>
      <div className="flex space-x-4">
        {socialLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--secondary)] hover:text-white transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {item.path}
            </svg>
          </a>
        ))}
      </div>
    </div>
           <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-[var(--secondary)]/40 pb-2">
              Download Now
            </h4>
         <div className="grid md:grid-cols-2 grid-cols-1">
            <a href="https://play.google.com/store/apps/details?id=com.weteachappneww.app">
              <Image
            src="/play-store.png"
            width={130}
            height={50}
            alt="play"
            />
            </a>
            <a href="https://apps.apple.com/us/app/weteachs/id6502515880"> <Image
            src="/app-store.png"
            width={120}
            height={12}
            alt="play"
            /></a>
         </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-center items-center pt-8 border-t border-[var(--secondary)]/30">
          <p className="text-[var(--secondary)]/80 text-sm">
            © 2025 WeTeachs — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
