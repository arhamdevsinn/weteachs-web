import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import type { CallRecord } from "@/src/lib/types/call";

const secondsFrom = (val: any) => {
  if (!val) return 0;
  try {
    if (typeof val === "number") return val;
    if (val.seconds) return val.seconds;
    if (val.toDate) return Math.floor(val.toDate().getTime() / 1000);
    const parsed = Date.parse(String(val));
    return isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
  } catch (e) {
    return 0;
  }
};

// Resolve limbo_ref / limbo_ref2 references to display names.
async function resolveCallUserNames(calls: any[]): Promise<any[]> {
  if (!Array.isArray(calls) || calls.length === 0) return calls;

  const cache = new Map<string, string | null>();

  const normalizeKey = (ref: any) => {
    if (!ref) return null;
    try {
      if (typeof ref === 'string') return ref.startsWith('/') ? ref.slice(1) : ref; // 'LimboUserMode/ID'
      if (ref.path) return ref.path.startsWith('/') ? ref.path.slice(1) : ref.path;
      if (ref.id) return `LimboUserMode/${ref.id}`;
    } catch (e) {
      return null;
    }
    return null;
  };

  const toFetch: string[] = [];
  for (const c of calls) {
    const k1 = normalizeKey(c?.limbo_ref);
    const k2 = normalizeKey(c?.limbo_ref2);
    if (k1 && !cache.has(k1)) { cache.set(k1, null); toFetch.push(k1); }
    if (k2 && !cache.has(k2)) { cache.set(k2, null); toFetch.push(k2); }
  }

  // Fetch all unique user docs
  await Promise.all(toFetch.map(async (pathStr) => {
    try {
      const parts = String(pathStr).split('/');
      if (parts.length >= 2) {
        const [col, id] = parts.slice(-2);
        const userDoc = await getDoc(doc(db, col, id));
        if (userDoc.exists()) {
          const d = userDoc.data() as any;
          const name = d?.display_name || d?.displayName || d?.name || null;
          cache.set(pathStr, name);
          return;
        }
      }
      cache.set(pathStr, null);
    } catch (e) {
      console.warn('resolveCallUserNames: failed to fetch', pathStr, e);
      cache.set(pathStr, null);
    }
  }));

  // Attach resolved names to call objects
  return calls.map(c => {
    const k1 = normalizeKey(c?.limbo_ref);
    const k2 = normalizeKey(c?.limbo_ref2);
    return {
      ...c,
      limbo_ref_name: k1 ? cache.get(k1) || null : null,
      limbo_ref2_name: k2 ? cache.get(k2) || null : null,
    };
  });
}

export async function getUserCalls(userId: string): Promise<CallRecord[]> {
  try {
  const userRef = doc(db, "LimboUserMode", userId);
  const q = query(collection(db, "Calls"), where("users", "array-contains", userRef));
  const snap = await getDocs(q);
  let calls: CallRecord[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  // resolve limbo_ref / limbo_ref2 to display names
  calls = await resolveCallUserNames(calls);
  // sort client-side by call_when desc
  calls.sort((a, b) => secondsFrom(b.call_when) - secondsFrom(a.call_when));
  return calls;
  } catch (err) {
    console.error("getUserCalls error:", err);
    // Try a safe fallback: query without ordering
    try {
    const userRef = doc(db, "LimboUserMode", userId);
    const q = query(collection(db, "Calls"), where("users", "array-contains", userRef));
    const snap = await getDocs(q);
  let calls = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  calls = await resolveCallUserNames(calls);
  calls.sort((a, b) => secondsFrom(b.call_when) - secondsFrom(a.call_when));
  return calls;
    } catch (err2) {
      console.error("getUserCalls fallback error:", err2);
      return [];
    }
  }
}

export function subscribeToUserCalls(userId: string, cb: (calls: CallRecord[]) => void) {
  const userRef = doc(db, "LimboUserMode", userId);
  // NOTE: collection name must match Firestore exactly (no trailing space)
  const q = query(collection(db, "Calls"), where("users", "array-contains", userRef));
  const unsub = onSnapshot(q, (snapshot) => {
    (async () => {
      try {
        let calls = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        calls = await resolveCallUserNames(calls);
        calls.sort((a, b) => secondsFrom(b.call_when) - secondsFrom(a.call_when));
        cb(calls);
      } catch (e) {
        console.error("Error resolving call user names on snapshot:", e);
        const calls = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        calls.sort((a, b) => secondsFrom(b.call_when) - secondsFrom(a.call_when));
        cb(calls as CallRecord[]);
      }
    })();
  }, (err) => {
    console.error("subscribeToUserCalls error:", err);
    cb([]);
  });

  // Return a safe cleanup function
  return () => {
    try {
      if (typeof unsub === "function") unsub();
    } catch (e) {
      console.warn("subscribeToUserCalls cleanup error:", e);
    }
  };
}
