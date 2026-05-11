import React, { useEffect, useRef, useState } from 'react';
import {
  UserIcon,
  PlusIcon,
  XMarkIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AddNewMember = ({
  members = [],
  setShowModal,
  eventTotalBudget,
  existingMembersCount,
  onSubmit,
  isLoading,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amountToPay: "",
  });
  const [errors, setErrors] = useState({});

  const modalRef     = useRef(null);
  const nameInputRef = useRef(null);

  // ── Suggested amount ──────────────────────────────────────────────
  const suggestedAmount =
    eventTotalBudget && existingMembersCount !== undefined
      ? Math.floor(eventTotalBudget / (existingMembersCount + 1))
      : 0;

  // ── Close on outside click / Escape ──────────────────────────────
  useEffect(() => {
    nameInputRef.current?.focus();

    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        setShowModal(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [setShowModal]);

  // ── Client-side validation ────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (!form.name.trim())
      errs.name = "Name is required";
    else if (form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    else if (form.name.trim().length > 50)
      errs.name = "Name must be less than 50 characters";

    if (!form.email.trim())
      errs.email = "Email is required";
    else if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(form.email))
      errs.email = "Please enter a valid email address";
    else if (
      members.some(
        (m) => (m.email ?? "").toLowerCase() === form.email.toLowerCase()
      )
    )
      errs.email = "A participant with this email already exists";

    if (form.phone && !/^[0-9]{10}$/.test(form.phone))
      errs.phone = "Please enter a valid 10-digit phone number";

    if (form.amountToPay !== "") {
      const amt = parseFloat(form.amountToPay);
      if (isNaN(amt) || amt <= 0)
        errs.amountToPay = "Please enter a valid amount greater than 0";
      else if (eventTotalBudget && amt > eventTotalBudget)
        errs.amountToPay = `Amount cannot exceed total budget (₹${eventTotalBudget.toLocaleString()})`;
    }

    return errs;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Show a single toast summarising what's wrong
      toast.error("Please fix the errors in the form before submitting.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const toastId = toast.loading("Adding participant...", {
      position: "top-right",
    });

    try {
      await onSubmit({
        name:        form.name.trim(),
        email:       form.email.trim().toLowerCase(),
        phone:       form.phone || "",
        amountToPay: form.amountToPay
          ? parseFloat(form.amountToPay)
          : suggestedAmount || 0,
      });

      toast.update(toastId, {
        render:    `🎉 ${form.name.trim()} added successfully!`,
        type:      "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Modal is closed by EventDetails mutation onSuccess
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      toast.update(toastId, {
        render:    msg,
        type:      "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  // ── Field change helper ───────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ── Reusable inline field error ───────────────────────────────────
  const FieldError = ({ msg }) =>
    msg ? (
      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
        <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" />
        {msg}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content">
              <UserIcon className="h-5 w-5" />
            </div>
            Add Participant
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200 active:scale-95"
            aria-label="Close modal"
            disabled={isLoading}
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Full Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  ref={nameInputRef}
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.name ? "border-error" : "border-base-300"
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40`}
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <FieldError msg={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.email ? "border-error" : "border-base-300"
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40`}
                  placeholder="participant@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <FieldError msg={errors.email} />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Phone Number{" "}
                <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="tel"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.phone ? "border-error" : "border-base-300"
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  disabled={isLoading}
                />
              </div>
              <FieldError msg={errors.phone} />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Amount to Pay{" "}
                <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="number"
                  min="1"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.amountToPay ? "border-error" : "border-base-300"
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40`}
                  placeholder={
                    suggestedAmount
                      ? `Suggested: ₹${suggestedAmount.toLocaleString()}`
                      : "Enter amount"
                  }
                  value={form.amountToPay}
                  onChange={(e) => handleChange("amountToPay", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {suggestedAmount > 0 && !form.amountToPay && !errors.amountToPay && (
                <p className="text-xs text-info mt-1.5 flex items-center gap-1">
                  💡 Equal split suggestion: ₹{suggestedAmount.toLocaleString()} per person
                </p>
              )}
              <FieldError msg={errors.amountToPay} />
            </div>
          </div>

          {/* ── Footer buttons ── */}
          <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-base-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Add Participant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewMember;