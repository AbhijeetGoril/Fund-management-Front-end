import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axois";

export const useConversationMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;
  
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    setIsLoading(true);

    axiosInstance
      .get(`/chat/conversations/${conversationId}/messages`)
      .then(({ data }) => {
        if (!cancelled) setMessages(data.messages);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    socket.emit("conversation:join", conversationId);

    return () => {
      cancelled = true;
      socket.emit("conversation:leave", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversation === conversationIdRef.current) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("message:new", handleNewMessage);
    return () => socket.off("message:new", handleNewMessage);
  }, []);

  const sendMessage = useCallback(
    (text) => {
      console.log("sendMessage called with:", text, "conversationId:", conversationId, "socket.connected:", socket.connected);
      if (!text?.trim() || !conversationId) {
        console.log("BAILED — text or conversationId missing");
        return;
      }

      setIsSending(true);
      socket.emit(
        "message:send",
        { conversationId, text: text.trim() },
        (response) => {
          console.log("server responded:", response);
          setIsSending(false);
          if (!response?.success) {
            console.error("Send failed:", response?.message);
          }
        }
      );
    },
    [conversationId]
  );

  return { messages, isLoading, isSending, sendMessage };
};