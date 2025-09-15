"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const ForgotPassword = () => {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      router.push("/auth/login");
      setEmail(""); // clear input
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-96 mx-auto">
               <div className="mb-4">
                  <Image
                    src="/logo.png" // Update this to your actual logo path
                    alt="WeTeaches Logo"
                    width={80}
                    height={80}
                    className="mx-auto w-20 h-20 rounded-full"
                  />
                </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={handleForgotPassword}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </div>
  );
};

export default ForgotPassword;
