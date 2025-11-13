// "use client";

// import React, { useState, useEffect } from "react";
// import { AuthService } from "@/src/lib/firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/src/lib/firebase/config";
// import { useRouter } from "next/navigation";
// import { Button } from "@/src/components/ui/button";
// import { toast } from "sonner";

// const VerifyEmailPage = () => {
//    const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [checking, setChecking] = useState(true);

//   // 🔄 Check if user becomes verified
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // Periodically refresh user's status
//         const interval = setInterval(async () => {
//           await user.reload();
//           if (user.emailVerified) {
//             clearInterval(interval);
//             toast.success("Email verified successfully!");
//             localStorage.removeItem("pending_verification_email");
//             localStorage.removeItem("pending_verification_password");
//             router.push("/profile"); // ✅ redirect to profile page
//           }
//         }, 3000); // check every 3 seconds

//         return () => clearInterval(interval);
//       } else {
//         setChecking(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

// const [cooldown, setCooldown] = useState(0);

// const handleResendEmail = async () => {
//   if (cooldown > 0) return;

//   setLoading(true);
//   try {
//     await AuthService.resendVerificationEmail();
//     toast.success("Verification email has been re-sent. Please check your inbox.");
//     setCooldown(60);
//   } catch (error: any) {
//     toast.error(error.message || "Failed to resend verification email.");
//   } finally {
//     setLoading(false);
//   }
// };

// // Countdown timer
// useEffect(() => {
//   if (cooldown > 0) {
//     const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
//     return () => clearTimeout(timer);
//   }
// }, [cooldown]);


//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full flex flex-col items-center">
//         <svg
//           className="mb-6 text-primary"
//           width={64}
//           height={64}
//           fill="none"
//           viewBox="0 0 64 64"
//         >
//           <rect width="64" height="64" rx="16" fill="#D1FAE5" />
//           <path
//             d="M16 24v16a4 4 0 004 4h24a4 4 0 004-4V24M16 24l16 12 16-12"
//             stroke="#059669"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>

//         <h1 className="text-2xl font-bold text-green-900 mb-2">
//           Verify Your Email
//         </h1>

//         <p className="text-gray-700 text-center mb-6">
//           Please check your email inbox and click the verification link to
//           activate your account.
//         </p>
// <div className="w-full flex justify-between items-center gap-2  ">
// <Button
//           onClick={(e) => {
//             e.preventDefault();
//             window.open("https://mail.google.com/mail", "_blank");
//           }}
//           className=" w-[50%] bg-secondary border-1 text-xs border-primary text-primary hover:text-white rounded-sm shadow hover:bg-primary transition "
//         >
//           Go to Gmail
//         </Button>

//         {/* <Button
//           onClick={handleResendEmail}
//           disabled={loading}
//           className="w-[50%] bg-primary text-xs text-white rounded-sm hover:bg-secondary hover:border-1 hover:border-primary hover:text-primary"
//         >
//           {loading ? "Resending..." : "Resend Verification Email"}
//         </Button> */}
//         <Button disabled={loading || cooldown > 0} onClick={handleResendEmail}
//             className="w-[50%] bg-primary text-xs text-white rounded-sm hover:bg-secondary hover:border-1 hover:border-primary hover:text-primary"
//           >
//   {loading ? "Resending..." : cooldown > 0 ? `Wait ${cooldown}s` : "Resend Verification Email"}
// </Button>

// </div>
//         <p className="text-xs text-gray-500 text-center mt-3">
//           Didn’t receive the email? Check your spam folder or resend it again
//           above.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmailPage;
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import { AuthService } from "@/src/lib/firebase/auth";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<number | null>(null);

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
      if (origin === "signup") router.push("/auth/login");
      else router.push("/profile");
      return true;
    }
    return false;
  };

  useEffect(() => {
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

    window.addEventListener("focus", checkVerification);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) checkVerification();
    });

    return () => {
      unsubscribe();
      stopPolling();
      window.removeEventListener("focus", checkVerification);
    };
  }, []);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await AuthService.resendVerificationEmail();
      toast.success("📨 Verification email re-sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
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
