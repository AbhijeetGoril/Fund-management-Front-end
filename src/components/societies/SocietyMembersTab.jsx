import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";
import {
  UserGroupIcon,
  UserPlusIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import AddSocietyMemberModal from "./AddSocietyMemberModal";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admins" },
  { key: "member", label: "Members" },
];

const SocietyMembersTab = ({ society, members = [], isAdmin = false }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  const filteredMembers =
    activeFilter === "all"
      ? members
      : members.filter((m) => m.role === activeFilter);

  const countFor = (key) =>
    key === "all" ? members.length : members.filter((m) => m.role === key).length;

  return (
    <div>
      {showAddModal && (
        <AddSocietyMemberModal
          societyId={society._id}
          members={members}
          setShowModal={setShowAddModal}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["society", society._id] })}
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <UserPlusIcon className="h-4 w-4" />
            Add Member
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
              onClick={() => setShowAddModal(true)}
              className="text-sm text-primary font-medium mt-2 hover:underline"
            >
              Add the first one
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredMembers.map((m) => {
            const displayName = m.user?.name || m.name || "Unnamed";
            const displayEmail = m.user?.email || m.email;
            const displayPhone = m.phone;

            return (
              <div
                key={m._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-base-200 hover:border-base-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 ring-2 ring-primary/20 flex items-center justify-center text-sm font-semibold text-base-content shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                    {m.role === "admin" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center ring-2 ring-base-100">
                        <ShieldCheckIcon className="h-2.5 w-2.5 text-primary-content" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-base-content truncate">{displayName}</p>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SocietyMembersTab;