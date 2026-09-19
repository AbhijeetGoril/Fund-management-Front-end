// components/HelpBot/HelpBotWidget.jsx

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle, X, Send, Phone, Bot } from "lucide-react";
import { axiosInstance } from "../../lib/axois";

const OWNER_PHONE_DISPLAY = "+91 8003098076";

const CONTACT_LINKS = [
  {
    key: "call",
    href: "tel:+918003098076",
    label: "Call",
    title: `Call ${OWNER_PHONE_DISPLAY}`,
    external: false,
    className: "btn btn-outline btn-xs rounded-full gap-1",
    icon: true,
  },
  {
    key: "whatsapp",
    href: "https://wa.me/918003098076",
    label: "WhatsApp",
    title: "Chat on WhatsApp",
    external: true,
    className: "btn btn-success btn-outline btn-xs rounded-full gap-1",
    icon: false,
  },
];

const askHelpBot = async ({ message, history }) => {
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
      needsHumanHelp: false,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const { mutate: sendMessage, isPending, error } = useMutation({
    mutationFn: askHelpBot,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, needsHumanHelp: data.needsHumanHelp },
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const nextMessages = [...messages, { role: "user", content: trimmed, needsHumanHelp: false }];
    setMessages(nextMessages);
    setInput("");

    const history = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-7, -1);

    sendMessage({ message: trimmed, history });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div
        className={`mb-4 w-80 sm:w-96 h-[30rem] rounded-3xl shadow-2xl bg-base-100 border border-base-300 flex flex-col overflow-hidden origin-bottom-right transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-content/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm">Help Assistant</p>
              <p className="text-[11px] opacity-80">Ask about this app</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-xs btn-circle text-primary-content hover:bg-primary-content/20"
            aria-label="Close help chat"
          >
            <X size={16} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-3 bg-base-200/30"
        >
          {messages.map((m, i) => (
            <div key={i} className={`chat ${m.role === "user" ? "chat-end" : "chat-start"}`}>
              {m.role === "assistant" && (
                <div className="chat-image avatar">
                  <div className="w-7 h-7 rounded-full bg-secondary/20 ring-1 ring-secondary/40 flex items-center justify-center">
                    <Bot size={14} className="text-secondary" />
                  </div>
                </div>
              )}
              <div
                className={`chat-bubble text-sm leading-relaxed shadow-sm ${
                  m.role === "user" ? "chat-bubble-primary" : "chat-bubble-secondary"
                }`}
              >
                {m.content}
              </div>

              {m.needsHumanHelp && (
                <div className="chat-footer flex gap-2 mt-1.5">
                  {CONTACT_LINKS.map((link) => (
                    
                      <a key={link.key}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={link.className}
                      title={link.title}
                    >
                      {link.icon && <Phone size={12} />}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isPending && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-7 h-7 rounded-full bg-secondary/20 ring-1 ring-secondary/40 flex items-center justify-center">
                  <Bot size={14} className="text-secondary" />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-secondary text-sm opacity-70">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error py-2 px-3 text-xs rounded-xl">
              {error?.response?.data?.error || "Something went wrong. Please try again."}
            </div>
          )}
        </div>

        <div className="border-t border-base-300 p-2.5 flex items-center gap-2 bg-base-100 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            className="input input-bordered input-sm flex-1 rounded-full"
            disabled={isPending}
          />
          <button
            onClick={handleSend}
            disabled={isPending || !input.trim()}
            className="btn btn-primary btn-sm btn-circle shrink-0"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="btn btn-primary btn-circle w-14 h-14 shadow-xl hover:scale-105 transition-transform"
        aria-label={isOpen ? "Close help chat" : "Open help chat"}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default HelpBotWidget;