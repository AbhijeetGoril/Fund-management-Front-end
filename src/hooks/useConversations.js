import { useState, useEffect, useCallback } from "react";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axois";

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(() => {
    return axiosInstance
      .get("/chat/conversations")
      .then(({ data }) => setConversations(data.conversations))
      .catch((err) => console.error("Failed to load conversations:", err));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchConversations().finally(() => setIsLoading(false));
  }, [fetchConversations]);

  // When any conversation gets a new message (even one not currently
  // open), bump it to the top of the list and update its preview —
  // re-fetching the whole list is simplest and cheap enough at this scale.
  useEffect(() => {
    const handleUpdate = () => {
      fetchConversations();
    };

    socket.on("conversation:updated", handleUpdate);
    return () => socket.off("conversation:updated", handleUpdate);
  }, [fetchConversations]);

  return { conversations, isLoading, refetch: fetchConversations };
};