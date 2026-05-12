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
  const remainingBudget  = totalBudget - totalDonations;
  const collectionRate   = totalBudget > 0
    ? Math.round((totalDonations / totalBudget) * 100)
    : 0;
  const unpaidCount      = members.length - paidMembers - partialPaidMembers;

  return (
    <div className="mb-8 space-y-3">

      {/* ── Row 1 — participant counts ── */}
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
          trendLabel={`${members.length > 0 ? Math.round((paidMembers / members.length) * 100) : 0}% of participants`}
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
          value={unpaidCount < 0 ? 0 : unpaidCount}
          icon={<XCircleIcon className="h-5 w-5" />}
          color="error"
          trendLabel="yet to pay"
        />
      </div>

      {/* ── Row 2 — money ── */}
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
  );
};

export default StatsCards;