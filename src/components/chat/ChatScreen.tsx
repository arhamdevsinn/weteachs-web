// @ts-nocheck
"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getUserConversations, 
  getUserPaidConversations,
  getUserFreeConversations,
  sendMessage,
  subscribeToMessages
} from "@/src/lib/api/chat";
import ReportDialog from "@/src/components/chat/ReportDialog";
import { deleteMessage, editMessage } from "@/src/lib/api/chat-message-actions";
import type { Conversation } from "@/src/lib/types/chat";
import { MessageSquareDot, Video, Phone, Menu, Star, Image as ImageIcon } from "lucide-react";
import MessageDialog from "@/src/components/chat/MessageDialog";
import { useUploadImage } from "@/src/hooks/useUploadImage";
import { getUserCalls, subscribeToUserCalls } from "@/src/lib/api/calls";
import type { CallRecord } from "@/src/lib/types/call";
import { auth, db } from "@/src/lib/firebase/config";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { toast } from "sonner";
import { sendPaymentNotificationEmail } from "@/src/lib/api/brevoEmail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

const mockCallLogs = [
  {
    id: 5,
    name: "Michael Brown",
    duration: "15 mins",
    time: "Today, 11:00 AM",
    status: "completed",
    type: "video",
  },
  {
    id: 6,
    name: "Emma Wilson",
    duration: "30 mins",
    time: "Yesterday, 3:30 PM",
    status: "completed",
    type: "audio",
  },
  {
    id: 7,
    name: "David Lee",
    duration: "Missed",
    time: "Jan 19, 2:00 PM",
    status: "missed",
    type: "video",
  },
];

