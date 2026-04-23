"use client";

/**
 * useRedditPixel — React hook
 *
 * Fires both the client-side Reddit Pixel AND the server-side Conversions API
 * in parallel for every event, maximising signal coverage.
 *
 * Usage:
 *   const { trackPageVisit, trackSearch, trackLead, trackSignUp } = useRedditPixel();
 */

import { useCallback } from "react";
import {
  trackPageVisit as pixelPageVisit,
  trackSearch as pixelSearch,
  trackLead as pixelLead,
  trackSignUp as pixelSignUp,
  getRedditClickId,
  collectAttributionData,
  type RedditEventData,
  type RedditEventName,
} from "@/src/lib/reddit-pixel";

// ─── CAPI helper ──────────────────────────────────────────────────────────────

async function sendToCAPI(
  event: RedditEventName,
  data?: RedditEventData
): Promise<void> {
  try {
    await fetch("/api/reddit-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        clickId: getRedditClickId(),
        ...collectAttributionData(),
        ...data,
      }),
    });
  } catch (err) {
    // CAPI failure should never break the user experience
    console.warn("[reddit-capi] Failed to send event:", err);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRedditPixel() {
  /**
   * PageVisit — call on route changes.
   */
  const trackPageVisit = useCallback(
    (data?: Omit<RedditEventData, "query">) => {
      pixelPageVisit(data);
      sendToCAPI("PageVisit", data);
    },
    []
  );

  /**
   * Search — call when a user submits a search query.
   * @param query - the search term
   */
  const trackSearch = useCallback(
    (query: string, data?: Omit<RedditEventData, "query">) => {
      pixelSearch(query, data);
      sendToCAPI("Search", { query, ...data });
    },
    []
  );

  /**
   * Lead — call when a user submits a contact / inquiry form.
   */
  const trackLead = useCallback((data?: RedditEventData) => {
    pixelLead(data);
    sendToCAPI("Lead", data);
  }, []);

  /**
   * SignUp — call immediately after a user successfully creates an account.
   */
  const trackSignUp = useCallback((data?: RedditEventData) => {
    pixelSignUp(data);
    sendToCAPI("SignUp", data);
  }, []);

  return { trackPageVisit, trackSearch, trackLead, trackSignUp };
}
