"use client";

import React, {useState} from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";

const Page: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
      const { user, profile } = useAuth();

  const isLoggedIn = Boolean(user);
  const isTeacher = Boolean(profile?.isTeacher);
  const isStudent = isLoggedIn && !isTeacher;
    
  
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
      {!isLoggedIn && (
        <>
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
        </>
      )}

      {isStudent && (
        <section className="px-6 md:px-16 py-14 bg-gradient-to-b from-white via-emerald-50/30 to-cyan-50/40">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8">
                  <p className="text-sm font-semibold text-primary mb-3">For Students</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How Does It Work?</h2>
                  <p className="text-lg text-gray-700 mb-4">Getting help is simple.</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 font-medium">
                    <li>Ask a question</li>
                    <li>Choose a helper</li>
                    <li>Get a real answer-fast</li>
                  </ol>
                  <p className="text-gray-700 mt-4">No long-term commitments. No endless searching.</p>
                </CardContent>
              </Card>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-emerald-100 bg-white">
                <img src="/student.png" alt="Student asking for expert guidance" className="w-full h-full object-cover min-h-[320px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-emerald-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What Can You Ask?</h3>
                  <p className="text-gray-700 mb-3">You can ask about anything you need help with.</p>
                  <p className="text-gray-700 font-semibold mb-2">Common examples:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>"Why am I not losing weight?"</li>
                    <li>"How do I start boxing as a beginner?"</li>
                    <li>"Can you review my resume?"</li>
                    <li>"How do I stay consistent with the gym?"</li>
                    <li>"What&apos;s the best way to learn this skill?"</li>
                  </ul>
                  <p className="text-gray-700 mt-4">If someone out there knows it-you can ask it.</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-cyan-100 bg-gradient-to-br from-cyan-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Why Not Just Use Google or YouTube?</h3>
                  <p className="text-gray-700 mb-3">
                    Because they give you general answers, Weteachs gives you personalized answers.
                  </p>
                  <p className="text-gray-700 mb-2">Instead of watching multiple videos or reading articles, you can:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask your exact situation</li>
                    <li>Get a direct response</li>
                    <li>Save time and confusion</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 rounded-2xl shadow-lg border-green-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Who Are the Helpers?</h3>
                  <p className="text-gray-700 mb-3">Helpers are real people with experience in specific areas.</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Fitness coaches</li>
                    <li>Students and Graduates</li>
                    <li>Hobbyists and Specialists</li>
                  </ul>
                  <p className="text-gray-700 mt-4">People who&apos;ve already solved the problem you have.</p>
                  <p className="text-gray-700 mt-2">No bots. No generic responses.</p>
                  <p className="text-gray-700">Just real people helping you move forward.</p>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-green-100 bg-white">
                <img src="/help.jpeg" alt="Helper providing one-on-one support" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-amber-100 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">How Much Does It Cost?</h3>
                  <p className="text-gray-700">Each helper sets their own price.</p>
                  <p className="text-gray-700">Many questions start at just a few dollars.</p>
                  <p className="text-gray-700">You only pay for what you need no subscriptions required.</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-primary/20 bg-primary text-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold mb-3">Why Use Weteachs?</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/95">
                    <li>Get answers faster</li>
                    <li>Learn from real people</li>
                    <li>Skip the trial and error</li>
                    <li>Get help specific to YOU</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <CardContent className="p-8 md:p-10 text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Ask?</h3>
                <p className="text-white/90 text-lg">Stop searching. Start asking.</p>
                <p className="text-white/90">Get real answers from real people right when you need them.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {isTeacher && (
        <section className="px-6 md:px-16 py-14 bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <p className="text-sm font-semibold text-primary mb-3">For Experts & Teachers</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">How Do You Earn?</h2>
                  <p className="text-gray-700 mb-3">Getting started is simple.</p>
                  <p className="text-gray-700 mb-3">
                    Sign up for free and create your first category-this is how people find and hire you.
                  </p>
                  <p className="text-gray-700 mb-3">Think of a category as your skill or service. It can be anything:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Fitness advice</li>
                    <li>Cooking help</li>
                    <li>Boxing coaching</li>
                    <li>Resume reviews</li>
                    <li>Even hobbies like skateboarding</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    You can create multiple categories and customize each one with your own pricing, description, and focus.
                  </p>
                  <p className="text-gray-700 mt-2">The clearer your category, the easier it is for clients to choose you.</p>
                </CardContent>
              </Card>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white">
                <img src="/expert.png" alt="Expert profile and earning opportunities" className="w-full h-full object-cover min-h-[320px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">How Do You Get Paid?</h3>
                  <p className="text-gray-700">We use Stripe to handle all payments a secure and trusted platform used worldwide.</p>
                  <p className="text-gray-700 mt-2">To start earning, simply connect your Stripe account.</p>
                  <p className="text-gray-700 mt-3">Once connected:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>You can receive payments directly</li>
                    <li>Transactions are safe and reliable</li>
                    <li>Payouts are handled automatically</li>
                  </ul>
                  <p className="text-gray-700 mt-4">After setup, you&apos;re officially ready to get hired.</p>
                </CardContent>
              </Card>

              <div className="rounded-2xl overflow-hidden shadow-lg border border-indigo-100 bg-white">
                <img src="/creator.png" alt="Creator and payment setup visual" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 rounded-2xl shadow-lg border-orange-100">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What Do Helpers Do?</h3>
                  <p className="text-gray-700 mb-3">Helpers answer questions and give guidance based on their experience.</p>
                  <p className="text-gray-700 mb-3">People come to Weteachs when they want real answers from real people not generic advice.</p>
                  <p className="text-gray-700 font-semibold mb-2">Examples:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Someone struggling with their workout routine</li>
                    <li>Someone trying to improve their resume</li>
                    <li>Someone learning how to cook their first meal</li>
                    <li>Someone needing help starting a new skill</li>
                  </ul>
                  <p className="text-gray-700 mt-4">Instead of spending hours searching online, they can ask you directly.</p>
                  <p className="text-gray-700 mt-2">Your role is simple:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>Share what you know</li>
                    <li>Help someone move forward</li>
                    <li>Get paid for your time</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white">
                <img src="/how.png" alt="Teacher helping learners through categories" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-primary to-teal-600 text-white">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Tips to Get Hired Faster</h3>
                <ul className="list-disc list-inside space-y-2 text-white/95">
                  <li>Be specific with your category (clear beats broad)</li>
                  <li>Set a fair starting price</li>
                  <li>Add a short description of what you help with</li>
                  <li>Stay active and respond quickly</li>
                </ul>
                <p className="text-white/90 mt-4">The more helpful and clear you are, the more clients you&apos;ll attract.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;
