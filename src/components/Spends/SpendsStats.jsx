// SpendsStats.jsx (Enhanced)
import React from "react";
import {
  CurrencyRupeeIcon,
  ChartBarIcon,
  EyeIcon,
  ReceiptPercentIcon
} from "@heroicons/react/20/solid";

const Card = ({ children, className = "", gradient = "from-blue-500 to-cyan-500" }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden ${className}`}>
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
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
      <Card gradient={isOverBudget ? "from-red-500 to-pink-500" : "from-blue-500 to-cyan-500"}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOverBudget ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
              Total Spent
            </p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{formatINR(totalSpent)}</p>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                {usage.toFixed(1)}% of budget
              </p>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {isOverBudget ? 'Over Budget' : 'On Track'}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl text-white ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} group-hover:scale-110 transition-transform duration-300`}>
            <CurrencyRupeeIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            style={{ width: `${Math.min(usage, 100)}%` }}
          ></div>
        </div>
      </Card>

      {/* Remaining Budget Card */}
      <Card gradient="from-green-500 to-emerald-500">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Remaining Budget
            </p>
            <p className={`text-2xl font-bold mb-2 ${remainingBudget < 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {formatINR(remainingBudget)}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">of {formatINR(totalBudget)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${remainingBudget < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {remainingBudget < 0 ? 'Deficit' : 'Available'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300">
            <ChartBarIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${Math.max(0, 100 - usage)}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">{Math.max(0, 100 - usage).toFixed(0)}%</span>
        </div>
      </Card>

      {/* Completed Spends Card */}
      <Card gradient="from-emerald-500 to-teal-500">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Completed
            </p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{completed}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                of {totalCount} total
              </p>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                {completionRate}% done
              </span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300">
            <EyeIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">{completionRate}%</span>
        </div>
      </Card>

      {/* Pending Spends Card */}
      <Card gradient="from-amber-500 to-orange-500">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              Pending
            </p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{pending}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{pending} awaiting action</p>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                {pendingRate}% pending
              </span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300">
            <ReceiptPercentIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
              style={{ width: `${pendingRate}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">{pendingRate}%</span>
        </div>
      </Card>
    </div>
  );
};

export default SpendsStats;