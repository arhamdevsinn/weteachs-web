// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import {
  fetchCommunityQuestions,
  fetchCommentsForQuestion,
  toggleLikeForComment,
  addCommentToQuestion,
  fetchRepliesForComment,
  addReplyToComment,
} from "@/src/utils/communityData";
import { toast } from "sonner";
import Image from "next/image";

const CommunityPost = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [loadingComments, setLoadingComments] = useState<string | null>(null);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [postingComment, setPostingComment] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});


  // 🆕 Reply State
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const [newReplies, setNewReplies] = useState<Record<string, string>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [postingReply, setPostingReply] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const { user } = useAuth();

  // 🕓 Convert timestamp → "x ago"
  function timeAgo(timestamp: any) {
    if (!timestamp) return "";
    const date =
      timestamp?.toDate?.() instanceof Date
        ? timestamp.toDate()
        : new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  }

  // 🔹 Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const data = await fetchCommunityQuestions();
      setQuestions(data || []);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  // 🔹 Load comments for question
  const handleQuestionClick = async (questionId: string) => {
    if (activeQuestionId === questionId) return setActiveQuestionId(null);
    setActiveQuestionId(questionId);
    if (comments[questionId]) return;
    setLoadingComments(questionId);
    const data = await fetchCommentsForQuestion(questionId);
    setComments((prev) => ({ ...prev, [questionId]: data }));
    setLoadingComments(null);
  };

  // 🆕 Load replies for comment
  const handleLoadReplies = async (commentId: string) => {
    if (replies[commentId]) return; // already loaded
    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    const data = await fetchRepliesForComment(commentId);
    setReplies((prev) => ({ ...prev, [commentId]: data }));
    setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
  };

  // 🆕 Post reply
  const handlePostReply = async (commentId: string) => {
    const uid = user?.uid;
    if (!uid) {
      router.push("/auth/login");
      return;
    }
    const text = (newReplies[commentId] || "").trim();
    if (!text) {
      toast.error("Please write a reply");
      return;
    }

    setPostingReply((prev) => ({ ...prev, [commentId]: true }));
    try {
      const created = await addReplyToComment({
        commentId,
        replyText: text,
        limboRef: `/LimboUserMode/${uid}`,
      });

      const optimistic = {
        ...created,
        LimboUser: {
          display_name: user?.displayName || user?.email?.split("@")[0] || "You",
          photo_url: user?.photoURL || "/logo.png",
        },
        created_time: new Date(),
      };

      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), optimistic],
      }));

      setNewReplies((prev) => ({ ...prev, [commentId]: "" }));
      toast.success("Reply posted successfully");
    } catch (err) {
      console.error("Error posting reply:", err);
      toast.error("Failed to post reply");
    } finally {
      setPostingReply((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Post comment
const handlePostComment = async (questionId: string) => {
  const uid = user?.uid;
  if (!uid) {
    router.push("/auth/login");
    return;
  }

  const text = (newComments[questionId] || "").trim();
  const file = selectedFiles[questionId];

  if (!text && !file) {
    toast.error("Please write a comment or attach an image/video");
    return;
  }

  setPostingComment(questionId);
  try {
    const created = await addCommentToQuestion(questionId, text, uid, file);
    setNewComments((prev) => ({ ...prev, [questionId]: "" }));
    setSelectedFiles((prev) => ({ ...prev, [questionId]: null }));
    toast.success("Comment posted successfully");
  } catch (err) {
    console.error("Error posting comment:", err);
    toast.error("Failed to post comment");
  } finally {
    setPostingComment(null);
  }
};


  // Like comment
  const handleLike = async (questionId: string, commentId: string) => {
    const uid = user?.uid;
    if (!uid) {
      router.push("/auth/login");
      return;
    }

    try {
      const updatedComment = await toggleLikeForComment(commentId, uid);
      setComments((prev) => ({
        ...prev,
        [questionId]: prev[questionId].map((c) =>
          c.id === commentId ? updatedComment : c
        ),
      }));
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  // 🔹 UI
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
        🌿 Community Discussions
      </h1>

      {questions.length === 0 ? (
        <p className="text-gray-500 text-center">No community questions found.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 space-y-3">
                <div
                  className="cursor-pointer"
                  onClick={() => handleQuestionClick(q.id)}
                >
                  <h3 className="font-semibold text-lg text-primary">
                    {q.Question}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{q.Description}</p>
                  <button className="text-green-700 text-sm font-medium hover:underline mt-2">
                    {activeQuestionId === q.id ? "Hide" : "View"}
                  </button>
                </div>

   {/* 💬 Comment Input Section */}
<div className="mt-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-3 transition-all duration-200 hover:shadow-md">
  <div className="flex items-center gap-2">
    <input
      type="text"
      placeholder="Write a comment..."
      value={newComments[q.id] || ""}
      onChange={(e) =>
        setNewComments((prev) => ({
          ...prev,
          [q.id]: e.target.value,
        }))
      }
      className="flex-1 bg-gray-50 focus:bg-white border border-gray-300 focus:border-primary/60 rounded-full px-4 py-2 text-sm outline-none transition-all"
    />

    {/* 📎 File Upload Button */}
    <label className="cursor-pointer flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-all duration-150">
      📎
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [q.id]: file || null,
          }));
        }}
        className="hidden"
      />
    </label>

    {/* 🚀 Post Button */}
    <button
      onClick={() => handlePostComment(q.id)}
      disabled={postingComment === q.id}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        postingComment === q.id
          ? "bg-primary/60 text-white cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/90 shadow-sm"
      }`}
    >
      {postingComment === q.id ? "Posting..." : "Post"}
    </button>
  </div>

  {/* 🖼️ Preview Selected File */}
  {selectedFiles[q.id] && (
    <div className="flex items-center gap-3 mt-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
      <div className="relative">
        {selectedFiles[q.id].type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(selectedFiles[q.id])}
            alt="preview"
            className="w-20 h-20 object-cover rounded-md border border-gray-300"
          />
        ) : (
          <video
            src={URL.createObjectURL(selectedFiles[q.id])}
            className="w-28 h-20 rounded-md border border-gray-300"
            controls
          />
        )}

        {/* ❌ Remove Button */}
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs hover:bg-red-600 shadow-sm"
          onClick={() =>
            setSelectedFiles((prev) => ({
              ...prev,
              [q.id]: null,
            }))
          }
        >
          ✕
        </button>
      </div>

      {/* 📄 File Info */}
      <div className="flex flex-col text-xs text-gray-600">
        <span className="font-medium">
          {selectedFiles[q.id]?.name?.slice(0, 20) || "File selected"}
        </span>
        <span>
          {(selectedFiles[q.id]?.size / 1024).toFixed(1)} KB
        </span>
      </div>
    </div>
  )}
</div>
              </div>

              {/* Comments */}
              {activeQuestionId === q.id && (
                <div className="bg-gray-50 border-t border-gray-200 rounded-b-2xl p-4">
                  {loadingComments === q.id ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : comments[q.id]?.length > 0 ? (
                    comments[q.id].map((c) => {
                      const uid = user?.uid;
                      const isLiked = c.LikedUsers?.some((u) => u.uid === uid);
                      const likeCount = c.LikedUsers?.length || 0;
                      return (
                        <div
                          key={c.id}
                          className="p-3 mb-3 bg-white border border-gray-200 rounded-xl"
                        >
                          <div className="flex gap-3">
                            <img
                              src={c.LimboUser?.photo_url || "/logo.png"}
                              alt={c.LimboUser?.display_name || "User"}
                              className="w-9 h-9 rounded-full border object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-green-900 text-sm">
                                  {c.LimboUser?.display_name || "User"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {timeAgo(c.create_when)}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{c.comment_text}</p>
                              {c.image && ( <Image src={c.image} alt="Comment media" width={200} height={200} className="mt-2 rounded-lg max-w-xs border border-gray-300" /> )} {c.video && c.video !== "" && ( <video src={c.video} controls width={200} className="mt-2 rounded-lg max-w-xs border border-gray-300" /> )}
                              <div className="flex items-center gap-2 mt-2">
                       <button 
                       onClick={() => handleLike(q.id, c.id)} 
                       className={`flex items-center gap-1 text-sm ${isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"} transition`} >
                         <span>Like{isLiked ? "❤️" : "🤍"}</span> 
                         <span>{likeCount}</span> 
                         </button> 
                                <button
                                  className="text-xs text-primary hover:underline"
                                  onClick={() => handleLoadReplies(c.id)}
                                >
                                  {replies[c.id]
                                    ? `Hide Replies (${replies[c.id].length})`
                                    : loadingReplies[c.id]
                                      ? "Loading..."
                                      : "View Replies"}
                                </button>

                              </div>

                              {/* Replies */}
                              {replies[c.id] !== undefined && (
                                <div className="ml-10 mt-3 space-y-2">
                                  {loadingReplies[c.id] ? (
                                    <div className="text-xs text-gray-400">Loading replies...</div>
                                  ) : replies[c.id].length === 0 ? (
                                    <div className="text-xs text-gray-400">No replies yet.</div>
                                  ) : (
                                    replies[c.id].map((r) => (
                                      <div
                                        key={r.id}
                                        className="flex gap-2 bg-gray-100 p-2 rounded-lg"
                                      >
                                        <img
                                          src={r.LimboUser?.photo_url || "/logo.png"}
                                          alt={r.LimboUser?.display_name}
                                          className="w-7 h-7 rounded-full border"
                                        />
                                        <div>
                                          <p className="text-xs font-semibold text-gray-700">
                                            {r.LimboUser?.display_name || "User"}
                                          </p>
                                          <p className="text-xs text-gray-600">{r.reply_text}</p>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                  {/* Reply input */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <input
                                      type="text"
                                      placeholder="Write a reply..."
                                      value={newReplies[c.id] || ""}
                                      onChange={(e) =>
                                        setNewReplies((prev) => ({
                                          ...prev,
                                          [c.id]: e.target.value,
                                        }))
                                      }
                                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                                    />
                                    <button
                                      onClick={() => handlePostReply(c.id)}
                                      disabled={postingReply[c.id]}
                                      className="bg-primary text-white px-3 py-1 rounded text-xs"
                                    >
                                      {postingReply[c.id] ? "..." : "Reply"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm italic">No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPost;
