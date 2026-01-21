// @ts-nocheck
"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getUserConversations, 
  sendMessage,
  subscribeToMessages
} from "@/src/lib/api/chat";
import {MessageSquareDot} from "lucide-react";
import { auth, db } from "@/src/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdFromUrl = searchParams.get("conversationId") || "";
  
  const [activeTab, setActiveTab] = React.useState("free");
  const [conversations, setConversations] = React.useState([]);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [showChatSection, setShowChatSection] = React.useState(false); // For mobile view
  const [openPaidChatDialog, setOpenPaidChatDialog] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const currentUserId = auth.currentUser?.uid || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
  const currentUserName = auth.currentUser?.displayName || (typeof window !== "undefined" ? localStorage.getItem("userName") : "User");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userConversations = await getUserConversations(currentUserId);
        setConversations(userConversations);
        console.log("User conversations loaded:", userConversations);
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
      }
    };

    loadConversations();
  }, [currentUserId, conversationIdFromUrl]);

  React.useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(selectedChat.id, (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !selectedChat?.id || !currentUserId) {
      return;
    }

    try {
      setSendingMessage(true);
      
      // Always fetch the current user's display name from Firebase
      let senderName = "User"; // Default fallback
      try {
        const userDoc = await getDoc(doc(db, "LimboUserMode", currentUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data from Firebase:", userData);
          senderName = userData.display_name || userData.displayName || userData.name || "User";
          console.log("Sender name to be used:", senderName);
        } else {
          console.warn("User document does not exist for:", currentUserId);
        }
      } catch (fetchError) {
        console.error("Error fetching user data:", fetchError);
      }
      
      console.log("Sending message with sender name:", senderName);
      await sendMessage(selectedChat.id, currentUserId, input.trim(), senderName);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

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

  const currentChats = getCurrentChats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen md:h-[90vh] w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
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
    <div className="bg-gradient-to-br from-[#E8ECE4] via-white to-[#E8ECE4]/50 md:py-2 md:px-6 md:min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white md:rounded-2xl md:shadow-2xl overflow-hidden md:border md:border-gray-100">
          {/* Sidebar - Hidden on mobile when chat is selected */}
          <aside className={`w-full md:w-80 bg-gradient-to-b from-[#22542F] to-[#1a4023] text-white flex flex-col ${
            showChatSection ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-black/10">
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
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {activeTab === "calls" ? (
                <div className="p-4 space-y-3">
                  {mockCallLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{log.name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          log.status === "completed" 
                            ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" 
                            : "bg-red-500/20 text-red-200 border border-red-500/30"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span className="flex items-center gap-2">
                          {log.type === "video" ? "📹" : "📞"} {log.duration}
                        </span>
                        <span>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {currentChats.length === 0 ? (
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
                            </span>
                            {chat.type === "paid" && (
                              <span className="text-[10px] bg-amber-400/90 text-amber-900 px-2 py-1 rounded-full flex-shrink-0 ml-2 font-bold">
                                💎 PAID
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-white/70 truncate group-hover:text-white/80 transition-colors">
                            {chat.last_message || "Start a conversation..."}
                          </span>
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
          <section className={`flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white ${
            !showChatSection ? 'hidden md:flex' : 'flex'
          }`}>
            {activeTab === "calls" ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#22542F] to-[#1a4023] flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Call History</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    View your call logs in the sidebar or start a new video call
                  </p>
                  <button
                    onClick={() => router.push("/download")}
                    className="bg-gradient-to-r from-[#22542F] to-[#1a4023] text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 font-semibold text-sm flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Start Video Call
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h1>
                </div>
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
                            💎 Paid Consultation
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
                      
                      {/* Paid Chat Dialog Trigger */}
                      <Dialog open={openPaidChatDialog} onOpenChange={setOpenPaidChatDialog}>
                        <DialogTrigger asChild>
                          <button className="p-2 hover:bg-amber-50 rounded-full transition-colors group">
                            <MessageSquareDot className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#22542F] flex items-center gap-2">
                               Upgrade to Paid Chat
                            </DialogTitle>
                            <DialogDescription>
                              Get premium access with priority support and extended chat features
                            </DialogDescription>
                          </DialogHeader>
                          
                          {/* Coming Soon Message */}
                          <div className="py-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">Coming Soon!</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                              Paid chat feature with Stripe integration is under development. Stay tuned for premium features!
                            </p>
                            <button
                              onClick={() => setOpenPaidChatDialog(false)}
                              className="px-8 py-3 bg-gradient-to-r from-[#22542F] to-[#1a4023] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                            >
                              Got it
                            </button>
                          </div>

                          {/* 
                          <div className="py-6 space-y-6">
                            {/* Pricing Card */}
                            {/*
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                              <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                                <span className="text-gray-600">/session</span>
                              </div>
                              
                              {/* Features List */}
                              {/*
                              <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-700">Priority response from experts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-700">Extended 60-minute sessions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-700">Screen sharing & file attachments</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-700">Chat history saved indefinitely</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-700">Money-back guarantee</span>
                                </li>
                              </ul>
                            </div>

                            {/* Stripe Payment Form */}
                            {/*
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] transition-all"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">CVC</label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] transition-all"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] transition-all"
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {/*
                            <div className="flex gap-3 pt-4">
                              <button
                                onClick={() => setOpenPaidChatDialog(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  toast.success("Payment successful! Paid chat activated 💎");
                                  setOpenPaidChatDialog(false);
                                }}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#22542F] to-[#1a4023] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                              >
                                Pay $9.99
                              </button>
                            </div>

                            {/* Trust Badges */}
                            {/*
                            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                </svg>
                                Secure Payment
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                SSL Encrypted
                              </div>
                            </div>
                          </div>
                          */}
                        </DialogContent>
                      </Dialog>

                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
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
                                <img 
                                  src={msg.sharedImage} 
                                  alt="Shared" 
                                  className="w-full rounded-2xl mb-2 shadow-lg border border-gray-200"
                                />
                              )}
                              {msg.text && (
                                <div
                                  className={`rounded-2xl px-5 py-3 mb-1.5 shadow-sm ${
                                    isMe
                                      ? "bg-gradient-to-br from-[#22542F] to-[#1a4023] text-white"
                                      : "bg-white text-gray-900 border border-gray-200"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                              )}
                              <span className={`text-xs text-gray-400 ${isMe ? "mr-2" : "ml-2"} flex items-center gap-1`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {msg.timestamp?.seconds
                                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Now"}
                              </span>
                            </div>
                            
                            {/* Spacer for sent messages to maintain alignment */}
                            {isMe && <div className="w-9 flex-shrink-0" />}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input Area */}
                <form
                  className="flex items-center gap-3 px-6 py-4 bg-white border-t border-gray-200 shadow-lg"
                  onSubmit={handleSendMessage}
                >
                  <button
                    type="button"
                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={!selectedChat}
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <input
                    type="text"
                    placeholder={selectedChat ? "Type your message..." : "Select a chat first"}
                    className="flex-1 rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#22542F]/30 focus:border-[#22542F] bg-gray-50 text-gray-900 disabled:opacity-50 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!selectedChat || sendingMessage}
                  />
                  
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#22542F] to-[#1a4023] hover:shadow-lg text-white rounded-full p-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={!selectedChat || sendingMessage || !input.trim()}
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
    </div>
  );
};

export default ChatScreen;
