// SpendModals.jsx (Enhanced)
import React, { useEffect, useCallback, useState } from "react";
import { 
  CurrencyRupeeIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from "@heroicons/react/20/solid";
import { PencilIcon } from "lucide-react";

const Backdrop = ({ onClose }) => (
  <div 
    className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" 
    onClick={onClose} 
    aria-hidden="true" 
  />
);

export const AddOrEditModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(
    initial || {
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      paidTo: "",
      receiptNumber: "",
      status: "pending",
      notes: "",
    }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      initial || {
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paidTo: "",
        receiptNumber: "",
        status: "pending",
        notes: "",
      }
    );
    setErrors({});
  }, [initial, open]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    const amt = Number(form.amount);
    if (!form.amount || Number.isNaN(amt) || amt <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    if (!form.category) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  const onEsc = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onEsc]);

  const getCategoryColor = (category) => {
    const colors = {
      Decoration: "border-pink-200 bg-pink-50 text-pink-700",
      Food: "border-amber-200 bg-amber-50 text-amber-700",
      Equipment: "border-blue-200 bg-blue-50 text-blue-700",
      Media: "border-purple-200 bg-purple-50 text-purple-700",
      Transport: "border-emerald-200 bg-emerald-50 text-emerald-700",
      Entertainment: "border-violet-200 bg-violet-50 text-violet-700",
      Other: "border-gray-200 bg-gray-50 text-gray-700"
    };
    return colors[category] || colors.Other;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: "text-green-700 bg-green-50 border-green-200",
        icon: <CheckCircleIcon className="h-4 w-4" />
      },
      pending: {
        color: "text-amber-700 bg-amber-50 border-amber-200",
        icon: <ClockIcon className="h-4 w-4" />
      },
      cancelled: {
        color: "text-red-700 bg-red-50 border-red-200",
        icon: <XCircleIcon className="h-4 w-4" />
      }
    };
    return configs[status] || configs.pending;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 transform transition-all duration-300 scale-95 hover:scale-100"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {initial ? "Edit Spend" : "Add New Spend"}
              </h3>
              <p className="text-sm text-gray-600">
                {initial ? "Update spend details" : "Add a new expense to track"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>Description</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter spend description..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                <span>Amount (₹)</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="0"
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span>Date</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.date && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${
                  errors.category ? 'border-red-300 bg-red-50' : 
                  form.category ? `${getCategoryColor(form.category)} border-2 font-semibold` : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select Category</option>
                <option value="Decoration">Decoration</option>
                <option value="Food">Food</option>
                <option value="Equipment">Equipment</option>
                <option value="Media">Media</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${
                  getStatusConfig(form.status).color
                } border-2 font-semibold`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Paid To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paid To (Vendor)
              </label>
              <input
                type="text"
                value={form.paidTo}
                onChange={(e) => setForm((f) => ({ ...f, paidTo: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Vendor name"
              />
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                value={form.receiptNumber}
                onChange={(e) => setForm((f) => ({ ...f, receiptNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Receipt number"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                placeholder="Any additional notes about this spend..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <CheckCircleIcon className="h-5 w-5" />
              {initial ? "Update Spend" : "Add Spend"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <XCircleIcon className="h-5 w-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ViewModal = ({ spend, onClose, onEdit }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      Number(n || 0)
    );

  const getCategoryConfig = (category) => {
    const configs = {
      Decoration: {
        gradient: "from-pink-500 to-rose-500",
        bg: "bg-pink-100",
        text: "text-pink-700",
        border: "border-pink-200"
      },
      Food: {
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200"
      },
      Equipment: {
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200"
      },
      Media: {
        gradient: "from-purple-500 to-indigo-500",
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200"
      },
      Transport: {
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200"
      },
      Entertainment: {
        gradient: "from-violet-500 to-purple-500",
        bg: "bg-violet-100",
        text: "text-violet-700",
        border: "border-violet-200"
      },
      Other: {
        gradient: "from-gray-500 to-slate-500",
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200"
      }
    };
    return configs[category] || configs.Other;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: "✅",
        label: "Completed"
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: "⏳",
        label: "Pending"
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: "❌",
        label: "Cancelled"
      }
    };
    return configs[status] || configs.pending;
  };

  if (!spend) return null;

  const categoryConfig = getCategoryConfig(spend.category);
  const statusConfig = getStatusConfig(spend.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${categoryConfig.bg} rounded-xl`}>
                <DocumentTextIcon className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Spend Details</h3>
                <p className="text-sm text-gray-600">Complete information about this expense</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-lg font-semibold text-gray-800">{spend.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Amount</label>
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-xl font-bold text-green-700">{formatINR(spend.amount)}</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Date</label>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <p className="text-lg font-semibold text-gray-800">{spend.date}</p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Category</label>
              <div className={`p-4 ${categoryConfig.bg} rounded-2xl border ${categoryConfig.border}`}>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${categoryConfig.gradient}`}>
                  {spend.category}
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
              <div className={`p-4 ${statusConfig.bg} rounded-2xl border ${statusConfig.border}`}>
                <span className="text-lg font-semibold flex items-center gap-2">
                  {statusConfig.icon}
                  <span className={statusConfig.text}>{statusConfig.label}</span>
                </span>
              </div>
            </div>

            {/* Paid To */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Paid To</label>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-lg font-semibold text-gray-800">{spend.paidTo || "N/A"}</p>
              </div>
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Receipt Number</label>
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200">
                <p className="text-lg font-semibold text-gray-800">{spend.receiptNumber || "N/A"}</p>
              </div>
            </div>

            {/* Approved By */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Approved By</label>
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <p className="text-lg font-semibold text-gray-800">{spend.approvedBy || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {spend.notes && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Notes</label>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-gray-800 leading-relaxed">{spend.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => onEdit(spend)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <PencilIcon className="h-5 w-5" />
              Edit Spend
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <XCircleIcon className="h-5 w-5" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};