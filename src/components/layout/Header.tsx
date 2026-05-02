// @ts-nocheck
"use client";
import Image from "next/image";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q) {
      router.push(`/categories/${encodeURIComponent(q.trim().toLowerCase())}`);
    }
  };

  const mainNavigationItems = [
    { href: "/categories", label: "Find Experts" },
    { href: "/teach", label: "Become an Expert" },
    { href: "/about", label: "How it works" },
  ];

  const categoryItems = [
    { href: "/categories/education", label: "Education" },
    { href: "/categories/fitness", label: "Fitness" },
    { href: "/categories/business", label: "Business" },
    { href: "/categories/art", label: "Art" },
    { href: "/categories/technology", label: "Technology" },
    { href: "/categories/finance", label: "Finance" },
  ];

  return (

    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.18)]">
        <div className="flex h-[68px] items-center justify-between border-b border-gray-200 px-4 lg:px-6">
          {/* Left side: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-4">
            <button
              className="p-1 text-primary hover:bg-gray-100 lg:hidden transition-colors rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} strokeWidth={2} /> : <Menu size={28} strokeWidth={2} />}
            </button>

            <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative h-8 w-8 lg:h-9 lg:w-9 shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="WeTeachs Logo"
                  fill
                  className="object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                  priority
                />
              </motion.div>
              <h1 className="text-xl lg:text-2xl font-bold bg-primary text-transparent bg-clip-text">
                WeTeachs
              </h1>
            </Link>
          </div>
          {/* <div className="flex items-center gap-3 lg:gap-8">
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
          </div> */}

          {/* Middle: Search Form (Desktop only) */}
          <form
            onSubmit={handleSubmit}
            className="hidden lg:flex items-center w-[420px] mx-4 px-2 py-1 rounded-xl 
             bg-white border border-gray-200 
             shadow-[0_2px_12px_rgba(0,0,0,0.06)] 
             focus-within:ring-2 focus-within:ring-primary/20 
             transition-all duration-300"
          >
            {/* Search Icon */}


            {/* Input */}
            <input
              name="q"
              aria-label="Search"
              placeholder="What do you need help with?"
              className="flex-1 bg-transparent px-3 py-1 text-[13px] text-gray-700 
               placeholder:text-gray-400 outline-none"
            />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* Button */}
            <button
              type="submit"
              className="ml-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[13px] font-semibold
               shadow-sm hover:bg-primary/90 hover:shadow-md 
               active:scale-95 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
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
                  className="whitespace-nowrap text-[14px] font-bold text-gray-700 hover:text-primary transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = "/auth/signup")}
                  className="h-[36px] rounded-lg border border-primary px-5 text-[14px] font-bold text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Join
                </button>
              </>
            )}
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="hidden h-[52px] items-center justify-center gap-3 border-b border-gray-100 bg-white px-8 md:flex">
          {categoryItems.map((item) => {
            // Check if current category is active
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-5 py-2 text-[14px] font-bold tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap rounded-full ${isActive
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(34,84,47,0.2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
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
