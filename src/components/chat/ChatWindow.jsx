import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useConversationMessages } from "../../hooks/useConversationMessages";
import { Loader } from "../Loader";
import { socket } from "../../lib/socket";

const timeLabel = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatWindow({ conversationId, title, subtitle }) {
  const currentUser = useSelector((state) => state.auth.user);
  const { messages, isLoading, isSending, sendMessage } = useConversationMessages(conversationId);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit fired, text:", text);
    if (!text.trim()) return;
    console.log("calling sendMessage");
    sendMessage(text);
    setText("");
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-base-content/40">
        <ChatBubbleLeftRightIcon className="h-10 w-10 mb-2" />
        <p className="text-sm font-medium">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-2xl border border-base-200/50 overflow-hidden">
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-base-200 bg-base-100/80 backdrop-blur-sm shrink-0">
          {title && <p className="font-semibold text-base-content text-sm">{title}</p>}
          {subtitle && <p className="text-xs text-base-content/50">{subtitle}</p>}
        </div>
      )}

      <div className="px-4 py-1 bg-yellow-100 text-xs font-mono">
        DEBUG: socket.connected = {String(socket.connected)}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader size="md" color="primary" variant="spinner" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-base-content/40 py-8">
            No messages yet — say hello.
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?._id === currentUser?._id;
            return (
              <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  {!isMe && (
                    <span className="text-[11px] text-base-content/40 mb-0.5 px-1">
                      {m.sender?.name || m.sender?.email || "Unknown"}
                    </span>
                  )}
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                      isMe
                        ? "bg-primary text-primary-content rounded-br-sm"
                        : "bg-base-200 text-base-content rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-base-content/35 mt-0.5 px-1">
                    {timeLabel(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-3 border-t border-base-200 bg-base-100 shrink-0"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-base-200 text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="p-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-content disabled:opacity-40 hover:shadow-md active:scale-95 transition-all duration-150 shrink-0"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}