"use client";

import React, {useState} from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";

const Page: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
      const { user } = useAuth();
    
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <section className="px-6 md:px-16 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold bg-primary text-white mb-4"
        >
        Become an Expert on Weteachs
        </motion.h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Turn your skills, passion, and knowledge into income. Join a global
          community where creators, learners, and experts grow together.
        </p>
      </section>
      <section className="px-6 md:px-16 py-14 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          What Makes <span className="text-primary">WeTeachs</span> Unique?
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-10">
          Weteachs is the first platform that brings creators, learners, and
          experts together in one community. If you have a skill, talent, or
          knowledge — there’s someone out there looking to learn from you.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            "Skills and expertise",
            "Portfolio, videos, and content",
            "Socials and links",
            "Categories of lessons or services",
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Card className="border shadow-sm hover:shadow-md transition rounded-xl">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">
                    {item}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="px-6 md:px-16 py-14 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Why Choose <span className="text-primary">WeTeachs?</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Work Anywhere – All you need is Wi-Fi.",
            "Total Control – Set your own rates, schedule, and categories.",
            "Flexible Earnings – Offer 15-minute or hourly sessions.",
            "Unlimited Opportunities – Teach anything, anytime.",
            "Growing Community – Connect, collaborate, and grow.",
          ].map((text, i) => (
            <Card
              key={i}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-6 text-gray-700">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="px-6 md:px-16 py-14 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8">How Do I Earn?</h2>
        <ol className="space-y-4 text-gray-700 max-w-3xl mx-auto text-left list-decimal list-inside">
          <li>Create Your Profile – Sign up and set up your personal Expert page.</li>
          <li>
            Set Your Rates – Start at just $3 per 15-minute session and customize pricing.
          </li>
          <li>Add Your Categories – Organize what you teach, one skill or many.</li>
          <li>Get Hired – Students can instantly book short or long sessions.</li>
          <li>
            Grow Your Brand – Use forums, leaderboards, and groups to connect.
          </li>
        </ol>
        <p className="mt-8 text-gray-600 max-w-3xl mx-auto">
          Your profile works like your own business storefront — flexible,
          scalable, and completely yours.
        </p>
      </section>
      <section className="px-6 md:px-16 py-14 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Who Can Become an <span className="text-primary">Expert?</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            "Mentors & Coaches",
            "Freelancers & Professionals",
            "Creators & Artists",
            "Hobbyists & Enthusiasts",
            "Teachers & Instructors",
          ].map((role, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Card className="bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-6 font-semibold text-gray-800">
                  {role}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-gray-600 mt-8 max-w-3xl mx-auto">
          If you can help someone learn, improve, or grow — Weteachs is for you.
        </p>
      </section>

{!user && (
  <>
    <Separator className="my-10 max-w-4xl mx-auto" />
    <section className="px-6 md:px-16 py-20 text-center bg-primary text-white rounded-t-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold mb-4"
      >
        Start Teaching Today
      </motion.h2>
      <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
        Weteachs gives you the tools to share your skills, earn money, and
        build your reputation. Whether you’re looking for a side hustle or a
        full-time business — this is the place to start.
      </p>
      <Button
     
        size="lg"
        onClick={() => {
          setMenuOpen(false);
          window.open("/auth/signup", "_blank");
        }}
        variant="secondary"
        className="font-semibold text-primary bg-white hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl"
      >
        👉 Sign Up & Start Teaching
      </Button>
    </section>
  </>
)}
    </div>
  );
};

export default Page;
