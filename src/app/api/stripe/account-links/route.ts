import { NextResponse } from "next/server";

const STRIPE_ACCOUNT_LINKS_API_URL = "https://api.stripe.com/v1/account_links";

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
    const { account, type, refresh_url: refreshUrl, return_url: returnUrl } = body ?? {};

    if (!account || !type || !refreshUrl || !returnUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "account, type, refresh_url, and return_url are required",
        },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("account", account);
    params.append("type", type);
    params.append("refresh_url", refreshUrl);
    params.append("return_url", returnUrl);

    const stripeResponse = await fetch(STRIPE_ACCOUNT_LINKS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error("Stripe account link creation failed", stripeData);
      return NextResponse.json(
        {
          success: false,
          error: stripeData?.error?.message || "Failed to create Stripe account link",
          code: stripeData?.error?.code || null,
          details: stripeData,
        },
        { status: stripeResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: stripeData.url,
      created: stripeData.created,
      expiresAt: stripeData.expires_at,
      accountLink: stripeData,
    });
  } catch (error) {
    console.error("Stripe account link route error", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Stripe account link route error",
      },
      { status: 500 }
    );
  }
}