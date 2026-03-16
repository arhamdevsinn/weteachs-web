import { NextResponse } from "next/server";

const STRIPE_TRANSFERS_API_URL = "https://api.stripe.com/v1/transfers";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: "Stripe secret key is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      destinationAccountId,
      amount,
      currency = "usd",
      chatDocId,
    } = body ?? {};

    if (!destinationAccountId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "destinationAccountId and amount are required",
        },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "amount must be a positive integer in cents",
        },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("destination", destinationAccountId);
    params.append("amount", String(Math.round(parsedAmount)));
    params.append("currency", String(currency).toLowerCase());

    if (chatDocId) {
      params.append("metadata[chatDocId]", String(chatDocId));
      params.append("transfer_group", `chat_${chatDocId}`);
    }

    const stripeResponse = await fetch(STRIPE_TRANSFERS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: stripeData?.error?.message || "Failed to create Stripe transfer",
          code: stripeData?.error?.code || null,
          details: stripeData,
        },
        { status: stripeResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      transferId: stripeData?.id || null,
      transfer: stripeData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Stripe transfer route error",
      },
      { status: 500 }
    );
  }
}
