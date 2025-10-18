import React from "react";

const SpendsHero = ({ event, totalSpent, budgetUsage }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      Number(n || 0)
    );

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl text-white p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              Spends
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              EVENT #{event.id}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {event.name} — Spends
          </h1>

          <p className="text-blue-100 text-lg mb-6 max-w-2xl">
            Review and manage all expenditures with transparent totals, filters, and quick actions.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="text-white/90 font-semibold">
              Total: {formatINR(totalSpent)}
            </div>
            <div className="text-white/90 font-semibold">
              Target: {formatINR(event.totalBudget)}
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-80">
          <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Spent</span>
              <span className="font-bold">{formatINR(totalSpent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Target</span>
              <span className="font-bold">{formatINR(event.totalBudget)}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-white to-indigo-200"
                style={{ width: `${Math.min(100, Math.max(0, Math.round(budgetUsage)))}%` }}
              />
            </div>
            <div className="text-center text-sm font-semibold">
              {Math.round(budgetUsage)}% of target
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendsHero;
