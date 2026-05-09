import React from 'react';
import { CheckCircleIcon, XCircleIcon, CurrencyRupeeIcon } from '@heroicons/react/20/solid';

const MembersTab = ({ event, members, onAddMember }) => {
  const totalBudget = event.totalBudget;
  const perMemberContribution = totalBudget / members.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-base-content">Event Members</h2>
        <button
          onClick={onAddMember}
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          + Add New Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th className="text-left py-3 px-4 rounded-l-xl">Member</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Expected Amount</th>
              <th className="text-left py-3 px-4">Paid Amount</th>
              <th className="text-left py-3 px-4">Remaining Amount</th>
              <th className="text-left py-3 px-4 rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              const expectedAmount = member.expectedAmount || perMemberContribution;
              const remainingAmount = member.remainingAmount || (expectedAmount - member.amount);
              const isPartial = member.hasPaid && remainingAmount > 0;
              
              return (
                <tr
                  key={member.id}
                  className={`border-b border-base-200 hover:bg-base-200/30 transition-colors ${
                    index === members.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-content flex items-center justify-center font-semibold">
                        {member.avatar || member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-base-content">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-base-content/70">{member.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <CurrencyRupeeIcon className="h-4 w-4 text-base-content/50" />
                      <span className="font-medium text-base-content">{expectedAmount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <CurrencyRupeeIcon className="h-4 w-4 text-success" />
                      <span className={`font-medium ${member.hasPaid ? 'text-success' : 'text-base-content/50'}`}>
                        {member.amount.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <CurrencyRupeeIcon className="h-4 w-4 text-error" />
                      <span className={`font-bold ${
                        remainingAmount === 0 ? 'text-success' : 'text-error'
                      }`}>
                        ₹{remainingAmount.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {remainingAmount === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-sm">
                        <CheckCircleIcon className="h-4 w-4" />
                        Fully Paid
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-sm">
                        <CurrencyRupeeIcon className="h-4 w-4" />
                        Partial Payment
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-error/10 text-error text-sm">
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

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-base-200/30 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-base-content/60 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-base-content">{members.length}</p>
          </div>
          <div className="text-center">
            <p className="text-base-content/60 text-sm">Total Expected</p>
            <p className="text-2xl font-bold text-warning">
              ₹{members.reduce((sum, m) => sum + (m.expectedAmount || perMemberContribution), 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-base-content/60 text-sm">Total Paid</p>
            <p className="text-2xl font-bold text-success">
              ₹{members.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-base-content/60 text-sm">Total Remaining</p>
            <p className="text-2xl font-bold text-error">
              ₹{members.reduce((sum, m) => {
                const expected = m.expectedAmount || perMemberContribution;
                const remaining = m.remainingAmount || (expected - m.amount);
                return sum + remaining;
              }, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersTab;