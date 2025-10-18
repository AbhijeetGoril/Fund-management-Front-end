// SpendsTable.jsx (Fully Enhanced)
import React from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  DocumentMagnifyingGlassIcon,
  CurrencyRupeeIcon
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
    new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      maximumFractionDigits: 0 
    }).format(Number(n || 0));

  // Enhanced color system for categories
  const getCategoryConfig = (category) => {
    const configs = {
      Decoration: {
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-50 to-rose-50",
        border: "border-pink-200",
        text: "text-pink-700",
        light: "bg-pink-100"
      },
      Food: {
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-50 to-orange-50",
        border: "border-amber-200",
        text: "text-amber-700",
        light: "bg-amber-100"
      },
      Equipment: {
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
        border: "border-blue-200",
        text: "text-blue-700",
        light: "bg-blue-100"
      },
      Media: {
        gradient: "from-purple-500 to-indigo-500",
        bgGradient: "from-purple-50 to-indigo-50",
        border: "border-purple-200",
        text: "text-purple-700",
        light: "bg-purple-100"
      },
      Transport: {
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-50 to-teal-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        light: "bg-emerald-100"
      },
      Entertainment: {
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-50 to-purple-50",
        border: "border-violet-200",
        text: "text-violet-700",
        light: "bg-violet-100"
      },
      Other: {
        gradient: "from-gray-500 to-slate-500",
        bgGradient: "from-gray-50 to-slate-50",
        border: "border-gray-200",
        text: "text-gray-700",
        light: "bg-gray-100"
      }
    };
    return configs[category] || configs.Other;
  };

  const getAmountColor = (amount) => {
    if (amount >= 10000) return "text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg";
    if (amount >= 5000) return "text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-lg";
    return "text-gray-800 font-semibold bg-gray-50 px-2 py-1 rounded-lg";
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-800",
        border: "border-green-200",
        dot: "bg-green-500"
      },
      pending: {
        bg: "bg-gradient-to-r from-amber-100 to-orange-100",
        text: "text-amber-800",
        border: "border-amber-200",
        dot: "bg-amber-500"
      },
      cancelled: {
        bg: "bg-gradient-to-r from-red-100 to-pink-100",
        text: "text-red-800",
        border: "border-red-200",
        dot: "bg-red-500"
      }
    };
    return configs[status] || configs.pending;
  };

  const headerCell = (label, key, width = "auto") => (
    <th
      className={`text-left py-3 px-3 sm:py-4 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-200 group border-r border-gray-100 last:border-r-0 ${width}`}
      onClick={() => {
        if (sortBy === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
          setSortBy(key);
          setSortOrder("desc");
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span className="group-hover:text-blue-600 transition-colors">{label}</span>
        {sortBy === key && (
          <div className="flex flex-col">
            <ArrowUpIcon 
              className={`h-3 w-3 transition-all ${
                sortOrder === "asc" ? "text-blue-600 scale-110" : "text-gray-400"
              }`} 
            />
            <ArrowDownIcon 
              className={`h-3 w-3 -mt-1 transition-all ${
                sortOrder === "desc" ? "text-blue-600 scale-110" : "text-gray-400"
              }`} 
            />
          </div>
        )}
      </div>
    </th>
  );

  // Mobile Card View
  const MobileSpendCard = ({ spend }) => {
    const categoryConfig = getCategoryConfig(spend.category);
    const statusConfig = getStatusConfig(spend.status);

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-3 hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-3 h-10 bg-gradient-to-b ${categoryConfig.gradient} rounded-full`}></div>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(spend)}
                className="text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors text-base line-clamp-2 hover:underline"
              >
                {spend.description}
              </button>
              {spend.paidTo && (
                <p className="text-sm text-gray-600 mt-1">Paid to: {spend.paidTo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
            <span className={getAmountColor(spend.amount)}>
              {formatINR(spend.amount)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{spend.date}</span>
          </div>
        </div>

        {/* Category and Status */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.gradient} shadow-sm`}>
            {spend.category}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></div>
            {spend.status.charAt(0).toUpperCase() + spend.status.slice(1)}
          </span>
        </div>

        {/* Receipt Number */}
        {spend.receiptNumber && (
          <div className="mb-3">
            <p className="text-xs text-cyan-700 font-medium bg-cyan-50 px-2 py-1 rounded-lg inline-block">
              Receipt: #{spend.receiptNumber}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(spend)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <EyeIcon className="h-4 w-4" />
            View
          </button>
          <button
            onClick={() => onEdit(spend)}
            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(spend.id)}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                {headerCell("Description", "description", "w-2/5")}
                {headerCell("Amount", "amount", "w-1/6")}
                {headerCell("Date", "date", "w-1/6")}
                {headerCell("Category", "category", "w-1/6")}
                {headerCell("Status", "status", "w-1/6")}
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((spend, index) => {
                const categoryConfig = getCategoryConfig(spend.category);
                const statusConfig = getStatusConfig(spend.status);
                
                return (
                  <tr 
                    key={spend.id} 
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    {/* Description */}
                    <td className="py-4 px-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-12 bg-gradient-to-b ${categoryConfig.gradient} rounded-full flex-shrink-0`}></div>
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => onView(spend)}
                            className="text-left font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm line-clamp-2 hover:underline"
                          >
                            {spend.description}
                          </button>
                          {spend.paidTo && (
                            <p className="text-xs text-gray-600 mt-1">Paid to: {spend.paidTo}</p>
                          )}
                          {spend.receiptNumber && (
                            <p className="text-xs text-cyan-600 font-medium mt-1">#{spend.receiptNumber}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                        <span className={getAmountColor(spend.amount)}>
                          {formatINR(spend.amount)}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{spend.date}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.gradient} shadow-sm`}>
                        {spend.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}>
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></div>
                        {spend.status.charAt(0).toUpperCase() + spend.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => onView(spend)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 tooltip"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(spend)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 tooltip"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(spend.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 tooltip"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {items.map((spend) => (
            <MobileSpendCard key={spend.id} spend={spend} />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <DocumentMagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2 font-semibold">No spends found</p>
            <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
              {items.length === 0 
                ? "Get started by adding your first spend to track expenses."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      {items.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100 px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing <span className="font-semibold text-blue-600">{items.length}</span> spends
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Sorted by: <span className="font-semibold">{sortBy}</span> ({sortOrder})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendsTable;