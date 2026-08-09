import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XMarkIcon, CurrencyRupeeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";

const recordPaymentApi = async ({ eventId, userId, amountPaid }) => {
  const { data } = await axiosInstance.patch(
    `/events/${eventId}/members/${userId}/payment`,
    { amountPaid }
  );
  return data;
};

const RecordPaymentModal = ({ eventId, member, onClose }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const remaining = (member.amountToPay ?? 0) - (member.amountPaid ?? 0);
  const displayName = member.user?.name || member.name || "this member";

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const { mutate: recordPayment, isPending } = useMutation({
    mutationFn: recordPaymentApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success(data?.message || "Payment recorded!", { position: "top-right" });
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Could not record payment.";
      setError(msg);
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    if (amt > remaining) {
      setError(`Amount cannot exceed remaining balance (₹${remaining.toLocaleString()}).`);
      return;
    }

    if (!member.user?._id) {
      setError("This member has no linked account — payment can't be recorded this way yet.");
      return;
    }

    recordPayment({ eventId, userId: member.user._id, amountPaid: amt });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-base-content">Record Payment</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200"
            disabled={isPending}
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        <div className="bg-base-200 rounded-xl p-3 text-sm">
          <p className="text-base-content font-medium">{displayName}</p>
          <div className="flex justify-between text-xs text-base-content/60 mt-1">
            <span>Paid: ₹{(member.amountPaid ?? 0).toLocaleString()} / ₹{(member.amountToPay ?? 0).toLocaleString()}</span>
            <span className="font-medium text-base-content">Remaining: ₹{remaining.toLocaleString()}</span>
          </div>
        </div>

        {remaining <= 0 ? (
          <p className="text-sm text-success bg-success/10 rounded-lg p-3">
            ✅ This member is already fully paid.
          </p>
        ) : !member.user?._id ? (
          <p className="text-sm text-warning bg-warning/10 rounded-lg p-3">
            This is an offline participant without a linked account. Payment recording for offline members isn't supported yet.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Amount Received
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max={remaining}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  placeholder={`Up to ₹${remaining.toLocaleString()}`}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
              {error && (
                <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                {isPending ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecordPaymentModal;