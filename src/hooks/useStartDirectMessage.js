import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axois";

// Get-or-creates a direct conversation with a given user, then
// navigates to /chat with that conversation pre-selected.
export const useStartDirectMessage = () => {
  const navigate = useNavigate();

  const { mutate: startDirectMessage, isPending } = useMutation({
    mutationFn: async (userId) => {
      const { data } = await axiosInstance.post(`/chat/direct/${userId}`);
      return data.conversation;
    },
    onSuccess: (conversation) => {
      navigate(`/chat?conversation=${conversation._id}`);
    },
    onError: (err) => {
      console.error("Failed to start direct message:", err);
    },
  });

  return { startDirectMessage, isPending };
};