// SpendsFilters.jsx (Themed Version)
import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SpendsFilters = ({
  searchTerm, setSearchTerm,
  categories,
  filterCategory, setFilterCategory,
  filterStatus, setFilterStatus,
  sortBy, sortOrder, setSortBy, setSortOrder,
  total, showing, completed, pending,
}) => {
  const hasActiveFilters = searchTerm || filterCategory !== "all" || filterStatus !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "text-success-content bg-success/10 border-success/20",
      pending:  "text-warning-content bg-warning/10 border-warning/20",
      rejected: "text-error-content bg-error/10 border-error/20",
      all:      "text-base-content bg-base-200 border-base-300",
    };
    return colors[status] || colors.all;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Decoration:    "text-primary bg-primary/10 border-primary/20",
      Food:          "text-secondary bg-secondary/10 border-secondary/20",
      Equipment:     "text-accent bg-accent/10 border-accent/20",
      Media:         "text-info bg-info/10 border-info/20",
      Transport:     "text-success bg-success/10 border-success/20",
      Entertainment: "text-warning bg-warning/10 border-warning/20",
      Other:         "text-base-content bg-base-200 border-base-300",
      all:           "text-base-content bg-base-200 border-base-300",
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-md border border-base-200 p-4 sm:p-6 mb-4 sm:mb-6">

      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

        {/* Search */}
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-base-content/50 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, vendor, receipt, payer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-100 text-base-content placeholder:text-base-content/50 hover:border-base-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/50 hover:text-base-content transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">

          {/* Category */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-base-100 min-w-[160px] appearance-none cursor-pointer transition-all duration-200 ${
                filterCategory !== "all"
                  ? getCategoryColor(filterCategory) + " border-2 font-semibold"
                  : "border-base-300 hover:border-base-400 text-base-content"
              }`}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-base-100 min-w-[160px] appearance-none cursor-pointer transition-all duration-200 ${
                filterStatus !== "all"
                  ? getStatusColor(filterStatus) + " border-2 font-semibold"
                  : "border-base-300 hover:border-base-400 text-base-content"
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Clear */}
          <button
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm ${
              hasActiveFilters
                ? "bg-gradient-to-r from-error to-error/80 text-error-content hover:shadow-lg transform hover:scale-105"
                : "bg-base-200 text-base-content/40 cursor-not-allowed"
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Results + Active badges */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-base-content/70 text-sm">
            Showing <span className="font-bold text-primary">{showing}</span> of{" "}
            <span className="font-bold text-base-content">{total}</span> spends
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-base-content/50">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}><XMarkIcon className="h-3 w-3" /></button>
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full border border-secondary/20">
                  {filterCategory}
                  <button onClick={() => setFilterCategory("all")}><XMarkIcon className="h-3 w-3" /></button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${
                  filterStatus === "approved" ? "bg-success/10 text-success border-success/20" :
                  filterStatus === "pending"  ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-error/10 text-error border-error/20"
                }`}>
                  {filterStatus}
                  <button onClick={() => setFilterStatus("all")}><XMarkIcon className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-base-content/60 hidden sm:inline">Sort by:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb);
              setSortOrder(so);
            }}
            className="px-3 py-2 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-base-100 text-base-content hover:border-base-400 transition-all duration-200"
          >
            <option value="spendDate-desc">📅 Date (Newest)</option>
            <option value="spendDate-asc">📅 Date (Oldest)</option>
            <option value="amount-desc">💰 Amount (High to Low)</option>
            <option value="amount-asc">💰 Amount (Low to High)</option>
            <option value="title-asc">📝 Title (A-Z)</option>
            <option value="title-desc">📝 Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      {showing > 0 && (
        <div className="mt-3 pt-3 border-t border-base-200">
          <div className="flex flex-wrap gap-4 text-xs text-base-content/50">
            <span>🎯 {Math.round((showing / total) * 100)}% of total</span>
            {filterStatus === "all" && completed !== undefined && pending !== undefined && (
              <>
                <span>✅ {Math.round((completed / total) * 100)}% approved</span>
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