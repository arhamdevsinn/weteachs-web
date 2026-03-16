import { NextResponse } from "next/server";

const STRIPE_CHECKOUT_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions";

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
      paymentfees,
      cancelurl,
      successurl,
      currency = "USD",
      time = 1,
      connected_account_ID,
      teachersname,
      customer_email,
      chatDocId,
    } = body ?? {};

    const amount = Number(paymentfees);
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "paymentfees must be a positive amount in cents" },
        { status: 400 }
      );
    }

    if (!cancelurl || !successurl || !connected_account_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "cancelurl, successurl and connected_account_ID are required",
        },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", String(successurl));
    params.append("cancel_url", String(cancelurl));
    params.append("line_items[0][price_data][currency]", String(currency).toLowerCase());
    params.append("line_items[0][price_data][unit_amount]", String(Math.round(amount)));
    params.append(
      "line_items[0][price_data][product_data][name]",
      `Session with ${teachersname || "Teacher"}`
    );
    params.append("line_items[0][quantity]", String(time || 1));

    if (customer_email) {
      params.append("customer_email", String(customer_email));
    }

    // Route captured funds to connected account
    params.append("payment_intent_data[transfer_data][destination]", String(connected_account_ID));

    if (chatDocId) {
      params.append("metadata[chatDocId]", String(chatDocId));
      params.append("payment_intent_data[metadata][chatDocId]", String(chatDocId));
    }

    const stripeResponse = await fetch(STRIPE_CHECKOUT_SESSIONS_URL, {
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
          error: stripeData?.error?.message || "Failed to create Stripe session",
          code: stripeData?.error?.code || null,
          details: stripeData,
        },
        { status: stripeResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: stripeData?.id || null,
      url: stripeData?.url || null,
      session: stripeData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Stripe sessions route error",
      },
      { status: 500 }
    );
  }
}
