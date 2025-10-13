// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleArrowLeft } from 'lucide-react';
import { AuthService } from '@/src/lib/firebase/auth'; // Adjust if needed

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
};

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
      await AuthService.signup(email, password);
      router.push('/create-profile'); // or redirect to login
    } catch (err: unknown) {
      setError(isErrorWithMessage(err) ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        {/* Back and Title */}
        <div className="flex items-center text-primary font-medium mb-4">
      <CircleArrowLeft
     onClick={() => router.back()}
     className="mr-2 text-xl"
     />
          <span className="text-lg">Sign up</span>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-primary mb-1">You are almost done!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Continue with the details below to complete your setup.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp}>

          <div className="mb-4">
            <label className="block text-primary text-sm font-medium mb-1">Sign up</label>
            <input
              type="email"
              placeholder="Email Address"
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
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <a href="/auth/login" className="text-green-700 font-medium hover:underline">Signin</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
