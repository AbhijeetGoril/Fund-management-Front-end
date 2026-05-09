import React from "react";
import SummaryCard from "../../components/SummaryCard";
import {
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";

const StatsCards = ({ 
  members, 
  paidMembers, 
  totalDonations, 
  pendingPayments, 
  totalBudget,
  totalRemainingAmount,
  partialPaidMembers 
}) => {
  const remainingBudget = totalBudget - totalDonations;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <SummaryCard
        label="Total Participants"
        value={members.length}
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
        color="primary"
        gradient="from-primary to-secondary"
      />
      <SummaryCard
        label="Paid Members"
        value={paidMembers}
        icon={<CheckCircleIcon className="h-6 w-6 text-success" />}
        color="success"
        gradient="from-success to-success/80"
      />
      <SummaryCard
        label="Partial Paid"
        value={partialPaidMembers}
        icon={<ArrowPathIcon className="h-6 w-6 text-info" />}
        color="info"
        gradient="from-info to-info/80"
      />
      <SummaryCard
        label="Total Collected"
        value={`₹${totalDonations.toLocaleString()}`}
        icon={<CurrencyRupeeIcon className="h-6 w-6 text-warning" />}
        color="warning"
        gradient="from-warning to-warning/80"
      />
      <SummaryCard
        label="Remaining Budget"
        value={`₹${remainingBudget.toLocaleString()}`}
        icon={<CurrencyRupeeIcon className="h-6 w-6 text-secondary" />}
        color="secondary"
        gradient="from-secondary to-secondary/80"
      />
      <SummaryCard
        label="Pending Payments"
        value={`₹${totalRemainingAmount.toLocaleString()}`}
        icon={<XCircleIcon className="h-6 w-6 text-error" />}
        color="error"
        gradient="from-error to-error/80"
      />
    </div>
  );
};

export default StatsCards;