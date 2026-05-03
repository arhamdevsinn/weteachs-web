import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface PricingTransformationProps {
  subText: string;
  pricingPoints?: string[];
  transformationPoints?: string[];
  badges?: string[];
  buttonText?: string;
  buttonHref?: string;
}


const PricingTransformation: React.FC<PricingTransformationProps> = ({
  subText,
  pricingPoints = [],
  transformationPoints = [],
  badges = ["Flexible sessions", "No long-term contract", "Real coaches"],
  buttonText,
  buttonHref
}) => {
  return (
    <section className="px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eef2ec_0%,#ffffff_45%,#e6ede4_100%)] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.35)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="rounded-[1.75rem] bg-white/80 p-7 shadow-sm ring-1 ring-black/5 backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22542f]">
              Starting Pricing
            </p>
            <h2 className="mt-3 text-5xl font-black leading-none text-slate-900 md:text-6xl">
              $5/hr +
            </h2>
            <p className="mt-4 text-lg font-semibold text-slate-700 md:text-xl">
              As low as $1 / 15min.{" "}
              <Link
                href="https://stripe.com"
                target="_blank"
                className="font-bold text-blue-700 underline decoration-blue-700/30 underline-offset-4"
              >
                Stripe
              </Link>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {badges.map((badge, index) => (
                <span
                  key={badge}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${index === 0
                    ? "bg-[#22542f]/10 text-[#22542f]"
                    : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-3 text-base font-semibold text-slate-700">
              {pricingPoints.map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22542f] text-sm text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#e6ece6] p-7 shadow-sm ring-1 ring-black/5 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black-600">
              Sign up page
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              Ready to Start Your Transformation?
            </h3>

            <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-2xl font-extrabold text-[#22542f] shadow-inner">
              No Commitment &nbsp; &gt;
            </p>

            <div className="mt-5 space-y-3 text-lg font-bold text-slate-900">
              {transformationPoints.map((point) => (
                <p key={point} className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>{point}</span>
                </p>
              ))}
            </div>

            <Button
              asChild
              className="mt-8 h-12 w-full rounded-full bg-[#22542f] px-6 text-base font-bold text-white shadow-lg transition hover:bg-[#1b4224] hover:shadow-xl"
            >
              <Link href={typeof buttonHref === 'string' ? buttonHref : ''}>{buttonText}</Link>
            </Button>

            <p className="mt-4 text-center text-sm font-medium text-slate-600">
              {subText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTransformation;
