import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "participant", label: "Participant" },
];

const updateMemberApi = async ({ eventId, memberId, payload }) => {
  const { data } = await axiosInstance.patch(
    `/events/${eventId}/members/${memberId}`,
    payload
  );
  return data;
};

const EditMemberModal = ({ eventId, member, onClose }) => {
  const [form, setForm] = useState({
    name: member.user?.name || member.name || "",
    phone: member.phone || "",
    amountToPay: member.amountToPay ?? 0,
    amountPaid: member.amountPaid ?? 0,
    role: member.role || "participant",
  });
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);
  const queryClient = useQueryClient();

  const isRegisteredUser = !!member.user?._id;

  useEffect(() => {
    firstFieldRef.current?.focus();
    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const { mutate: updateMember, isPending } = useMutation({
    mutationFn: updateMemberApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success(data?.message || "Member updated!", { position: "top-right" });
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Could not update member.";
      setError(msg);
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isRegisteredUser && !form.name.trim()) {
      setError("Name is required.");
      return;
    }

    const toPay = Number(form.amountToPay);
    if (isNaN(toPay) || toPay < 0) {
      setError("Amount to pay must be a valid non-negative number.");
      return;
    }

    const paid = Number(form.amountPaid);
    if (isNaN(paid) || paid < 0) {
      setError("Amount paid must be a valid non-negative number.");
      return;
    }

    updateMember({
      eventId,
      memberId: member._id,
      payload: {
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        amountToPay: toPay,
        amountPaid: paid,
        role: form.role,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-base-content">Edit Member</h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        {isRegisteredUser && (
          <p className="text-xs text-base-content/50 bg-base-200 rounded-lg p-3">
            This is a registered user — their display name comes from their account and can't be changed here.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isRegisteredUser && (
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">
              Phone <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              <input
                ref={isRegisteredUser ? firstFieldRef : undefined}
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isPending}
                className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Amount Paid
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="number"
                  min="0"
                  value={form.amountPaid}
                  onChange={(e) => handleChange("amountPaid", e.target.value)}
                  disabled={isPending}
                  className="w-full pl-9 pr-3 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Amount to Pay
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="number"
                  min="0"
                  value={form.amountToPay}
                  onChange={(e) => handleChange("amountToPay", e.target.value)}
                  disabled={isPending}
                  className="w-full pl-9 pr-3 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-base-content/45 -mt-2">
            Editing "Amount Paid" here directly corrects the record — for a normal new payment, use the "Pay" button instead.
          </p>

          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">Role</label>
            <div className="relative">
              <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                disabled={isPending}
                className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-error flex items-center gap-1">
              <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;