// @ts-nocheck
"use client";
import React, { useState, Suspense } from "react";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { Switch } from "@/src/components/ui/switch";
import { Input } from "@/src/components/ui/input";
import { Search, ArrowLeft, Heart, MessageSquare, Eye } from "lucide-react";
import CommunityPost from "@/src/components//community/CommunityPost";
import { Skeleton } from "@/src/components/ui/skeleton";

const CommunityPage = () => {
  // const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("questions");
    const router = useRouter();
  const { user } = useAuth();

  return (
    <>
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
        {/* <div className="max-w-lg mx-auto flex items-center justify-between text-gray-700">
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
        </div> */}

        {/* Tabs */}
        <div className="max-w-lg mx-auto flex gap-4 justify-center mt-6">
            <Button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-4 rounded-full font-medium text-base transition-all ${
              activeTab === "questions"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary border border-primary hover:bg-primary/5"
            }`} >
            Questions
          </Button>
          {/* <Button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-4 rounded-full font-medium text-base transition-all ${
              activeTab === "groups"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary border border-primary hover:bg-primary/5"
            }`}
          >
            Groups
          </Button> */}
        </div>

        {/* Community Posts */}
        {/* <div className="grid gap-6 mt-8">
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
        </div> */}
          <Suspense
            fallback={
              <div className="min-h-[400px] w-full max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-1/3 rounded-md" />
                  <div className="w-20" />
                </div>
                <div className="max-w-lg mx-auto flex items-center gap-3 bg-white rounded-2xl shadow-md px-5 py-3 border border-gray-200">
                  <Search className="text-primary" />
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-4 w-1/2 rounded-md" />
                          <Skeleton className="h-3 w-2/3 rounded-md" />
                          <Skeleton className="h-10 w-40 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <CommunityPost />
          </Suspense>
       </div>
     </section>    
     </>
   );
 };
 
 export default CommunityPage;
