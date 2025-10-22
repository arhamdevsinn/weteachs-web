"use client";
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';

const CommunityPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              One App. <span className="text-primary">Every Creator.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn knowledge into your sessions. Connect with experts through video, audio, or chat sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Create a team</h2>
                <p className="text-gray-600 mb-6">
                  Build a team with experts to get the knowledge you need from the comfort of your home.
                </p>
                <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/auth/signup", "_blank");
                }}
                variant="secondary"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors "
              >
                  Create
                </Button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-primary mb-4">Earn</h2>
                <p className="text-gray-600 mb-6">
                  Share your expertise and earn income by teaching others what you know best.
                </p>
           <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/auth/signup", "_blank");
                }}
                variant="secondary"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors "
              >
                  Start Earning
                </Button>
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Learn</h2>
                <p className="text-gray-600 mb-6">
                  Browse experts in any field and book sessions to get help, learn new skills, or get answers on your schedule.
                </p>
               <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/learn");
                }}
                variant="secondary"
                className="px-6 py-3 bg-primary text-white rounded-lg  transition-colors "
              >
                  Explore Learning
                </Button>
              </div>

              <div className="bg-primary p-8 rounded-2xl shadow-lg text-white">
                <h2 className="text-2xl font-bold mb-4">All your content in one place</h2>
                <p className="mb-6 opacity-90">
                  Manage all your community content seamlessly. Share knowledge across multiple platforms with your students.
                </p>
              <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/learn");
                }}
                variant="secondary"
                className="px-6 py-3 bg-white text-primary rounded-lg  transition-colors "
              >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Looking for reliable help?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Connect with experts in any field and book sessions to get help, learn new skills, or chat on your schedule.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 max-w-md">
              <h3 className="text-xl font-bold mb-4 text-primary">Learn as a Student</h3>
              <p className="mb-6">
                Browse experts in any field and book their sessions to get help, learn new skills, or get answers on your schedule.
              </p>
              <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/auth/signup", "_blank");
                }}
                variant="secondary"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
              >
                Join as Student
              </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 max-w-md">
              <h3 className="text-xl font-bold mb-4 text-primary">Teach as an Expert</h3>
              <p className="mb-6">
                Share your knowledge, create content, and earn income by teaching others what you know best.
              </p>

              <Button

                size="lg"
                onClick={() => {
                  setMenuOpen(false);
                  window.open("/auth/signup", "_blank");
                }}
                variant="secondary"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
              >
                Join as Expert
              </Button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto text-gray-800">
            <h3 className="text-2xl font-bold mb-4 text-primary">About Our Community</h3>
            <p className="mb-6">
              Our platform brings together creators and learners in a vibrant community where knowledge is shared through video, audio, and chat sessions. Whether you&apos;re looking to learn new skills or share your expertise, we provide the tools you need to succeed.
            </p>
            <Button

              size="lg"
              onClick={() => {
                setMenuOpen(false);
                window.open("/auth/signup", "_blank");
              }}
              variant="secondary"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
            >
              Discover Our Community
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;