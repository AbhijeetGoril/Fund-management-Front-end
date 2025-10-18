import React, { useEffect, useCallback, useState } from "react";

const Backdrop = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
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
  }, [initial]);

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
    onClose();
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100">
        <div className="px-6 py-5 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{initial ? "Edit Spend" : "Add Spend"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter spend description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid To</label>
              <input
                type="text"
                value={form.paidTo}
                onChange={(e) => setForm((f) => ({ ...f, paidTo: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Vendor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
              <input
                type="text"
                value={form.receiptNumber}
                onChange={(e) => setForm((f) => ({ ...f, receiptNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Receipt number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about this spend..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              {initial ? "Update Spend" : "Add Spend"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-500 text-white rounded-2xl font-semibold hover:bg-gray-600">
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

  if (!spend) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Backdrop onClose={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Spend Details</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-xl hover:bg-gray-100 text-gray-700" aria-label="Close details">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-lg font-semibold text-gray-800">{spend.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="text-lg font-semibold text-gray-800">{formatINR(spend.amount)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-gray-800">{spend.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <span className="ml-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{spend.category}</span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Paid To</label>
              <p className="text-gray-800">{spend.paidTo || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Receipt Number</label>
              <p className="text-gray-800">{spend.receiptNumber || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <span
                className={`ml-1 px-3 py-1 rounded-full text-sm font-medium ${
                  spend.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : spend.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {spend.status.charAt(0).toUpperCase() + spend.status.slice(1)}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Approved By</label>
              <p className="text-gray-800">{spend.approvedBy || "N/A"}</p>
            </div>
          </div>

          {spend.notes && (
            <div>
              <label className="text-sm font-medium text-gray-600">Notes</label>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-2xl mt-1">{spend.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={() => onEdit(spend)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">
              Edit Spend
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-2xl font-semibold hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
