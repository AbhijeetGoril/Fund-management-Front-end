import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { axiosInstance } from "../lib/axois";
import { toast } from "react-toastify";
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellSolid } from "@heroicons/react/24/solid";

const fetchNotifications = async () => {
  const { data } = await axiosInstance.get("/notification");
  return data;
};

const markAsReadApi = async (id) => {
  const { data } = await axiosInstance.patch(`/notification/${id}/read`);
  return data;
};

const markAllAsReadApi = async () => {
  const { data } = await axiosInstance.patch("/notification/read-all");
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

const TYPE_TABS = [
  { key: "all", label: "All" },
  {
    key: "invitations",
    label: "Invitations",
    types: ["invitation_received", "invitation_accepted", "invitation_rejected"],
  },
  {
    key: "events",
    label: "Events",
    types: ["participant_added", "event_created", "event_updated", "event_reminder"],
  },
  { key: "payments", label: "Payments", types: ["donation_received", "expense_added"] },
];

const typeStyles = {
  invitation_received: { icon: "✉️", ring: "ring-primary/20", bg: "bg-primary/10" },
  invitation_accepted: { icon: "✅", ring: "ring-success/20", bg: "bg-success/10" },
  invitation_rejected: { icon: "❌", ring: "ring-error/20", bg: "bg-error/10" },
  participant_added: { icon: "👤", ring: "ring-secondary/20", bg: "bg-secondary/10" },
  event_created: { icon: "📅", ring: "ring-info/20", bg: "bg-info/10" },
  event_updated: { icon: "📅", ring: "ring-info/20", bg: "bg-info/10" },
  event_reminder: { icon: "⏰", ring: "ring-warning/20", bg: "bg-warning/10" },
  donation_received: { icon: "💰", ring: "ring-success/20", bg: "bg-success/10" },
  expense_added: { icon: "💸", ring: "ring-error/20", bg: "bg-error/10" },
};

const defaultStyle = { icon: "🔔", ring: "ring-base-300", bg: "bg-base-200" };

const SkeletonRow = () => (
  <div className="p-4 flex gap-3 animate-pulse">
    <div className="h-10 w-10 rounded-full bg-base-300 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-1/3 bg-base-300 rounded" />
      <div className="h-3 w-2/3 bg-base-300 rounded" />
    </div>
  </div>
);

const NotificationsPage = () => {
  const [readTab, setReadTab] = useState("unread"); // "unread" | "all"
  const [typeTab, setTypeTab] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Single fetch — everything else is filtered client-side below
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["event"] });
  };

  const { mutate: markAsRead } = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.", { position: "top-right" });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Could not mark all as read.", {
        position: "top-right",
      }),
  });

  const { mutateAsync: acceptInvitation, isPending: isAccepting } = useMutation({
    mutationFn: acceptInvitationApi,
    onSuccess: (data) => {
      invalidateAll();
      toast.success(data?.message || "Invitation accepted!", { position: "top-right" });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Could not accept invitation.", {
        position: "top-right",
      }),
  });

  const { mutateAsync: rejectInvitation, isPending: isRejecting } = useMutation({
    mutationFn: rejectInvitationApi,
    onSuccess: (data) => {
      invalidateAll();
      toast.success(data?.message || "Invitation rejected.", { position: "top-right" });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Could not reject invitation.", {
        position: "top-right",
      }),
  });

  const allNotifications = data?.notifications ?? [];
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  // Client-side filtering — no extra API calls when switching tabs
  const readFiltered =
    readTab === "unread" ? allNotifications.filter((n) => !n.isRead) : allNotifications;

  const filteredNotifications =
    typeTab === "all"
      ? readFiltered
      : readFiltered.filter((n) =>
          TYPE_TABS.find((t) => t.key === typeTab)?.types?.includes(n.type)
        );

  const countFor = (tab) =>
    tab.key === "all" ? readFiltered.length : readFiltered.filter((n) => tab.types?.includes(n.type)).length;

  const handleRowClick = (n) => {
    if (!n.isRead) markAsRead(n._id);
    if (n.type === "invitation_received") return; // stays for its own buttons
    if (n.link) navigate(n.link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2.5">
            {unreadCount > 0 ? (
              <BellSolid className="h-6 w-6 text-primary" />
            ) : (
              <BellIcon className="h-6 w-6" />
            )}
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-sm text-base-content/50 mb-5">
          Stay up to date on invitations, events, and payments.
        </p>

        {/* Unread / All toggle */}
        <div className="flex gap-2 mb-3">
          {["unread", "all"].map((key) => (
            <button
              key={key}
              onClick={() => setReadTab(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                readTab === key
                  ? "bg-primary text-primary-content shadow-sm"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Type tabs + Mark all as read */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTypeTab(tab.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  typeTab === tab.key
                    ? "bg-base-300 text-base-content font-semibold"
                    : "bg-base-200 text-base-content/50 hover:bg-base-300"
                }`}
              >
                {tab.label} <span className="opacity-70">({countFor(tab)})</span>
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 transition-all"
            >
              <CheckIcon className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-lg border border-base-200/50 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-base-200">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-error font-medium">Failed to load notifications.</p>
              <p className="text-xs text-base-content/40 mt-1">Please try refreshing the page.</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              {readTab === "unread" ? (
                <CheckIcon className="h-12 w-12 mx-auto text-base-content/15 mb-3" />
              ) : (
                <InboxIcon className="h-12 w-12 mx-auto text-base-content/15 mb-3" />
              )}
              <p className="text-base-content/50 font-medium">
                {readTab === "unread" ? "You're all caught up" : "Nothing here yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {filteredNotifications.map((n) => {
                const style = typeStyles[n.type] || defaultStyle;
                const hasPendingInvite =
                  n.type === "invitation_received" &&
                  n.relatedInvitation &&
                  n.relatedInvitation.status === "pending";
                const hasResolvedInvite =
                  n.type === "invitation_received" &&
                  n.relatedInvitation &&
                  n.relatedInvitation.status !== "pending";

                return (
                  <div
                    key={n._id}
                    onClick={() => handleRowClick(n)}
                    className={`p-4 flex gap-3 transition-colors relative cursor-pointer ${
                      !n.isRead ? "bg-primary/[0.04] hover:bg-primary/[0.07]" : "hover:bg-base-200/40"
                    }`}
                  >
                    {!n.isRead && (
                      <span className="absolute left-1.5 top-6 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}

                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-lg shrink-0 ring-4 ${style.bg} ${style.ring}`}
                    >
                      {style.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            !n.isRead
                              ? "font-semibold text-base-content"
                              : "font-medium text-base-content/80"
                          }`}
                        >
                          {n.title}
                        </p>
                        <span className="text-xs text-base-content/40 shrink-0 whitespace-nowrap">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-base-content/60 mt-0.5 leading-snug">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        {!n.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n._id);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-base-200 text-base-content/70 rounded-lg hover:bg-base-300 transition-all"
                          >
                            <CheckIcon className="h-3 w-3" />
                            Mark read
                          </button>
                        )}

                        {hasResolvedInvite && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                              n.relatedInvitation.status === "accepted"
                                ? "bg-success/10 text-success"
                                : "bg-error/10 text-error"
                            }`}
                          >
                            {n.relatedInvitation.status === "accepted" ? (
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                            ) : (
                              <XCircleIcon className="h-3.5 w-3.5" />
                            )}
                            {n.relatedInvitation.status}
                          </span>
                        )}
                      </div>

                      {hasPendingInvite && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptInvitation(n.relatedInvitation._id);
                            }}
                            disabled={isAccepting || isRejecting}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-content rounded-lg hover:shadow-md active:scale-95 disabled:opacity-50 transition-all duration-150"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectInvitation(n.relatedInvitation._id);
                            }}
                            disabled={isAccepting || isRejecting}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-base-200 text-base-content rounded-lg hover:bg-base-300 active:scale-95 disabled:opacity-50 transition-all duration-150"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    );
};

export default NotificationsPage;