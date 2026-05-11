import React from 'react';
import { CheckCircleIcon, XCircleIcon, CurrencyRupeeIcon } from '@heroicons/react/20/solid';

// ── Normalise API participant → component shape ────────────────────
const normalise = (member) => ({
  id:              member._id,
  name:            member.name,
  email:           member.email,
  avatar:          member.name?.charAt(0)?.toUpperCase() ?? "?",
  expectedAmount:  member.amountToPay      ?? member.expectedAmount  ?? 0,
  amount:          member.amountPaid       ?? member.amount          ?? 0,
  paymentStatus:   member.paymentStatus    ?? (member.hasPaid ? "paid" : "pending"),
});

const MembersTab = ({ event, members = [], onAddMember }) => {
  const totalBudget = event?.budget?.target ?? event?.totalBudget ?? 0;
  const safeMembers = members.map(normalise);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-base-content">
          Participants
          <span className="ml-2 text-sm font-normal text-base-content/50">
            ({safeMembers.length})
          </span>
        </h2>
        <button
          onClick={onAddMember}
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          + Add Participant
        </button>
      </div>

      {safeMembers.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <CurrencyRupeeIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No participants yet</p>
          <p className="text-sm mt-1">Add the first participant to get started.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200/50">
                <tr>
                  <th className="text-left py-3 px-4 rounded-l-xl text-sm font-medium text-base-content/60">Participant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Amount Due</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Amount Paid</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Remaining</th>
                  <th className="text-left py-3 px-4 rounded-r-xl text-sm font-medium text-base-content/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {safeMembers.map((member, index) => {
                  const remaining = member.expectedAmount - member.amount;
                  const isFullyPaid = member.paymentStatus === "paid"    || remaining <= 0;
                  const isPartial   = member.paymentStatus === "partial" || (member.amount > 0 && remaining > 0);

                  return (
                    <tr
                      key={member.id}
                      className={`border-b border-base-200 hover:bg-base-200/30 transition-colors ${
                        index === safeMembers.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-content flex items-center justify-center font-semibold text-sm">
                            {member.avatar}
                          </div>
                          <span className="font-medium text-base-content">{member.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-base-content/70 text-sm">{member.email}</td>

                      {/* Amount Due */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <CurrencyRupeeIcon className="h-4 w-4 text-base-content/50" />
                          <span className="font-medium text-base-content">
                            {member.expectedAmount.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <CurrencyRupeeIcon className="h-4 w-4 text-success" />
                          <span className={`font-medium ${member.amount > 0 ? "text-success" : "text-base-content/50"}`}>
                            {member.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Remaining */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <CurrencyRupeeIcon className="h-4 w-4 text-error" />
                          <span className={`font-bold ${remaining <= 0 ? "text-success" : "text-error"}`}>
                            {Math.max(0, remaining).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-4">
                        {isFullyPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                            <CheckCircleIcon className="h-4 w-4" />
                            Fully Paid
                          </span>
                        ) : isPartial ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                            <CurrencyRupeeIcon className="h-4 w-4" />
                            Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-error/10 text-error text-xs font-medium">
                            <XCircleIcon className="h-4 w-4" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="mt-6 p-4 bg-base-200/30 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-base-content/60 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-base-content">{safeMembers.length}</p>
              </div>
              <div className="text-center">
                <p className="text-base-content/60 text-sm">Total Expected</p>
                <p className="text-2xl font-bold text-warning">
                  ₹{safeMembers.reduce((sum, m) => sum + m.expectedAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-base-content/60 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-success">
                  ₹{safeMembers.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-base-content/60 text-sm">Total Remaining</p>
                <p className="text-2xl font-bold text-error">
                  ₹{safeMembers
                    .reduce((sum, m) => sum + Math.max(0, m.expectedAmount - m.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MembersTab;