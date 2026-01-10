// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { AuthService } from '@/src/lib/firebase/auth';

const isErrorWithMessage = (error: unknown): error is { message: string } =>
  typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string";

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🔸 Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agree) {
      setError('You must agree to the processing of personal data.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.signup(email, password);
      toast.success(res.message); // ✅ "Go to your email and verify first"
      router.push('/auth/verify-email');
    } catch (err) {
      setError(isErrorWithMessage(err) ? err.message : 'An unexpected error occurred.');
      toast.error(isErrorWithMessage(err) ? err.message : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center text-primary font-medium mb-4">
          <CircleArrowLeft onClick={() => router.back()} className="mr-2 text-xl cursor-pointer" />
          <span className="text-lg">Sign Up</span>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-1">You are almost done!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Continue with the details below to complete your setup.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-primary text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-200 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-primary text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-200 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-primary text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-200 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              I agree to the processing of Personal data
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-full font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <a href="/auth/login" className="text-green-700 font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
