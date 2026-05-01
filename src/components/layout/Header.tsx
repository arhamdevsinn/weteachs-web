// @ts-nocheck
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/src/lib/firebase/auth";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Bell,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const storedId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") ||
      localStorage.getItem("userId") ||
      user?.uid ||
      null
      : null;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  const mainNavigationItems = [
    { href: "/categories", label: "Find Experts" },
    { href: "/teach", label: "Become an Expert" },
    { href: "/about", label: "How it works" },
  ];

  const categoryItems = [
    { href: "/categories?category=education", label: "Education" },
    { href: "/fitness", label: "Fitness" },
    { href: "/categories?category=business", label: "Business" },
    { href: "/categories?category=art", label: "Art" },
    { href: "/categories?category=technology", label: "Technology" },
    { href: "/categories?category=finance", label: "Finance" },
  ];

  return (

    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.18)]">
        <div className="flex h-[68px] items-center justify-between border-b border-gray-200 px-4 lg:px-6">
          {/* Left side: Hamburger (mobile only) + Logo */}
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              className="p-1 text-primary hover:bg-gray-100 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
            </button>
            <Link href="/" className="flex shrink-0 items-center">
              <span className="text-[26px] lg:text-[30px] font-medium tracking-normal text-primary">
                Weteachs
              </span>
            </Link>
          </div>

          {/* Middle: Search Form (Desktop only) */}
          <form
            action="/categories"
            className="hidden h-[36px] w-[350px] shrink-0 items-stretch overflow-hidden rounded-[3px] border border-gray-300 bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] lg:flex mx-4"
          >
            <input
              name="q"
              aria-label="Search"
              placeholder="What do you need help with?"
              className="min-w-0 flex-1 px-3 text-[13px] font-semibold text-gray-800 outline-none placeholder:text-gray-800"
            />
            <button
              type="submit"
              aria-label="Search experts"
              className="flex w-[40px] items-center justify-center bg-primary text-white"
            >
              <span className="sr-only">Search</span>
            </button>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {mainNavigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-center text-[14px] font-extrabold leading-tight text-black transition-colors hover:text-primary ${active ? "text-primary" : ""
                    }`}
                >
                  <span className="block whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side: Mobile "Sign up" */}
          <div className="flex items-center lg:hidden">
            {!user ? (
              <Link href="/auth/signup" className="text-[22px] font-medium text-primary">
                Sign up
              </Link>
            ) : <div></div>
              // (
              //   <button
              //     onClick={() => router.push("/notifications")}
              //     className="flex p-2 items-center justify-center rounded-full text-primary hover:bg-gray-100"
              //   >
              //     <Bell size={26} strokeWidth={1.5} />
              //   </button>
              // )
            }
          </div>

          {/* Desktop Actions */}
          <div className="ml-5 hidden items-center gap-4 lg:flex">
            <Link
              href="/chat"
              aria-label="Open chat"
              className="flex h-[31px] w-[31px] items-center justify-center rounded-[3px] border border-gray-200 text-gray-400 transition hover:border-primary hover:text-primary"
            >
              <MessageSquare size={22} strokeWidth={1.4} />
            </Link>
            {user && (
              <button
                onClick={() => router.push("/notifications")}
                className="flex h-[31px] w-[31px] items-center justify-center rounded-[3px] text-primary hover:bg-gray-100"
              >
                <Bell className="h-5 w-5 text-primary" />
              </button>
            )}
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-primary text-sm font-medium cursor-pointer hover:bg-blue-100 transition">
                    <User size={16} />
                    <span>{user?.email?.split("@")[0] || "User"}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => handleNavigate("/profile")}
                      className="cursor-pointer"
                    >
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/stripe?userId=${encodeURIComponent(storedId || "")}`)}
                      className="cursor-pointer"
                    >
                      Payments
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-primary text-sm text-white hover:bg-secondary hover:text-primary" onClick={() => setShowConfirm(true)} disabled={loading}>
                  <LogOut size={15} /> {loading ? "..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/auth/login")}
                  className="whitespace-nowrap text-[14px] font-extrabold text-black hover:text-primary"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = "/auth/signup")}
                  className="h-[34px] rounded-[8px] border-2 border-primary px-2 text-[24px] font-black leading-none text-primary shadow-[0_0_0_1px_rgba(34,84,47,0.12)] hover:bg-primary hover:text-white"
                >
                  Join
                </button>
              </>
            )}
          </div>
        </div>

        <nav className="hidden h-[34px] items-center justify-around border-b border-gray-200 bg-white px-8 md:flex">
          {categoryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-extrabold text-gray-600 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-[100] bg-black/60 lg:hidden"
              />

              {/* Slide-in Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-[101] flex w-[85%] max-w-[360px] flex-col bg-white shadow-2xl lg:hidden"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#22542F] text-[15px] font-black tracking-tighter text-white">
                      WT
                    </div>
                    <span className="text-[26px] font-black text-[#22542F]">
                      WeTeachs
                    </span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border-2 border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3.5 text-[17px] font-bold transition ${pathname === "/" || pathname === ""
                      ? "bg-[#E8ECE4] text-[#22542F]"
                      : "text-[#333333] hover:bg-gray-50"
                      }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3.5 text-[17px] font-bold transition ${pathname === "/about"
                      ? "bg-[#E8ECE4] text-[#22542F]"
                      : "text-[#333333] hover:bg-gray-50"
                      }`}
                  >
                    Helper
                  </Link>
                  <Link
                    href="/learn"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3.5 text-[17px] font-bold transition ${pathname.startsWith("/learn")
                      ? "bg-[#E8ECE4] text-[#22542F]"
                      : "text-[#333333] hover:bg-gray-50"
                      }`}
                  >
                    Clients
                  </Link>
                  <Link
                    href="/teach"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3.5 text-[17px] font-bold transition ${pathname === "/teach"
                      ? "bg-[#E8ECE4] text-[#22542F]"
                      : "text-[#333333] hover:bg-gray-50"
                      }`}
                  >
                    Learn
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3.5 text-[17px] font-bold transition ${pathname === "/categories"
                      ? "bg-[#E8ECE4] text-[#22542F]"
                      : "text-[#333333] hover:bg-gray-50"
                      }`}
                  >
                    Explore
                  </Link>
                </div>

                {/* Drawer Footer Actions */}
                <div className="border-t border-gray-100 p-5">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-6 text-[16px] font-bold text-black"
                        onClick={() => {
                          setMenuOpen(false);
                          handleNavigate("/profile");
                        }}
                      >
                        <User size={20} />
                        My Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-6 text-[16px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setMenuOpen(false);
                          setShowConfirm(true);
                        }}
                      >
                        <LogOut size={20} />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          window.location.href = "/auth/login";
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3.5 text-[17px] font-bold text-black transition hover:bg-gray-50"
                      >
                        <LogIn size={20} strokeWidth={2.5} />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          window.location.href = "/auth/signup";
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B6BF9] py-3.5 text-[17px] font-bold text-white transition hover:opacity-90"
                      >
                        <UserPlus size={20} strokeWidth={2.5} />
                        Sign up
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* 🧩 Logout Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              You’ll be redirected to the login page after signing out.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={loading}
              className="px-4 bg-red-500 hover:bg-red-600"
            >
              {loading ? "Signing out..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
