"use client";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full flex flex-col items-center">
        <svg
          className="mb-6 text-primary"
          width={64}
          height={64}
          fill="none"
          viewBox="0 0 64 64"
        >
          <rect width="64" height="64" rx="16" fill="#D1FAE5" />
          <path
            d="M16 24v16a4 4 0 004 4h24a4 4 0 004-4V24M16 24l16 12 16-12"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-700 text-center mb-6">
          Please check your email inbox and click the verification link to activate your account.
        </p>
        <a
          href="https://mail.google.com/mail"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-800 transition mb-2"
        >
          Go to Gmail
        </a>
        <p className="text-xs text-gray-500 text-center mt-2">
          Didn’t receive the email? Check your spam folder or resend the verification from your profile.
        </p>
      </div>
    </div>
  );
};

export default page;
