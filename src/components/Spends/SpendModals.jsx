// SpendModals.jsx (Themed Version)
import React, { useEffect, useCallback, useState } from "react";
import {
  CurrencyRupeeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { PencilIcon } from "lucide-react";

const Backdrop = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-base-content/40 backdrop-blur-sm transition-all duration-300"
    onClick={onClose}
    aria-hidden="true"
  />
);

export const AddOrEditModal = ({ open, onClose, onSubmit, initial, eventId }) => {
  const emptyForm = {
    title: "",
    amount: "",
    spendDate: new Date().toISOString().split("T")[0],
    category: "",
    paidBy: "",
    paidTo: "",
    receiptNumber: "",
    receiptImage: null,
    receiptImagePreview: "",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        amount: initial.amount || "",
        spendDate: initial.spendDate
          ? initial.spendDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        category: initial.category || "",
        paidBy: initial.paidBy || "",
        paidTo: initial.paidTo || "",
        receiptNumber: initial.receiptNumber || "",
        receiptImage: null,
        receiptImagePreview: initial.receiptImage || "",
        notes: initial.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial, open]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    const amt = Number(form.amount);
    if (!form.amount || Number.isNaN(amt) || amt <= 0) e.amount = "Enter a valid amount";
    if (!form.paidBy.trim()) e.paidBy = "Paid By is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("event", eventId);
    fd.append("title", form.title.trim());
    fd.append("amount", Number(form.amount));
    fd.append("paidBy", form.paidBy.trim());
    if (form.category)      fd.append("category", form.category);
    if (form.paidTo)        fd.append("paidTo", form.paidTo);
    if (form.notes)         fd.append("notes", form.notes);
    if (form.spendDate)     fd.append("spendDate", form.spendDate);
    if (form.receiptNumber) fd.append("receiptNumber", form.receiptNumber);
    if (form.receiptImage)  fd.append("receiptImage", form.receiptImage);
    
    onSubmit(fd);
  };

  const onEsc = useCallback((e) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onEsc]);

  const getCategoryConfig = (category) => {
    const configs = {
      Decoration:    { border: "border-primary/30",   bg: "bg-primary/10",   text: "text-primary"         },
      Food:          { border: "border-secondary/30", bg: "bg-secondary/10", text: "text-secondary"       },
      Equipment:     { border: "border-accent/30",    bg: "bg-accent/10",    text: "text-accent"          },
      Media:         { border: "border-info/30",      bg: "bg-info/10",      text: "text-info"            },
      Transport:     { border: "border-success/30",   bg: "bg-success/10",   text: "text-success"         },
      Entertainment: { border: "border-warning/30",   bg: "bg-warning/10",   text: "text-warning"         },
      Other:         { border: "border-base-300",     bg: "bg-base-200",     text: "text-base-content/70" },
    };
    return configs[category] || configs.Other;
  };

  if (!open) return null;

  const inputBase =
    "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-base-100 shadow-2xl border border-base-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200 to-primary/10 rounded-t-3xl flex-shrink-0">
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title — required */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-1">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={`${inputBase} ${errors.title ? "border-error bg-error/5" : "border-base-300 hover:border-base-400"}`}
                placeholder="e.g. Venue Decoration"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />{errors.title}
                </p>
              )}
            </div>

            {/* Amount — required */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-1">
                <CurrencyRupeeIcon className="h-4 w-4 text-success" />
                Amount (₹) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={`${inputBase} ${errors.amount ? "border-error bg-error/5" : "border-base-300 hover:border-base-400"}`}
                placeholder="0"
              />
              {errors.amount && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />{errors.amount}
                </p>
              )}
            </div>

            {/* Paid By — required */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-1">
                Paid By <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.paidBy}
                onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value }))}
                className={`${inputBase} ${errors.paidBy ? "border-error bg-error/5" : "border-base-300 hover:border-base-400"}`}
                placeholder="Who paid?"
              />
              {errors.paidBy && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <XCircleIcon className="h-4 w-4" />{errors.paidBy}
                </p>
              )}
            </div>

            {/* Category — optional */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                Category
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`${inputBase} appearance-none cursor-pointer ${
                  form.category
                    ? `${getCategoryConfig(form.category).border} ${getCategoryConfig(form.category).bg} ${getCategoryConfig(form.category).text} border-2 font-semibold`
                    : "border-base-300 hover:border-base-400"
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
            </div>

            {/* Spend Date — optional */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Date
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <input
                type="date"
                value={form.spendDate}
                onChange={(e) => setForm((f) => ({ ...f, spendDate: e.target.value }))}
                className={`${inputBase} border-base-300 hover:border-base-400`}
              />
            </div>

            {/* Paid To — optional */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                Paid To (Vendor)
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <input
                type="text"
                value={form.paidTo}
                onChange={(e) => setForm((f) => ({ ...f, paidTo: e.target.value }))}
                className={`${inputBase} border-base-300 hover:border-base-400`}
                placeholder="Vendor / payee name"
              />
            </div>

            {/* Receipt Number — optional */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                Receipt Number
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <input
                type="text"
                value={form.receiptNumber}
                onChange={(e) => setForm((f) => ({ ...f, receiptNumber: e.target.value }))}
                className={`${inputBase} border-base-300 hover:border-base-400`}
                placeholder="e.g. REC001"
              />
            </div>

            {/* Receipt Image — optional */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                Receipt Image
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-base-300 hover:border-primary/50 rounded-2xl cursor-pointer transition-all duration-200 bg-base-100 hover:bg-primary/5 overflow-hidden">
                {form.receiptImagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={form.receiptImagePreview}
                      alt="Receipt preview"
                      className="w-full max-h-48 object-contain p-3"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setForm((f) => ({ ...f, receiptImage: null, receiptImagePreview: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-error text-error-content rounded-full hover:scale-110 transition-all shadow-md"
                      title="Remove image"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                    <p className="text-center text-xs text-base-content/40 pb-2">
                      Click ✕ to remove · click image to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                    <DocumentTextIcon className="h-8 w-8 text-base-content/30 mb-2" />
                    <p className="text-sm text-base-content/50">
                      <span className="text-primary font-semibold">Click to upload</span> a receipt image
                    </p>
                    <p className="text-xs text-base-content/30 mt-1">PNG, JPG, WEBP · max 5 MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setForm((f) => ({
                        ...f,
                        receiptImage: file,
                        receiptImagePreview: reader.result,
                      }));
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Notes — optional */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                Notes
                <span className="text-xs font-normal text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className={`${inputBase} border-base-300 hover:border-base-400 resize-none`}
                placeholder="Any additional notes..."
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
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(n || 0));

  const getCategoryConfig = (category) => {
    const configs = {
      Decoration:    { gradient: "from-primary to-secondary",   bg: "bg-primary/10",   text: "text-primary",         border: "border-primary/20"   },
      Food:          { gradient: "from-secondary to-accent",    bg: "bg-secondary/10", text: "text-secondary",       border: "border-secondary/20" },
      Equipment:     { gradient: "from-accent to-info",         bg: "bg-accent/10",    text: "text-accent",          border: "border-accent/20"    },
      Media:         { gradient: "from-info to-primary",        bg: "bg-info/10",      text: "text-info",            border: "border-info/20"      },
      Transport:     { gradient: "from-success to-emerald-600", bg: "bg-success/10",   text: "text-success",         border: "border-success/20"   },
      Entertainment: { gradient: "from-warning to-orange-500",  bg: "bg-warning/10",   text: "text-warning",         border: "border-warning/20"   },
      Other:         { gradient: "from-base-300 to-base-400",   bg: "bg-base-200",     text: "text-base-content/70", border: "border-base-300"     },
    };
    return configs[category] || configs.Other;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: { bg: "bg-success/20", text: "text-success", border: "border-success/30", icon: "✅", label: "Completed" },
      pending:   { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30", icon: "⏳", label: "Pending"   },
      cancelled: { bg: "bg-error/20",   text: "text-error",   border: "border-error/30",   icon: "❌", label: "Cancelled" },
    };
    return configs[status] || configs.pending;
  };

  if (!spend) return null;

  const categoryConfig = getCategoryConfig(spend.category);
  const statusConfig   = getStatusConfig(spend.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-base-100 shadow-2xl border border-base-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200 to-primary/10 rounded-t-3xl flex-shrink-0">
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
            <button onClick={onClose} className="p-2 text-base-content/50 hover:text-base-content hover:bg-base-200 rounded-xl transition-all">
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Title</label>
              <div className="p-4 bg-base-200 rounded-2xl border border-base-300">
                <p className="text-lg font-semibold text-base-content">{spend.title}</p>
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
                <p className="text-lg font-semibold text-base-content">
                  {spend.spendDate ? new Date(spend.spendDate).toLocaleDateString("en-IN") : "N/A"}
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Category</label>
              <div className={`p-4 ${categoryConfig.bg} rounded-2xl border ${categoryConfig.border}`}>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-primary-content bg-gradient-to-r ${categoryConfig.gradient}`}>
                  {spend.category || "N/A"}
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

            {/* Paid By */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Paid By</label>
              <div className="p-4 bg-base-200 rounded-2xl border border-base-300">
                <p className="text-lg font-semibold text-base-content">{spend.paidBy?.name || "N/A"}</p>
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
            {spend.receiptNumber && (
              <div>
                <label className="block text-sm font-semibold text-base-content/70 mb-2">Receipt Number</label>
                <div className="p-4 bg-info/10 rounded-2xl border border-info/20">
                  <p className="text-lg font-semibold text-info">{spend.receiptNumber}</p>
                </div>
              </div>
            )}

            {/* Created By */}
            <div>
              <label className="block text-sm font-semibold text-base-content/70 mb-2">Created By</label>
              <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
                <p className="text-lg font-semibold text-accent">
                  {spend.createdBy?.name || spend.createdBy || "N/A"}
                </p>
              </div>
            </div>

            {/* Receipt Image */}
            {spend.receiptImage && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-base-content/70 mb-2">Receipt Image</label>
                <div className="p-3 bg-base-200 rounded-2xl border border-base-300">
                  <img
                    src={spend.receiptImage}
                    alt="Receipt"
                    className="w-full max-h-56 object-contain rounded-xl"
                  />
                </div>
              </div>
            )}
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