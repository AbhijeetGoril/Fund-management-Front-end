import React from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/20/solid";

const SpendsTable = ({
  items,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  onView,
  onEdit,
  onDelete
}) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      Number(n || 0)
    );

  const headerCell = (label, key) => (
    <th
      className="text-left py-4 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 rounded-2xl"
      onClick={() => {
        if (sortBy === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
          setSortBy(key);
          setSortOrder(key === "amount" || key === "date" ? "desc" : "asc");
        }
      }}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortBy === key &&
          (sortOrder === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          ))}
      </div>
    </th>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                {headerCell("Description", "description")}
                {headerCell("Amount", "amount")}
                {headerCell("Date", "date")}
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((spend) => (
                <tr key={spend.id} className="group hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => onView(spend)}
                        className="text-left font-medium text-gray-800 group-hover:text-blue-600 transition-colors"
                      >
                        {spend.description}
                      </button>
                      {spend.paidTo && (
                        <p className="text-sm text-gray-600 mt-0.5">Paid to: {spend.paidTo}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-800">{formatINR(spend.amount)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      {spend.date}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {spend.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        spend.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : spend.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {spend.status.charAt(0).toUpperCase() + spend.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(spend)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(spend)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(spend.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <DocumentMagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No spends found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendsTable;
