// SpendsTable.jsx (Themed Version)
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

  // Theme-based category configuration (using semantic roles)
  const getCategoryConfig = (category) => {
    const configs = {
      Decoration: {
        gradient: "from-primary to-secondary",
        bgLight: "bg-primary/10",
        border: "border-primary/20",
        text: "text-primary",
      },
      Food: {
        gradient: "from-secondary to-accent",
        bgLight: "bg-secondary/10",
        border: "border-secondary/20",
        text: "text-secondary",
      },
      Equipment: {
        gradient: "from-accent to-info",
        bgLight: "bg-accent/10",
        border: "border-accent/20",
        text: "text-accent",
      },
      Media: {
        gradient: "from-info to-primary",
        bgLight: "bg-info/10",
        border: "border-info/20",
        text: "text-info",
      },
      Transport: {
        gradient: "from-success to-emerald-600", // success with darker edge
        bgLight: "bg-success/10",
        border: "border-success/20",
        text: "text-success",
      },
      Entertainment: {
        gradient: "from-warning to-orange-500",
        bgLight: "bg-warning/10",
        border: "border-warning/20",
        text: "text-warning",
      },
      Other: {
        gradient: "from-base-300 to-base-400",
        bgLight: "bg-base-300/30",
        border: "border-base-300",
        text: "text-base-content/70",
      }
    };
    return configs[category] || configs.Other;
  };

  const getAmountColor = (amount) => {
    if (amount >= 10000) return "text-error font-bold bg-error/10 px-2 py-1 rounded-lg";
    if (amount >= 5000) return "text-warning font-semibold bg-warning/10 px-2 py-1 rounded-lg";
    return "text-base-content font-semibold bg-base-200 px-2 py-1 rounded-lg";
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        bg: "bg-success/20",
        text: "text-success",
        border: "border-success/30",
        dot: "bg-success"
      },
      pending: {
        bg: "bg-warning/20",
        text: "text-warning",
        border: "border-warning/30",
        dot: "bg-warning"
      },
      cancelled: {
        bg: "bg-error/20",
        text: "text-error",
        border: "border-error/30",
        dot: "bg-error"
      }
    };
    return configs[status] || configs.pending;
  };

  const headerCell = (label, key, width = "auto") => (
    <th
      className={`text-left py-3 px-3 sm:py-4 sm:px-4 text-xs sm:text-sm font-bold text-base-content/70 cursor-pointer hover:bg-primary/5 rounded-xl transition-all duration-200 group border-r border-base-200 last:border-r-0 ${width}`}
      onClick={() => {
        if (sortBy === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
          setSortBy(key);
          setSortOrder("desc");
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span className="group-hover:text-primary transition-colors">{label}</span>
        {sortBy === key && (
          <div className="flex flex-col">
            <ArrowUpIcon 
              className={`h-3 w-3 transition-all ${
                sortOrder === "asc" ? "text-primary scale-110" : "text-base-content/30"
              }`} 
            />
            <ArrowDownIcon 
              className={`h-3 w-3 -mt-1 transition-all ${
                sortOrder === "desc" ? "text-primary scale-110" : "text-base-content/30"
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
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-4 mb-3 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-3 h-10 bg-gradient-to-b ${categoryConfig.gradient} rounded-full`}></div>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(spend)}
                className="text-left font-semibold text-base-content hover:text-primary transition-colors text-base line-clamp-2 hover:underline"
              >
                {spend.description}
              </button>
              {spend.paidTo && (
                <p className="text-sm text-base-content/60 mt-1">Paid to: {spend.paidTo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CurrencyRupeeIcon className="h-4 w-4 text-success" />
            <span className={getAmountColor(spend.amount)}>
              {formatINR(spend.amount)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-base-content">{spend.date}</span>
          </div>
        </div>

        {/* Category and Status */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-primary-content bg-gradient-to-r ${categoryConfig.gradient} shadow-sm`}>
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
            <p className="text-xs text-info font-medium bg-info/10 px-2 py-1 rounded-lg inline-block">
              Receipt: #{spend.receiptNumber}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t border-base-200">
          <button
            onClick={() => onView(spend)}
            className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <EyeIcon className="h-4 w-4" />
            View
          </button>
          <button
            onClick={() => onEdit(spend)}
            className="flex items-center gap-2 px-3 py-2 text-success hover:bg-success/10 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(spend.id)}
            className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-md border border-base-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-base-200 bg-gradient-to-r from-base-200 to-primary/10">
                {headerCell("Description", "description", "w-2/5")}
                {headerCell("Amount", "amount", "w-1/6")}
                {headerCell("Date", "date", "w-1/6")}
                {headerCell("Category", "category", "w-1/6")}
                {headerCell("Status", "status", "w-1/6")}
                <th className="text-left py-4 px-4 text-sm font-bold text-base-content/70 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {items.map((spend) => {
                const categoryConfig = getCategoryConfig(spend.category);
                const statusConfig = getStatusConfig(spend.status);
                
                return (
                  <tr 
                    key={spend.id} 
                    className="group hover:bg-primary/5 transition-all duration-300"
                  >
                    {/* Description */}
                    <td className="py-4 px-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-12 bg-gradient-to-b ${categoryConfig.gradient} rounded-full flex-shrink-0`}></div>
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => onView(spend)}
                            className="text-left font-semibold text-base-content group-hover:text-primary transition-colors text-sm line-clamp-2 hover:underline"
                          >
                            {spend.description}
                          </button>
                          {spend.paidTo && (
                            <p className="text-xs text-base-content/60 mt-1">Paid to: {spend.paidTo}</p>
                          )}
                          {spend.receiptNumber && (
                            <p className="text-xs text-info font-medium mt-1">#{spend.receiptNumber}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <CurrencyRupeeIcon className="h-4 w-4 text-success" />
                        <span className={getAmountColor(spend.amount)}>
                          {formatINR(spend.amount)}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-base-content/70 bg-base-200 rounded-lg px-3 py-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{spend.date}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-bold text-primary-content bg-gradient-to-r ${categoryConfig.gradient} shadow-sm`}>
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
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(spend)}
                          className="p-2 text-success hover:bg-success/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(spend.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
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
            <DocumentMagnifyingGlassIcon className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/70 text-lg mb-2 font-semibold">No spends found</p>
            <p className="text-base-content/50 text-sm mb-4 max-w-md mx-auto">
              Get started by adding your first spend to track expenses.
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      {items.length > 0 && (
        <div className="bg-base-200/50 border-t border-base-200 px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center text-sm text-base-content/70">
            <span>
              Showing <span className="font-semibold text-primary">{items.length}</span> spends
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