'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/src/lib/firebase/auth';
import { UrlUtils } from '@/src/utils/urlUtils';
import { Suspense } from 'react';

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
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get('redirect') || '/profile';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await AuthService.login(email, password);
      const userId = userCredential.user.uid;
      const finalUrl = UrlUtils.addUserIdToUrl(redirectPath, userId);
      router.push(finalUrl);
    } catch (err: unknown) {
      setError(isErrorWithMessage(err) ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        {/* Logo */}
        <div className="mb-4">
          <img
            src="/logo.png" // Update this to your actual logo path
            alt="WeTeaches Logo"
            className="mx-auto w-20 h-20 rounded-full"
          />
        </div>

        {/* Header Text */}
        <h1 className="text-2xl font-bold text-green-800 mb-1">Welcome to WeTeachs</h1>
        <p className="text-sm text-gray-600 mb-6">You're Asking! We're Listening!</p>

        <form onSubmit={handleLogin} className="text-left">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-green-800">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-green-800">Password</label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
            </div>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            className="w-full bg-primary text-white py-2 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

      {redirectPath !== '/dashboard' && (
        <p className="mt-4 text-sm text-gray-600">
          After login, you&apos;ll be redirected to your intended page.
        </p>
      )}

        </form>

        {/* Sign up and Footer */}
        <p className="mt-6 text-sm text-gray-700">
          Don’t have an account? <a href="/auth/signup" className="text-primary font-medium hover:underline">Sign up</a>
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
