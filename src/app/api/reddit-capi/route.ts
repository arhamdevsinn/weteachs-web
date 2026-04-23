/**
 * Reddit Conversions API (CAPI) — Server-side route
 * POST /api/reddit-capi
 *
 * Mirrors every client-side Pixel event server-to-server so signal
 * is captured even when the browser blocks the JS pixel.
 *
 * Docs: https://ads.reddit.com/cc-docs/capi
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

type RedditEventName = "PageVisit" | "Search" | "Lead" | "SignUp";

interface CAPIRequestBody {
  event: RedditEventName;
  // Attribution
  clickId?: string;        // rclid from URL
  uuid?: string;           // cross-session identity
  email?: string;          // plain-text — will be hashed server-side
  externalId?: string;     // your internal user ID
  mobileAdId?: string;     // MAID (IDFA / GAID)
  ipAddress?: string;      // forwarded from client
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  // Metadata
  value?: number;
  currency?: string;
  itemCount?: number;
  conversionId?: string;
  productId?: string;
  productCategory?: string;
  productName?: string;
  // Search
  query?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** SHA-256 hash a string (for PII like email). */
function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Pull the real client IP, honouring common proxy headers. */
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;
  const accessToken = process.env.REDDIT_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error("[reddit-capi] Missing NEXT_PUBLIC_REDDIT_PIXEL_ID or REDDIT_CAPI_ACCESS_TOKEN env vars");
    return NextResponse.json(
      { error: "Reddit CAPI not configured" },
      { status: 500 }
    );
  }

  let body: CAPIRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    event,
    clickId,
    uuid,
    email,
    externalId,
    mobileAdId,
    ipAddress,
    userAgent,
    screenWidth,
    screenHeight,
    value,
    currency,
    itemCount,
    conversionId,
    productId,
    productCategory,
    productName,
    query,
  } = body;

  if (!event) {
    return NextResponse.json({ error: "event is required" }, { status: 400 });
  }

  // Build the CAPI payload per Reddit's spec
  const payload = {
    test_mode: process.env.NODE_ENV !== "production",
    events: [
      {
        event_at: new Date().toISOString(),
        event_type: {
          tracking_type: event,
        },
        // ── Click-through attribution ──────────────────────────────────────
        click_id: clickId ?? null,
        // ── User identity signals ──────────────────────────────────────────
        user: {
          ...(uuid && { uuid }),
          ...(email && { email: sha256(email) }),
          ...(externalId && { external_id: sha256(externalId) }),
          ...(mobileAdId && { mobile_ad_id: mobileAdId }),
          ip_address: ipAddress ?? getClientIP(req),
          user_agent: userAgent ?? req.headers.get("user-agent") ?? "",
          ...(screenWidth && screenHeight && {
            screen_dimensions: {
              width: screenWidth,
              height: screenHeight,
            },
          }),
        },
        // ── Event metadata ─────────────────────────────────────────────────
        custom_data: {
          ...(value !== undefined && { value: String(value) }),
          ...(currency && { currency }),
          ...(itemCount !== undefined && { item_count: String(itemCount) }),
          ...(conversionId && { conversion_id: conversionId }),
          ...(productId && { products: [{ id: productId, category: productCategory, name: productName }] }),
          ...(query && { search_string: query }),
        },
      },
    ],
  };

  try {
    const redditRes = await fetch(
      `https://ads-api.reddit.com/api/v2.0/conversions/events/${pixelId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await redditRes.text();

    if (!redditRes.ok) {
      console.error(`[reddit-capi] Reddit API error ${redditRes.status}:`, responseText);
      return NextResponse.json(
        { error: "Reddit CAPI upstream error", detail: responseText },
        { status: redditRes.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[reddit-capi] Network error sending to Reddit:", err);
    return NextResponse.json({ error: "Failed to reach Reddit CAPI" }, { status: 502 });
  }
}
