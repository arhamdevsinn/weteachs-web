/**
 * Reddit Pixel — Client-side utility
 * Tracks: PageVisit | Search | Lead | SignUp
 * Attribution: Click ID, UUID, Email, IP, User Agent, Screen Dimensions, External ID, MAID
 * Metadata: Value, Currency, Item Count, Conversion ID, Product ID, Product Category, Product Name
 */

// ─── Type Declarations ────────────────────────────────────────────────────────

declare global {
  interface Window {
    rdt?: RedditPixelFunction;
  }
}

type RedditPixelFunction = {
  (action: "init", pixelId: string, options?: RedditInitOptions): void;
  (action: "track", event: RedditEventName, data?: RedditEventData): void;
  sendEvent?: (...args: unknown[]) => void;
  callQueue: unknown[];
};

// ─── Event Names ─────────────────────────────────────────────────────────────

export type RedditEventName = "PageVisit" | "Search" | "Lead" | "SignUp";

// ─── Init Options ─────────────────────────────────────────────────────────────

export interface RedditInitOptions {
  optOut?: boolean;
  useDecimalCurrencyValues?: boolean;
  /** SHA-256 hashed email */
  email?: string;
  /** External advertiser user ID */
  externalId?: string;
  /** Mobile Advertising ID */
  mobileAdId?: string;
  /** Reddit Click ID from rclid URL param */
  clickId?: string;
  /** UUID for cross-session identity */
  uuid?: string;
}

// ─── Event Data ───────────────────────────────────────────────────────────────

export interface RedditEventData {
  // Attribution
  clickId?: string;
  uuid?: string;
  email?: string;
  externalId?: string;
  mobileAdId?: string;
  ipAddress?: string;
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

  // Search-specific
  query?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true only in a browser context with rdt loaded. */
function isPixelAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.rdt === "function";
}

/** Reads `rclid` from the current URL (Reddit's click-through parameter). */
export function getRedditClickId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("rclid") ?? undefined;
}

/** Collects device-level attribution data automatically. */
export function collectAttributionData(): Pick<
  RedditEventData,
  "userAgent" | "screenWidth" | "screenHeight"
> {
  if (typeof window === "undefined") return {};
  return {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Tracks a **PageVisit** event.
 * Call once per route change.
 */
export function trackPageVisit(data?: Omit<RedditEventData, "query">): void {
  if (!isPixelAvailable()) return;
  window.rdt!("track", "PageVisit", {
    ...collectAttributionData(),
    clickId: getRedditClickId(),
    ...data,
  });
}

/**
 * Tracks a **Search** event.
 * @param query - The search term the user entered.
 */
export function trackSearch(
  query: string,
  data?: Omit<RedditEventData, "query">
): void {
  if (!isPixelAvailable()) return;
  window.rdt!("track", "Search", {
    ...collectAttributionData(),
    clickId: getRedditClickId(),
    query,
    ...data,
  });
}

/**
 * Tracks a **Lead** event.
 * Fire when a user submits a contact / inquiry form.
 */
export function trackLead(data?: RedditEventData): void {
  if (!isPixelAvailable()) return;
  window.rdt!("track", "Lead", {
    ...collectAttributionData(),
    clickId: getRedditClickId(),
    ...data,
  });
}

/**
 * Tracks a **SignUp** event.
 * Fire when a user successfully creates an account.
 */
export function trackSignUp(data?: RedditEventData): void {
  if (!isPixelAvailable()) return;
  window.rdt!("track", "SignUp", {
    ...collectAttributionData(),
    clickId: getRedditClickId(),
    ...data,
  });
}

/**
 * Generic tracker — use when you need to fire any event by name.
 */
export function trackEvent(
  event: RedditEventName,
  data?: RedditEventData
): void {
  if (!isPixelAvailable()) return;
  window.rdt!("track", event, {
    ...collectAttributionData(),
    clickId: getRedditClickId(),
    ...data,
  });
}
