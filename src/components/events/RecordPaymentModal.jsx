import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  XMarkIcon,
  CurrencyRupeeIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";
import ModalPortal from "../ModalPortal";

const METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

const recordPaymentApi = async ({ eventId, memberId, formData }) => {
  const { data } = await axiosInstance.patch(
    `/events/${eventId}/members/${memberId}/payment`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

const RecordPaymentModal = ({ eventId, member, onClose }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

    const formData = new FormData();
    formData.append("amountPaid", amt);
    formData.append("method", method);
    formData.append("note", note.trim());
    if (receiptFile) formData.append("receiptImage", receiptFile);

    // Keyed by the EventMember document's own _id — works for both
    // registered members (member.user set) and offline members
    // (member.user null), since every EventMember has an _id regardless.
    recordPayment({ eventId, memberId: member._id, formData });
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 max-h-[90vh] overflow-y-auto">
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {!member.user?._id && (
                <p className="text-xs text-base-content/45 mt-1.5">
                  This is an offline participant — the payment will be recorded, but they won't receive an in-app notification.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Payment Method
              </label>
              <div className="relative">
                <BanknotesIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none"
                >
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Note <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isPending}
                  rows="2"
                  placeholder="e.g. Paid in cash at the venue"
                  className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Receipt <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>

              {receiptPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-base-300 h-28">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    disabled={isPending}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-error text-white rounded-lg hover:bg-error/80 transition-colors"
                    aria-label="Remove receipt"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/50 rounded-md text-white text-xs truncate max-w-[80%]">
                    {receiptFile?.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="w-full h-20 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <PhotoIcon className="h-6 w-6 text-base-content/30" />
                  <span className="text-xs text-base-content/50">
                    Attach a receipt photo
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReceiptChange}
              />
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
      </ModalPortal>
    
  );
};

export default RecordPaymentModal;