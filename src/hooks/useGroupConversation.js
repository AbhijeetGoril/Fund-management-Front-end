import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axois";

// Get-or-creates the group conversation for a society or event, and
// returns its id once ready. Kept as one hook (parameterized by kind)
// rather than two nearly-identical ones for society vs event.
export const useGroupConversation = (kind, id) => {
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const endpoint = kind === "society" ? `/chat/society/${id}` : `/chat/event/${id}`;

    axiosInstance
      .get(endpoint)
      .then(({ data }) => {
        if (!cancelled) setConversationId(data.conversation._id);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load group chat.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [kind, id]);

  return { conversationId, isLoading, error };
};