// EventSpends.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../components/Navbar/Navbar";
import { Loader } from "../../components/Loader";
import SpendsHero from "../../components/Spends/SpendsHero";
import SpendsStats from "../../components/Spends/SpendsStats";
import SpendsFilters from "../../components/Spends/SpendsFilters";
import SpendsTable from "../../components/Spends/SpendsTable";
import { AddOrEditModal, ViewModal } from "../../components/Spends/SpendModals";
import {
  getEventSpends,
  addSpend,
  updateSpend,
  deleteSpend,
} from "../../lib/api/spendApi";
import toast from "react-hot-toast";

const EventSpends = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── UI State ──────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]         = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus]     = useState("all");
  const [sortBy, setSortBy]                 = useState("spendDate");
  const [sortOrder, setSortOrder]           = useState("desc");
  const [addEditOpen, setAddEditOpen]       = useState(false);
  const [editingSpend, setEditingSpend]     = useState(null);
  const [viewSpend, setViewSpend]           = useState(null);

  // ── Query ─────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["eventSpends", eventId],
    queryFn: () => getEventSpends(eventId),
    staleTime: 30_000,
  });
  console.log(data)
  const spends    = data?.data?.spends  ?? [];
  const summary   = data?.data?.summary ?? null;
  const eventInfo = data?.data?.event   ?? null;

  // ── Mutations ─────────────────────────────────────────────────────────
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["eventSpends", eventId] });

  const addMutation = useMutation({
    mutationFn: (fd) => addSpend(fd),
    onSuccess: () => {
      toast.success("Spend added successfully");
      setAddEditOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to add spend"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }) => updateSpend(id, fd),
    onSuccess: () => {
      toast.success("Spend updated successfully");
      setAddEditOpen(false);
      setEditingSpend(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update spend"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSpend(id),
    onSuccess: () => {
      toast.success("Spend deleted");
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete spend"),
  });

  // ── Derived values ────────────────────────────────────────────────────
  const totalSpent      = summary?.totalSpent      ?? 0;
  const remainingBudget = summary?.remainingBudget ?? 0;
  const totalBudget     = summary?.totalBudget     ?? 0;
  const budgetUsage     = totalBudget
    ? Math.min(100, (totalSpent / totalBudget) * 100)
    : 0;
  const pendingSpends  = summary?.pendingCount  ?? 0;
  const approvedSpends = summary?.approvedCount ?? 0;

  const categories = useMemo(
    () => [...new Set(spends.map((s) => s.category).filter(Boolean))],
    [spends]
  );

  const filteredSpends = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = spends.filter((spend) => {
      const matchesSearch =
        !q ||
        (spend.title || "").toLowerCase().includes(q) ||
        (spend.paidTo || "").toLowerCase().includes(q) ||
        (spend.receiptNumber || "").toLowerCase().includes(q) ||
        (spend.paidBy?.name || spend.paidBy || "").toLowerCase().includes(q);
      const matchesCategory =
        filterCategory === "all" || spend.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || spend.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    list.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      } else if (sortBy === "spendDate") {
        aVal = new Date(a.spendDate);
        bVal = new Date(b.spendDate);
      } else {
        aVal = a[sortBy] ?? "";
        bVal = b[sortBy] ?? "";
      }
      return sortOrder === "asc"
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    return list;
  }, [spends, searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingSpend(null);
    setAddEditOpen(true);
  };

  const openEdit = (spend) => {
    setEditingSpend(spend);
    setAddEditOpen(true);
  };

  const onSubmitAddEdit = (fd) => {
    if (editingSpend) {
      updateMutation.mutate({ id: editingSpend._id, fd });
    } else {
      addMutation.mutate(fd);
    }
  };

  const handleDeleteSpend = (id) => {
    if (!window.confirm("Are you sure you want to delete this spend?")) return;
    deleteMutation.mutate(id);
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  // ── Loading ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader size="lg" color="primary" variant="spinner" />
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (isError || !eventInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              {isError
                ? error?.response?.data?.message || "Failed to load spends"
                : "Event not found"}
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eventForHero = {
    ...eventInfo,
    name: eventInfo.title,
    totalBudget: eventInfo.budget?.target ?? 0,
    id: eventInfo._id,
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(`/events/${eventInfo._id}`)}
            className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-all duration-200 bg-base-100/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Event</span>
          </button>

          <button
            onClick={openAdd}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">
              {isSubmitting ? "Saving..." : "Add Spend"}
            </span>
          </button>
        </div>

        {/* Hero */}
        <SpendsHero
          event={eventForHero}
          totalSpent={totalSpent}
          budgetUsage={budgetUsage}
        />

        {/* Stats */}
        <SpendsStats
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          totalBudget={totalBudget}
          completed={approvedSpends}
          pending={pendingSpends}
          totalCount={spends.length}
        />

        {/* Filters */}
        <SpendsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          total={spends.length}
          showing={filteredSpends.length}
          completed={approvedSpends}
          pending={pendingSpends}
        />

        {/* Table */}
        <SpendsTable
          items={filteredSpends}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          onView={(s) => setViewSpend(s)}
          onEdit={openEdit}
          onDelete={handleDeleteSpend}
        />

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-base-content/40 text-xs sm:text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modals */}
      <AddOrEditModal
        open={addEditOpen}
        onClose={() => {
          if (isSubmitting) return;
          setAddEditOpen(false);
          setEditingSpend(null);
        }}
        onSubmit={onSubmitAddEdit}
        initial={editingSpend}
        eventId={eventId}
      />

      <ViewModal
        spend={viewSpend}
        onClose={() => setViewSpend(null)}
        onEdit={(s) => {
          setViewSpend(null);
          openEdit(s);
        }}
      />
    </div>
  );
};

export default EventSpends;