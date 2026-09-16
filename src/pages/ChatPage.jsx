import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { useConversations } from "../hooks/useConversations";
import { useSelector } from "react-redux";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

function activeConversationHeader(conversation, currentUserId) {
  if (!conversation) return {};

  if (conversation.type === "group") {
    if (conversation.society) return { title: conversation.society.name, subtitle: "Society group chat" };
    if (conversation.event) return { title: conversation.event.title, subtitle: "Event group chat" };
    return { title: "Group", subtitle: "" };
  }

  const other = conversation.participants.find((p) => p._id !== currentUserId);
  return { title: other?.name || other?.email || "Unknown", subtitle: other?.email || "" };
}

export default function ChatPage() {
  const { conversations, isLoading } = useConversations();
  const [searchParams] = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  // If we arrived here via a "Message" button elsewhere (e.g.
  // ?conversation=<id>), pre-select that thread once the list loads.
  useEffect(() => {
    const requested = searchParams.get("conversation");
    if (requested) setActiveConversationId(requested);
  }, [searchParams]);

  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const { title, subtitle } = activeConversationHeader(activeConversation, currentUser?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-base-content">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          <div className="md:col-span-1 bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 overflow-hidden flex flex-col">
            <ConversationList
              conversations={conversations}
              isLoading={isLoading}
              activeConversationId={activeConversationId}
              onSelect={setActiveConversationId}
            />
          </div>

          <div className="md:col-span-2 h-full">
            <ChatWindow
              conversationId={activeConversationId}
              title={title}
              subtitle={subtitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}