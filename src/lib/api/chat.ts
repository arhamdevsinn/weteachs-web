// @ts-nocheck
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion,
  serverTimestamp,
  query,
  where,
  getDocs,
  or,
  and,
  DocumentReference,
  addDoc,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { limit } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import type { Conversation } from "@/src/lib/types/chat";

/**
 * Get or create a conversation between two users
 * @param currentUserId - The current user's UID
 * @param expertId - The expert's UID
 * @returns The conversation ID
 */
export const getOrCreateConversation = async (
  currentUserId: string,
  expertId: string
): Promise<string> => {
  try {
    // First, check if a conversation already exists
    const conversationId = await findExistingConversation(currentUserId, expertId);
    
    if (conversationId) {
      console.log("Found existing conversation:", conversationId);
      return conversationId;
    }

    // If no conversation exists, create a new one
    console.log("Creating new conversation...");
    const newConversationId = await createNewConversation(currentUserId, expertId);
    return newConversationId;
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    throw error;
  }
};

/**
 * Find existing conversation between two users in the 'chats' collection
 * Uses limboref and limboref2 to query conversations
 */
const findExistingConversation = async (
  userId1: string,
  userId2: string
): Promise<string | null> => {
  try {
    // Create document references for both users
    const user1Ref = doc(db, "LimboUserMode", userId1);
    const user2Ref = doc(db, "LimboUserMode", userId2);

    // Query for conversations where user1 is limboref and user2 is limboref2
    const q1 = query(
      collection(db, "chats"),
      where("limboref", "==", user1Ref),
      where("limboref2", "==", user2Ref)
    );

    // Query for conversations where user2 is limboref and user1 is limboref2
    const q2 = query(
      collection(db, "chats"),
      where("limboref", "==", user2Ref),
      where("limboref2", "==", user1Ref)
    );

    // Execute both queries
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    // Check if any conversation exists
    if (!snapshot1.empty) {
      return snapshot1.docs[0].id;
    }
    
    if (!snapshot2.empty) {
      return snapshot2.docs[0].id;
    }

    return null;
  } catch (error) {
    console.error("Error finding existing conversation:", error);
    return null;
  }
};

/**
 * Create a new conversation between two users in the 'chats' collection
 */
const createNewConversation = async (
  currentUserId: string,
  expertId: string
): Promise<string> => {
  try {
    // Get user details
    const [currentUserDoc, expertDoc] = await Promise.all([
      getDoc(doc(db, "LimboUserMode", currentUserId)),
      getDoc(doc(db, "LimboUserMode", expertId))
    ]);

    if (!currentUserDoc.exists() || !expertDoc.exists()) {
      throw new Error("One or both users not found");
    }

    const currentUserData = currentUserDoc.data();
    const expertData = expertDoc.data();

    // Create document references
    const currentUserRef = doc(db, "LimboUserMode", currentUserId);
    const expertRef = doc(db, "LimboUserMode", expertId);

    // Create the conversation document in 'chats' collection
    const conversationRef = await addDoc(collection(db, "chats"), {
      // References to users
      limboref: currentUserRef,
      limboref2: expertRef,
      users: [currentUserRef, expertRef],
      userNames: [
        currentUserData.display_name || "User",
        expertData.display_name || "Expert"
      ],
      
      // chats metadata
      chats_paid_for: false,
      paid_chats: false,
      home_chats: false,
      stream_chats: false,
      completed: false,
      Reviewed: false,
      Student_Reply_true: false,
      
      // Online status
      is_student_online: false,
      is_expert_online: false,
      
      // Last message info
      last_message: "",
      last_message_time: serverTimestamp(),
      last_message_seen_by: [],
      
      // Last seen timestamps
      student_last_seen: serverTimestamp(),
      expert_last_seen: serverTimestamp(),
      
      // Creation time
      modified_time: serverTimestamp(),
      
      // References to related documents (if needed)
      student_ref: currentUserData.student_ref || null,
      teacher_ref: expertData.teacher_ref || null,
      job_ref: null,
      
      // Stripe IDs (if available)
      studentStripeID: currentUserData.stripeAccountId || "",
      teacherStripeID: expertData.stripeAccountId || "",
    });

    const conversationId = conversationRef.id;

    // Add conversation ID to both users' messages_chats arrays
    await Promise.all([
      updateDoc(doc(db, "LimboUserMode", currentUserId), {
        messages_chats: arrayUnion(conversationId)
      }),
      updateDoc(doc(db, "LimboUserMode", expertId), {
        messages_chats: arrayUnion(conversationId)
      })
    ]);

    console.log("Created new conversation:", conversationId);
    return conversationId;
  } catch (error) {
    console.error("Error creating new conversation:", error);
    throw error;
  }
};

