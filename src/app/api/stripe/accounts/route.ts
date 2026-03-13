import { NextResponse } from "next/server";

const STRIPE_API_URL = "https://api.stripe.com/v1/accounts";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Stripe secret key is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      business_type: businessType,
      country,
      email,
      type,
    } = body ?? {};

    if (!businessType || !country || !email || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "business_type, country, email, and type are required",
        },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("business_type", businessType);
    params.append("country", country);
    params.append("email", email);
    params.append("type", type);

    const stripeResponse = await fetch(STRIPE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      const rawMessage = stripeData?.error?.message || "Failed to create Stripe account";
      const connectNotEnabled = rawMessage.includes("signed up for Connect");

      console.error("Stripe account creation failed", stripeData);
      return NextResponse.json(
        {
          success: false,
          error: connectNotEnabled
            ? "Stripe Connect is not enabled on this Stripe account. Enable Connect at https://dashboard.stripe.com/connect and try again."
            : rawMessage,
          code: connectNotEnabled ? "stripe_connect_not_enabled" : stripeData?.error?.code || null,
          actionUrl: connectNotEnabled ? "https://dashboard.stripe.com/connect" : null,
          details: stripeData,
        },
        { status: stripeResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      accountId: stripeData.id,
      chargesEnabled: Boolean(stripeData.charges_enabled),
      detailsSubmitted: Boolean(stripeData.details_submitted),
      payoutsEnabled: Boolean(stripeData.payouts_enabled),
      account: stripeData,
    });
  } catch (error) {
    console.error("Stripe account route error", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Stripe route error",
      },
      { status: 500 }
    );
  }
}