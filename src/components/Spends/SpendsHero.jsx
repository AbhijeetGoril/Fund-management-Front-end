// SpendsHero.jsx (Enhanced)
import React from "react";
import { ChartBarIcon, CurrencyRupeeIcon } from "@heroicons/react/20/solid";

const SpendsHero = ({ event, totalSpent, budgetUsage }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );

  const isOverBudget = budgetUsage > 100;
  const remainingBudget = event.totalBudget - totalSpent;

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl text-white p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-300/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold border border-white/30 flex items-center gap-2">
              <CurrencyRupeeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Expense Management
            </span>
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold border border-white/30">
              Event #{event.id}
            </span>
            <span className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold border ${
              isOverBudget 
                ? 'bg-red-500/20 text-red-100 border-red-300/50' 
                : 'bg-green-500/20 text-green-100 border-green-300/50'
            }`}>
              {isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            {event.name}
            <span className="block text-blue-200 text-lg sm:text-xl lg:text-2xl font-light mt-1">
              Financial Overview & Analytics
            </span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl leading-relaxed">
            Comprehensive expense tracking with real-time budget monitoring, detailed analytics, and actionable insights for better financial management.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-300" />
              <div>
                <p className="text-xs text-blue-200">Total Spent</p>
                <p className="font-bold text-white text-sm sm:text-base">{formatINR(totalSpent)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
              <ChartBarIcon className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-xs text-blue-200">Budget Target</p>
                <p className="font-bold text-white text-sm sm:text-base">{formatINR(event.totalBudget)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                isOverBudget ? 'bg-red-400' : 'bg-green-400'
              }`}>
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs text-blue-200">Remaining</p>
                <p className={`font-bold text-sm sm:text-base ${
                  remainingBudget < 0 ? 'text-red-300' : 'text-green-300'
                }`}>
                  {formatINR(remainingBudget)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30 w-full lg:w-auto lg:min-w-80 hover:bg-white/25 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOverBudget ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
            Budget Progress
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-auto">
              {Math.round(budgetUsage)}%
            </span>
          </h3>
          
          <div className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Spent</span>
                <span className="font-bold">{formatINR(totalSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Target</span>
                <span className="font-bold">{formatINR(event.totalBudget)}</span>
              </div>
              
              {/* Main Progress Bar */}
              <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    isOverBudget 
                      ? 'bg-gradient-to-r from-red-400 to-pink-400' 
                      : 'bg-gradient-to-r from-green-400 to-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, Math.round(budgetUsage)))}%` }}
                />
              </div>
            </div>

            {/* Status & Metrics */}
            <div className={`text-center text-sm font-bold ${
              isOverBudget ? 'text-red-200' : 'text-green-200'
            }`}>
              {Math.round(budgetUsage)}% {isOverBudget ? 'Over Budget' : 'of Target'}
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
              <div className="text-center">
                <p className="text-xs text-blue-200">Daily Avg</p>
                <p className="text-sm font-semibold">{formatINR(totalSpent / 30)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-200">Remaining Days</p>
                <p className="text-sm font-semibold">15 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default SpendsHero;