const ChatScreen = () => {
     const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(false);
  // Handler for reporting a message
  const handleReport = () => {
    setMessageDialogOpen(false);
    setReportDialogOpen(true);
  };

  // Handler for submitting a report
  const handleSubmitReport = async (data: any) => {
    setReportLoading(true);
    try {
      // Firestore add logic here
      const { report_message, reporte_image, reporter_uploaded_ss, message_ref } = data;
      const reportsRef = (await import("firebase/firestore")).collection(db, "reports");
      const docData = {
        message_ref,
        open: true,
        report_message,
        reporte_image,
        reporter_uploaded_ss,
        time_when_reported: new Date(),
        who_received_report: selectedChat?.otherParticipant?.uid
          ? (await import("firebase/firestore")).doc(db, "LimboUserMode", selectedChat.otherParticipant.uid)
          : null,
        who_sent_report: currentUserId
          ? (await import("firebase/firestore")).doc(db, "LimboUserMode", currentUserId)
          : null,
      };
      await (await import("firebase/firestore")).addDoc(reportsRef, docData);
      toast.success("Report submitted");
      setReportDialogOpen(false);
    } catch (e) {
      toast.error("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };
  // Handler for editing a message (opens the edit dialog)
  const handleEdit = () => {
    setMessageDialogOpen(false);
    setEditingMessage(dialogPayload);
    setEditInput(dialogPayload?.text || "");
    setEditDialogOpen(true);
  };

  // Handler for copying a message
  const handleCopy = async () => {
    setMessageDialogOpen(false);
    try {
      await navigator.clipboard.writeText(dialogPayload?.text || dialogPayload?.message_text || "");
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Copy failed");
    }
  };

  // Handler for deleting a message
  const handleDelete = async () => {
    setMessageDialogOpen(false);
    if (!dialogPayload || !selectedChat) return;
    try {
      await deleteMessage(selectedChat.id, dialogPayload.id);
      toast.success("Message deleted");
    } catch (e) {
      toast.error("Failed to delete message");
    }
  };

  // Handler for saving an edited message
  const handleSaveEditDialog = async () => {
    if (!editingMessage || !selectedChat) return;
    try {
      await editMessage(selectedChat.id, editingMessage.id, editInput);
      toast.success("Message updated");
      setEditDialogOpen(false);
      setEditingMessage(null);
    } catch (e) {
      toast.error("Failed to update message");
    }
  };
  // --- Reply UI state ---
  const [replyTo, setReplyTo] = React.useState<any>(null);
  const [editInput, setEditInput] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingMessage, setEditingMessage] = React.useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdFromUrl = searchParams.get("conversationId") || "";
  
  const [activeTab, setActiveTab] = React.useState("free");
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  // Always scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [calls, setCalls] = React.useState<CallRecord[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [tabLoading, setTabLoading] = React.useState(false);
  const [callsLoading, setCallsLoading] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = React.useState(false);
  const [dialogPayload, setDialogPayload] = React.useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [jobCompletedDialogOpen, setJobCompletedDialogOpen] = React.useState(false);
  const [startingPayment, setStartingPayment] = React.useState(false);
  const [selectedChatPaymentStatus, setSelectedChatPaymentStatus] = React.useState<boolean | null>(null);
  const [expertRating, setExpertRating] = React.useState(0);
  const [expertReview, setExpertReview] = React.useState("");
  const [reviewCategory, setReviewCategory] = React.useState("");
  const [completingJob, setCompletingJob] = React.useState(false);
  const [isTeacherUser, setIsTeacherUser] = React.useState<boolean>(false);
  const [loadingUserRole, setLoadingUserRole] = React.useState(true);
  const reviewCategories = [
    "New",
    "Arts",
    "Business & Entrepreneur",
    "Education",
    "Family",
    "Fashion & Beauty",
    "Finance & Investing",
    "Fitness",
    "Foods & Cooking",
    "Gaming",
    "Health & Wellness",
    "Home improvements & DIY",
    "Language & Communication",
    "Marketing & Social Media",
    "Mental Health & Mindfulness",
    "Music",
    "Pet Care & Training",
    "Relationships & Dating Advice",
    "Spirituality & Religion",
    "Technology",
    "Travel & Culture",
    "Random",
  ];
  const [showChatSection, setShowChatSection] = React.useState(false); // For mobile view
  const [openPaidChatDialog, setOpenPaidChatDialog] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const currentUserId = auth.currentUser?.uid || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
  const currentUserName = auth.currentUser?.displayName || (typeof window !== "undefined" ? localStorage.getItem("userName") : "User");

  // Fetch user role to determine if expert or student
  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUserId) {
        setLoadingUserRole(false);
        return;
      }
      try {
        const userDocRef = doc(db, "LimboUserMode", currentUserId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsTeacherUser(userData?.isTeacher === true);
        }

      } catch (error) {
        console.error("Failed to fetch user role:", error);
      } finally {
        setLoadingUserRole(false);
      }
    };
    fetchUserRole();
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatCallWhen = (when: any) => {
    // Normalize various timestamp shapes into a Date
    if (!when) return "Now";
    let date: Date | null = null;
    try {
      if (when?.seconds && typeof when.seconds === 'number') {
        date = new Date(when.seconds * 1000);
      } else if (typeof when === 'number') {
        date = new Date(when);
      } else if (typeof when === 'string') {
        const parsed = new Date(when);
        if (!isNaN(parsed.getTime())) date = parsed;
      } else if (when?.toDate && typeof when.toDate === 'function') {
        date = when.toDate();
      }
    } catch (e) {
      // fallthrough to string fallback
      console.warn('formatCallWhen: failed to parse when', when, e);
    }

    if (!date) return String(when);

    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;

    const diffDays = Math.floor(diffSeconds / 86400);
    if (diffDays < 7) return `${diffDays}d`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks}w`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo`;

    return `${Math.floor(diffDays / 365)}y`;
  };

  const getParticipantIds = (call: any) => {
    if (!call?.users || !Array.isArray(call.users)) return [];
    return call.users.map((r: any) => {
      try {
        if (typeof r === "string") return r.split("/").pop();
        if (r.path) return r.path.split("/").pop();
        if (r.id) return r.id;
      } catch (e) {
        return String(r);
      }
    });
  };

  const getRefId = (ref: any) => {
    if (!ref) return null;
    try {
      if (typeof ref === 'string') return ref.split('/').pop();
      if (ref.path) return ref.path.split('/').pop();
      if (ref.id) return ref.id;
    } catch (e) {
      return null;
    }
    return null;
  };

  const isVideoUrl = (url: string | undefined) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.includes('video'));
  };

  const serializeCallForLog = (c: any) => {
    const users = Array.isArray(c?.users) ? c.users.map((u: any) => (u?.path ? u.path.split('/').pop() : (u?.id || String(u)))) : [];
    const limboref = c?.limbo_ref?.path ? c.limbo_ref.path.split('/').pop() : (c?.limbo_ref?.id || null);
    const limboref2 = c?.limbo_ref2?.path ? c.limbo_ref2.path.split('/').pop() : (c?.limbo_ref2?.id || null);
    let when = null;
    try {
      if (c?.call_when?.seconds) when = new Date(c.call_when.seconds * 1000).toISOString();
      else if (c?.call_when?.toDate) when = c.call_when.toDate().toISOString();
      else if (typeof c?.call_when === 'string') when = c.call_when;
    } catch (e) {
      when = String(c?.call_when);
    }

    return {
      id: c?.id,
      app_id: c?.app_id || null,
      channelname: c?.channelname || null,
      call_declined: !!c?.call_declined,
      call_ended: !!c?.call_ended,
      call_when: when,
      isVideo: !!c?.isVideo,
      limbo_ref: limboref,
      limbo_ref2: limboref2,
      ringing: !!c?.ringing,
      student_joined: !!c?.student_joined,
      teacher_joined: !!c?.teacher_joined,
      token_id: c?.token_id || null,
      users,
      videoRequst: !!c?.videoRequst,
    };
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations based on activeTab (free/paid)
  React.useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) {
        setLoading(false);
        setIsInitialLoad(false);
        return;
      }
      try {
        // For initial page load, show full page skeleton
        // For tab changes, show tab skeleton
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setTabLoading(true);
        }
        
        let userConversations = [];
        if (activeTab === "paid") {
          userConversations = await getUserPaidConversations(currentUserId);
          console.log("Paid conversations:", userConversations);
        } else if (activeTab === "free") {
          userConversations = await getUserFreeConversations(currentUserId);
          console.log("Free conversations:", userConversations);
        } else {
          userConversations = await getUserConversations(currentUserId);
          console.log("All conversations:", userConversations);
        }
          // Map conversations and fetch user data for DocumentReference users
          const mapConversationsWithUserData = async () => {
            const mapped = await Promise.all(userConversations.map(async (conv) => {
              let type = conv.type;
              if (!type && typeof conv.paid_chat === 'boolean') {
                type = conv.paid_chat ? 'paid' : 'free';
              }
              let otherParticipant = conv.otherParticipant;
              if (!otherParticipant && Array.isArray(conv.users)) {
                // Exclude current user, pick the other
                let other = conv.users.find(u => {
                  if (typeof u === 'string') return u !== currentUserId;
                  if (u && u.id) return u.id !== currentUserId;
                  return true;
                });
                if (other && typeof other === 'object' && other.type === 'document' && other.firestore) {
                  // It's a DocumentReference, fetch user data
                  try {
                    const userDoc = await getDoc(other);
                    if (userDoc.exists()) {
                      const userData = userDoc.data();
                      otherParticipant = {
                        uid: other.id,
                        display_name: userData.display_name || userData.name || 'Unknown',
                        photo_url: userData.photo_url || '',
                        isTeacher: userData.isTeacher || false,
                        isStudent: userData.isStudent || false,
                        isOnline: userData.isOnline || false,
                      };
                    } else {
                      otherParticipant = {
                        uid: other.id,
                        display_name: 'Unknown',
                        photo_url: '',
                        isTeacher: false,
                        isStudent: false,
                        isOnline: false,
                      };
                    }
                  } catch (e) {
                    otherParticipant = {
                      uid: other.id,
                      display_name: 'Unknown',
                      photo_url: '',
                      isTeacher: false,
                      isStudent: false,
                      isOnline: false,
                    };
                  }
                } else if (typeof other === 'string') {
                  otherParticipant = {
                    uid: other,
                    display_name: 'Unknown',
                    photo_url: '',
                    isTeacher: false,
                    isStudent: false,
                    isOnline: false,
                  };
                }
              }
              return {
                ...conv,
                type,
                otherParticipant,
              };
            }));
            // Sort by last_message_time.seconds (descending)
            mapped.sort((a, b) => {
              const aTime = a.last_message_time?.seconds || 0;
              const bTime = b.last_message_time?.seconds || 0;
              return bTime - aTime;
            });
            setConversations(mapped);
          };
          await mapConversationsWithUserData();
          // After conversations are set, select the first chat if available
          setConversations(prev => {
            if (prev.length > 0) {
              setSelectedChat(prev[0]);
            }
            return prev;
          });
        if (conversationIdFromUrl) {
          const foundConversation = userConversations.find(c => c.id === conversationIdFromUrl);
          if (foundConversation) {
            setSelectedChat(foundConversation);
          }
        } else if (userConversations.length > 0) {
          setSelectedChat(userConversations[0]);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
        setTabLoading(false);
        setIsInitialLoad(false);
      }
    };
    loadConversations();
  }, [activeTab, currentUserId, conversationIdFromUrl]);

  React.useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(selectedChat.id, (loadedMessages) => {
      setMessages(loadedMessages);
      // Update conversations in real time when a new message arrives
      if (loadedMessages && loadedMessages.length > 0) {
        const lastMsg = loadedMessages[loadedMessages.length - 1];
        setConversations(prev => {
          let updated = prev.map(c => {
            if (c.id === selectedChat.id) {
              return {
                ...c,
                last_message: lastMsg.text || lastMsg.message_text || '',
                last_message_time: lastMsg.createdAt || lastMsg.timestamp || c.last_message_time,
              };
            }
            return c;
          });
          // Sort by last_message_time.seconds (descending)
          updated.sort((a, b) => {
            const aTime = a.last_message_time?.seconds || 0;
            const bTime = b.last_message_time?.seconds || 0;
            return bTime - aTime;
          });
          return updated;
        });
        // Optionally, auto-select the chat if the message is from another user
        if (lastMsg.from?.uid && lastMsg.from.uid !== currentUserId) {
          setSelectedChat(selectedChat);
        }
        console.log(`[ChatScreen] New message, updating chat tile and sorting:`, lastMsg);
      }
    });

    // Some subscribe helpers may return undefined; guard the cleanup call
    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch (e) {
        console.warn("Error during messages unsubscribe cleanup:", e);
      }
    };
  }, [selectedChat?.id]);

  React.useEffect(() => {
    const syncSelectedChatPaymentStatus = async () => {
      if (!selectedChat?.id) {
        setSelectedChatPaymentStatus(null);
        return;
      }

      try {
        const chatSnap = await getDoc(doc(db, "chats", selectedChat.id));
        if (!chatSnap.exists()) return;

        const chatData = chatSnap.data() || {};
        setSelectedChatPaymentStatus(Boolean(chatData.chat_paid_for));

        setSelectedChat((prev) => {
          if (!prev || prev.id !== selectedChat.id) return prev;
          return {
            ...prev,
            ...chatData,
          };
        });
      } catch (error) {
        console.warn("Failed to refresh selected chat payment status:", error);
      }
    };

    syncSelectedChatPaymentStatus();
  }, [selectedChat?.id]);

  // Load and subscribe to calls for current user
  React.useEffect(() => {
    if (!currentUserId) return;

    let unsub: (() => void) | undefined;
    const load = async () => {
      try {
        setCallsLoading(true);
        const fetched = await getUserCalls(currentUserId);
        setCalls(fetched);
        // Log each call in a serializable, readable format
        // console.log("User calls loaded (raw):", fetched);
        try {
          fetched.forEach((c: any, idx: number) => {
            // console.log(`call[${idx}]`, serializeCallForLog(c));
          });
        } catch (e) {
          console.warn('Could not serialize calls for logging', e);
        }
      } catch (err) {
        console.error("Error loading calls:", err);
      } finally {
        setCallsLoading(false);
      }
      // Subscribe for realtime updates
      unsub = subscribeToUserCalls(currentUserId, (latest) => {
        setCalls(latest);
      });
    };

    load();

    return () => {
      if (unsub) unsub();
    };
  }, [currentUserId]);

  // (Removed duplicate handleSendMessage; only the reply-enabled version remains below)

  // Image / Video upload
  const { uploadImage, uploading: uploadingMedia } = useUploadImage();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleMediaPick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat?.id || !currentUserId) return;
    try {
      const folder = `users/${currentUserId}/uploads`;
      const url = await uploadImage(file, folder);
      // send message with media URL and empty text
      await sendMessage(selectedChat.id, currentUserId, "", currentUserName || "User", url);
    } catch (err) {
      console.error("Error uploading media:", err);
      toast.error("Failed to upload media");
    } finally {
      // clear the input so same file can be re-picked
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openMessageDialogFor = (msg: any) => {
    setDialogPayload(msg);
    setMessageDialogOpen(true);
  };

  const handleReply = () => {
    setMessageDialogOpen(false);
    if (dialogPayload) {
      setReplyTo({
        id: dialogPayload.id,
        text: dialogPayload.text,
        senderName: dialogPayload.senderName,
      });
    }
  };

  const handleSaveEdit = () => {
    setMessageDialogOpen(false);
    console.log("Save edit for", dialogPayload);
  };

//   const handleReport = () => {
//     setMessageDialogOpen(false);
//     console.log("Report", dialogPayload);
//     toast("Reported");
//   };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat?.id || !currentUserId) {
      return;
    }

    const paidConversation = Boolean(selectedChat?.paid_chat || selectedChat?.paid_chats || selectedChat?.type === "paid");
    const chatPaidFor = selectedChatPaymentStatus ?? Boolean(selectedChat?.chat_paid_for);
    if (paidConversation && !chatPaidFor) {
      toast.error("This paid chat is locked. Complete payment to start messaging.");
      return;
    }

    try {
      setSendingMessage(true);
      let senderName = "User";
      try {
        const userDoc = await getDoc(doc(db, "LimboUserMode", currentUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          senderName = userData.display_name || userData.displayName || userData.name || "User";
        }
      } catch (fetchError) {
        console.error("Error fetching user data:", fetchError);
      }
      // If replying, prepend reply info to message (for now, as a simple string, or you can extend schema)
      let messageText = input.trim();
      if (replyTo) {
        messageText = `↩️ ${replyTo.senderName ? replyTo.senderName + ': ' : ''}${replyTo.text}\n${messageText}`;
      }
      await sendMessage(selectedChat.id, currentUserId, messageText, senderName, "", replyTo ? {
        isReply: true,
        replySenderName: replyTo.senderName,
        replyPreview: replyTo.text,
      } : undefined);
      setInput("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };
  // --- End of logic section ---

  const getCurrentChats = () => {
    if (activeTab === "calls") return [];
    
    return conversations.filter(conv => {
      if (activeTab === "free") return conv.type === "free";
      if (activeTab === "paid") return conv.type === "paid";
      return true;
    });
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatSection(true); // Show chat section on mobile when a chat is selected
  };

  const handleBackToSidebar = () => {
    setShowChatSection(false); // Go back to sidebar on mobile
  };

  const canCompleteJob =
    expertRating > 0 &&
    expertReview.trim().length > 0 &&
    reviewCategory.trim().length > 0;

  const isSelectedChatPaidType = Boolean(
    selectedChat && (selectedChat.type === "paid" || selectedChat.paid_chat || selectedChat.paid_chats)
  );
  const isSelectedChatPaidFor = selectedChatPaymentStatus ?? Boolean(selectedChat?.chat_paid_for);
  const isSelectedChatLockedForPayment = Boolean(selectedChat && isSelectedChatPaidType && !isSelectedChatPaidFor);
  const isPaymentReleasedToExpert = Boolean(selectedChat?.payment_released_to_expert);

  const handleOpenSupportTicket = () => {
    const supportContext = selectedChat
      ? `Payment/refund support request for chat ${selectedChat.id}`
      : "Payment/refund support request";
    setDialogPayload({ text: supportContext, message_text: supportContext });
    setReportDialogOpen(true);
  };

  const handlePayToChat = async () => {
    if (!selectedChat?.id || !currentUserId) {
      toast.error("Missing chat information");
      return;
    }

    if (isTeacherUser) {
      toast.error("Only students can pay to unlock this chat");
      return;
    }

    try {
      setStartingPayment(true);

      const chatRef = doc(db, "chats", selectedChat.id);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        toast.error("Chat document not found");
        return;
      }

      const chatDoc = chatSnap.data() || {};
      if (chatDoc.chat_paid_for) {
        setSelectedChatPaymentStatus(true);
        toast.success("This chat is already paid and unlocked");
        return;
      }

      const jobRef = chatDoc.job_ref || null;
      let jobData: any = null;

      if (jobRef) {
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          jobData = jobSnap.data() || {};
        }
      }

      const baseAmount = Number(jobData?.total_price ?? jobData?.job_price ?? 0);
      const amountInCents = Math.max(0, Math.round(baseAmount * 100));
      if (amountInCents <= 0) {
        toast.error("Invalid job amount. Please contact support.");
        return;
      }

      const existingTransactionQ = query(collection(db, "transactions"), where("chatref", "==", chatRef));
      const existingTransactions = await getDocs(existingTransactionQ);

      let transactionRef: any = null;
      if (!existingTransactions.empty) {
        transactionRef = existingTransactions.docs[0].ref;
      } else {
        transactionRef = await addDoc(collection(db, "transactions"), {
          amount: amountInCents,
          teacher_ref: chatDoc.teacher_ref || null,
          student_ref: chatDoc.student_ref || null,
          created_time: serverTimestamp(),
          chatref: chatRef,
          job_ref: jobRef || null,
          paid: false,
          payout_released: false,
          refund_created: false,
          limboref: chatDoc.limboref || null,
          limboref2: chatDoc.limboref2 || null,
          job_topic: jobData?.job_topic || jobData?.topic || "",
          job_student_name: jobData?.Student_Name || jobData?.student_name || "",
        });
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "https://weteachs.com";
      const sessionPayload = {
        paymentfees: amountInCents,
        cancelurl: `${origin}/chat?conversationId=${selectedChat.id}&payment=cancelled`,
        successurl: `${origin}/chat?conversationId=${selectedChat.id}&payment=success`,
        currency: "USD",
        time: 1,
        teachersname: selectedChat?.otherParticipant?.display_name || "Teacher",
        customer_email:
          auth.currentUser?.email ||
          (typeof window !== "undefined" ? localStorage.getItem("userEmail") : "") ||
          "",
        chatDocId: selectedChat.id,
      };

      const sessionRes = await fetch("/api/stripe/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionPayload),
      });

      const sessionOutput = await sessionRes.json();
      if (!sessionRes.ok || !sessionOutput?.success || !sessionOutput?.url) {
        if (transactionRef && existingTransactions.empty) {
          await deleteDoc(transactionRef).catch(() => undefined);
        }
        toast.error(sessionOutput?.error || "Failed to create payment session");
        return;
      }

      await updateDoc(chatRef, {
        stripe_sessionId: sessionOutput?.sessionId || null,
        stripe_sessionld: sessionOutput?.sessionId || null,
      }).catch(() => undefined);

      if (transactionRef) {
        await updateDoc(transactionRef, {
          stripe_sessionld: sessionOutput?.sessionId || null,
          stripe_checkout_url: sessionOutput?.url || null,
          updated_time: serverTimestamp(),
        }).catch(() => undefined);
      }

      window.location.href = sessionOutput.url;
    } catch (error) {
      console.error("Failed to start payment session:", error);
      toast.error("Unable to start payment. Please try again.");
    } finally {
      setStartingPayment(false);
    }
  };

  const releaseExpertPayout = async (chatDoc: any) => {
    if (!selectedChat?.id) {
      throw new Error("Missing chat information");
    }

    const chatRef = doc(db, "chats", selectedChat.id);
    if (chatDoc?.payment_released_to_expert) {
      return { alreadyReleased: true, transferId: chatDoc?.stripe_transfer_id || null };
    }

    const expertUid = selectedChat?.otherParticipant?.uid || null;
    let stripeAccountID = "";
    let stripeChargesEnabled = false;
    if (expertUid) {
      const expertSnap = await getDoc(doc(db, "LimboUserMode", expertUid));
      if (expertSnap.exists()) {
        const expertData = expertSnap.data() || {};
        stripeAccountID = expertData.stripeAccountID || expertData.stripeAccountId || expertData.stripe_id || "";
        stripeChargesEnabled = Boolean(expertData.stripeChargesEnabled || expertData.charges_enabled);
      }
    }

    if (!stripeAccountID || !stripeChargesEnabled) {
      throw new Error("Expert payout account is not ready. Please contact support.");
    }

    const transactionsQ = query(collection(db, "transactions"), where("chatref", "==", chatRef));
    const transactionsSnap = await getDocs(transactionsQ);

    let transactionDocRef: any = null;
    let amountInCents = 0;
    let existingTransferId: string | null = null;
    let jobData: any = null;

    if (!transactionsSnap.empty) {
      const txDoc = transactionsSnap.docs[0];
      const txData = txDoc.data() || {};
      transactionDocRef = txDoc.ref;
      amountInCents = Number(txData.amount || 0);
      if (txData.payout_released || txData.paid === true) {
        existingTransferId = txData.stripe_transfer_id || chatDoc?.stripe_transfer_id || null;
      }
    }

    if (existingTransferId) {
      await updateDoc(chatRef, {
        payment_released_to_expert: true,
        payment_released_time: serverTimestamp(),
        stripe_transfer_id: existingTransferId,
      }).catch(() => undefined);

      return { alreadyReleased: true, transferId: existingTransferId };
    }

    if (amountInCents <= 0) {
      let totalPrice = 0;
      const jobRef = chatDoc.job_ref;
      if (jobRef) {
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          jobData = jobSnap.data() || {};
          totalPrice = Number(jobData.total_price ?? jobData.job_price ?? 0);
        }
      }
      amountInCents = Math.max(0, Math.round(totalPrice * 100));
    }

    if (amountInCents <= 0) {
      throw new Error("Unable to determine payout amount. Please contact support.");
    }

    const transferResponse = await fetch("/api/stripe/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatDocId: selectedChat.id,
        destinationAccountId: stripeAccountID,
        amount: amountInCents,
        currency: "usd",
      }),
    });

    const transferResult = await transferResponse.json();
    if (!transferResponse.ok || !transferResult?.success) {
      throw new Error(transferResult?.error || "Failed to release payout to expert");
    }

    await updateDoc(chatRef, {
      payment_released_to_expert: true,
      payment_released_time: serverTimestamp(),
      stripe_transfer_id: transferResult?.transferId || null,
    });

    if (transactionDocRef) {
      await updateDoc(transactionDocRef, {
        paid: true,
        payout_released: true,
        paid_time: serverTimestamp(),
        stripe_transfer_id: transferResult?.transferId || null,
      }).catch((error) => {
        console.warn("Failed updating transaction payout fields:", error);
      });
    }

    const [currentUserSnap, expertSnap] = await Promise.all([
      currentUserId ? getDoc(doc(db, "LimboUserMode", currentUserId)) : Promise.resolve(null),
      expertUid ? getDoc(doc(db, "LimboUserMode", expertUid)) : Promise.resolve(null),
    ]);
    const currentUserData = currentUserSnap?.exists() ? currentUserSnap.data() : null;
    const expertData = expertSnap?.exists() ? expertSnap.data() : null;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://weteachs.com";
    const paymentDetailsUrl = `${origin}/chat?conversationId=${selectedChat.id}&payment=success`;

    await Promise.allSettled([
      sendPaymentNotificationEmail({
        to: currentUserData?.email || auth.currentUser?.email || "",
        recipientName: currentUserData?.display_name || currentUserData?.displayName || currentUserName || "You",
        counterpartyName: expertData?.display_name || selectedChat?.otherParticipant?.display_name || "Expert",
        amount: `$${(amountInCents / 100).toFixed(2)}`,
        topic: jobData?.job_topic || jobData?.topic || selectedChat?.otherParticipant?.display_name || "your session",
        statusLabel: "payment release",
        detailsUrl: paymentDetailsUrl,
      }),
      sendPaymentNotificationEmail({
        to: expertData?.email || selectedChat?.otherParticipant?.email || "",
        recipientName: expertData?.display_name || selectedChat?.otherParticipant?.display_name || "Expert",
        counterpartyName: currentUserData?.display_name || currentUserName || "a student",
        amount: `$${(amountInCents / 100).toFixed(2)}`,
        topic: jobData?.job_topic || jobData?.topic || selectedChat?.otherParticipant?.display_name || "your session",
        statusLabel: "payout update",
        detailsUrl: paymentDetailsUrl,
      }),
    ]).catch((emailError) => {
      console.warn("Failed to send payment email:", emailError);
    });

    return { alreadyReleased: false, transferId: transferResult?.transferId || null };
  };

  const handleSubmitExpertReview = async () => {
    if (!selectedChat?.id || !currentUserId) {
      toast.error("Missing chat information");
      return;
    }

    if (!canCompleteJob) {
      toast.error("Please add a rating, review, and category");
      return;
    }

    let payoutReleased = false;
    try {
      setCompletingJob(true);

      const chatRef = doc(db, "chats", selectedChat.id);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        toast.error("Chat document not found");
        return;
      }

      const chatDoc = chatSnap.data() || {};
      const isChatPaidFor = Boolean(chatDoc.chat_paid_for);

      if (!isChatPaidFor) {
        toast.error("Please pay to unlock chat before completing the review.");
        return;
      }

      const teacherRef =
        chatDoc.teacher_ref ||
        chatDoc.teacherRef ||
        (selectedChat?.otherParticipant?.uid ? doc(db, "LimboUserMode", selectedChat.otherParticipant.uid) : null);
      const studentRef =
        chatDoc.student_ref ||
        chatDoc.studentRef ||
        (currentUserId ? doc(db, "LimboUserMode", currentUserId) : null);

      const payoutResult = await releaseExpertPayout(chatDoc);
      payoutReleased = true;

      await addDoc(collection(db, "Reviews"), {
        chatref: chatRef,
        teacherRef: teacherRef || null,
        rated_by: studentRef || null,
        userid: teacherRef || null,
        ratings: Number(expertRating),
        dat: serverTimestamp(),
        reviews: expertReview.trim(),
        Category: reviewCategory,
      });

      await updateDoc(chatRef, {
        Reviewed: true,
        student_completed: true,
        review_text: expertReview,
        review_category: reviewCategory,
        review_rating: expertRating,
        reviewed_time: serverTimestamp(),
      });

      if (teacherRef) {
        await updateDoc(teacherRef, {
          rating: arrayUnion(Number(expertRating)),
        }).catch((err) => {
          console.warn("Non-blocking teacher rating update failed:", err);
        });
      }

      setSelectedChat((prev) => {
        if (!prev || prev.id !== selectedChat.id) return prev;
        return {
          ...prev,
          payment_released_to_expert: true,
          stripe_transfer_id: payoutResult?.transferId || prev.stripe_transfer_id,
        };
      });

      toast.success("Review submitted and payment released");
      setReviewDialogOpen(false);
      setExpertReview("");
      setReviewCategory("");
      setExpertRating(0);
    } catch (error) {
      console.error("Failed to complete job:", error);
      if (payoutReleased) {
        toast.error("Payment released, but review failed. Please contact support.");
      } else {
        toast.error(error?.message || "Failed to submit review");
      }
    } finally {
      setCompletingJob(false);
    }
  };

  const handleSkipExpertReview = () => {
    setReviewDialogOpen(false);
  };

  const handleCompleteJob = async () => {
    if (!selectedChat?.id) {
      toast.error("Missing chat information");
      setJobCompletedDialogOpen(false);
      return;
    }

    try {
      setCompletingJob(true);

      const chatRef = doc(db, "chats", selectedChat.id);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        toast.error("Chat document not found");
        setJobCompletedDialogOpen(false);
        return;
      }

      const chatDoc = chatSnap.data() || {};

      if (!chatDoc.chat_paid_for) {
        toast.error("Student payment is required before expert completion.");
        setJobCompletedDialogOpen(false);
        return;
      }

      if (!chatDoc.payment_released_to_expert) {
        toast.error("Payment must be released by the student review before completing the job.");
        setJobCompletedDialogOpen(false);
        return;
      }

      if (chatDoc.completed) {
        toast.success("This job is already completed.");
        setJobCompletedDialogOpen(false);
        return;
      }

      // Step 1: Update chats collection with completed = true
      await updateDoc(chatRef, {
        completed: true,
        expert_completed: true,
      });

      // Step 2: Get teacherRef and total_price, then update TeacherDetails
      const teacherRef =
        chatDoc.teacher_ref ||
        chatDoc.teacherRef ||
        (selectedChat?.otherParticipant?.uid ? doc(db, "TeacherDetails", selectedChat.otherParticipant.uid) : null);

      let totalPrice = 0;
      const jobRef = chatDoc.job_ref;
      if (jobRef) {
        try {
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists()) {
            const jobData = jobSnap.data() || {};
            totalPrice = Number(jobData.total_price ?? jobData.job_price ?? 0);
          }
        } catch (err) {
          console.warn("Failed to fetch job data:", err);
        }
      }

      // Step 3: Update TeacherDetails with Number_of_completed_jobs and Total_amount_earned
      if (teacherRef) {
        await updateDoc(teacherRef, {
          Number_of_completed_jobs: arrayUnion(1),
          Total_amount_earned: arrayUnion(totalPrice),
        });
      } else {
        console.warn("TeacherRef not found, skipping teacher stats update");
      }

      toast.success("Job marked as completed");
      setJobCompletedDialogOpen(false);
    } catch (error) {
      console.error("Failed to complete job:", error);
      toast.error("Failed to complete job");
    } finally {
      setCompletingJob(false);
      setJobCompletedDialogOpen(false);
    }
  };

  const currentChats = getCurrentChats();

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-br from-[#E8ECE4] via-white to-[#E8ECE4]/50 md:min-h-[calc(100vh-4rem)] md:py-2 md:px-6">
        <div className="min-h-[calc(100dvh-68px)] md:h-full md:min-h-0">
          <div className="flex min-h-[calc(100dvh-68px)] w-[100%] flex-col overflow-visible bg-white md:h-[calc(100vh-6rem)] md:min-h-0 md:flex-row md:overflow-hidden md:rounded-2xl md:border md:border-gray-100 md:shadow-2xl">
            {/* Sidebar Skeleton */}
            <aside className="sm:w-[40%] w-full bg-gradient-to-b from-[#22542F] to-[#1a4023] text-white flex flex-col md:h-full md:min-h-0">
              {/* Header Skeleton */}
              <div className="sticky top-[68px] z-20 flex-shrink-0 px-6 py-5 border-b border-white/10 bg-[#1d4f2b] md:static md:bg-black/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-white/20 animate-pulse rounded"></div>
                    <div className="h-3 w-32 bg-white/20 animate-pulse rounded"></div>
                  </div>
                </div>
                {/* Tab Buttons Skeleton */}
                <div className="flex gap-2 bg-black/20 backdrop-blur-sm rounded-xl p-1.5">
                  <div className="flex-1 h-10 bg-white/20 animate-pulse rounded-lg"></div>
                  <div className="flex-1 h-10 bg-white/20 animate-pulse rounded-lg"></div>
                  <div className="flex-1 h-10 bg-white/20 animate-pulse rounded-lg"></div>
                </div>
              </div>
              {/* Conversations List Skeleton */}
              <nav className="flex-1 p-4 space-y-3 md:min-h-0 md:overflow-y-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center p-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-white/20 animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-white/20 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main Chat Section Skeleton */}
            <section className="flex-1 w-full sm:w-[60%] flex flex-col bg-gradient-to-br from-gray-50 to-white">
              {/* Chat Header Skeleton */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
              {/* Messages Area Skeleton */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-200' : 'bg-primary/20'} p-4 rounded-2xl animate-pulse`}>
                      <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-32 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input Area Skeleton */}
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-screen md:h-[90vh] w-full">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view messages</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-gradient-to-br from-[#E8ECE4] via-white to-[#E8ECE4]/50 md:min-h-[calc(100vh-4rem)] md:py-2 md:px-6">
      <div className="min-h-[calc(100dvh-68px)] md:h-full md:min-h-0">
        <div className="flex min-h-[calc(100dvh-68px)] w-[100%] flex-col overflow-visible bg-white md:h-[calc(100vh-6rem)] md:min-h-0 md:flex-row md:overflow-hidden md:rounded-2xl md:border md:border-gray-100 md:shadow-2xl">
          {/* Sidebar - Hidden on mobile when chat is selected */}
          <aside className={`sm:w-[40%] w-full bg-gradient-to-b from-[#22542F] to-[#1a4023] text-white flex flex-col md:h-full md:min-h-0 ${
            showChatSection ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="sticky top-[68px] z-20 flex-shrink-0 px-6 py-5 border-b border-white/10 bg-[#1d4f2b] md:static md:bg-black/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Messages</h2>
                  <p className="text-xs text-white/70">{conversations.length} conversations</p>
                </div>
              </div>
              
              {/* Tab Buttons */}
              <div className="flex gap-2 bg-black/20 backdrop-blur-sm rounded-xl p-1.5">
                <button
                  onClick={() => setActiveTab("free")}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === "free" 
                      ? "bg-white text-[#22542F] shadow-lg" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                   Free Chat
                </button>
                <button
                  onClick={() => setActiveTab("paid")}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === "paid" 
                      ? "bg-white text-[#22542F] shadow-lg" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                   Paid
                </button>
                <button
                  onClick={() => setActiveTab("calls")}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === "calls" 
                      ? "bg-white text-[#22542F] shadow-lg" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                   Calls
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <nav className="flex-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent md:min-h-0 md:overflow-y-auto">
              {activeTab === "calls" ? (
                callsLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 shadow-sm border animate-pulse">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            <div className="h-3 w-12 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                // <div className="p-4 space-y-3">
                //     {(calls.length ? calls : mockCallLogs).map((log: any) => {
                //     const isMock = !log.id || typeof log.id === 'number';
                //     const status = isMock ? log.status : (
                //       log.call_ended ? 'ended' : (log.call_declined ? 'declined' : (log.ringing ? 'ringing' : 'scheduled'))
                //     );
                //     const type = isMock ? log.type : (log.isVideo ? 'video' : 'audio');
                //     const when = isMock ? log.time : formatCallWhen(log.call_when);
                //     const participants = isMock ? [log.name] : getParticipantIds(log);
                //     const senderName = isMock ? log.name : (log.limbo_ref_name || participants[0] || 'Unknown');
                //     const receiverName = isMock ? '' : (log.limbo_ref2_name || participants[1] || '');
                //     // compute limbo ids and arrow direction relative to current user
                //     const limboId = !isMock ? getRefId(log.limbo_ref) : null;
                //     const limbo2Id = !isMock ? getRefId(log.limbo_ref2) : null;
                //     const showUpArrow = !!(limboId && currentUserId && limboId === currentUserId);

                //     // Show the "other" participant relative to the current user
                //     let primaryDisplay = senderName;
                //     if (!isMock) {
                //       if (limbo2Id && limbo2Id === currentUserId) {
                //         // current user is receiver -> show sender
                //         primaryDisplay = log.limbo_ref_name || limboId || senderName;
                //       } else if (limboId && limboId === currentUserId) {
                //         // current user is sender -> show receiver
                //         primaryDisplay = log.limbo_ref2_name || limbo2Id || receiverName || 'Unknown';
                //       }
                //     }

                //     return (
                //       <div
                //         key={log.id}
                //         className="bg-white rounded-lg p-3 transition-all duration-200 cursor-pointer border-2 border-[#22542F]"
                //       >
                //         <div className="flex items-center gap-4">
                //           {/* Avatar */}
                //           <div className="flex-shrink-0">
                //             <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-[#22542F]">
                //               {/* if you have a logo or avatar, replace src below */}
                //               <img src="/logo.png" alt="avatar" className="w-full h-full object-cover" />
                //             </div>
                //           </div>

                //           {/* Main content: name + time */}
                //           <div className="flex-1 min-w-0">
                //             <div className="flex items-center justify-between">
                //               <div className="truncate">
                //                 {/* <div className="font-semibold text-sm text-[#0f2f18]">{isMock ? log.name : (log.channelname || log.app_id || log.id)}</div> */}
                //                   {/* <div className="font-semibold">{
                //                     (() => {
                //                       const limboId = getRefId(call.limbo_ref);
                //                       const limbo2Id = getRefId(call.limbo_ref2);
                //                       const showUp = !!(limboId && currentUserId && limboId === currentUserId);
                //                       const name = (limbo2Id && limbo2Id === currentUserId) ? (call.limbo_ref_name || limboId || 'Unknown') : ((limboId && limboId === currentUserId) ? (call.limbo_ref2_name || limbo2Id || 'Unknown') : (call.limbo_ref_name || call.limbo_ref || 'Unknown'));
                //                       return (
                //                         <span className="inline-flex items-center gap-2">
                //                           <span>{name}</span>
                //                           <span className={`text-sm ${showUp ? 'text-red-400' : 'text-green-400'}`}>{showUp ? '⬆' : '⬇'}</span>
                //                         </span>
                //                       );
                //                     })()
                //                   }</div> */}
                //                 <div className="text-[12px] text-[#22542F] mt-1">{when}</div>
                //               </div>
                //               {/* Arrow indicator on the right */}
                //               <div className="ml-4 flex-shrink-0">
                //                 <span className={`text-xl ${showUpArrow ? 'text-red-500' : 'text-green-500'}`} title={showUpArrow ? 'Error (up)' : 'Normal (down)'}>
                //                   {showUpArrow ? '↗' : '↘'}
                //                 </span>
                //               </div>
                //             </div>

                //             {/* Secondary line: badge + participants (hidden on very small screens truncated) */}
                //             <div className="mt-2 flex items-center justify-between text-sm">
                //               <div className="flex items-center gap-2 truncate">
                //                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type === 'video' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800'}`}>
                //                   {type === 'video' ? 'Video call' : 'Audio call'}
                //                 </span>
                //                 <span className="text-gray-600 truncate">{primaryDisplay}{receiverName && primaryDisplay !== `${senderName}` ? ` • ${receiverName}` : (receiverName && primaryDisplay === senderName ? ` → ${receiverName}` : '')}</span>
                //               </div>
                //             </div>

                //             {/* Joined indicators - subtle, shown only on md+ */}
                //             {!isMock && (
                //               <div className="mt-3 text-xs text-gray-600 hidden md:flex gap-3">
                //                 {log.student_joined ? (
                //                   <span className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 rounded-full">Student joined</span>
                //                 ) : (
                //                   <span className="px-2 py-0.5 bg-white/10 rounded-full">Student not joined</span>
                //                 )}
                //                 {log.teacher_joined ? (
                //                   <span className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 rounded-full">Teacher joined</span>
                //                 ) : (
                //                   <span className="px-2 py-0.5 bg-white/10 rounded-full">Teacher not joined</span>
                //                 )}
                //               </div>
                //             )}
                //           </div>
                //         </div>
                //       </div>
                //     );
                //   })}
                // </div>
                    <div className="p-4 space-y-4">
                    {calls.map((call) => {
                      const status = call.call_ended ? 'Ended' : (call.call_declined ? 'Declined' : (call.ringing ? 'Ringing' : 'Scheduled'));
                      const type = call.isVideo ? 'Video' : 'Audio';
                      const when = formatCallWhen(call.call_when);
                      const participants = getParticipantIds(call).join(', ');
                      return (
                        <div key={call.id} className="bg-white rounded-xl p-4 shadow-sm border">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22542F] to-[#1a4023] flex items-center justify-center text-white font-bold">
                                  {/* decorative call icon (video or audio) */}
                                  {type === 'Video' ? (
                                    <Video className="w-6 h-6 text-white" />
                                  ) : (
                                    <Phone className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-primary">{
                                    (() => {
                                      const limboId = getRefId(call.limbo_ref);
                                      const limbo2Id = getRefId(call.limbo_ref2);
                                      const showUp = !!(limboId && currentUserId && limboId === currentUserId);
                                      const name = (limbo2Id && limbo2Id === currentUserId) ? (call.limbo_ref_name || limboId || 'Unknown') : ((limboId && limboId === currentUserId) ? (call.limbo_ref2_name || limbo2Id || 'Unknown') : (call.limbo_ref_name || call.limbo_ref || 'Unknown'));
                                      return (
                                        <span className="inline-flex items-center gap-2">
                                          <span>{name}</span>
                                                       <div className="ml-4 flex-shrink-0">
                                <span className={`text-xl ${showUp ? 'text-red-500' : 'text-green-500'}`} title={showUp ? 'Error (up)' : 'Normal (down)'}>
                                  {showUp ? '↗' : '↘'}
                                </span>
                              </div>
                                        </span>
                            
                                      );
                                    })()
                                  }</div>
                                  <div className="text-sm text-gray-500">{
                                    (() => {
                                      const limboId = getRefId(call.limbo_ref);
                                      const limbo2Id = getRefId(call.limbo_ref2);
                                      const left = call.limbo_ref_name || limboId;
                                      const right = call.limbo_ref2_name || limbo2Id;
                                    })()
                                  }</div>
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${call.isVideo ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800'}`}>
                                      {call.isVideo ? 'Video call' : 'Audio call'}
                                    </span>
                                  </div>
                                   <div className="text-xs text-gray-500 mt-1">{when}</div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-primary font-medium">{status}</div>
                             
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <>
                  {tabLoading ? (
                    <div className="p-4 space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-center p-3">
                          <div className="w-14 h-14 rounded-full bg-white/20 animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 bg-white/20 animate-pulse rounded"></div>
                            <div className="h-3 w-1/2 bg-white/20 animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentChats.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-white/60 text-sm">No conversations yet</p>
                      <p className="text-white/40 text-xs mt-1">Start chatting with experts</p>
                    </div>
                  ) : (
                    currentChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={`w-full text-left px-5 py-4 border-b border-white/5 hover:bg-white/10 transition-all duration-200 flex gap-3 focus:outline-none group ${
                          selectedChat?.id === chat.id ? "bg-white/15 border-l-4 border-l-white" : ""
                        }`}
                        aria-current={selectedChat?.id === chat.id ? "true" : undefined}
                      >
                        {/* Profile Photo */}
                        <div className="flex-shrink-0 relative">
                          {chat.otherParticipant?.photo_url ? (
                            <img 
                              src={chat.otherParticipant.photo_url} 
                              alt={chat.otherParticipant.display_name || "User"}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white/30 group-hover:border-white/50 transition-all"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30 group-hover:border-white/50 transition-all">
                              {(chat.otherParticipant?.display_name || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          {/* Online indicator - using isOnline from API */}
                          {chat.otherParticipant?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#22542F]"></div>
                          )}
                        </div>
                        
                        {/* Chat Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-base truncate group-hover:text-white transition-colors">
                              {chat.otherParticipant?.display_name || "Unknown"}
                              {chat.otherParticipant?.isTeacher && (
                                <span className="ml-2 text-[11px] px-2 py-0.5 bg-white/10 text-white rounded-full font-semibold">Teacher</span>
                              )}
                              {chat.otherParticipant?.isStudent && (
                                <span className="ml-2 text-[11px] px-2 py-0.5 bg-white/10 text-white rounded-full font-semibold">Student</span>
                              )}
                            </span>
                            {chat.type === "paid" && (
                              <span className="text-[10px] bg-amber-400/90 text-amber-900 px-2 py-1 rounded-full flex-shrink-0 ml-2 font-bold">
                               PAID
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-white/70 truncate group-hover:text-white/80 transition-colors">
                            {chat.last_message || "Start a conversation..."}
                          </span>
                          {/* If reference data exists, show a subtle line */}
                          {/* {(chat.limborefData?.display_name || chat.studentRefData?.display_name) && (
                            <span className="text-[11px] text-white/50 mt-0.5">
                              {chat.limborefData?.display_name ? `Ref: ${chat.limborefData.display_name}` : ''}
                              {chat.studentRefData?.display_name ? (chat.limborefData?.display_name ? ` • ${chat.studentRefData.display_name}` : `Ref: ${chat.studentRefData.display_name}`) : ''}
                            </span>
                          )} */}
                          <span className="text-[10px] text-white/50">
                            {chat.last_message_time?.seconds
                              ? new Date(chat.last_message_time.seconds * 1000).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Now"}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </>
              )}
            </nav>
          </aside>

          {/* Main Chat Section - Hidden on mobile when no chat is selected */}
          <section className={`flex-1 w-full sm:w-[60%] flex flex-col bg-gradient-to-br from-gray-50 to-white ${
            !showChatSection ? 'hidden md:flex' : 'flex'
          }`}>
            {activeTab === "calls" ? (
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Call History</h3>
                {calls.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No calls found yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Calls will appear here when you have call activity.</p>
                  </div>
                ) : (
                //   <div className="space-y-4">
                //     {calls.map((call) => {
                //       const status = call.call_ended ? 'Ended' : (call.call_declined ? 'Declined' : (call.ringing ? 'Ringing' : 'Scheduled'));
                //       const type = call.isVideo ? 'Video' : 'Audio';
                //       const when = formatCallWhen(call.call_when);
                //       const participants = getParticipantIds(call).join(', ');
                //       return (
                //         <div key={call.id} className="bg-white rounded-xl p-4 shadow-sm border">
                //           <div className="flex items-start justify-between gap-4">
                //             <div className="flex-1">
                //               <div className="flex items-center gap-3">
                //                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22542F] to-[#1a4023] flex items-center justify-center text-white font-bold">
                //                   {/* kept as decorative avatar for the call */}
                //                   {type === 'Video' ? 'VC' : 'AC'}
                //                 </div>
                //                 <div>
                //                   {/* Show the participant opposite the current user */}
                //                   <div className="font-semibold">{
                //                     (() => {
                //                       const limboId = getRefId(call.limbo_ref);
                //                       const limbo2Id = getRefId(call.limbo_ref2);
                //                       const showUp = !!(limboId && currentUserId && limboId === currentUserId);
                //                       const name = (limbo2Id && limbo2Id === currentUserId) ? (call.limbo_ref_name || limboId || 'Unknown') : ((limboId && limboId === currentUserId) ? (call.limbo_ref2_name || limbo2Id || 'Unknown') : (call.limbo_ref_name || call.limbo_ref || 'Unknown'));
                //                       return (
                //                         <span className="inline-flex items-center gap-2">
                //                           <span>{name}</span>
                //                           <span className={`text-sm ${showUp ? 'text-red-400' : 'text-green-400'}`}>{showUp ? '⬆' : '⬇'}</span>
                //                         </span>
                //                       );
                //                     })()
                //                   }</div>
                //                   <div className="text-sm text-gray-500">{
                //                     (() => {
                //                       const limboId = getRefId(call.limbo_ref);
                //                       const limbo2Id = getRefId(call.limbo_ref2);
                //                       const left = call.limbo_ref_name || limboId;
                //                       const right = call.limbo_ref2_name || limbo2Id;
                //                       if (left && right) return `${left} → ${right}`;
                //                       return participants || 'Participants not available';
                //                     })()
                //                   }</div>
                //                   <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                //                     <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${call.isVideo ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800'}`}>
                //                       {call.isVideo ? 'Video call' : 'Audio call'}
                //                     </span>
                //                     <span className="text-xs text-gray-400">Token: {call.token_id ? `${String(call.token_id).slice(0,24)}...` : 'N/A'}</span>
                //                   </div>
                //                   {/* <div className="text-xs text-gray-400 mt-1 flex gap-2">
                //                     <span className={`${call.student_joined ? 'text-emerald-600' : 'text-gray-400'}`}>{call.student_joined ? 'Student joined' : 'Student not joined'}</span>
                //                     <span className={`${call.teacher_joined ? 'text-emerald-600' : 'text-gray-400'}`}>{call.teacher_joined ? 'Teacher joined' : 'Teacher not joined'}</span>
                //                   </div> */}
                //                 </div>
                //               </div>
                //             </div>
                //             <div className="text-right">
                //               <div className="text-sm font-medium">{status}</div>
                //               <div className="text-xs text-gray-500 mt-1">{when}</div>
                //             </div>
                //           </div>
                //         </div>
                //       );
                //     })}
                //   </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22542F] to-[#1a4023] flex items-center justify-center text-white font-bold">
                      {/* Phone icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92V21a1 1 0 0 1-1.11 1 19 19 0 0 1-8.63-3.07 19 19 0 0 1-6-6A19 19 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.7.34 1.38.66 2.02a1 1 0 0 1-.24 1L7.91 7.91a15 15 0 0 0 6 6l1.14-1.14a1 1 0 0 1 1-.24c.64.32 1.32.54 2.02.66a1 1 0 0 1 .75 1V21z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-800">Call History</div>
                      <div className="text-sm text-gray-500">Recent call activity will appear here</div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Back button for mobile */}
                    <button
                      onClick={handleBackToSidebar}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Back to conversations"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Profile Photo in Header */}
                    {selectedChat?.otherParticipant?.photo_url ? (
                      <div className="relative">
                        <img 
                          src={selectedChat.otherParticipant.photo_url} 
                          alt={selectedChat.otherParticipant.display_name || "User"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#22542F]/20"
                        />
                        {/* Online indicator - using isOnline from API */}
                        {selectedChat.otherParticipant?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    ) : selectedChat ? (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22542F] to-[#1a4023] flex items-center justify-center text-white font-bold text-lg border-2 border-[#22542F]/20">
                        {(selectedChat.otherParticipant?.display_name || "U").charAt(0).toUpperCase()}
                      </div>
                    ) : null}
                    
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selectedChat?.otherParticipant?.display_name || "Select a chat"}
                      </h2>
                      {selectedChat?.type === "paid" ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                           Paid Consultation
                          </span>
                        </div>
                      ) : selectedChat ? (
                        // Show "Online" based on isOnline property
                        selectedChat.otherParticipant?.isOnline ? (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Online
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 font-medium">Offline</span>
                        )
                      ) : null}

                      {/* Show reference info if available */}
                      {/* {(selectedChat?.limborefData?.display_name || selectedChat?.studentRefData?.display_name) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedChat?.limborefData?.display_name && (
                            <span className="mr-2">Ref: {selectedChat.limborefData.display_name}</span>
                          )}
                          {selectedChat?.studentRefData?.display_name && (
                            <span>Student Ref: {selectedChat.studentRefData.display_name}</span>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                  {selectedChat && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 hidden md:block">
                        {selectedChat.last_message_time?.seconds
                          ? new Date(selectedChat.last_message_time.seconds * 1000).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "Now"}
                      </span>
                      
                      {selectedChat.type === 'paid' && (
                        <>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Video className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Phone className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isTeacherUser) {
                                setJobCompletedDialogOpen(true);
                              } else {
                                setReviewDialogOpen(true);
                              }
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={isTeacherUser ? "Open job completed dialog" : "Open review expert dialog"}
                          >
                            <Menu className="w-5 h-5 text-gray-600" />
                          </button>
                        </>
                      )}

                      {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button> */}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-br from-[#E8ECE4]/20 to-white">
                  {!selectedChat ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#22542F]/10 to-[#1a4023]/5 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-[#22542F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Select a conversation to start messaging</p>
                      <p className="text-gray-400 text-sm mt-1">Choose from your conversations on the left</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#22542F]/10 to-[#1a4023]/5 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-[#22542F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Start a conversation with {selectedChat.otherParticipant?.display_name}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">Send your first message below</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => {
                        const isMe = msg.from?.uid === currentUserId;
                        return (
                          <div
                            key={msg.id || idx}
                            className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} animate-fadeIn`}
                          >
                            {/* Profile Photo for Message */}
                            {!isMe && selectedChat?.otherParticipant?.photo_url ? (
                              <img 
                                src={selectedChat.otherParticipant.photo_url} 
                                alt={msg.senderName || "User"}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1 ring-2 ring-[#22542F]/20"
                              />
                            ) : !isMe ? (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#22542F]/20 to-[#1a4023]/10 flex items-center justify-center text-[#22542F] font-bold text-sm flex-shrink-0 mt-1">
                                {(msg.senderName || "U").charAt(0).toUpperCase()}
                              </div>
                            ) : null}
                            
                            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-md`}>
                              {msg.sharedImage && (
                                isVideoUrl(msg.sharedImage) ? (
                                  <video
                                    controls
                                    className="w-full rounded-2xl mb-2 shadow-lg border border-gray-200 cursor-pointer"
                                    onClick={() => openMessageDialogFor(msg)}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      openMessageDialogFor(msg);
                                    }}
                                  >
                                    <source src={msg.sharedImage} />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <img
                                    src={msg.sharedImage}
                                    alt="Shared"
                                    className="w-full rounded-2xl mb-2 shadow-lg border border-gray-200 cursor-pointer"
                                    onClick={() => openMessageDialogFor(msg)}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      openMessageDialogFor(msg);
                                    }}
                                  />
                                )
                              )}
                              {msg.text && (
                                <div
                                  className={`rounded-2xl px-0 py-0 mb-1.5 shadow-sm ${
                                    isMe
                                      ? "bg-primary text-white"
                                      : "bg-white text-gray-900 border border-gray-200"
                                  } cursor-pointer relative min-w-[120px] max-w-[70vw] break-words whitespace-pre-line`}
                                  onClick={() => openMessageDialogFor(msg)}
                                  onContextMenu={e => {
                                    e.preventDefault();
                                    openMessageDialogFor(msg);
                                  }}
                                >
                                  {msg.text.startsWith('↩️') && (
                                    <div className="rounded-t-lg rounded-br-lg bg-[#2e6a3e] px-3 pt-2 pb-1 flex flex-col" style={{borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 0, borderBottomLeftRadius: 0}}>
                                      <span className="text-xs font-bold text-white">You</span>
                                      <span className="text-xs text-white/80">{msg.text.split('\n')[0].replace(/^↩️\s*You: /, '').replace(/^↩️\s*/, '')}</span>
                                    </div>
                                  )}
                                  <div className="px-4 py-2">
                                    <span className="block text-base leading-relaxed">{msg.text.startsWith('↩️') ? msg.text.split('\n').slice(1).join('\n') : msg.text}</span>
                                    <span className="block text-xs text-gray-200 text-right mt-1">{msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}</span>
                                  </div>
                                </div>
                              )}
                              {/* <span className={`text-xs text-gray-400 ${isMe ? "mr-2" : "ml-2"} flex items-center gap-1`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {msg.timestamp?.seconds
                                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Now"}
                              </span> */}
                            </div>
                            
                            {/* Spacer for sent messages to maintain alignment */}
                            {isMe && <div className="w-9 flex-shrink-0" />}
                          </div>
                        );
                      })}
                      {/* <div ref={messagesEndRef} /> */}
                    </>
                  )}
                </div>

                {isSelectedChatLockedForPayment && (
                  <div className="mx-6 mb-3 mt-1 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800 font-semibold">This paid chat is locked until payment is completed.</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {isTeacherUser
                        ? "Waiting for the student to complete payment."
                        : "Complete payment to unlock messaging with your expert."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {!isTeacherUser && (
                        <button
                          type="button"
                          onClick={handlePayToChat}
                          className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-[#255c31] transition-colors disabled:opacity-60"
                          disabled={startingPayment}
                        >
                          {startingPayment ? "Redirecting..." : "Pay to Chat"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleOpenSupportTicket}
                        className="h-10 px-4 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
                      >
                        Report Payment/Refund Issue
                      </button>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                {replyTo && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-[#e6efe6] border-l-4 border-[#22542F] rounded-t-lg mb-[-8px]">
                    <span className="text-xs text-gray-500">Replying to</span>
                    <span className="font-semibold text-xs text-gray-700 truncate max-w-[120px]">{replyTo.senderName}</span>
                    <span className="text-xs text-gray-600 italic truncate max-w-[120px]">{replyTo.text}</span>
                    <button className="ml-auto text-gray-400 hover:text-gray-700" onClick={() => setReplyTo(null)}>&times;</button>
                  </div>
                )}
                <form
                  className="flex items-center gap-3 px-6 py-4 bg-white border-t border-gray-200 shadow-lg"
                  onSubmit={handleSendMessage}
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleMediaPick}
                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={!selectedChat || uploadingMedia || isSelectedChatLockedForPayment}
                    title="Attach image or video"
                  >
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </button>
                  
                  <input
                    type="text"
                    placeholder={selectedChat ? "Type your message..." : "Select a chat first"}
                    className="flex-1 rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] bg-gray-50 text-gray-900 disabled:opacity-50 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!selectedChat || sendingMessage || isSelectedChatLockedForPayment}
                  />
                  
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#22542F] to-[#1a4023] hover:shadow-lg text-white rounded-full p-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={!selectedChat || sendingMessage || !input.trim() || isSelectedChatLockedForPayment}
                  >
                    {sendingMessage ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
      <MessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        message={dialogPayload?.text || dialogPayload?.message_text}
        imageUrl={dialogPayload?.sharedImage}
        isMine={dialogPayload?.from?.uid === currentUserId}
        onReply={handleReply}
        onSaveEdit={handleEdit}
        onReport={handleReport}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />

      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        name={currentUserName}
        message={dialogPayload?.text || dialogPayload?.message_text || ""}
        onSubmit={handleSubmitReport}
        loading={reportLoading}
      />

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-[470px] w-[95vw] p-0 gap-0 overflow-hidden bg-[#D6DBE0] border-0 [&>button]:hidden">
          <div className="bg-primary text-white px-5 py-4 flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold leading-none">Review Your Expert</DialogTitle>
            <button
              type="button"
              onClick={() => setReviewDialogOpen(false)}
              className="w-12 h-12 rounded-2xl border border-white/70 text-white text-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close review dialog"
            >
              X
            </button>
          </div>

          <div className="px-4 py-5">
            <div className="flex items-center justify-center gap-1.5 mb-5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="p-1"
                  onClick={() => setExpertRating(value)}
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-9 h-9 ${value <= expertRating ? "text-[#B89A45] fill-[#B89A45]" : "text-[#A7A7A7] fill-[#A7A7A7]"}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              className="w-full min-h-[150px] rounded-2xl border-2 border-primary bg-white px-5 py-4 text-2xl text-black placeholder:text-black/90 focus:outline-none focus:ring-0"
              placeholder="Review"
              value={expertReview}
              onChange={(e) => setExpertReview(e.target.value)}
            />

            <select
              value={reviewCategory}
              onChange={(e) => setReviewCategory(e.target.value)}
              className="w-full h-16 mt-6 rounded-xl border-2 border-primary bg-white px-5 text-2xl text-black focus:outline-none"
            >
              <option value="">Categories</option>
              {reviewCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <p className="text-center text-2xl text-black mt-8 leading-tight">
              Leave a review and rating to release payment to your expert.
            </p>

            <button
              type="button"
              onClick={handleSubmitExpertReview}
              className="w-full h-16 mt-8 rounded-xl bg-primary text-white text-2xl font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.25)] hover:bg-[#255c31] transition-colors disabled:opacity-60"
              disabled={completingJob || !canCompleteJob}
            >
              {completingJob ? "Processing..." : "Submit Review & Release Payment"}
            </button>

            <button
              type="button"
              onClick={handleSkipExpertReview}
              className="w-full h-16 mt-6 rounded-xl bg-primary text-white text-2xl font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.25)] hover:bg-[#255c31] transition-colors"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={handleOpenSupportTicket}
              className="w-full mt-6 text-center text-lg text-[#2D45CE]"
            >
              Any issues contact support. or request a refund ticket
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Completed Dialog - For Experts */}
      <Dialog open={jobCompletedDialogOpen} onOpenChange={setJobCompletedDialogOpen}>
        <DialogContent className="max-w-[470px] w-[95vw] p-0 gap-0 overflow-hidden bg-white border-0 [&>button]:hidden flex flex-col items-center justify-center min-h-[300px] rounded-2xl">
          <div className="w-full flex flex-col items-center gap-6 p-8">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 text-center">Job Completed</h2>

            {!isPaymentReleasedToExpert && (
              <p className="text-center text-sm text-gray-500">
                Payment is released after the student submits a review.
              </p>
            )}

            <div className="w-full space-y-3">
              {/* Job Completed Button */}
              <button
                type="button"
                onClick={handleCompleteJob}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-[#22542F] to-[#1a4023] text-white text-lg font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.25)] hover:shadow-lg transition-all"
                disabled={completingJob || !isPaymentReleasedToExpert}
              >
                {completingJob ? "Processing..." : "Job Completed"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setJobCompletedDialogOpen(false)}
                className="w-full h-14 rounded-xl border-2 border-gray-300 text-gray-700 text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Message Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full border rounded-md p-2 min-h-[80px]"
            value={editInput}
            onChange={e => setEditInput(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 justify-end mt-4">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setEditDialogOpen(false)}
            >Cancel</button>
            <button
              className="px-4 py-2 rounded bg-[#22542F] text-white hover:bg-[#1a4023]"
              onClick={handleSaveEditDialog}
              disabled={!editInput.trim()}
            >Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatScreen;
