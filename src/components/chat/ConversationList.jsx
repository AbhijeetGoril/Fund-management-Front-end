import { useSelector } from "react-redux";
import { BuildingLibraryIcon, CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Loader } from "../Loader";

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
};

function conversationDisplay(conversation, currentUserId) {
  if (conversation.type === "group") {
    if (conversation.society) {
      return {
        name: conversation.society.name,
        icon: <BuildingLibraryIcon className="h-5 w-5" />,
        image: conversation.society.logo,
      };
    }
    if (conversation.event) {
      return {
        name: conversation.event.title,
        icon: <CalendarIcon className="h-5 w-5" />,
        image: conversation.event.coverPhoto,
      };
    }
    return { name: "Group", icon: <UserCircleIcon className="h-5 w-5" />, image: null };
  }

  // Direct — show the OTHER participant, not yourself
  const other = conversation.participants.find((p) => p._id !== currentUserId);
  return {
    name: other?.name || other?.email || "Unknown",
    icon: <UserCircleIcon className="h-5 w-5" />,
    image: other?.profilePicture,
  };
}

export default function ConversationList({ conversations, isLoading, activeConversationId, onSelect }) {
  const currentUser = useSelector((state) => state.auth.user);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size="md" color="primary" variant="spinner" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="text-center text-sm text-base-content/40 py-10 px-4">
        No conversations yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-base-200 overflow-y-auto">
      {conversations.map((c) => {
        const { name, icon, image } = conversationDisplay(c, currentUser?._id);
        const isActive = c._id === activeConversationId;

        return (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              isActive ? "bg-primary/10" : "hover:bg-base-200/50"
            }`}
          >
            {image ? (
              <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center text-white shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-base-content truncate">{name}</p>
              <p className="text-xs text-base-content/50 truncate">
                {c.lastMessage?.text || "No messages yet"}
              </p>
            </div>
            {c.lastMessage?.sentAt && (
              <span className="text-[11px] text-base-content/35 shrink-0">
                {timeAgo(c.lastMessage.sentAt)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}