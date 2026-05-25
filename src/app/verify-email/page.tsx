// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import { AuthService } from "@/src/lib/firebase/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";

type VerificationDialogState = "idle" | "verifying" | "verified" | "error";
type ResetPasswordState = "idle" | "checking" | "ready" | "success" | "error";

const VerifyEmailPage = () => {
   const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState<VerificationDialogState>("idle");
  const [resetState, setResetState] = useState<ResetPasswordState>("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const pollRef = useRef<number | null>(null);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle Firebase action links via oobCode.
  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    const mode = searchParams.get("mode");

    if (oobCode) {
      const handleActionCode = async () => {
        try {
          if (mode === "resetPassword") {
            setResetState("checking");
            const email = await verifyPasswordResetCode(auth, oobCode);
            setResetEmail(email);
            setResetState("ready");
            return;
          }

          if (mode && mode !== "verifyEmail") {
            setDialogState("error");
            toast.error("This account action is not supported.");
            return;
          }

          setDialogState("verifying");
          await applyActionCode(auth, oobCode);

          // Keep a visible "verifying" state for at least ~2s for better UX.
          await sleep(2200);

          setDialogState("verified");
          toast.success("✅ Email verified successfully!");

          // Keep success state visible briefly before redirect.
          await sleep(2200);

          const origin = localStorage.getItem("pending_origin");
          localStorage.removeItem("pending_verification_email");
          localStorage.removeItem("pending_verification_password");
          localStorage.removeItem("pending_origin");
      
          if (origin === "signup") router.push("/auth/login");
          else router.push("/profile");
        } catch (err) {
          console.error("Firebase action link failed:", err);

          if (mode === "resetPassword") {
            setResetState("error");
            toast.error("❌ Password reset link is invalid or expired. Please request a new one.");
          } else {
            setDialogState("error");
            toast.error("❌ Verification link is invalid or expired. Please request a new one.");
          }
        }
      };

      handleActionCode();
    }
  }, [searchParams, router]);

  const handleResetPassword = async () => {
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      toast.error("Password reset link is missing a code.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setResetState("success");
      toast.success("Password reset successfully. Please log in.");
      await sleep(1400);
      router.push("/auth/login");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Could not reset password. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  const checkVerification = async () => {
    let user = auth.currentUser;

    // If no user logged in, try restoring session
    if (!user) {
      const email = localStorage.getItem("pending_verification_email");
      const password = localStorage.getItem("pending_verification_password");
      if (email && password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          user = userCredential.user;
        } catch {
          return false;
        }
      } else {
        return false;
      }
    }

    // Reload user to check verification status
    await user.reload();
    if (user.emailVerified) {
      toast.success("✅ Email verified successfully!");
      const origin = localStorage.getItem("pending_origin");
      localStorage.removeItem("pending_verification_email");
      localStorage.removeItem("pending_verification_password");
      localStorage.removeItem("pending_origin");

      // Redirect based on origin
      if (origin === "signup"||!userId) router.push("/auth/login");
      else router.push("/profile");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (searchParams.get("oobCode")) return;

    const startPolling = () => {
      if (pollRef.current) return;
      checkVerification();
      pollRef.current = window.setInterval(checkVerification, 3000);
    };

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) startPolling();
      else stopPolling();
    });

    const handleVisibilityChange = () => {
      if (!document.hidden) checkVerification();
    };

    window.addEventListener("focus", checkVerification);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unsubscribe();
      stopPolling();
      window.removeEventListener("focus", checkVerification);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [searchParams]);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await AuthService.resendVerificationEmail();
      toast.success("📨 Verification email re-sent! Check your inbox.");
    } catch (error) {
      toast.error(error.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  if (searchParams.get("mode") === "resetPassword") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full flex flex-col items-center">
          <svg className="mb-6 text-primary" width={64} height={64} fill="none" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#D1FAE5" />
            <path
              d="M22 30V24a10 10 0 0120 0v6M20 30h24v18H20V30z"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1 className="text-2xl font-bold text-green-900 mb-2">Reset Password</h1>

          {resetState === "checking" && (
            <p className="text-gray-700 text-center">Checking your reset link...</p>
          )}

          {resetState === "error" && (
            <>
              <p className="text-gray-700 text-center mb-6">
                This password reset link is invalid or expired. Please request a new one.
              </p>
              <Button
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full bg-primary text-white rounded-sm"
              >
                Request New Reset Link
              </Button>
            </>
          )}

          {resetState === "success" && (
            <p className="text-gray-700 text-center">Your password was reset. Redirecting to login...</p>
          )}

          {resetState === "ready" && (
            <div className="w-full">
              <p className="text-gray-700 text-center mb-6">
                Create a new password for {resetEmail || "your account"}.
              </p>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-3"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-5"
              />
              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-primary text-white rounded-sm hover:bg-secondary hover:border-1 hover:border-primary hover:text-primary"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      {(dialogState === "verifying" || dialogState === "verified") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              {dialogState === "verifying" ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 7L10 17L4 11"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <h2 className="text-lg font-semibold text-green-900">
              {dialogState === "verifying" ? "Verifying..." : "Successfully Verified"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {dialogState === "verifying"
                ? "Please wait while we confirm your email address."
                : "Your email is verified. Redirecting you now..."}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full flex flex-col items-center">
        <svg className="mb-6 text-primary" width={64} height={64} fill="none" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#D1FAE5" />
          <path
            d="M16 24v16a4 4 0 004 4h24a4 4 0 004-4V24M16 24l16 12 16-12"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h1 className="text-2xl font-bold text-green-900 mb-2">Verify Your Email</h1>

        <p className="text-gray-700 text-center mb-6">
          Please check your email inbox and click the verification link.
          This page will detect it automatically and redirect you.
        </p>
 <div className="w-full flex justify-between items-center gap-2  ">
           <Button
            onClick={(e) => {
              e.preventDefault();
              window.open("https://mail.google.com/mail", "_blank");
            }}
            className=" w-[50%] bg-secondary border-1 text-xs border-primary text-primary hover:text-white rounded-sm shadow hover:bg-primary transition "
          >
            Go to Gmail
          </Button> 

        <Button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-[50%] bg-primary text-xs text-white rounded-sm hover:bg-secondary hover:border-1 hover:border-primary hover:text-primary"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </Button>
      </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Once verified, you’ll be redirected automatically.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
