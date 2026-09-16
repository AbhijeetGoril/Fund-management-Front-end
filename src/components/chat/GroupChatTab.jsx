import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useGroupConversation } from "../../hooks/useGroupConversation";
import { Loader } from "../Loader";
import ChatWindow from "./ChatWindow";

export default function GroupChatTab({ kind, id, title }) {
  const { conversationId, isLoading, error } = useGroupConversation(kind, id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader size="md" color="primary" variant="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ExclamationTriangleIcon className="h-8 w-8 text-error/50 mb-2" />
        <p className="text-sm text-error font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[500px]">
      <ChatWindow conversationId={conversationId} title={title} subtitle="Group chat" />
    </div>
  );
}