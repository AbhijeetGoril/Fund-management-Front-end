import React from "react";
import {
  CurrencyRupeeIcon,
  ChartBarIcon,
  EyeIcon,
  ReceiptPercentIcon
} from "@heroicons/react/20/solid";

const Card = ({ children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
    {children}
  </div>
);

const SpendsStats = ({ totalSpent, remainingBudget, totalBudget, completed, pending, totalCount }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      Number(n || 0)
    );
  const usage = totalBudget ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">{formatINR(totalSpent)}</p>
            <p className={`text-sm ${usage > 100 ? "text-red-600" : "text-green-600"}`}>
              {usage.toFixed(1)}% of budget
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white">
            <CurrencyRupeeIcon className="h-6 w-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Remaining Budget</p>
            <p className="text-2xl font-bold text-gray-800">{formatINR(remainingBudget)}</p>
            <p className="text-sm text-gray-500">of {formatINR(totalBudget)}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white">
            <ChartBarIcon className="h-6 w-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed Spends</p>
            <p className="text-2xl font-bold text-gray-800">{completed}</p>
            <p className="text-sm text-gray-500">
              {completed} of {totalCount} total
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
            <EyeIcon className="h-6 w-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Spends</p>
            <p className="text-2xl font-bold text-gray-800">{pending}</p>
            <p className="text-sm text-gray-500">{pending} awaiting action</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white">
            <ReceiptPercentIcon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpendsStats;
