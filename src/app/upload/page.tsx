"use client";
import React from "react";
import { Home, Search, PlusCircle, MessageCircle, Bell } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
    const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Upload</h1>
        <p className="text-gray-700 text-lg mb-8">What would you like to create?</p>

        <div className="space-y-6 w-full max-w-md">
          {/* Create a Category */}
          <div className="border rounded-xl p-5 shadow-sm bg-white text-center">
              <Link href={`/categories/create-categories?teacherId=${teacherId}`}>
      <button className="w-full border border-green-600 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition">
        Create a Category
      </button>
    </Link>
            <p className="text-sm text-gray-600 mt-2">
              Create a category to get hired! or check out ideas{" "}
              <a href="#" className="text-blue-600 underline">
                Search
              </a>
            </p>
          </div>

          {/* Ask a Question */}
          <div className="border rounded-xl p-5 shadow-sm bg-white text-center">
            <button className="w-full border border-green-600 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition">
              Ask a Question
            </button>
            <p className="text-sm text-gray-600 mt-2">
              What questions do you have? or head over to the{" "}
              <a href="#" className="text-blue-600 underline">
                Community zone
              </a>
            </p>
          </div>

          {/* Upload to Feed (Beta) */}
          <div className="border rounded-xl p-5 shadow-sm bg-white text-center">
            <button className="w-full border border-green-600 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition">
              (BETA) Upload to future feed
            </button>
            <p className="text-sm text-gray-600 mt-2">
              This will allow you to post for the next update where we will add a feed for how-to
              videos & images!
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="border-t bg-white p-3 flex justify-around">
        <button className="flex flex-col items-center text-gray-600 hover:text-green-700">
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-green-700">
          <Search size={22} />
          <span className="text-xs">Search</span>
        </button>
        <button className="flex flex-col items-center text-green-700">
          <PlusCircle size={28} />
          <span className="text-xs font-semibold">Create</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-green-700">
          <MessageCircle size={22} />
          <span className="text-xs">Message</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-green-700">
          <Bell size={22} />
          <span className="text-xs">Alerts</span>
        </button>
      </footer>
    </div>
  );
};

export default Page;
