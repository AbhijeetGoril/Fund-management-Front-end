// components/HelpBot/HelpBotWidget.jsx
//
// Floating help-chat widget. Drop <HelpBotWidget /> once near the root of
// your app (e.g. in App.jsx) and it renders a chat bubble in the
// bottom-right corner on every page.

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle, X, Send } from "lucide-react";
import { axiosInstance } from "../../lib/axois"; // adjust relative depth if needed

const askHelpBot = async ({ message, history }) => {
  // NOTE: if VITE_API_URL is the bare host (no "/api" suffix), change this
  // to "/api/help-chat" instead.
  const { data } = await axiosInstance.post("/help-chat", { message, history });
  return data;
};

const HelpBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the help assistant. Ask me anything about using this app — joining a society, recording payments, invitations, dues, and more.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const { mutate: sendMessage, isPending, error } = useMutation({
    mutationFn: askHelpBot,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");

    const history = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-7, -1); // last few turns, excluding the message we're about to send

    sendMessage({ message: trimmed, history });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[28rem] rounded-2xl shadow-2xl bg-base-100 border border-base-300 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">Help Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-xs btn-circle text-primary-content"
              aria-label="Close help chat"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`chat ${m.role === "user" ? "chat-end" : "chat-start"}`}>
                <div
                  className={`chat-bubble text-sm ${
                    m.role === "user" ? "chat-bubble-primary" : "chat-bubble-secondary"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary text-sm opacity-70">
                  Thinking…
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-error px-2">
                {error?.response?.data?.error || "Something went wrong. Please try again."}
              </div>
            )}
          </div>

          <div className="border-t border-base-300 p-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              className="input input-bordered input-sm flex-1"
              disabled={isPending}
            />
            <button
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="btn btn-primary btn-sm btn-circle"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="btn btn-primary btn-circle w-14 h-14 shadow-xl"
        aria-label="Open help chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default HelpBotWidget;