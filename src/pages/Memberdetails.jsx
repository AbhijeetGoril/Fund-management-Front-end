import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar/Navbar";
import { axiosInstance } from "../lib/axois";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const fetchMemberDetails = async (eventId, memberId) => {
  const { data } = await axiosInstance.get(`/events/${eventId}/members/${memberId}`);
  return data;
};

const paymentStatusStyle = {
  paid: "bg-success/10 text-success",
  partial: "bg-warning/10 text-warning",
  pending: "bg-error/10 text-error",
};

const methodLabel = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  card: "Card",
  other: "Other",
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const formatDateTime = (dateString) =>
  new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const SkeletonBlock = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-32 bg-base-300/60 rounded-3xl" />
    <div className="h-24 bg-base-300/50 rounded-2xl" />
    <div className="h-64 bg-base-300/40 rounded-3xl" />
  </div>
);

const MemberDetails = () => {
  const { eventId, memberId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["memberDetails", eventId, memberId],
    queryFn: () => fetchMemberDetails(eventId, memberId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <SkeletonBlock />
        </div>
      </div>
    );
  }

  if (isError || !data?.member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-10">
            <div className="h-14 w-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-7 w-7 text-error" />
            </div>
            <h2 className="text-xl font-bold text-base-content mb-2">
              Couldn't load member details
            </h2>
            <p className="text-base-content/60 text-sm mb-6">
              {error?.response?.data?.message || error?.message}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { member, payments = [], event } = data;
  const displayName = member.user?.name || member.name || "Unnamed member";
  const email = member.user?.email || member.email;
  const remaining = (member.amountToPay ?? 0) - (member.amountPaid ?? 0);
  const isOverdue =
    member.dueDate &&
    new Date(member.dueDate) < new Date() &&
    member.paymentStatus !== "paid";
  const progress =
    member.amountToPay > 0
      ? Math.min(100, Math.round((member.amountPaid / member.amountToPay) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors bg-base-100/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-base-200 hover:shadow-lg text-sm font-medium w-fit"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        {/* Member header */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white capitalize">
                  <ShieldCheckIcon className="h-3.5 w-3.5" />
                  {member.role}
                </span>
                {!member.user && (
                  <span className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                    Offline Member
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                {displayName}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-white/85 text-sm">
                {email && (
                  <span className="flex items-center gap-1.5">
                    <EnvelopeIcon className="h-4 w-4" />
                    {email}
                  </span>
                )}
                {member.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="h-4 w-4" />
                    {member.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dues card */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <CurrencyRupeeIcon className="h-5 w-5" />
              Payment Summary — {event?.title}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                paymentStatusStyle[member.paymentStatus] || "bg-base-200 text-base-content/60"
              }`}
            >
              {member.paymentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Paid</p>
              <p className="text-xl font-bold text-success">₹{(member.amountPaid ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Owed</p>
              <p className="text-xl font-bold text-base-content">₹{(member.amountToPay ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Remaining</p>
              <p className={`text-xl font-bold ${remaining > 0 ? "text-error" : "text-success"}`}>
                ₹{Math.max(0, remaining).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className="h-2 rounded-full bg-base-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress >= 100 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {member.dueDate && (
            <div
              className={`flex items-center gap-2 text-sm rounded-xl p-3 ${
                isOverdue ? "bg-error/10 text-error" : "bg-base-200/60 text-base-content/70"
              }`}
            >
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span>
                {isOverdue ? "Overdue since " : "Due by "}
                <span className="font-semibold">{formatDate(member.dueDate)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Payment history */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
          <div className="p-6 pb-4 border-b border-base-200">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <ReceiptPercentIcon className="h-5 w-5" />
              Payment History
            </h2>
            <p className="text-sm text-base-content/50 mt-0.5">
              {payments.length} record{payments.length !== 1 ? "s" : ""}
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BanknotesIcon className="h-10 w-10 text-base-content/15 mb-3" />
              <p className="text-base-content/50 font-medium">No payments recorded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {payments.map((p) => {
                const isCorrection = p.type === "correction";
                const isNegative = p.amount < 0;
                return (
                  <div key={p._id} className="p-4 sm:p-5 flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCorrection
                          ? isNegative
                            ? "bg-warning/10 text-warning"
                            : "bg-info/10 text-info"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      <CurrencyRupeeIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-base-content">
                          <span className={isNegative ? "text-warning" : "text-success"}>
                            {isNegative ? "-" : "+"}₹{Math.abs(p.amount).toLocaleString()}
                          </span>
                          {isCorrection && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-base-200 text-base-content/60">
                              Correction
                            </span>
                          )}
                        </p>
                        <span className="text-xs text-base-content/40 whitespace-nowrap">
                          {formatDateTime(p.paymentDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-base-content/50">
                        {!isCorrection && (
                          <span className="px-2 py-0.5 rounded-full bg-base-200">
                            {methodLabel[p.method] || p.method}
                          </span>
                        )}
                        <span>
                          Recorded by {p.recordedBy?.name || "Unknown"}
                        </span>
                      </div>

                      {p.note && (
                        <p className="text-sm text-base-content/70 mt-2">{p.note}</p>
                      )}

                      {p.receiptImage && (
                        <a
                          href={p.receiptImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2"
                        >
                          <img
                            src={p.receiptImage}
                            alt="Receipt"
                            className="h-16 w-16 object-cover rounded-lg border border-base-300 hover:opacity-80 transition-opacity"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;