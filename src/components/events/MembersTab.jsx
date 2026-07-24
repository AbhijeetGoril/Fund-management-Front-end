import { useState } from "react";
import { UserGroupIcon, UserPlusIcon, PhoneIcon } from "@heroicons/react/24/outline";

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

const MembersTab = ({ event, members = [], onAddMember }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredMembers =
    activeFilter === "all"
      ? members
      : members.filter((m) => m.role === activeFilter);

  const countFor = (key) =>
    key === "all" ? members.length : members.filter((m) => m.role === key).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {f.label} <span className="opacity-70">({countFor(f.key)})</span>
            </button>
          ))}
        </div>

        <button
          onClick={onAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <UserPlusIcon className="h-4 w-4" />
          Add Participant
        </button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-16">
          <UserGroupIcon className="h-10 w-10 mx-auto text-base-content/20 mb-3" />
          <p className="text-base-content/50">
            No {activeFilter === "all" ? "members" : activeFilter + "s"} yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((m) => {
            const displayEmail = m.user?.email || m.email;
            const displayPhone = m.phone; // only ever set for offline/guest members

            return (
              <div
                key={m._id}
                className="flex items-center justify-between p-4 rounded-xl border border-base-200 hover:border-base-300 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {(m.user?.name || m.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-base-content">
                      {m.user?.name || m.name || "Unnamed"}
                    </p>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-base-content/50">
                      <span className="capitalize">{m.role}</span>
                      {displayEmail && (
                        <>
                          <span>·</span>
                          <span>{displayEmail}</span>
                        </>
                      )}
                      {displayPhone && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" />
                            {displayPhone}
                          </span>
                        </>
                      )}
                      {!displayEmail && !displayPhone && <span>No contact info</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-base-content">
                    ₹{(m.amountPaid ?? 0).toLocaleString()} / ₹{(m.amountToPay ?? 0).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      paymentBadgeClass[m.paymentStatus] || "bg-base-200 text-base-content/60"
                    }`}
                  >
                    {m.paymentStatus || "pending"}
                  </span>
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