/**
 * Send a message in a conversation
 * Stores messages in the 'chat_messages' subcollection of the chats document
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  messageText: string,
  senderName: string = "User",
  sharedUrl: string = ""
) => {
  try {
    console.log("sendMessage called with:", { conversationId, senderId, messageText, senderName });
    
    // Get sender's document reference
    const senderRef = doc(db, "LimboUserMode", senderId);
    
    // Always fetch the sender's name from Firestore to ensure it's not null
    let finalSenderName = senderName;
    try {
      const senderDoc = await getDoc(senderRef);
      if (senderDoc.exists()) {
        const userData = senderDoc.data();
        console.log("Sender user data from Firebase:", userData);
        // Try multiple possible field names for the display name
        finalSenderName = userData.display_name || userData.displayName || userData.name || senderName || "User";
        console.log("Final sender name:", finalSenderName);
      } else {
        console.warn("Sender document does not exist, using provided name:", senderName);
        finalSenderName = senderName || "User";
      }
    } catch (fetchError) {
      console.error("Error fetching sender document:", fetchError);
      finalSenderName = senderName || "User";
    }
    
    // Ensure finalSenderName is never null or undefined
    if (!finalSenderName || finalSenderName === null || finalSenderName === undefined) {
      finalSenderName = "User";
    }
    
    console.log("About to save message with nameofsender:", finalSenderName);
    
    // Add message to the chat_messages subcollection
    const messageRef = await addDoc(
      collection(db, "chats", conversationId, "chat_messages"),
      {
        sent_by: senderRef,
        message_text: messageText,
        nameofsender: finalSenderName,
        created_at: serverTimestamp(),
        shared_image: sharedUrl || "", // set shared image/video url when provided
      }
    );

    // Update the conversation's last message
    await updateDoc(doc(db, "chats", conversationId), {
      last_message: messageText,
      last_message_time: serverTimestamp(),
      last_message_seen_by: [senderRef], // Only sender has seen it initially
    });

    console.log("Message sent successfully:", messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Get all conversations for a user from the 'chats' collection
 * Fetches conversations where user is either limboref or limboref2
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const userRef = doc(db, "LimboUserMode", userId);

    // Query for conversations where user is limboref
    const q1 = query(
      collection(db, "chats"),
      where("limboref", "==", userRef)
    );

    // Query for conversations where user is limboref2
    const q2 = query(
      collection(db, "chats"),
      where("limboref2", "==", userRef)
    );

    // Execute both queries
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    // Combine results
    const conversations: Conversation[] = [];

    // Helper to fetch limboref and student_ref data if present
    const fetchRefsData = async (data: any) => {
      let limborefData = {};
      let studentRefData = {};
      try {
        if (data.limboref) {
          const limborefDoc = await getDoc(data.limboref);
          if (limborefDoc.exists()) limborefData = limborefDoc.data();
        }
        if (data.student_ref) {
          const studentRefDoc = await getDoc(data.student_ref);
          if (studentRefDoc.exists()) studentRefData = studentRefDoc.data();
        }
      } catch (e) {
        // ignore individual ref fetch errors
      }
      return { limborefData, studentRefData };
    };

    // Process conversations where user is limboref
    for (const docSnap of snapshot1.docs) {
      const data = docSnap.data();

      // Skip conversations that have no messages in chat_messages subcollection
      try {
        const messagesSnap = await getDocs(query(collection(db, "chats", docSnap.id, "chat_messages"), limit(1)));
        if (messagesSnap.empty) {
          // no messages, skip showing this conversation
          continue;
        }
      } catch (e) {
        // if check fails, continue and include the conversation to avoid hiding due to transient errors
        console.warn("Could not check messages for conversation", docSnap.id, e);
      }
      
      // Get the other user's details (limboref2)
      const otherUserRef = data.limboref2;
      const otherUserDoc = otherUserRef ? await getDoc(otherUserRef) : null;
      const otherUserData = otherUserDoc && otherUserDoc.exists() ? otherUserDoc.data() : {};

      const isOtherUserTeacher = otherUserData.isTeacher || false;
      const isOtherUserStudent = otherUserData.isStudent || false;

      const { limborefData, studentRefData } = await fetchRefsData(data);

      conversations.push({
        id: docSnap.id,
        ...data,
        otherParticipant: {
          uid: otherUserRef?.id || "",
          display_name: otherUserData.display_name || "User",
          photo_url: otherUserData.photo_url || "",
          isTeacher: isOtherUserTeacher,
          isStudent: isOtherUserStudent,
          isOnline: isOtherUserTeacher 
            ? (data.is_expert_online || false) 
            : (data.is_student_online || false),
        },
        type: data.chat_paid_for ? "paid" : "free",
        is_expert_online: data.is_expert_online || false,
        is_student_online: data.is_student_online || false,
        limborefData,
        studentRefData,
      });
    }

    // Process conversations where user is limboref2
    for (const docSnap of snapshot2.docs) {
      const data = docSnap.data();

      // Skip conversations that have no messages in chat_messages subcollection
      try {
        const messagesSnap = await getDocs(query(collection(db, "chats", docSnap.id, "chat_messages"), limit(1)));
        if (messagesSnap.empty) {
          continue;
        }
      } catch (e) {
        console.warn("Could not check messages for conversation", docSnap.id, e);
      }
      
      // Get the other user's details (limboref)
      const otherUserRef = data.limboref;
      const otherUserDoc = otherUserRef ? await getDoc(otherUserRef) : null;
      const otherUserData = otherUserDoc && otherUserDoc.exists() ? otherUserDoc.data() : {};

      const isOtherUserTeacher = otherUserData.isTeacher || false;
      const isOtherUserStudent = otherUserData.isStudent || false;

      const { limborefData, studentRefData } = await fetchRefsData(data);

      conversations.push({
        id: docSnap.id,
        ...data,
        otherParticipant: {
          uid: otherUserRef?.id || "",
          display_name: otherUserData.display_name || "User",
          photo_url: otherUserData.photo_url || "",
          isTeacher: isOtherUserTeacher,
          isStudent: isOtherUserStudent,
          isOnline: isOtherUserTeacher 
            ? (data.is_expert_online || false) 
            : (data.is_student_online || false),
        },
        type: data.chat_paid_for ? "paid" : "free",
        is_expert_online: data.is_expert_online || false,
        is_student_online: data.is_student_online || false,
        limborefData,
        studentRefData,
      });
    }

    // Sort by last message time (most recent first)
    conversations.sort((a, b) => {
      const timeA = a.last_message_time?.seconds || 0;
      const timeB = b.last_message_time?.seconds || 0;
      return timeB - timeA;
    });

    return conversations;
  } catch (error) {
    console.error("Error getting user conversations:", error);
    return [];
  }
};

/**
 * Get messages for a conversation from the 'chat_messages' subcollection
 */
export const getConversationMessages = async (conversationId: string) => {
  try {
    const messagesQuery = query(
      collection(db, "chats", conversationId, "chat_messages"),
      orderBy("created_at", "asc")
    );
    
    const snapshot = await getDocs(messagesQuery);
    
    const messages = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        // Get sender's details from the 'sent_by' reference
        let senderData = {};
        let senderId = "";
        
        if (data.sent_by && typeof data.sent_by === 'object' && data.sent_by.id) {
          senderId = data.sent_by.id;
          const senderDoc = await getDoc(data.sent_by);
          if (senderDoc.exists()) {
            senderData = senderDoc.data();
          }
        }

        return {
          id: docSnap.id,
          text: data.message_text,
          timestamp: data.created_at,
          senderName: data.nameofsender || senderData.display_name || "User",
          sharedImage: data.shared_image || "",
          from: {
            uid: senderId,
            display_name: data.nameofsender || senderData.display_name || "User",
            photo_url: senderData.photo_url || "",
          }
        };
      })
    );

    return messages;
  } catch (error) {
    console.error("Error getting conversation messages:", error);
    return [];
  }
};

/**
 * Listen to real-time messages for a conversation
 * @param conversationId - The conversation ID
 * @param callback - Function to call when messages update
 * @returns Unsubscribe function
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: any[]) => void
) => {
  const messagesQuery = query(
    collection(db, "chats", conversationId, "chat_messages"),
    orderBy("created_at", "asc")
  );

  return onSnapshot(
    messagesQuery,
    async (snapshot) => {
      const messages = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          // Get sender's details from the 'sent_by' reference
          let senderData = {};
          let senderId = "";
          
          if (data.sent_by && typeof data.sent_by === 'object' && data.sent_by.id) {
            senderId = data.sent_by.id;
            const senderDoc = await getDoc(data.sent_by);
            if (senderDoc.exists()) {
              senderData = senderDoc.data();
            }
          }

          return {
            id: docSnap.id,
            text: data.message_text,
            timestamp: data.created_at,
            senderName: data.nameofsender || senderData.display_name || "User",
            sharedImage: data.shared_image || "",
            from: {
              uid: senderId,
              display_name: data.nameofsender || senderData.display_name || "User",
              photo_url: senderData.photo_url || "",
            }
          };
        })
      );

      callback(messages);
    },
    (error) => {
      console.error("Error in message subscription:", error);
    }
  );
};
