import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";

const MembersTab = ({ event, members, onAddMember }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-base-content">Event Participants</h3>
        <div className="flex gap-3">
          <button
            onClick={onAddMember}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Participant
          </button>
          <Link
            to={`/events/${event.id}/spends`}
            className="px-6 py-3 bg-base-100 text-base-content rounded-2xl font-semibold hover:shadow-md transition-all duration-200 flex items-center gap-2 border border-base-200"
          >
            <ReceiptPercentIcon className="h-5 w-5 text-primary" />
            Track Spends
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-primary-content font-semibold shadow-md">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-base-content">{member.name}</h4>
                  <p className="text-base-content/70 text-sm">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-base-content">
                    {member.hasPaid ? `₹${member.amount}` : "Not Paid"}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      member.hasPaid
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-error/10 text-error border border-error/20"
                    }`}
                  >
                    {member.hasPaid ? (
                      <>
                        <CheckCircleIcon className="h-3 w-3" />
                        Paid
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersTab;