import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { axiosInstance } from "../lib/axois";
import { toast } from "react-toastify";
import { BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const fetchNotifications = async () => {
  const { data } = await axiosInstance.get("/notification");
  return data;
};

const acceptInvitationApi = async (invitationId) => {
  const { data } = await axiosInstance.patch(`/invitations/${invitationId}/accept`);
  return data;
};

const rejectInvitationApi = async (invitationId) => {
  const { data } = await axiosInstance.patch(`/invitations/${invitationId}/reject`);
  return data;
};

// Simple relative-time formatter — no external package needed
const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

// Group notification types into tabs
const TABS = [
  { key: "all", label: "All" },
  { key: "invitations", label: "Invitations", types: ["invitation_received", "invitation_accepted", "invitation_rejected"] },
  { key: "events", label: "Events", types: ["participant_added", "event_created", "event_updated", "event_reminder"] },
  { key: "payments", label: "Payments", types: ["donation_received", "expense_added"] },
];

const typeIcon = {
  invitation_received: "🔴",
  invitation_accepted: "🟢",
  invitation_rejected: "⚪",
  participant_added: "👤",
  event_created: "📅",
  event_updated: "📅",
  event_reminder: "⏰",
  donation_received: "💰",
  expense_added: "💸",
};

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const { mutateAsync: acceptInvitation, isPending: isAccepting } = useMutation({
    mutationFn: acceptInvitationApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast.success(data?.message || "Invitation accepted!", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not accept invitation.", {
        position: "top-right",
      });
    },
  });

  const { mutateAsync: rejectInvitation, isPending: isRejecting } = useMutation({
    mutationFn: rejectInvitationApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data?.message || "Invitation rejected.", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not reject invitation.", {
        position: "top-right",
      });
    },
  });

  const notifications = data?.notifications ?? [];

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) =>
          TABS.find((t) => t.key === activeTab)?.types?.includes(n.type)
        );

  const countFor = (tab) => {
    if (tab.key === "all") return notifications.length;
    return notifications.filter((n) => tab.types?.includes(n.type)).length;
  };

  const handleClick = (n) => {
    if (n.type === "invitation_received") return; // has its own Accept/Reject buttons
    if (n.link) navigate(n.link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <BellIcon className="h-6 w-6" />
            Notifications
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {tab.label} <span className="opacity-70">({countFor(tab)})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-lg border border-base-200/50 overflow-hidden">
          {isLoading ? (
            <p className="text-center text-base-content/50 py-16">Loading...</p>
          ) : isError ? (
            <p className="text-center text-error py-16">Failed to load notifications.</p>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <BellIcon className="h-10 w-10 mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/50">No notifications here yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {filteredNotifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`p-4 flex gap-3 transition-colors ${
                    !n.isRead ? "bg-primary/5" : ""
                  } ${n.type !== "invitation_received" && n.link ? "cursor-pointer hover:bg-base-200/50" : ""}`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{typeIcon[n.type] || "🔔"}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${!n.isRead ? "font-semibold text-base-content" : "text-base-content/80"}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-base-content/40 shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-base-content/60 mt-0.5">{n.message}</p>

                    {n.type === "invitation_received" && n.relatedInvitation.status === "pending" && n.relatedInvitation && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptInvitation(n.relatedInvitation);
                          }}
                          disabled={isAccepting || isRejecting}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-content rounded-lg hover:shadow disabled:opacity-50 transition-all"
                        >
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rejectInvitation(n.relatedInvitation);
                          }}
                          disabled={isAccepting || isRejecting}
                          className="px-3 py-1.5 text-xs font-medium bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;