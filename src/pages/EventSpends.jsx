// EventSpends.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar/Navbar";
import { Loader } from "../components/Loader";
import SpendsHero from "../components/Spends/SpendsHero";
import SpendsStats from "../components/Spends/SpendsStats";
import SpendsFilters from "../components/Spends/SpendsFilters";
import SpendsTable from "../components/Spends/SpendsTable";
import { AddOrEditModal, ViewModal } from "../components/Spends/SpendModals";

const dummyEventsArray = {
  1: {
    id: 1,
    name: "Annual Function 2024",
    date: "2024-03-15",
    venue: "Community Hall",
    description: "Join us for an evening of cultural performances...",
    totalBudget: 50000,
    collectedAmount: 35000,
    status: "active",
    spends: [
      { id: 1, description: "Venue Decoration", amount: 15000, date: "2024-03-10", category: "Decoration", paidTo: "Creative Decorators", receiptNumber: "REC001", status: "completed", approvedBy: "Abhijeet Sharma", receiptImage: "", notes: "Included flowers and lighting" },
      { id: 2, description: "Sound System Rental", amount: 8000, date: "2024-03-12", category: "Equipment", paidTo: "Audio Solutions", receiptNumber: "REC002", status: "completed", approvedBy: "Priya Singh", receiptImage: "", notes: "Wireless microphones included" },
      { id: 3, description: "Catering Services", amount: 12000, date: "2024-03-14", category: "Food", paidTo: "Taste Caterers", receiptNumber: "REC003", status: "pending", approvedBy: "Rohit Kumar", receiptImage: "", notes: "Buffet for 150 people" },
      { id: 4, description: "Photography", amount: 6000, date: "2024-03-08", category: "Media", paidTo: "Photo Studio", receiptNumber: "REC004", status: "completed", approvedBy: "Anjali Patel", receiptImage: "", notes: "2 photographers for 6 hours" },
      { id: 5, description: "Transportation", amount: 4500, date: "2024-03-13", category: "Transport", paidTo: "City Transport Co.", receiptNumber: "REC005", status: "pending", approvedBy: "Sanjay Mehta", receiptImage: "", notes: "2 buses for guest pickup" },
    ],
  },
};

const EventSpends = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingSpend, setEditingSpend] = useState(null);
  const [viewSpend, setViewSpend] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const foundEvent = dummyEventsArray[eventId] || dummyEventsArray[1];
      setEvent(foundEvent);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [eventId]);

  const totalSpent = useMemo(
    () => (event?.spends || []).reduce((sum, s) => sum + s.amount, 0),
    [event]
  );
  const remainingBudget = (event?.totalBudget || 0) - totalSpent;
  const budgetUsage = event?.totalBudget
    ? Math.min(100, (totalSpent / event.totalBudget) * 100)
    : 0;

  const statusCounts =
    event?.spends.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {}) || {};
  const completedSpends = statusCounts.completed || 0;
  const pendingSpends = statusCounts.pending || 0;
  const categories = [...new Set(event?.spends.map((s) => s.category) || [])];

  const filteredSpends = useMemo(() => {
    if (!event) return [];
    const q = searchTerm.trim().toLowerCase();
    let filtered = event.spends.filter((spend) => {
      const matchesSearch =
        !q ||
        spend.description.toLowerCase().includes(q) ||
        (spend.paidTo || "").toLowerCase().includes(q) ||
        (spend.receiptNumber || "").toLowerCase().includes(q);
      const matchesCategory = filterCategory === "all" || spend.category === filterCategory;
      const matchesStatus = filterStatus === "all" || spend.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "amount") {
        aVal = a.amount; bVal = b.amount;
      } else if (sortBy === "date") {
        aVal = new Date(a.date); bVal = new Date(b.date);
      } else {
        aVal = a[sortBy]; bVal = b[sortBy];
      }
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return filtered;
  }, [event, searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  const openAdd = () => {
    setEditingSpend(null);
    setAddEditOpen(true);
  };
  const openEdit = (spend) => {
    setEditingSpend(spend);
    setAddEditOpen(true);
  };
  const onSubmitAddEdit = (payload) => {
    if (!event) return;
    if (editingSpend) {
      const updated = event.spends.map((s) =>
        s.id === editingSpend.id ? { ...s, ...payload } : s
      );
      setEvent({ ...event, spends: updated });
      setEditingSpend(null);
    } else {
      const nextId = Math.max(...event.spends.map((s) => s.id)) + 1;
      const newSpend = {
        id: nextId,
        ...payload,
        approvedBy: "Current User",
        receiptImage: "",
      };
      setEvent({ ...event, spends: [...event.spends, newSpend] });
    }
    setAddEditOpen(false);
  };
  const handleDeleteSpend = (id) => {
    if (!event) return;
    if (window.confirm("Are you sure you want to delete this spend?")) {
      setEvent({ ...event, spends: event.spends.filter((s) => s.id !== id) });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader size="lg" color="primary" variant="spinner" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">Event not found</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      {/* Animated blobs using theme colors */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-all duration-200 bg-base-100/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back to Event</span>
            </button>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto justify-center"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Add Spend</span>
          </button>
        </div>

        {/* Hero Section */}
        <SpendsHero event={event} totalSpent={totalSpent} budgetUsage={budgetUsage} />

        {/* Statistics Cards */}
        <SpendsStats
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          totalBudget={event.totalBudget}
          completed={completedSpends}
          pending={pendingSpends}
          totalCount={event.spends.length}
        />

        {/* Filters Section */}
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
          total={event.spends.length}
          showing={filteredSpends.length}
          completed={completedSpends}
          pending={pendingSpends}
        />

        {/* Main Table */}
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
          setAddEditOpen(false);
          setEditingSpend(null);
        }}
        onSubmit={onSubmitAddEdit}
        initial={editingSpend}
      />
      <ViewModal
        spend={viewSpend}
        onClose={() => setViewSpend(null)}
        onEdit={openEdit}
      />
    </div>
  );
};

export default EventSpends;