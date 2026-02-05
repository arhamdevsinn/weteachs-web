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
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import ChatIcon from "../ChatIcon";

const Header = () => {
   const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/teach", label: "Teach" },
    { href: "/learn", label: "Learn" },
    { href: "/about", label: "About" },
    { href: "/categories", label: "Explore" },
    ...(user ? [{ href: "/community", label: "Community" }] : []),
    // ...(user ? [{ href: "/categories", label: "Explore" }] : []),
    // ...(user ? [{ href: "/profile", label: "Profile" }] : []),
  ];

  return (

    <>
      {/* 🌈 Modern Glass Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/60 backdrop-blur-xl shadow-[0_1px_10px_rgba(0,0,0,0.05)] transition-all">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              
              <Image  priority={true}
                src="/logo.png"
                alt="logo"
                width={36}
                height={36}
                className="rounded-lg shadow-sm"
              />
            </motion.div>
            <h1 className="text-2xl font-bold bg-primary text-transparent bg-clip-text">
              WeTeachs
            </h1>
          </Link>

          {/* Middle: Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-all ${
                    active
                      ? "text-primary after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-primary"
                      : "text-black hover:text-primary hover:after:absolute hover:after:left-0 hover:after:bottom-[-6px] hover:after:w-full hover:after:h-[2px] hover:after:bg-primaary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth / User */}
          <div className="hidden md:flex items-center gap-3">
                   <Link href="/chat" aria-label="Open chat" className="flex items-center justify-center rounded-full p-2 hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-primary">
              <ChatIcon className="w-6 h-6 text-primary" />
            </Link>
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
        {/* <DropdownMenuItem
          onClick={() => handleNavigate("/edit-profile")}
          className="cursor-pointer"
        >
          Edit Profile
        </DropdownMenuItem> */}
        
      </DropdownMenuContent>
    </DropdownMenu>
    <Button variant="ghost" size="sm" className="text-sm flex items-center bg-primary text-white gap-2 hover:bg-red-50 hover:text-red-600" onClick={() => setShowConfirm(true)} disabled={loading} > <LogOut size={15} /> {loading ? "..." : "Logout"} </Button>
  </>
) : (
  <>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (window.location.href = "/auth/login")}
      className="flex items-center gap-2 hover:text-primary"
    >
      <LogIn size={15} />
      Login
    </Button>
    <Button
      size="sm"
      onClick={() => (window.location.href = "/auth/signup")}
      className="flex items-center gap-2 bg-primary text-white hover:opacity-90"
    >
      <UserPlus size={15} />
      Sign up
    </Button>
  </>
)}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* 📱 Mobile Navigation */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-lg py-4 px-6 space-y-2"
          >
            {navigationItems.map((item) => (
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
