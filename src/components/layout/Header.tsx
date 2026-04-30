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
import { motion } from "framer-motion";

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
    { href: "/categories", label: "Find Experts",  },
    { href: "/teach", label: "Become an Expert",  },
    { href: "/about", label: "How it works", },
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
        <div className="flex h-[68px] items-center border-b border-gray-200 px-5 lg:px-6">
          <Link href="/" className="mr-8 flex shrink-0 items-center">
            <span className="text-[30px] font-black leading-none tracking-normal text-primary [text-shadow:0_1px_1px_rgba(0,0,0,0.2)]">
              WeTeachs
            </span>
          </Link>

          <form
            action="/categories"
            className="hidden h-[36px] w-[350px] shrink-0 items-stretch overflow-hidden rounded-[3px] border border-gray-300 bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] md:flex"
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

          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {mainNavigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-center text-[14px] font-extrabold leading-tight text-black transition-colors hover:text-primary ${
                    active
                      ? "text-primary"
                      : ""
                  }`}
                >
                  <span className="block whitespace-nowrap">{item.label}</span>
                  <span className="block whitespace-nowrap text-[14px] font-extrabold text-red-500">
                    {item.helper}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-5 hidden items-center gap-4 md:flex">
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
        {/* <DropdownMenuItem
          onClick={() => handleNavigate("/edit-profile")}
          className="cursor-pointer"
        >
          Edit Profile
        </DropdownMenuItem> */}
        
      </DropdownMenuContent>
    </DropdownMenu>
    <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-primary text-sm text-white hover:bg-red-50 hover:text-red-600" onClick={() => setShowConfirm(true)} disabled={loading} > <LogOut size={15} /> {loading ? "..." : "Logout"} </Button>
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

          <button
            className="ml-auto rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-100 bg-white px-6 py-4 shadow-lg lg:hidden"
          >
            <form action="/categories" className="mb-4 flex h-10 overflow-hidden rounded border border-gray-300">
              <input
                name="q"
                aria-label="Search"
                placeholder="What do you need help with?"
                className="min-w-0 flex-1 px-3 text-sm font-semibold outline-none"
              />
              <button type="submit" className="w-11 bg-primary" aria-label="Search experts" />
            </form>

            {[...mainNavigationItems, ...categoryItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-blue-100 text-primary"
                    : "text-gray-700 hover:bg-blue-50 hover:text-primary"
                }`}
              >
                {item.label}
                {"helper" in item && (
                  <span className="ml-1 text-xs font-bold text-red-500">{item.helper}</span>
                )}
              </Link>
            ))}

            <hr className="my-3 border-gray-200" />

            {user ? (
              <>
               <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
       
          <User size={16} />
          <span className="text-sm">{user?.email || "Account"}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleNavigate("/profile")}
          className="cursor-pointer"
        >
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigate("/edit-profile")}
          className="cursor-pointer"
        >
          Edit Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowConfirm(true);
                  }}
                >
                  <LogOut size={15} className="mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/auth/login";
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <LogIn size={15} className="mr-1" /> Login
                </Button>
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/auth/signup";
                  }}
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-indigo-500 text-white"
                >
                  <UserPlus size={15} className="mr-1" /> Sign up
                </Button>
              </>
            )}
          </motion.div>
        )}
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
