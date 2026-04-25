import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  UserIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const AdminNumberDetail = ({
  members,
  formatCurrency,
  markPaymentAsPaid,
  event,
  handleDeleteEvent,
  handleEditEvent,
  handleEditMemberPayment,
  handlePartialPaid
}) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleRecordPayment = (memberId) => {
    setSelectedMember(memberId);
    setShowPaymentModal(true);
  };

  // Calculate total paid across all members
  const totalPaid = event.payments.reduce((sum, payment) => {
    const memberPaid = payment.transactions.reduce((acc, t) => acc + t.paidAmount, 0);
    return sum + memberPaid;
  }, 0);

  const totalAmount = event.payments.reduce((sum, p) => sum + p.amount, 0);
  
  const submitPayment = () => {
    if (paymentAmount && selectedMember) {
      handlePartialPaid(event.id, selectedMember, parseFloat(paymentAmount));
      setShowPaymentModal(false);
      setPaymentAmount("");
    }
  };

  // Helper to get total paid for a specific member
  const getMemberPaid = (payment) => {
    return payment.transactions.reduce((sum, t) => sum + t.paidAmount, 0);
  };

  // Helper to get remaining amount for a member
  const getMemberRemaining = (payment) => {
    return payment.amount - getMemberPaid(payment);
  };

  // Compute total pending (remaining amount across all members)
  const totalPending = event.payments.reduce((sum, payment) => sum + getMemberRemaining(payment), 0);

  return (
    <div className="border-t border-base-200">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-base-content/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-2xl shadow-2xl p-6 w-96 animate-in fade-in zoom-in duration-200">
            <h3 className="font-semibold text-lg text-base-content mb-4">
              Record Payment for Member {selectedMember}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Payment Amount
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-4 py-2 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content"
                placeholder="Enter amount"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-base-300 rounded-xl text-base-content hover:bg-base-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content font-medium rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <h4 className="font-semibold text-base-content mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-primary" />
          Member Payment Summary
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-base-200/50 rounded-xl">
              <tr className="border-b border-base-200">
                <th className="p-3 text-sm font-medium text-base-content/70">Member</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Total Amount</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Paid Amount</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Remaining Amount</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Status</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Last Payment Date</th>
                <th className="p-3 text-sm font-medium text-base-content/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {event.payments.map((payment) => {
                const member = members.find((m) => m.id === payment.memberId);
                const memberPaid = getMemberPaid(payment);
                const memberRemaining = getMemberRemaining(payment);
                const isPaid = memberRemaining === 0;
                const lastTransaction = payment.transactions[payment.transactions.length - 1];

                return (
                  <tr
                    key={payment.memberId}
                    className="border-b border-base-200 hover:bg-base-200/30 transition-colors duration-150"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-xl w-8 h-8 mr-3 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-base-content">
                            {member?.name || `Member ${payment.memberId}`}
                          </div>
                          <div className="text-xs text-base-content/50">
                            {member?.email || "No email available"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-base-content">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-3 font-medium text-success">
                      {formatCurrency(memberPaid)}
                    </td>
                    <td className="p-3 font-medium text-error">
                      {formatCurrency(memberRemaining)}
                    </td>
                    <td className="p-3">
                      {isPaid ? (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full flex items-center w-fit border border-success/20">
                          <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full flex items-center w-fit border border-error/20">
                          <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-base-content/60">
                      {!lastTransaction ? "Not paid yet" : lastTransaction.date}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRecordPayment(payment.memberId)}
                          className="px-2 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 flex items-center gap-1 text-xs font-medium"
                          title="Record Payment"
                        >
                          <PlusCircleIcon className="h-4 w-4" />
                          <span>Record</span>
                        </button>

                        <button
                          onClick={() => handleEditMemberPayment(event.id, payment.memberId)}
                          className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-base-content transition-all duration-200"
                          title="Edit Payment"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        {!isPaid && (
                          <button
                            onClick={() => markPaymentAsPaid(event.id, payment.memberId)}
                            className="px-2 py-1.5 text-xs bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            Full Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Total Summary Row */}
              <tr className="border-t border-base-200 bg-base-200/30 font-medium">
                <td className="p-3 text-base-content font-semibold">Total</td>
                <td className="p-3 text-base-content">{formatCurrency(totalAmount)}</td>
                <td className="p-3 text-success">{formatCurrency(totalPaid)}</td>
                <td className="p-3 text-error">{formatCurrency(totalPending)}</td>
                <td className="p-3" colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-base-200/50 px-5 py-3 border-t border-base-200 flex justify-between">
        <button className="text-base-content/70 hover:text-base-content flex items-center gap-1 transition-colors duration-200">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export Report
        </button>
        <div className="flex space-x-3">
          <button
            className="text-base-content/70 hover:text-base-content flex items-center gap-1 transition-colors duration-200"
            onClick={() => handleEditEvent(event)}
          >
            <PencilIcon className="h-4 w-4" />
            Edit Event
          </button>
          <button
            className="text-error/80 hover:text-error flex items-center gap-1 transition-colors duration-200"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <TrashIcon className="h-4 w-4" />
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNumberDetail;