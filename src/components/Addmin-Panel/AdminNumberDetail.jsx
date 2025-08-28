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
  

  const submitPayment = () => {
    if (paymentAmount && selectedMember) {
      handlePartialPaid(event.id, selectedMember, parseFloat(paymentAmount));
      setShowPaymentModal(false);
      setPaymentAmount("");
    }
  };

  return (
    <div className="border-t">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-semibold text-lg mb-4">
              Record Payment for Member {selectedMember}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <h4 className="font-semibold text-gray-800 mb-4">
          Member Payment Summary
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-600">Member</th>
                <th className="p-3 text-sm font-medium text-gray-600">Total Amount</th>
                <th className="p-3 text-sm font-medium text-gray-600">Paid Amount</th>
                <th className="p-3 text-sm font-medium text-gray-600">Remaining Amount</th>
                <th className="p-3 text-sm font-medium text-gray-600">Status</th>
                <th className="p-3 text-sm font-medium text-gray-600">Payment Date</th>
                <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {event.payments.map((payment) => {
                const member = members.find((m) => m.id === payment.memberId);
                const remainingAmount = payment.amount - payment.paidAmount;
                
                return (
                  <tr
                    key={payment.memberId}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {member?.name || `Member ${payment.memberId}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member?.email || "No email available"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-gray-700">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-3 font-medium text-green-600">
                      {formatCurrency(payment.paidAmount)}
                    </td>
                    <td className="p-3 font-medium text-red-600">
                      {formatCurrency(remainingAmount)}
                    </td>
                    <td className="p-3">
                      {payment.paidAmount >= payment.amount ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center w-fit">
                          <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center w-fit">
                          <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {payment.date || "Not paid yet"}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRecordPayment(payment.memberId)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600 hover:text-blue-800 transition flex items-center"
                          title="Record Payment"
                        >
                          <PlusCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Record</span>
                        </button>
                        
                        <button
                          onClick={() => handleEditMemberPayment(event.id, payment.memberId)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition flex items-center"
                          title="Edit Payment"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        {payment.paidAmount < payment.amount && (
                          <button
                            onClick={() => markPaymentAsPaid(event.id, payment.memberId)}
                            className="px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
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
              <tr className="border-t bg-gray-50 font-medium">
                <td className="p-3">Total</td>
                <td className="p-3 text-gray-700">
                  {formatCurrency(
                    event.payments.reduce((sum, payment) => sum + payment.amount, 0)
                  )}
                </td>
                <td className="p-3 text-green-600">
                  {formatCurrency(
                    event.payments.reduce((sum, payment) => 
                      sum + payment.paidAmount, 0)
                  )}
                </td>
                <td className="p-3 text-red-600">
                  {formatCurrency(
                    event.payments.reduce((sum, payment) => 
                      sum + (payment.status === "pending" ? payment.amount : 0), 0)
                  )}
                </td>
                <td className="p-3" colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t flex justify-between">
        <button className="text-gray-600 hover:text-gray-800 flex items-center">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
          Export Report
        </button>
        <div className="flex space-x-2">
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center"
            onClick={() => handleEditEvent(event)}
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit Event
          </button>
          <button 
            className="text-red-600 hover:text-red-800 flex items-center" 
            onClick={() => handleDeleteEvent(event.id)}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNumberDetail;