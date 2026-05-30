import { NextResponse } from "next/server";

const BREVO_EMAIL_FUNCTION_URL =
  process.env.BREVO_EMAIL_FUNCTION_URL ||
  "https://us-central1-weteach-4-z4d3id.cloudfunctions.net/sendBrevoEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, textContent } = body ?? {};

    if (!to || !subject || !textContent) {
      return NextResponse.json(
        { success: false, error: "to, subject, and textContent are required" },
        { status: 400 }
      );
    }

    const brevoResponse = await fetch(BREVO_EMAIL_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, textContent }),
    });

    const contentType = brevoResponse.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await brevoResponse.json()
      : await brevoResponse.text();

    if (!brevoResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send Brevo email",
          details: data,
        },
        { status: brevoResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Brevo email route error",
      },
      { status: 500 }
    );
  }
}
