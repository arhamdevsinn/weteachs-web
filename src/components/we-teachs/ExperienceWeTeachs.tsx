// @ts-nocheck
"use client";
import React from "react";

const ExperienceWeTeachs = () => (
  <section className="max-w-5xl mx-auto py-12 px-4">
    {/* Title */}
    <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-6 uppercase">
      Experience WeTeachs
    </h2>
    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Card 1 */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
        <h3 className="text-2xl font-semibold text-primary mb-3">
          What is WeTeachs?
        </h3>
        <p className="text-gray-700 mb-6">
          The ultimate learning and teaching Mobile App, that&apos;s what we are!
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-full font-medium text-sm"
          onClick={() => window.open("/faq", "_blank", "noopener,noreferrer")}
        >
          FAQ
        </button>
      </div>
      {/* Card 2 */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
        <h3 className="text-2xl font-semibold text-primary mb-3">
          How can WeTeachs help you?
        </h3>
        <p className="text-gray-700 mb-6">
          For Experts, who doesn&apos;t need some extra cash? Maybe you just like sharing your knowledge!<br />
          <span className="italic">
            The Students is just a general term for anyone who needs help! Which is basically anyone anywhere! From not knowing why your computer is turning on to why you cookies are dry, the learning options are boundless
          </span>
        </p>
      </div>
      {/* Card 3 */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
        <h3 className="text-2xl font-semibold text-primary mb-3">
          Who is WeTeachs for?
        </h3>
        <p className="text-gray-700 mb-6">
          Whether you&apos;re a freelancer, small business owner, or just looking to be more productive in your personal life, WeTeachs is the perfect <span className="font-semibold">solution</span>. Our app is customizable and adaptable to your specific needs, making it a valuable tool for anyone who wants to achieve more.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-full font-medium text-sm"
        onClick={() => window.open("/auth/signup", "_blank", "noopener,noreferrer")}
        >
          Sign Up Now
        </button>
      </div>
    </div>
    {/* What You Should Know Section */}
    <h3 className="text-md font-semibold tracking-wide text-gray-700 mb-4 uppercase">
      What you should know
    </h3>
    <div className="space-y-6">
      <div>
        <h4 className="text-primary text-xl font-semibold mb-2">Online Work</h4>
        <p className="text-gray-700 text-sm mb-2">
          As an Expert during your sign up process you will set up your first category there will allow you to be hired!
        </p>
        <h5 className="text-primary font-semibold mb-1">What is a category?</h5>
        <p className="text-gray-700 text-sm mb-2">
          Categories are the topics you choose to be hired for allowing you to set up specific rates, language & descriptions for each one. Create as many as you want from: cooking-cleaning-music-sports-fitness-art-education-anything
        </p>
        <h5 className="text-primary font-semibold mb-1">Knowledge shop all set up?</h5>
        <p className="text-gray-700 text-sm mb-2">
          Once you have created your categories & profile, kick back turn on notifications and wait to be hired!
        </p>
        <h5 className="text-primary font-semibold mb-1">Hired?</h5>
        <p className="text-gray-700 text-sm mb-2">
          Once you have been hired and the job has been started, your job is to use our chat messaging & video call features to Help, Assist, Mentor, Tutor, Teach or any thing to solve their problem
        </p>
      </div>
      <div>
        <h4 className="text-primary text-xl font-semibold mb-2">Online Help</h4>
        <p className="text-gray-700 text-sm">
          Students you have one simple job. Sign up and hire the perfect Expert to solve your problem!
        </p>
      </div>
    </div>
  </section>
);

export default ExperienceWeTeachs;