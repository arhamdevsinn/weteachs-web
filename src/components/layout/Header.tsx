"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthService } from "@/src/lib/firebase/auth";
import { useAuth } from "@/src/hooks/useAuth";
import { Menu, X, LogOut, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  if (!user) return null;

  const navigationItems = [
    { href: "/profile", label: "Profile" },
    { href: "/home", label: "Home" },
    { href: "/teach", label: "Teach" },
    { href: "/learn", label: "Learn" },
    // { href: "/contact", label: "Contact" },
    { href: "/community", label: "Community" },
    { href: "/categories", label: "Explore" },
  ];

  return (
    <>
      <header className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-white via-blue-50 to-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md">
        {/* Logo */}
        <div className="text-3xl font-bold text-primary tracking-tight">
          WeTeachs
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative text-sm font-medium transition-all px-2 py-1 rounded-md ${
                pathname === item.href
                  ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary"
                  : "text-gray-600 hover:text-primary hover:bg-gray-100"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">
              {user.email ? user.email.split("@")[0] : "User"}
            </span>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 bg-primary"
            onClick={() => setShowConfirm(true)}
            disabled={loading}
          >
            <LogOut size={16} />
            {loading ? "..." : "Sign Out"}
          </Button>
        </div>
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-4 bg-white/90 backdrop-blur-md shadow-lg rounded-lg w-56 p-5 flex flex-col space-y-3 md:hidden z-50 border border-gray-100"
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {item.label}
              </a>
            ))}
            <hr className="my-2" />
            <div className="flex items-center gap-2 text-gray-700">
              <User size={16} className="text-primary" />
              <span className="text-sm">
                {user.email ? user.email.split("@")[0] : "User"}
              </span>
            </div>
            <Button
              onClick={() => {
                setMenuOpen(false);
                setShowConfirm(true);
              }}
              variant="destructive"
              size="sm"
              disabled={loading}
              className="mt-2 flex items-center gap-2"
            >
              <LogOut size={16} />
              {loading ? "..." : "Sign Out"}
            </Button>
          </motion.div>
        )}
      </header>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You’ll be redirected to the login page.
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
              className="px-4 bg-primary"
            >
              {loading ? "Signing Out..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
