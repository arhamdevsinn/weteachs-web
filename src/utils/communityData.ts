// @ts-nocheck
import { db, storage  } from "@/src/lib/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  collectionGroup,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";


/** 🔹 Fetch all community questions */
export async function fetchCommunityQuestions() {
  const ref = collection(db, "CommunityQuestions");
  const snap = await getDocs(ref);
  if (snap.empty) return [];

  const results = await Promise.all(
    snap.docs.map(async (docSnap) => {
      const data = docSnap.data();

      // Fetch the user (Limbo_ref)
      let user = null;
      if (data.Limbo_ref) {
        user = await fetchUserByRef(data.Limbo_ref.path || data.Limbo_ref);
      }

      return {
        id: docSnap.id,
        ...data,
        LimboUser: user,
      };
    })
  );

  return results;
}
/** 🔹 Fetch all comments for a given question */
export async function fetchCommentsForQuestion(questionId: string) {
  const ref = collection(db, "CommunityComments");
  const q = query(
    collection(db, "CommunityComments"),
    where("com_post_ref", "==", doc(db, "CommunityQuestions", questionId))
  );
  const snap = await getDocs(q);

  let results: [] = [];
  if (!snap.empty) {
    results = await Promise.all(
      snap.docs.map(async (docSnap) => {
        const data = docSnap.data();

        // Fetch referenced Limbo user
        let limboUser = null;
        if (data.Limbo_ref) {
          limboUser = await fetchUserByRef(data.Limbo_ref.path || data.Limbo_ref);
        }

        // Fetch referenced Expert
        let expertUser = null;
        if (data.Expert_ref) {
          expertUser = await fetchUserByRef(data.Expert_ref.path || data.Expert_ref);
        }

        // Fetch liked users
        let likedUsers: [] = [];
        if (Array.isArray(data.Liked_user_ref)) {
          likedUsers = await Promise.all(
            data.Liked_user_ref.map(
              (ref) => fetchUserByRef(ref.path || ref)
            )
          );
        }
console.log("likedUsers", limboUser, expertUser, likedUsers, data);
        return {
          id: docSnap.id,
          ...data,
          LimboUser: limboUser,
          ExpertUser: expertUser,
          LikedUsers: likedUsers,
        };
      })
    );
  }

  return results;
}
export async function toggleLikeForComment(commentId: string, uid: string) {
  console.log("🔹 toggleLikeForComment called with:", { commentId, uid });

  if (!commentId) {
    console.error("❌ commentId is missing");
    throw new Error("commentId is required");
  }
  if (!uid) {
    console.error("❌ uid is missing");
    throw new Error("uid is required");
  }

  const commentRef = doc(db, "CommunityComments", commentId);
  console.log("📄 Getting document ref:", commentRef.path);

  const commentSnap = await getDoc(commentRef);
  console.log("📦 Document snapshot fetched:", commentSnap.exists());

  if (!commentSnap.exists()) {
    console.error("❌ Comment not found:", commentId);
    throw new Error("Comment not found");
  }

  const data = commentSnap.data();
  const likedUsers: string[] = data?.LikedUsers || [];

  console.log("👥 Current liked users:", likedUsers);
  const alreadyLiked = likedUsers.includes(uid);
  console.log("❤️ Already liked:", alreadyLiked);

  // ✅ Update Firestore
  if (alreadyLiked) {
    console.log("🧹 Removing like for user:", uid);
    await updateDoc(commentRef, { LikedUsers: arrayRemove(uid) });
  } else {
    console.log("✨ Adding like for user:", uid);
    await updateDoc(commentRef, { LikedUsers: arrayUnion(uid) });
  }

  // ✅ Construct and return updated comment
  const updatedComment = {
    id: commentId,
    ...data,
    LikedUsers: alreadyLiked
      ? likedUsers.filter((id) => id !== uid)
      : [...likedUsers, uid],
  };

  console.log("✅ Updated comment object:", updatedComment);
  return updatedComment;
}
/** 🔹 Helper — fetch LimboUser details by Firestore reference path */
export async function fetchUserByRef(refPath: string | { path: string }) {
  try {
    // If refPath is an object with a .path property, use it
    let path = typeof refPath === "string" ? refPath : refPath.path;

    // If path is just an ID, prepend the collection name
    if (!path.includes("/")) {
      path = `LimboUserMode/${path}`;
    }

    const segments = path.split("/");
    const userDoc = await getDoc(doc(db, ...segments));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
  } catch (err) {
    console.error("Error fetching user by ref:", err);
  }
  return null;
}

