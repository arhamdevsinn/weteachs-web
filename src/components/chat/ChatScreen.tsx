"use client";
import React from "react";


const mockChats = [
  {
    id: 1,
    name: "Support",
    lastMessage: "How can we help you today?",
    time: "09:00",
    messages: [
      { from: "support", text: "Hello! How can we help you today?", time: "09:00" },
      { from: "me", text: "I have a question about your courses.", time: "09:01" },
    ],
  },
  {
    id: 2,
    name: "Arham Dev",
    lastMessage: "Thanks for your help!",
    time: "08:45",
    messages: [
      { from: "arham", text: "Hi, do you need any help?", time: "08:40" },
      { from: "me", text: "Yes, I need info about pricing.", time: "08:41" },
      { from: "arham", text: "Sure! Please check our pricing page.", time: "08:42" },
      { from: "me", text: "Thanks for your help!", time: "08:45" },
    ],
  },
];

const ChatScreen = () => {
  const [selectedChat, setSelectedChat] = React.useState(mockChats[0]);
  const [input, setInput] = React.useState("");

  return (
    <div className="flex h-[90vh] p-4 w-full bg-white/80 rounded-xl shadow-lg border border-gray-200 ">
      {/* Left: Chat List */}
      <aside className="w-64 bg-primary text-white flex flex-col border-r border-gray-200">
        <div className="px-6 py-4 border-b border-white/20">
          <h2 className="text-lg font-bold tracking-wide">Chats</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full text-left px-5 py-4 border-b border-white/10 hover:bg-white/10 transition flex flex-col gap-1 focus:outline-none ${selectedChat.id === chat.id ? "bg-white/10" : ""}`}
              aria-current={selectedChat.id === chat.id ? "true" : undefined}
            >
              <span className="font-medium text-base">{chat.name}</span>
              <span className="text-xs opacity-80 truncate">{chat.lastMessage}</span>
              <span className="text-[10px] opacity-60 mt-1">{chat.time}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Right: Messages */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-primary  text-white border-b border-gray-200">
          <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
          <span className="text-xs opacity-80">{selectedChat.time}</span>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white/60">
          {selectedChat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-xs mb-1 ${
                  msg.from === "me"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-primary text-white"
                }`}
              >
                {msg.text}
              </div>
              <span className={`text-xs text-gray-400 ${msg.from === "me" ? "mr-2" : "ml-2"}`}>{msg.from === "me" ? "You" : selectedChat.name} • {msg.time}</span>
            </div>
          ))}
        </div>
        {/* Input */}
        <form
          className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200"
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              setSelectedChat(prev => ({
                ...prev,
                messages: [
                  ...prev.messages,
                  { from: "me", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                ],
              }));
              setInput("");
            }
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-indigo-600 text-white rounded-full px-5 py-2 font-medium transition"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatScreen;
