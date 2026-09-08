import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserGroupIcon, UserPlusIcon, PhoneIcon, CurrencyRupeeIcon, ShieldCheckIcon, PencilIcon, CalendarIcon, ExclamationTriangleIcon, BellAlertIcon, EnvelopeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axois";
import RecordPaymentModal from "./RecordPaymentModal";
import EditMemberModal from "./EditMemberModal";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admins" },
  { key: "member", label: "Members" },
  { key: "participant", label: "Participants" },
];

const paymentBadgeClass = {
  paid: "bg-success/10 text-success",
  partial: "bg-warning/10 text-warning",
  pending: "bg-error/10 text-error",
};

const paymentBarClass = {
  paid: "bg-success",
  partial: "bg-warning",
  pending: "bg-error/60",
};

const roleRingClass = {
  admin: "ring-primary/30 from-primary/20 to-primary/5",
  member: "ring-secondary/30 from-secondary/20 to-secondary/5",
  participant: "ring-info/30 from-info/20 to-info/5",
};

// Returns a label + color classes based on how close/overdue the due
// date is relative to today. Thresholds:
//   overdue        -> red    (dueDate has already passed)
//   due today/1-3d -> orange (getting close)
//   due 4-7d       -> blue   (approaching)
//   due 8d+        -> neutral gray (plenty of time)
const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const today = new Date();
  // Zero out time portions so "today" comparisons are day-based, not hour-based
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
  const formatted = due.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (diffDays < 0) {
    return {
      label: `Overdue · ${formatted}`,
      className: "bg-error/10 text-error border border-error/20",
      icon: ExclamationTriangleIcon,
    };
  }
  if (diffDays <= 3) {
    return {
      label: diffDays === 0 ? "Due today" : `Due in ${diffDays}d · ${formatted}`,
      className: "bg-warning/10 text-warning border border-warning/20",
      icon: CalendarIcon,
    };
  }
  if (diffDays <= 7) {
    return {
      label: `Due in ${diffDays}d · ${formatted}`,
      className: "bg-info/10 text-info border border-info/20",
      icon: CalendarIcon,
    };
  }
  return {
    label: `Due ${formatted}`,
    className: "bg-base-200 text-base-content/50 border border-base-300",
    icon: CalendarIcon,
  };
};

