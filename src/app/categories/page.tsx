// app/page.tsx
"use client";

import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Search & Create */}
      <div className="px-6 py-4 flex items-center justify-between bg-white shadow">
        <div className="flex items-center space-x-3">
          <button className="text-2xl">☰</button>
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-1 rounded w-64"
          />
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-green-800">
          + Create
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded shadow p-3 flex flex-col space-y-2"
          >
            <div className="bg-gray-200 h-32 w-full rounded"></div>
            <div className="text-sm text-gray-600">Topic</div>
            <div className="font-semibold">Title</div>
            <div className="text-sm text-gray-500">Description</div>
            <div className="text-xs text-gray-400 mt-auto">❤️ 0 likes</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
