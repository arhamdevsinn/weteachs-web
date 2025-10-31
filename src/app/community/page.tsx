"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { Switch } from "@/src/components/ui/switch";
import { Input } from "@/src/components/ui/input";
import { Search, ArrowLeft, Heart, MessageSquare, Eye } from "lucide-react";

const CommunityPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("questions");
    const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      {user ? (
      <section className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
        
          <h1 className="flex-1 text-center text-4xl font-bold text-primary tracking-tight">
            Community Zone
          </h1>
          <div className="w-20" /> {/* spacer for centering */}
        </div>

        {/* Description */}
        <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
          Get help with your questions or engage with the{" "}
          <span className="text-primary font-semibold">
            Experts & Students
          </span>{" "}
          in our growing learning community.
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto flex items-center gap-3 bg-white rounded-2xl shadow-md px-5 py-3 border border-gray-200">
          <Search className="text-primary" />
          <Input
            placeholder="Search community posts..."
            className="border-none shadow-none focus-visible:ring-0 text-gray-700"
          />
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/90 text-white rounded-full"
          >
            ➤
          </Button>
        </div>

        {/* Filters */}
        <div className="max-w-lg mx-auto flex items-center justify-between text-gray-700">
          <div className="flex gap-6 font-medium">
            <button className="hover:text-primary transition-colors"
            onClick={() => router.push('/community/leader-board')}>
              Leaderboard
            </button>
            <button className="hover:text-primary transition-colors"
            onClick={() => router.push('/community/news')}>
              News
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show active</span>
            <Switch
              defaultChecked
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto flex gap-4 justify-center mt-6">
          <Button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-4 rounded-full font-medium text-base transition-all ${
              activeTab === "questions"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary border border-primary hover:bg-primary/5"
            }`}
          >
            Questions
          </Button>
          <Button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-4 rounded-full font-medium text-base transition-all ${
              activeTab === "groups"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary border border-primary hover:bg-primary/5"
            }`}
          >
            Groups
          </Button>
        </div>

        {/* Community Posts */}
        <div className="grid gap-6 mt-8">
            <Card
              className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Community"
                    width={45}
                    height={45}
                    className="rounded-full border border-primary/40"
                  />
                  <div>
                    <h3 className="font-semibold text-primary">
                      Community Post
                    </h3>
                    <p className="text-sm text-gray-500">
                      Posted 4 months ago
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  Any questions for us? Feel free to ask here and connect with
                  others.
                </p>

                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> 7
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> 1
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> 1
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/community/community-post")}
                    className="rounded-full border-primary text-primary hover:bg-primary/10"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
      ) : (
        <div className="min-h-screen bg-secondary">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  One App. <span className="text-primary">Every Creator.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Turn knowledge into your sessions. Connect with experts
                  through video, audio, or chat sessions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left column */}
                <div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                      Create a Team
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Build a team with experts to get the knowledge you need
                      from the comfort of your home.
                    </p>
                    <Button
                      size="lg"
                      onClick={() =>
                        window.open("/auth/signup", "_blank", "noopener,noreferrer")
                      }
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Create
                    </Button>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-primary mb-4">Earn</h2>
                    <p className="text-gray-600 mb-6">
                      Share your expertise and earn income by teaching others
                      what you know best.
                    </p>
                    <Button
                      size="lg"
                      onClick={() =>
                        window.open("/auth/signup", "_blank", "noopener,noreferrer")
                      }
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Start Earning
                    </Button>
                  </div>
                </div>

                {/* Right column */}
                <div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">Learn</h2>
                    <p className="text-gray-600 mb-6">
                      Browse experts in any field and book sessions to get help,
                      learn new skills, or get answers on your schedule.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.open("/learn")}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Explore Learning
                    </Button>
                  </div>

                  <div className="bg-primary p-8 rounded-2xl shadow-lg text-white">
                    <h2 className="text-2xl font-bold mb-4">
                      All your content in one place
                    </h2>
                    <p className="mb-6 opacity-90">
                      Manage all your community content seamlessly. Share
                      knowledge across multiple platforms with your students.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.open("/learn")}
                      className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
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
              <h2 className="text-3xl font-bold mb-6">
                Looking for reliable help?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto">
                Connect with experts in any field and book sessions to get help,
                learn new skills, or chat on your schedule.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 max-w-md">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    Learn as a Student
                  </h3>
                  <p className="mb-6">
                    Browse experts in any field and book their sessions to get
                    help, learn new skills, or get answers on your schedule.
                  </p>
                  <Button
                    size="lg"
                    onClick={() =>
                      window.open("/auth/signup", "_blank", "noopener,noreferrer")
                    }
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Join as Student
                  </Button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 max-w-md">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    Teach as an Expert
                  </h3>
                  <p className="mb-6">
                    Share your knowledge, create content, and earn income by
                    teaching others what you know best.
                  </p>
                  <Button
                    size="lg"
                    onClick={() =>
                      window.open("/auth/signup", "_blank", "noopener,noreferrer")
                    }
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Join as Expert
                  </Button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto text-gray-800">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  About Our Community
                </h3>
                <p className="mb-6">
                  Our platform brings together creators and learners in a vibrant
                  community where knowledge is shared through video, audio, and
                  chat sessions. Whether you&apos;re looking to learn new skills or
                  share your expertise, we provide the tools you need to succeed.
                </p>
                <Button
                  size="lg"
                  onClick={() =>
                    window.open("/auth/signup", "_blank", "noopener,noreferrer")
                  }
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full"
                >
                  Discover Our Community
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default CommunityPage;