export async function fetchRepliesForComment(commentId: string) {
  if (!commentId) throw new Error("❌ commentId is required");

  console.log("📥 Fetching replies for comment:", commentId);

  const repliesRef = collection(db, "CommunityComments", commentId, "Replies");
  const q = query(repliesRef, orderBy("created_time", "asc"));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log("⚠️ No replies found for comment:", commentId);
    return [];
  }

  const replies = await Promise.all(
    snap.docs.map(async (replyDoc) => {
      const data = replyDoc.data();

      let limboUser = null;
      if (data.Limbo_ref) {
        const limboPath = data.Limbo_ref.path || data.Limbo_ref;
        limboUser = await fetchUserByRef(limboPath);
      }

      let expertUser = null;
      if (data.Exper_ref) {
        const experPath = data.Exper_ref.path || data.Exper_ref;
        expertUser = await fetchUserByRef(experPath);
      }

      const created = data.created_time?.toDate?.() || data.created_time;

      console.log("🗨️ Reply:", {
        id: replyDoc.id,
        text: data.reply_text,
        created,
        limboUser,
        expertUser,
      });

      return {
        id: replyDoc.id,
        reply_text: data.reply_text || "",
        video: data.video || "",
        created_time: created,
        LimboUser: limboUser,
        ExpertUser: expertUser,
      };
    })
  );

  console.log(`✅ ${replies.length} replies fetched for comment ${commentId}`);
  return replies;
}
export async function addReplyToComment({ commentId, replyText, limboRef }) {
  if (!commentId || !replyText) throw new Error("❌ Missing required fields");

  const replyRef = collection(db, "CommunityComments", commentId, "Replies");

  const newReply = {
    reply_text: replyText,
    Limbo_ref: limboRef ? doc(db, limboRef) : null,
    created_time: serverTimestamp(),
    video: "",
  };

  const added = await addDoc(replyRef, newReply);

  console.log("✅ Reply added:", added.id);
  return { id: added.id, ...newReply };
}

const firebaseStorage = storage || getStorage(app); // ✅ Fallback

export async function addCommentToQuestion(
  questionId: string,
  text: string,
  uid: string,
  mediaFile?: File
) {
  if (!text?.trim() && !mediaFile)
    throw new Error("Comment cannot be empty");
  if (!questionId) throw new Error("questionId is required");
  if (!uid) throw new Error("User not logged in");

  const questionRef = doc(db, "CommunityQuestions", questionId);
  const userRef = doc(db, "LimboUserMode", uid);

  let image = "";
  let mediaType = "";

  if (mediaFile) {
    const ext = mediaFile.name.split(".").pop()?.toLowerCase();
    const isVideo = ["mp4", "mov", "avi", "webm"].includes(ext || "");
    mediaType = isVideo ? "video" : "image";

    const storageRef = ref(
      firebaseStorage,
      `community_comments/${uid}/${Date.now()}_${mediaFile.name}`
    );

    const metadata = { contentType: mediaFile.type };
    const snapshot = await uploadBytes(storageRef, mediaFile, metadata);
    image = await getDownloadURL(snapshot.ref);
  }

  const payload = {
    comment_text: text?.trim() || "",
    com_post_ref: questionRef,
    Limbo_ref: userRef,
    create_when: serverTimestamp(),
    LikedUsers: [],
  };

  if (image) {
    payload.image = image;
    payload.media_type = mediaType;
  }

  const commentRef = await addDoc(collection(db, "CommunityComments"), payload);
  const snap = await getDoc(commentRef);
  return { id: snap.id, ...snap.data() };
}
