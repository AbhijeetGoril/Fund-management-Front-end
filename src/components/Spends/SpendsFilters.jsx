// SpendsFilters.jsx (Fixed)
import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SpendsFilters = ({
  searchTerm,
  setSearchTerm,
  categories,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  total,
  showing,
  completed,
  pending
}) => {
  const hasActiveFilters = searchTerm || filterCategory !== "all" || filterStatus !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "text-green-700 bg-green-100 border-green-200",
      pending: "text-amber-700 bg-amber-100 border-amber-200",
      cancelled: "text-red-700 bg-red-100 border-red-200",
      all: "text-gray-700 bg-gray-100 border-gray-200"
    };
    return colors[status] || colors.all;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Decoration: "text-pink-700 bg-pink-100 border-pink-200",
      Food: "text-amber-700 bg-amber-100 border-amber-200",
      Equipment: "text-blue-700 bg-blue-100 border-blue-200",
      Media: "text-purple-700 bg-purple-100 border-purple-200",
      Transport: "text-emerald-700 bg-emerald-100 border-emerald-200",
      Entertainment: "text-violet-700 bg-violet-100 border-violet-200",
      Other: "text-gray-700 bg-gray-100 border-gray-200",
      all: "text-gray-700 bg-gray-100 border-gray-200"
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search spends by description, vendor, or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:border-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 min-w-[160px] appearance-none cursor-pointer transition-all duration-200 ${
                filterCategory !== "all" 
                  ? getCategoryColor(filterCategory) + " border-2 font-semibold" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 min-w-[160px] appearance-none cursor-pointer transition-all duration-200 ${
                filterStatus !== "all" 
                  ? getStatusColor(filterStatus) + " border-2 font-semibold" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm ${
              hasActiveFilters
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-lg transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Results Count */}
        <div className="flex items-center gap-3">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-bold text-blue-600">{showing}</span> of{" "}
            <span className="font-bold text-gray-800">{total}</span> spends
          </p>
          
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                  {filterCategory}
                  <button onClick={() => setFilterCategory("all")} className="hover:text-purple-900">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${
                  filterStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                  filterStatus === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {filterStatus}
                  <button onClick={() => setFilterStatus("all")} className="hover:opacity-70">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
          <div className="flex gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-");
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 hover:border-gray-400 transition-all duration-200"
            >
              <option value="date-desc">📅 Date (Newest)</option>
              <option value="date-asc">📅 Date (Oldest)</option>
              <option value="amount-desc">💰 Amount (High to Low)</option>
              <option value="amount-asc">💰 Amount (Low to High)</option>
              <option value="description-asc">📝 Description (A-Z)</option>
              <option value="description-desc">📝 Description (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {showing > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>🎯 {Math.round((showing / total) * 100)}% of total</span>
            {filterStatus === "all" && completed !== undefined && pending !== undefined && (
              <>
                <span>✅ {Math.round((completed / total) * 100)}% completed</span>
                <span>⏳ {Math.round((pending / total) * 100)}% pending</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendsFilters;