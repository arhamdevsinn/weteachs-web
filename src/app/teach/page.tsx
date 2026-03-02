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
      {/* <section className="px-6 md:px-16 py-20 text-center">
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
      </section> */}
      {/* ================= STEPS SECTION ================= */}
<section className="px-6 md:px-16 py-20 bg-gray-50">

  {/* STEP 1 */}
  <div className="bg-primary text-white rounded-lg p-6 mb-10">
    <h3 className="text-2xl font-bold">Step 1.</h3>
    <p className="text-lg font-semibold">Create your free account</p>
    <p className="text-white/80">Sign up in minutes</p>
  </div>

  {/* STEP 2 */}
  <div className="bg-primary text-white rounded-lg p-6 mb-10">
    <h3 className="text-2xl font-bold">Step 2.</h3>
    <p className="text-lg font-semibold">Start helping today!</p>
    <p className="text-white/80">
      Turn what you’re good at into income!
    </p>
  </div>

  {/* ACTION CARDS */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
    {[
      "Assist",
      "Mentor",
      "Tutor",
      "Guide",
      "Help",
      "Teach",
      "Advise",
      "More!",
    ].map((item, i) => (
      <div
        key={i}
        className="bg-secondary text-primary text-xl font-semibold rounded-xl p-10 text-center shadow-md hover:scale-105 transition"
      >
        {item}
      </div>
    ))}
  </div>
  {/* PROFILE PREVIEW CARD */}
  <div className="bg-white rounded-xl mx-auto w-96 shadow-md p-6 mb-14">
    <div className="rounded-lg mb-6 overflow-hidden flex items-center justify-center bg-green-200 ">
      <img
        src="/helper-categpry.jpg"
        alt="Helper Category"
        className="object-cover w-full h-full "
      />
      
    </div>

    <h4 className="text-xl font-bold text-green-700">
      Topic (Math)
    </h4>
    <p className="text-gray-600">Category (Education)</p>
    <p className="text-gray-600 mb-4">
      Description (I can help you with algebra)
    </p>

    <div className="flex justify-between text-sm text-gray-700">
      <span>$3 / 15min</span>
      <span>Expertise Level (Advanced)</span>
      <span>Helper Name</span>
    </div>
  </div>

  {/* STEP 3 */}
  <div className="bg-primary text-white rounded-lg p-6 mb-10">
    <h3 className="text-2xl font-bold">Step 3.</h3>
    <p className="text-lg font-semibold">Customize your profile</p>
    <p className="text-white/80">
      Stand out from the competition with a unique profile
    </p>
  </div>

  {/* IMAGES SECTION */}
  <div className="grid md:grid-cols-2 gap-8 mb-14">
    <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
      <img
        src="/help.jpeg"
        alt="Picture of a person"
        className="object-cover w-full h-full"
      />
    </div>

    <div className=" rounded-xl overflow-hidden flex items-center justify-center bg-green-200">
      <img
        src="/image.png"
        alt="Screenshot from web/app"
        className="object-cover w-full h-full"
      />
    </div>
  </div>

  {/* STEP 4 */}
  <div className="bg-primary text-white rounded-lg p-6">
    <h3 className="text-2xl font-bold">Step 4.</h3>
    <p className="text-lg font-semibold">GET HIRED!</p>
    <p className="text-white/80">
      The more Categories you have the better chance of getting hired
    </p>
  </div>

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
