// SpendModals.jsx (Themed Version)
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
    className="fixed inset-0 bg-base-content/40 backdrop-blur-sm transition-all duration-300" 
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

  // Theme-based category styling
  const getCategoryConfig = (category) => {
    const configs = {
      Decoration: {
        border: "border-primary/30",
        bg: "bg-primary/10",
        text: "text-primary",
      },
      Food: {
        border: "border-secondary/30",
        bg: "bg-secondary/10",
        text: "text-secondary",
      },
      Equipment: {
        border: "border-accent/30",
        bg: "bg-accent/10",
        text: "text-accent",
      },
      Media: {
        border: "border-info/30",
        bg: "bg-info/10",
        text: "text-info",
      },
      Transport: {
        border: "border-success/30",
        bg: "bg-success/10",
        text: "text-success",
      },
      Entertainment: {
        border: "border-warning/30",
        bg: "bg-warning/10",
        text: "text-warning",
      },
      Other: {
        border: "border-base-300",
        bg: "bg-base-200",
        text: "text-base-content/70",
      }
    };
    return configs[category] || configs.Other;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        bg: "bg-success/20",
        text: "text-success",
        border: "border-success/30",
        icon: <CheckCircleIcon className="h-4 w-4" />
      },
      pending: {
        bg: "bg-warning/20",
        text: "text-warning",
        border: "border-warning/30",
        icon: <ClockIcon className="h-4 w-4" />
      },
      cancelled: {
        bg: "bg-error/20",
        text: "text-error",
        border: "border-error/30",
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
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-base-100 shadow-2xl border border-base-200 transform transition-all duration-300 scale-95 hover:scale-100"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200 to-primary/10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <DocumentTextIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">
                {initial ? "Edit Spend" : "Add New Spend"}
              </h3>
              <p className="text-sm text-base-content/70">
                {initial ? "Update spend details" : "Add a new expense to track"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                <span>Description</span>
                <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 ${
                  errors.description ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-400'
                }`}
                placeholder="Enter spend description..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                <CurrencyRupeeIcon className="h-4 w-4 text-success" />
                <span>Amount (₹)</span>
                <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 ${
                  errors.amount ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-400'
                }`}
                placeholder="0"
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>Date</span>
                <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content ${
                  errors.date ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-400'
                }`}
              />
              {errors.date && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2">
                Category <span className="text-error">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none cursor-pointer bg-base-100 text-base-content ${
                  errors.category ? 'border-error bg-error/5' : 
                  form.category ? `${getCategoryConfig(form.category).border} ${getCategoryConfig(form.category).bg} ${getCategoryConfig(form.category).text} border-2 font-semibold` : 'border-base-300 hover:border-base-400'
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
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none cursor-pointer bg-base-100 ${getStatusConfig(form.status).bg} ${getStatusConfig(form.status).text} ${getStatusConfig(form.status).border} border-2 font-semibold`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Paid To */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2">
                Paid To (Vendor)
              </label>
              <input
                type="text"
                value={form.paidTo}
                onChange={(e) => setForm((f) => ({ ...f, paidTo: e.target.value }))}
                className="w-full px-4 py-3 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 hover:border-base-400"
                placeholder="Vendor name"
              />
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                value={form.receiptNumber}
                onChange={(e) => setForm((f) => ({ ...f, receiptNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 hover:border-base-400"
                placeholder="Receipt number"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/80 mb-2">
                Additional Notes
              </label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 hover:border-base-400 resize-none"
                placeholder="Any additional notes about this spend..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-base-200">
            <button 
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <CheckCircleIcon className="h-5 w-5" />
              {initial ? "Update Spend" : "Add Spend"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-base-200 text-base-content rounded-2xl font-semibold hover:bg-base-300 transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
      Decoration: { gradient: "from-primary to-secondary", bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
      Food: { gradient: "from-secondary to-accent", bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
      Equipment: { gradient: "from-accent to-info", bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
      Media: { gradient: "from-info to-primary", bg: "bg-info/10", text: "text-info", border: "border-info/20" },
      Transport: { gradient: "from-success to-emerald-600", bg: "bg-success/10", text: "text-success", border: "border-success/20" },
      Entertainment: { gradient: "from-warning to-orange-500", bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
      Other: { gradient: "from-base-300 to-base-400", bg: "bg-base-200", text: "text-base-content/70", border: "border-base-300" }
    };
    return configs[category] || configs.Other;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: { bg: "bg-success/20", text: "text-success", border: "border-success/30", icon: "✅", label: "Completed" },
      pending: { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30", icon: "⏳", label: "Pending" },
      cancelled: { bg: "bg-error/20", text: "text-error", border: "border-error/30", icon: "❌", label: "Cancelled" }
    };
    return configs[status] || configs.pending;
  };

  if (!spend) return null;

  const categoryConfig = getCategoryConfig(spend.category);
  const statusConfig = getStatusConfig(spend.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-base-100 shadow-2xl border border-base-200 transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200 to-primary/10 rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${categoryConfig.bg} rounded-xl`}>
                <DocumentTextIcon className={`h-6 w-6 ${categoryConfig.text}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content">Spend Details</h3>
                <p className="text-sm text-base-content/70">Complete information about this expense</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-base-content/50 hover:text-base-content hover:bg-base-200 rounded-xl transition-all duration-200"
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
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Description</label>
              <div className="p-4 bg-base-200 rounded-2xl border border-base-300">
                <p className="text-lg font-semibold text-base-content">{spend.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Amount</label>
              <div className="p-4 bg-success/10 rounded-2xl border border-success/20">
                <p className="text-xl font-bold text-success">{formatINR(spend.amount)}</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Date</label>
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold text-base-content">{spend.date}</p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Category</label>
              <div className={`p-4 ${categoryConfig.bg} rounded-2xl border ${categoryConfig.border}`}>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-primary-content bg-gradient-to-r ${categoryConfig.gradient}`}>
                  {spend.category}
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Status</label>
              <div className={`p-4 ${statusConfig.bg} rounded-2xl border ${statusConfig.border}`}>
                <span className="text-lg font-semibold flex items-center gap-2">
                  {statusConfig.icon}
                  <span className={statusConfig.text}>{statusConfig.label}</span>
                </span>
              </div>
            </div>

            {/* Paid To */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Paid To</label>
              <div className="p-4 bg-base-200 rounded-2xl border border-base-300">
                <p className="text-lg font-semibold text-base-content">{spend.paidTo || "N/A"}</p>
              </div>
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Receipt Number</label>
              <div className="p-4 bg-info/10 rounded-2xl border border-info/20">
                <p className="text-lg font-semibold text-info">{spend.receiptNumber || "N/A"}</p>
              </div>
            </div>

            {/* Approved By */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Approved By</label>
              <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
                <p className="text-lg font-semibold text-accent">{spend.approvedBy || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {spend.notes && (
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Notes</label>
              <div className="p-4 bg-warning/10 rounded-2xl border border-warning/20">
                <p className="text-base-content leading-relaxed">{spend.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-base-200">
            <button 
              onClick={() => onEdit(spend)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <PencilIcon className="h-5 w-5" />
              Edit Spend
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-base-200 text-base-content rounded-2xl font-semibold hover:bg-base-300 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
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