const MembersTab = ({ event, members = [], onAddMember, isAdmin = false }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [payingMember, setPayingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: sendReminder, isPending: isSendingReminder } = useMutation({
    mutationFn: async (memberId) => {
      const { data } = await axiosInstance.post(
        `/events/${event._id}/members/${memberId}/remind`
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Reminder sent!", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Could not send reminder.",
        { position: "top-right" }
      );
    },
  });

  const { data: pendingData } = useQuery({
    queryKey: ["pendingInvitations", event._id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/invitations/event/${event._id}/pending`
      );
      return data;
    },
    enabled: isAdmin, // only admins need to see/manage pending invites
  });
  const pendingInvitations = pendingData?.invitations ?? [];

  const { mutate: cancelInvitation, isPending: isCancelling } = useMutation({
    mutationFn: async (invitationId) => {
      const { data } = await axiosInstance.patch(
        `/invitations/${invitationId}/cancel`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pendingInvitations", event._id] });
      toast.success(data?.message || "Invitation cancelled.", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Could not cancel invitation.",
        { position: "top-right" }
      );
    },
  });

  const filteredMembers =
    activeFilter === "all"
      ? members
      : members.filter((m) => m.role === activeFilter);

  const countFor = (key) =>
    key === "all" ? members.length : members.filter((m) => m.role === key).length;

  return (
    <div>
      {payingMember && (
        <RecordPaymentModal
          eventId={event._id}
          member={payingMember}
          onClose={() => setPayingMember(null)}
        />
      )}

      {editingMember && (
        <EditMemberModal
          eventId={event._id}
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}

      {isAdmin && pendingInvitations.length > 0 && (
        <div className="mb-6 bg-base-200/40 rounded-2xl border border-base-200 p-4">
          <h3 className="text-sm font-semibold text-base-content/70 mb-3 flex items-center gap-1.5">
            <EnvelopeIcon className="h-4 w-4" />
            Pending Invitations ({pendingInvitations.length})
          </h3>
          <div className="space-y-2">
            {pendingInvitations.map((inv) => (
              <div
                key={inv._id}
                className="flex items-center justify-between gap-3 bg-base-100 rounded-xl px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-base-content truncate">{inv.email}</p>
                  <p className="text-xs text-base-content/45">
                    Invited by {inv.invitedBy?.name || "Unknown"}
                  </p>
                </div>
                <button
                  onClick={() => cancelInvitation(inv._id)}
                  disabled={isCancelling}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-error bg-error/10 rounded-lg hover:bg-error/20 transition-all duration-200 disabled:opacity-50 shrink-0"
                >
                  <XCircleIcon className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? "bg-primary text-primary-content shadow-sm"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {f.label} <span className="opacity-70">({countFor(f.key)})</span>
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <UserPlusIcon className="h-4 w-4" />
            Add Participant
          </button>
        )}
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-14 w-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
            <UserGroupIcon className="h-7 w-7 text-base-content/25" />
          </div>
          <p className="text-base-content/50 font-medium">
            No {activeFilter === "all" ? "members" : activeFilter + "s"} yet
          </p>
          {isAdmin && activeFilter === "all" && (
            <button
              onClick={onAddMember}
              className="text-sm text-primary font-medium mt-2 hover:underline"
            >
              Add the first one
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredMembers.map((m) => {
            const displayEmail = m.user?.email || m.email;
            const displayPhone = m.phone;
            const paid = m.amountPaid ?? 0;
            const toPay = m.amountToPay ?? 0;
            const owesMoney = toPay > 0;
            const fullyPaid = m.paymentStatus === "paid";
            const progressPct = toPay > 0 ? Math.min(100, (paid / toPay) * 100) : 0;
            const ringStyle = roleRingClass[m.role] || roleRingClass.participant;
            // Only show a due-date indicator for members who still owe
            // money and haven't paid in full — a fully paid member's
            // deadline is no longer relevant.
            const dueDateStatus = !fullyPaid ? getDueDateStatus(m.dueDate) : null;

            return (
              <div
                key={m._id}
                onClick={() => navigate(`/events/${event._id}/members/${m._id}`)}
                className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-base-200 bg-base-100/60 hover:border-base-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`relative h-11 w-11 rounded-full bg-gradient-to-br ${ringStyle} ring-2 flex items-center justify-center text-sm font-semibold text-base-content shrink-0`}
                  >
                    {(m.user?.name || m.name || "?").charAt(0).toUpperCase()}
                    {m.role === "admin" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center ring-2 ring-base-100">
                        <ShieldCheckIcon className="h-2.5 w-2.5 text-primary-content" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-base-content truncate">
                      {m.user?.name || m.name || "Unnamed"}
                    </p>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-base-content/50 mt-0.5">
                      <span className="capitalize font-medium text-base-content/60">{m.role}</span>
                      {displayEmail && (
                        <>
                          <span className="text-base-content/25">·</span>
                          <span className="truncate">{displayEmail}</span>
                        </>
                      )}
                      {displayPhone && (
                        <>
                          <span className="text-base-content/25">·</span>
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" />
                            {displayPhone}
                          </span>
                        </>
                      )}
                    </div>
                    {dueDateStatus && (
                      <span
                        className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${dueDateStatus.className}`}
                      >
                        <dueDateStatus.icon className="h-3 w-3" />
                        {dueDateStatus.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {owesMoney && (
                    <div className="w-32 hidden sm:block">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-base-content">
                          ₹{paid.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-base-content/40">
                          of ₹{toPay.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-base-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            paymentBarClass[m.paymentStatus] || "bg-base-300"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                      paymentBadgeClass[m.paymentStatus] || "bg-base-200 text-base-content/60"
                    }`}
                  >
                    {owesMoney ? m.paymentStatus || "pending" : "—"}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMember(m);
                      }}
                      className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-all duration-200"
                      aria-label="Edit member"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {isAdmin && owesMoney && !fullyPaid && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendReminder(m._id);
                      }}
                      disabled={isSendingReminder}
                      className="p-1.5 rounded-lg text-base-content/40 hover:text-warning hover:bg-warning/10 transition-all duration-200 disabled:opacity-50"
                      aria-label="Send payment reminder"
                      title="Send payment reminder"
                    >
                      <BellAlertIcon className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {isAdmin && owesMoney && !fullyPaid && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPayingMember(m);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-content rounded-lg hover:shadow-md active:scale-95 transition-all duration-200"
                    >
                      <CurrencyRupeeIcon className="h-3.5 w-3.5" />
                      Pay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MembersTab;