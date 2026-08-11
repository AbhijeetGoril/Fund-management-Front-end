import React from "react";
import SummaryCard from "../../components/SummaryCard";
import {
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";

const StatsCards = ({
  members = [],
  paidMembers = 0,
  totalDonations = 0,
  pendingPayments = 0,
  totalBudget = 0,
  totalRemainingAmount = 0,
  partialPaidMembers = 0,
}) => {
  const remainingBudget = totalBudget - totalDonations;
  const collectionRate = totalBudget > 0
    ? Math.min(100, Math.round((totalDonations / totalBudget) * 100))
    : 0;
  const unpaidCount = Math.max(0, members.length - paidMembers - partialPaidMembers);
  const paidPct = members.length > 0 ? Math.round((paidMembers / members.length) * 100) : 0;

  return (
    <div className="space-y-4">

      {/* ── Collection rate overview strip ── */}
      {totalBudget > 0 && (
        <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                Fund Collection Progress
              </p>
              <p className="text-sm text-base-content mt-0.5">
                <span className="font-bold">₹{totalDonations.toLocaleString("en-IN")}</span>
                <span className="text-base-content/50"> of ₹{totalBudget.toLocaleString("en-IN")} target</span>
              </p>
            </div>
            <span
              className={`text-lg font-bold ${
                collectionRate >= 100 ? "text-success" : collectionRate >= 50 ? "text-primary" : "text-warning"
              }`}
            >
              {collectionRate}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-base-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                collectionRate >= 100 ? "bg-success" : collectionRate >= 50 ? "bg-primary" : "bg-warning"
              }`}
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Row 1 — participant counts ── */}
      <div>
        <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wide mb-2 px-1">
          Participants
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            label="Total Participants"
            value={members.length}
            icon={<UsersIcon className="h-5 w-5" />}
            color="primary"
            trendLabel="registered for event"
          />
          <SummaryCard
            label="Fully Paid"
            value={paidMembers}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            color="success"
            trendLabel={`${paidPct}% of participants`}
          />
          <SummaryCard
            label="Partial Payment"
            value={partialPaidMembers}
            icon={<ArrowPathIcon className="h-5 w-5" />}
            color="info"
            trendLabel="partially settled"
          />
          <SummaryCard
            label="Not Paid"
            value={unpaidCount}
            icon={<XCircleIcon className="h-5 w-5" />}
            color="error"
            trendLabel="yet to pay"
          />
        </div>
      </div>

      {/* ── Row 2 — money ── */}
      <div>
        <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wide mb-2 px-1">
          Finances
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard
            label="Total Collected"
            value={`₹${totalDonations.toLocaleString("en-IN")}`}
            icon={<CurrencyRupeeIcon className="h-5 w-5" />}
            color="warning"
            trendLabel={`${collectionRate}% of budget collected`}
          />
          <SummaryCard
            label="Pending Payments"
            value={`₹${totalRemainingAmount.toLocaleString("en-IN")}`}
            icon={<XCircleIcon className="h-5 w-5" />}
            color="error"
            trendLabel="outstanding from participants"
          />
          <SummaryCard
            label="Remaining Budget"
            value={`₹${Math.abs(remainingBudget).toLocaleString("en-IN")}`}
            icon={<CurrencyRupeeIcon className="h-5 w-5" />}
            color={remainingBudget < 0 ? "error" : "secondary"}
            trendLabel={remainingBudget < 0 ? "over budget" : "left to reach target"}
          />
        </div>
      </div>

    </div>
  );
};

export default StatsCards;