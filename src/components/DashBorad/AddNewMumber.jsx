import React, { useEffect, useRef, useState } from 'react';
import {
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  CurrencyRupeeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  XMarkIcon,
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
  const [mode, setMode] = useState(null); // null | "invite" | "offline"
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amountToPay: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const modalRef      = useRef(null);
  const firstFieldRef = useRef(null);

  const suggestedAmount =
    eventTotalBudget && existingMembersCount !== undefined
      ? Math.floor(eventTotalBudget / (existingMembersCount + 1))
      : 0;

  useEffect(() => {
    if (mode) firstFieldRef.current?.focus();

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
  }, [setShowModal, mode]);

  const validate = () => {
    console.log("🟣 [validate] running for mode:", mode, "form:", form); // DEBUG
    const errs = {};

    if (mode === "invite") {
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
    } else if (mode === "offline") {
      if (!form.name.trim())
        errs.name = "Name is required";

      if (form.email.trim()) {
        if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(form.email))
          errs.email = "Please enter a valid email address";
        else if (
          members.some(
            (m) => (m.email ?? "").toLowerCase() === form.email.toLowerCase()
          )
        )
          errs.email = "A participant with this email already exists";
      }
    }

    if (form.amountToPay !== "") {
      const amt = parseFloat(form.amountToPay);
      if (isNaN(amt) || amt <= 0)
        errs.amountToPay = "Please enter a valid amount greater than 0";
      else if (eventTotalBudget && amt > eventTotalBudget)
        errs.amountToPay = `Amount cannot exceed total budget (₹${eventTotalBudget.toLocaleString()})`;
    }

    if (form.message.length > 300)
      errs.message = "Message must be less than 300 characters";

    console.log("🟣 [validate] result errors:", errs); // DEBUG
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔴 [handleSubmit] FORM SUBMITTED — mode:", mode); // DEBUG

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.log("🔴 [handleSubmit] blocked by validation:", validationErrors); // DEBUG
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form before submitting.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const label = mode === "invite" ? form.email.trim() : form.name.trim();
    const toastId = toast.loading(
      mode === "invite" ? "Sending invitation..." : "Adding participant...",
      { position: "top-right" }
    );

    const payload = {
      mode,
      name:        form.name.trim() || undefined,
      email:
        mode === "invite"
          ? form.email.trim().toLowerCase()
          : form.email.trim()
          ? form.email.trim().toLowerCase()
          : undefined,
      phone:       form.phone.trim() || undefined,
      amountToPay: form.amountToPay ? parseFloat(form.amountToPay) : suggestedAmount || 0,
      message:     form.message.trim(),
    };

    console.log("🔴 [handleSubmit] calling onSubmit with:", payload); // DEBUG

    try {
      await onSubmit(payload);

      console.log("🟢 [handleSubmit] onSubmit resolved successfully"); // DEBUG

      toast.update(toastId, {
        render:    mode === "invite" ? `📨 Invitation sent to ${label}!` : `✅ ${label} added!`,
        type:      "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log("🔴 [handleSubmit] onSubmit threw:", err); // DEBUG

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content">
              <UserPlusIcon className="h-5 w-5" />
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

        {/* ── Step 1: ask which way to add ── */}
        {!mode && (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-base-content/60">
              How would you like to add this participant?
            </p>

            <button
              type="button"
              onClick={() => setMode("invite")}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <PaperAirplaneIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-base-content">Send Invitation</p>
                <p className="text-xs text-base-content/60">
                  They'll get an email to join and accept. Requires an email address.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("offline")}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
            >
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary shrink-0">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-base-content">Add Offline User</p>
                <p className="text-xs text-base-content/60">
                  No account needed — add directly with name (and email/phone if you have them).
                </p>
              </div>
            </button>
          </div>
        )}

        {/* ── Step 2: form ── */}
        {mode && (
          <>
            <button
              type="button"
              onClick={() => { setMode(null); setErrors({}); }}
              disabled={isLoading}
              className="text-xs text-base-content/50 hover:text-base-content flex items-center gap-1 -mt-1"
            >
              ← Choose a different method
            </button>

            <p className="text-sm text-base-content/60 -mt-1">
              {mode === "invite"
                ? "They'll get an email invite to join this event."
                : "Add someone directly to the event. Email and phone are optional — useful if they don't have or don't want to use an account."}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">

                {/* Name — required for offline, not used for invite */}
                {mode === "offline" && (
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-1">
                      Name <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                      <input
                        ref={firstFieldRef}
                        type="text"
                        className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                          errors.name ? "border-error" : "border-base-300"
                        } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40`}
                        placeholder="Participant's full name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <FieldError msg={errors.name} />
                  </div>
                )}

                {/* Email — required for invite, optional for offline */}
                <div>
                  <label className="block text-sm font-semibold text-base-content/80 mb-1">
                    Email Address{" "}
                    {mode === "invite" ? (
                      <span className="text-error">*</span>
                    ) : (
                      <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
                    )}
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      ref={mode === "invite" ? firstFieldRef : undefined}
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
                  {mode === "offline" && (
                    <p className="text-xs text-base-content/50 mt-1.5">
                      If they have an existing account with this email, they'll be sent an invite instead of being added directly.
                    </p>
                  )}
                  <FieldError msg={errors.email} />
                </div>

                {/* Phone — offline only */}
                {mode === "offline" && (
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-1">
                      Phone{" "}
                      <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Amount — shared */}
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

                {/* Message — invite only */}
                {mode === "invite" && (
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-1">
                      Message{" "}
                      <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <ChatBubbleLeftRightIcon className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                      <textarea
                        rows={3}
                        className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                          errors.message ? "border-error" : "border-base-300"
                        } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/40 resize-none`}
                        placeholder="Add a personal note to the invite..."
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <FieldError msg={errors.message} />
                  </div>
                )}
              </div>

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
                      {mode === "invite" ? "Sending..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4" />
                      {mode === "invite" ? "Send Invite" : "Add Participant"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewMember;