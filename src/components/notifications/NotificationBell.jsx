import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BellIcon } from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

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

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // poll every 30s
  });

  const { mutateAsync: acceptInvitation, isPending: isAccepting } = useMutation({
    mutationFn: acceptInvitationApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["event"] }); // refresh any open event view
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

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recent = notifications.slice(0, 8);

  const handleClickNotification = (n) => {
    // Invitation notifications show Accept/Reject inline instead of navigating
    if (n.type === "invitation_received" && n.link) return;

    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg hover:bg-base-200 transition-all duration-200"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6 text-base-content/70" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-error text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-base-200">
            <h4 className="font-semibold text-base-content text-sm">Notifications</h4>
          </div>

          <div className="max-h-[28rem] overflow-y-auto divide-y divide-base-200">
            {isLoading ? (
              <p className="text-sm text-base-content/50 text-center py-8">Loading...</p>
            ) : recent.length === 0 ? (
              <p className="text-sm text-base-content/50 text-center py-8">
                No notifications yet
              </p>
            ) : (
              recent.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className={`px-4 py-3 hover:bg-base-200/50 transition-colors ${
                    !n.isRead ? "bg-primary/5" : ""
                  } ${n.type !== "invitation_received" ? "cursor-pointer" : ""}`}
                >
                  <div className="flex gap-2">
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                    <div className={`flex-1 ${n.isRead ? "pl-4" : ""}`}>
                      <p
                        className={`text-sm ${
                          n.isRead ? "text-base-content/70" : "text-base-content font-medium"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>

                      {/* Accept/Reject inline for pending invitation notifications */}
                      {n.type === "invitation_received" && n.relatedInvitation && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptInvitation(n.relatedInvitation);
                            }}
                            disabled={isAccepting || isRejecting}
                            className="px-3 py-1 text-xs font-medium bg-primary text-primary-content rounded-lg hover:shadow disabled:opacity-50 transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectInvitation(n.relatedInvitation);
                            }}
                            disabled={isAccepting || isRejecting}
                            className="px-3 py-1 text-xs font-medium bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;