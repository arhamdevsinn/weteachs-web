// @ts-nocheck
'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/lib/firebase/auth';
import { Button } from '../ui/button';
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import { toast } from "sonner";
import { UserProfileAPI } from "@/src/lib/api/userProfile";

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // ✅ Simple email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ✅ Frontend validation
    if (!email) {
      toast.error("Email is required!");
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address!");
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await AuthService.login(email, password);
      const userId = userCredential.user.uid;

      // ✅ Save userId to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", userId);
        // fetch logged-in user's profile and store usernameT (if present)
        try {
          const profileRes = await UserProfileAPI.getProfile(userId);
          const usernameFromProfile =
            profileRes?.teacherDetails?.usernameT ||
            profileRes?.teacher?.usernameT ||
            profileRes?.userProfile?.usernameT ||
            profileRes?.profile?.usernameT ||
            profileRes?.studentDetails?.usernameS ||
            null;
          if (usernameFromProfile) {
            localStorage.setItem("usernameT", usernameFromProfile);
          }
          console.log("Fetched and stored usernameT:", usernameFromProfile);
        } catch (err) {
          console.warn("Failed to fetch/store username after login:", err);
        }
      }
const usernameProfile = localStorage.getItem("usernameT") || "user";  
      toast.success("Login successful!");
      router.push(`/profile?name=${usernameProfile}`);
    } catch (err) {
      if (err.message?.includes("verify your email")) {
        toast.error("Please verify your email before logging in!");
        router.push("/auth/verify-email");
      } else {
        toast.error(err.message || "Login failed!");
      }
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        {/* Logo */}
        <div className="mb-4">
          <Image  priority={true}
            src="/logo.png"
            alt="WeTeaches Logo"
            width={80}
            height={80}
            className="mx-auto w-20 h-20 rounded-full"
          />
        </div>

        {/* Header Text */}
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome to WeTeachs</h1>
        <p className="text-sm text-gray-600 mb-6">You&apos;re Asking! We&apos;re Listening!</p>

        <form onSubmit={handleLogin} className="text-left">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-primary">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary/20"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-primary">Password</label>
              <a href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary/20"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="mr-2 accent-primary"
            />
            <label className="text-sm text-gray-700">Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-full font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Sign up and Footer */}
        <p className="mt-6 text-sm text-gray-700">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
        <p className="mt-2 text-sm font-medium text-primary">WeTeachs.com</p>
      </div>
    </div>
  );
}

export const Login = () => (
  <Suspense fallback={<div>Loading login...</div>}>
    <LoginForm />
  </Suspense>
);
