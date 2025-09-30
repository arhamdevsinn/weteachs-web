"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthService } from "@/src/lib/firebase/auth";
import { useAuth } from "@/src/hooks/useAuth";
import { Menu, X } from "lucide-react"; // icons

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      window.location.href = "/auth/login"; // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show navigation for non-authenticated users
  }

  const navigationItems = [
    { href: "/profile", label: "Profile" },
    { href: "/about", label: "About" },
    { href: "/expert", label: "Teach" },
    { href: "/student", label: "Learn" },
    { href: "/community", label: "Community" },
    { href: "/categories", label: "Explore" },
  ];

  return (
    <header className="w-full p-4 flex items-center justify-between shadow-sm border-b">
      {/* Logo */}
      <div className="text-3xl font-bold text-primary flex items-center gap-2">
        WeTeachs
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8">
        {navigationItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-primary text-secondary"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* User + Logout (always visible) */}
      <div className="hidden md:flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Hi, {user.email ? user.email.split("@")[0].trim() : ""}
        </span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary hover:text-black disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Sign Out"}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-48 p-4 flex flex-col space-y-3 md:hidden z-50">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary text-secondary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </a>
          ))}
          <hr />
          <span className="text-sm text-gray-600">
            Hi, {user.email ? user.email.split("@")[0].trim() : ""}
          </span>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary hover:text-black disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Sign Out"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
