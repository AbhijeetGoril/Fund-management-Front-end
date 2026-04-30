// SpendsStats.jsx (Themed Version)
import React from "react";
import {
  CurrencyRupeeIcon,
  ChartBarIcon,
  EyeIcon,
  ReceiptPercentIcon
} from "@heroicons/react/20/solid";

const Card = ({ children, className = "", gradientFrom = "primary", gradientTo = "secondary" }) => (
  <div className={`bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${className}`}>
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/0 to-${gradientTo}/0 group-hover:from-${gradientFrom}/10 group-hover:to-${gradientTo}/5 transition-opacity duration-300 pointer-events-none`}></div>
    {children}
  </div>
);

const SpendsStats = ({ totalSpent, remainingBudget, totalBudget, completed, pending, totalCount }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );
  const usage = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = usage > 100;
  const completionRate = totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0;
  const pendingRate = totalCount > 0 ? Math.round((pending / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Spent Card */}
      <Card gradientFrom={isOverBudget ? "error" : "primary"} gradientTo={isOverBudget ? "error" : "secondary"}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOverBudget ? 'bg-error animate-pulse' : 'bg-primary'}`}></div>
              Total Spent
            </p>
            <p className="text-2xl font-bold text-base-content mb-2">{formatINR(totalSpent)}</p>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${isOverBudget ? "text-error" : "text-success"}`}>
                {usage.toFixed(1)}% of budget
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isOverBudget 
                  ? 'bg-error/10 text-error' 
                  : 'bg-success/10 text-success'
              }`}>
                {isOverBudget ? 'Over Budget' : 'On Track'}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl text-primary-content bg-gradient-to-r ${isOverBudget ? 'from-error to-error/70' : 'from-primary to-secondary'} group-hover:scale-110 transition-transform duration-300`}>
            <CurrencyRupeeIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 w-full bg-base-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-error to-error/70' 
                : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            style={{ width: `${Math.min(usage, 100)}%` }}
          ></div>
        </div>
      </Card>

      {/* Remaining Budget Card */}
      <Card gradientFrom="success" gradientTo="success">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              Remaining Budget
            </p>
            <p className={`text-2xl font-bold mb-2 ${remainingBudget < 0 ? 'text-error' : 'text-base-content'}`}>
              {formatINR(remainingBudget)}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-base-content/50">of {formatINR(totalBudget)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                remainingBudget < 0 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
              }`}>
                {remainingBudget < 0 ? 'Deficit' : 'Available'}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl text-primary-content bg-gradient-to-r from-success to-success/70 group-hover:scale-110 transition-transform duration-300">
            <ChartBarIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-base-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-success to-success/70 transition-all duration-1000"
              style={{ width: `${Math.max(0, 100 - usage)}%` }}
            ></div>
          </div>
          <span className="text-xs text-base-content/60 font-medium">{Math.max(0, 100 - usage).toFixed(0)}%</span>
        </div>
      </Card>

      {/* Completed Spends Card */}
      <Card gradientFrom="success" gradientTo="success">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              Completed
            </p>
            <p className="text-2xl font-bold text-base-content mb-2">{completed}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-base-content/50">
                of {totalCount} total
              </p>
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                {completionRate}% done
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl text-primary-content bg-gradient-to-r from-success to-success/70 group-hover:scale-110 transition-transform duration-300">
            <EyeIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-base-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-success to-success/70 transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <span className="text-xs text-base-content/60 font-medium">{completionRate}%</span>
        </div>
      </Card>

      {/* Pending Spends Card */}
      <Card gradientFrom="warning" gradientTo="warning">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
              Pending
            </p>
            <p className="text-2xl font-bold text-base-content mb-2">{pending}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-base-content/50">{pending} awaiting action</p>
              <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                {pendingRate}% pending
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl text-primary-content bg-gradient-to-r from-warning to-warning/70 group-hover:scale-110 transition-transform duration-300">
            <ReceiptPercentIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-base-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-warning to-warning/70 transition-all duration-1000"
              style={{ width: `${pendingRate}%` }}
            ></div>
          </div>
          <span className="text-xs text-base-content/60 font-medium">{pendingRate}%</span>
        </div>
      </Card>
    </div>
  );
};

export default SpendsStats;