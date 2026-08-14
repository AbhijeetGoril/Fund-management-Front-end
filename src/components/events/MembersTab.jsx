import { useState } from "react";
import { UserGroupIcon, UserPlusIcon, PhoneIcon, CurrencyRupeeIcon, ShieldCheckIcon, PencilIcon } from "@heroicons/react/24/outline";
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

const MembersTab = ({ event, members = [], onAddMember, isAdmin = false }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [payingMember, setPayingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

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

            return (
              <div
                key={m._id}
                className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-base-200 bg-base-100/60 hover:border-base-300 hover:shadow-sm transition-all duration-200"
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
                      onClick={() => setEditingMember(m)}
                      className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-all duration-200"
                      aria-label="Edit member"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {isAdmin && owesMoney && !fullyPaid && (
                    <button
                      onClick={() => setPayingMember(m)}
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