import React from "react";
import { fullPayMember } from "../../redux/eventsSlice";
import { useDispatch } from "react-redux";

const TableAttribute = (
  formatCurrency,
  event,
  payment,
  members,
  setSelectedMember,
  setShowPaymentModal,
  handleEditMemberPayment
) => {
  const member = members.find((m) => m.id === payment.memberId);
  const handleRecordPayment = (memberId) => {
    setSelectedMember(memberId);
    setShowPaymentModal(true);
  };

  const dispatch = useDispatch();
  const markPaymentAsPaid = (eventId, memberId) => {
    dispatch(fullPayMember({ eventId, memberId: memberId }));
  };
  const paidAmount = payment.transactions.reduce(
    (sum, p) => sum + p.paidAmount,
    0
  );
  return (
    <>
      (
      <tr key={payment.memberId} className="border-t hover:bg-gray-50">
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
          {formatCurrency(paidAmount)}
        </td>
        <td className="p-3 font-medium text-red-600">
          {formatCurrency(
            payment.amount -
              payment.transactions.reduce((sum, p) => sum + p.paidAmount, 0)
          )}
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
          {payment.transactions.length == 0
            ? "Not paid yet"
            : payment.transactions[payment.transactions.length - 1].date}
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
              onClick={() =>
                handleEditMemberPayment(event.id, payment.memberId)
              }
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
      )
    </>
  );
};

export default TableAttribute;
