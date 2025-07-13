// components/PaymentTable.js
import React from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const PaymentTable = ({ 
  event, 
  members, 
  onMarkAsPaid,
  formatCurrency
}) => {
  return (
    <div className="border-t">
      <div className="p-5">
        <h4 className="font-semibold text-gray-800 mb-4">Member Payment Status</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-600">Member</th>
                <th className="p-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="p-3 text-sm font-medium text-gray-600">Status</th>
                <th className="p-3 text-sm font-medium text-gray-600">Payment Date</th>
                <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {event.payments.map(payment => {
                const member = members.find(m => m.id === payment.memberId);
                return (
                  <tr key={payment.memberId} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{member?.name}</div>
                          <div className="text-xs text-gray-500">{member?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-gray-700">{formatCurrency(payment.amount)}</td>
                    <td className="p-3">
                      {payment.status === "paid" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center w-fit">
                          <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center w-fit">
                          <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{payment.date || "-"}</td>
                    <td className="p-3">
                      {payment.status === "pending" && (
                        <button
                          onClick={() => onMarkAsPaid(event.id, payment.memberId)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;