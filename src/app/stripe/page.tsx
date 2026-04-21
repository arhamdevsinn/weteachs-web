// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { Button } from "@/src/components/ui/button";
import { db } from "@/src/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeInfo,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";

const StripePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const paramUserId = searchParams.get("userId") || searchParams.get("uid");
  const storedId =
    typeof window !== "undefined"
      ? paramUserId ||
        localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        user?.uid ||
        null
      : null;

  const { profile, teacherDetails, loading: profileLoading } = useUserProfile(storedId || undefined);

  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [localStripeAccountId, setLocalStripeAccountId] = useState("");
  const [localStripeChargesEnabled, setLocalStripeChargesEnabled] = useState(false);
  const [stripeErrorMessage, setStripeErrorMessage] = useState("");
  const [stripeActionUrl, setStripeActionUrl] = useState("");

  const computeTotalEarned = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + Number(item || 0), 0);
    }
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      return Number(value) || 0;
    }
    return 0;
  };

  const totalEarnedFromProfile = computeTotalEarned(
    teacherDetails?.Total_amount_earned ?? profile?.Total_amount_earned
  );

  const [totalEarnings, setTotalEarnings] = useState(totalEarnedFromProfile);

  const profileName = profile?.display_name || profile?.displayName || "Your profile";
  const existingStripeAccountId =
    teacherDetails?.stripeAccountID ||
    profile?.stripeAccountID ||
    teacherDetails?.stripeAccountId ||
    profile?.stripeAccountId ||
    teacherDetails?.stripe_id ||
    profile?.stripe_id ||
    "";
  const stripeAccountId = localStripeAccountId || existingStripeAccountId;
  const existingStripeChargesEnabled = Boolean(
    teacherDetails?.stripeChargesEnabled ||
      profile?.stripeChargesEnabled ||
      teacherDetails?.charges_enabled ||
      profile?.charges_enabled
  );
  const stripeChargesEnabled = localStripeAccountId ? localStripeChargesEnabled : existingStripeChargesEnabled;
  const isStripeConnected = Boolean(stripeAccountId);
  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  const email = profile?.email || "";

  useEffect(() => {
    if (existingStripeAccountId) {
      setLocalStripeAccountId(existingStripeAccountId);
      setLocalStripeChargesEnabled(existingStripeChargesEnabled);
    }

    setTotalEarnings(totalEarnedFromProfile);
  }, [existingStripeAccountId, existingStripeChargesEnabled, totalEarnedFromProfile]);

  const handleStripeConnect = async () => {
    if (!storedId) {
      toast.error("User id not found. Cannot connect Stripe.");
      return;
    }

    if (stripeAccountId) {
      toast.info("Stripe account already connected for this profile.");
      return;
    }

    if (!email) {
      toast.error("Email is required before creating a Stripe account.");
      return;
    }

    setStripeConnecting(true);
    setStripeErrorMessage("");
    setStripeActionUrl("");

    try {
      const response = await fetch("/api/stripe/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_type: "individual",
          country: "us",
          email,
          type: "standard",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.accountId) {
        if (result?.actionUrl) {
          setStripeActionUrl(result.actionUrl);
        }
        if (result?.error) {
          setStripeErrorMessage(result.error);
        }
        throw new Error(result?.error || "Unable to create Stripe account.");
      }

      const stripePayload = {
        stripeAccountID: result.accountId,
        stripeChargesEnabled: Boolean(result.chargesEnabled),
      };

      await setDoc(doc(db, "LimboUserMode", storedId), stripePayload, { merge: true });

      if (profile?.isTeacher) {
        await setDoc(doc(db, "TeacherDetails", teacherDetails?.id || storedId), stripePayload, {
          merge: true,
        });
      }

      const currentOrigin = window.location.origin;
      const stripePath = `/stripe?userId=${encodeURIComponent(storedId)}`;
      const accountLinkResponse = await fetch("/api/stripe/account-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: result.accountId,
          type: "account_onboarding",
          refresh_url: `${currentOrigin}${stripePath}`,
          return_url: `${currentOrigin}${stripePath}`,
        }),
      });

      const accountLinkResult = await accountLinkResponse.json();

      if (!accountLinkResponse.ok || !accountLinkResult?.success || !accountLinkResult?.url) {
        if (accountLinkResult?.error) {
          setStripeErrorMessage(accountLinkResult.error);
        }
        throw new Error(accountLinkResult?.error || "Unable to create Stripe account link.");
      }

      setLocalStripeAccountId(result.accountId);
      setLocalStripeChargesEnabled(Boolean(result.chargesEnabled));
      setStripeErrorMessage("");
      setStripeActionUrl(accountLinkResult.url);
      toast.success("Stripe account created successfully.");
      window.location.assign(accountLinkResult.url);
    } catch (error) {
      console.error("Stripe connection error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect Stripe.");
    } finally {
      setStripeConnecting(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
        <Skeleton className="h-96 w-full max-w-2xl rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex items-center justify-between bg-primary px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Go back"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Stripe</h1>
              <p className="text-sm text-emerald-50/90">
                Connect your payout account and keep track of onboarding status.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#dfe1e6] px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-md rounded-[32px] bg-[#d4d6dc] px-5 py-8 text-center shadow-inner ring-1 ring-white/40 sm:px-8">
            <div className="relative mx-auto w-fit mb-6">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-4 ring-white/60 sm:h-36 sm:w-36">
                {profile?.isTeacher ? (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-3xl font-semibold text-emerald-800">
                    ${totalEarnings.toFixed(2)}
                  </div>
                ) : (
               <div></div>
                )}
              </div>
              <div className="absolute -right-2 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                <BadgeInfo className="h-4.5 w-4.5" />
              </div>
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#2d7b3e]">{profileName}</p>

            <Button
              type="button"
              onClick={handleStripeConnect}
              disabled={stripeConnecting}
              className="mt-8 h-14 w-full rounded-full border border-[#1b1b1b] bg-[#4d39f5] text-lg font-semibold text-white shadow-[0_10px_18px_rgba(0,0,0,0.18)] transition hover:bg-[#4330ec]"
            >
              {stripeConnecting
                ? "Connecting..."
                : isStripeConnected
                  ? "Stripe Connected"
                  : "Sign Up With Stripe"}
            </Button>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => router.push(`/transactions?userId=${encodeURIComponent(storedId || "")}`)}
                className="h-12 w-full rounded-full bg-white text-[#4d39f5] border border-[#4d39f5] hover:bg-[#4d39f5] hover:text-white"
              >
                View Transaction Details
              </Button>
            </div>

            <div className="mt-12 space-y-5 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Expert AccountId</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {stripeAccountId || "Pending connection"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 px-4 py-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-base font-semibold text-slate-900">Info</p>
                <p className="mt-2 text-sm leading-6 text-[#4d39f5]">
                  {stripeErrorMessage
                    ? stripeErrorMessage
                    : isStripeConnected
                    ? stripeChargesEnabled
                      ? "Your Stripe account is connected and charges are enabled for this profile."
                      : "Your Stripe account has been created. Complete onboarding in Stripe if more setup is required."
                    : "Create your Stripe account here. The returned account id will be saved to your profile automatically."}
                </p>
                {stripeActionUrl ? (
                  <Button type="button" variant="link" className="mt-2 h-auto p-0 text-[#4d39f5]" asChild>
                    <a href={stripeActionUrl} target="_blank" rel="noreferrer">
                      Enable Stripe Connect
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>

              <div className="rounded-3xl bg-white px-4 py-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-2xl font-semibold text-slate-950">Tutorial Video</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Need help setting up payouts? Follow the step-by-step guide before connecting your Stripe account.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button type="button" variant="outline" className="rounded-full" asChild>
                    <a href="/how-to-weteachs">
                      <PlayCircle className="h-4 w-4" />
                      Watch tutorial
                    </a>
                  </Button>
                  <Button type="button" variant="ghost" className="rounded-full text-slate-700" asChild>
                    <a href="https://stripe.com" target="_blank" rel="noreferrer">
                      Visit Stripe
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePage;