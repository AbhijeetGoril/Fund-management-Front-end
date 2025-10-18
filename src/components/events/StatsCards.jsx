import React from "react";
import SummaryCard from "../../components/SummaryCard";
import {
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";

const StatsCards = ({ members, paidMembers, totalDonations, pendingPayments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        label="Total Participants"
        value={members.length}
        icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
        color="blue"
        gradient="from-blue-500 to-cyan-500"
      />
      <SummaryCard
        label="Paid Members"
        value={paidMembers}
        icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
        color="green"
        gradient="from-green-500 to-emerald-500"
      />
      <SummaryCard
        label="Total Collected"
        value={`₹${totalDonations.toLocaleString()}`}
        icon={<CurrencyRupeeIcon className="h-6 w-6 text-amber-500" />}
        color="amber"
        gradient="from-amber-500 to-orange-500"
      />
      <SummaryCard
        label="Pending Payments"
        value={pendingPayments}
        icon={<XCircleIcon className="h-6 w-6 text-red-500" />}
        color="red"
        gradient="from-red-500 to-pink-500"
      />
    </div>
  );
};

export default StatsCards;
