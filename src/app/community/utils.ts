// @ts-nocheck
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config"; // adjust import to your setup

export async function fetchCommunityQuestions() {
  const ref = collection(db, "CommunityQuestions");
  const snap = await getDocs(ref);
  console.log("snap", snap);
  if (!snap.empty) {
    const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(results);
  } else {
    console.log("No documents found.");
  }
  return results;
}

export async function fetchCommentsForQuestion(questionId: string) {
  const ref = collection(db, "CommunityComments");
  const q = query(ref, where("com_post_ref", "==", `/CommunityQuestions/${questionId}`));
  console.log("q", q);
  const snap = await getDocs(q);
  console.log("snap", snap);
  if (!snap.empty) {
    const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("results", results);
  } else {
    console.log("No documents found.");
  }
  return results;
}