import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";

const MembersTab = ({ event, members, onAddMember }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Event Participants</h3>
        <div className="flex gap-3">
          <button
            onClick={onAddMember}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Participant
          </button>
          <Link
            to={`/events/${event.id}/spends`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <ReceiptPercentIcon className="h-5 w-5 text-white" />
            Track Spends
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  <p className="text-gray-600 text-sm">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {member.hasPaid ? `₹${member.amount}` : "Not Paid"}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      member.hasPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
