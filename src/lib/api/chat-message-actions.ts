import { db } from "@/src/lib/firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * Delete a message from a conversation
 * @param conversationId - The conversation ID
 * @param messageId - The message ID
 */
export async function deleteMessage(conversationId: string, messageId: string) {
  try {
    await deleteDoc(doc(db, "chats", conversationId, "chat_messages", messageId));
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

/**
 * Edit a message's text or shared image
 * @param conversationId - The conversation ID
 * @param messageId - The message ID
 * @param newText - The new message text (optional)
 * @param newSharedImage - The new shared image URL (optional)
 */
export async function editMessage(
  conversationId: string,
  messageId: string,
  newText?: string,
  newSharedImage?: string
) {
  try {
    const update: any = {};
    if (typeof newText === "string") update["message_text"] = newText;
    if (typeof newSharedImage === "string") update["shared_image"] = newSharedImage;
    await updateDoc(doc(db, "chats", conversationId, "chat_messages", messageId), update);
    return true;
  } catch (error) {
    console.error("Error editing message:", error);
    throw error;
  }
}
