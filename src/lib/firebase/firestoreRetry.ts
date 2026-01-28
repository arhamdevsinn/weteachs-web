import { getDoc, getDocs } from "firebase/firestore";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getDocWithRetry(ref: any, attempts = 3, delayMs = 500) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await getDoc(ref);
    } catch (e) {
      lastErr = e;
      // If last attempt, throw
      if (i === attempts - 1) break;
      // exponential backoff
      await sleep(delayMs * Math.pow(2, i));
    }
  }
  throw lastErr;
}

export async function getDocsWithRetry(query: any, attempts = 3, delayMs = 500) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await getDocs(query);
    } catch (e) {
      lastErr = e;
      if (i === attempts - 1) break;
      await sleep(delayMs * Math.pow(2, i));
    }
  }
  throw lastErr;
}
