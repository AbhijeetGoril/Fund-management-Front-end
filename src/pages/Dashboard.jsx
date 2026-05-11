import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import Navbar from "../components/Navbar/Navbar";
import { Loader } from "../components/Loader";
import CreateEventForm from "../components/Addmin-Panel/CreateEventForm";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/common/StatCard";
import SectionHeader from "../components/common/SectionHeader";
import EventGrid from "../components/events/EventGrid";
import EventFilters from "../components/events/EventFilters";
import SocietyGrid from "../components/societies/SocietyGrid";

import { axiosInstance } from "../lib/axois";
import { societies as seedSocieties } from "../data/dummy";

// ── Fetcher ───────────────────────────────────────────────────────────────────
const fetchMyEvents = async () => {
  const { data } = await axiosInstance.get("/societies/events/allMyRelatedEvents");
  return data.events;
};

// ── Normalizers ───────────────────────────────────────────────────────────────
function normalizeSocieties(list) {
  const societies = Array.isArray(list) ? list : [];
  const toNumber = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const toNumberFromCommaString = (v) =>
    typeof v === "string" ? toNumber(v.replace(/,/g, "")) : toNumber(v);

  return societies.map((s) => ({
    ...s,
    totalMembers: toNumber(s.totalMembers),
    totalCollected: toNumberFromCommaString(s.totalCollected),
    status: (s.status || "active").toLowerCase(),
    events: Array.isArray(s.events)
      ? s.events.map((e) => ({
          ...e,
          totalMembers: toNumber(e.totalMembers),
          paidMembers: toNumber(e.paidMembers),
          pendingPayments: toNumber(e.pendingPayments),
          totalCollected: toNumber(e.totalCollected),
          progress: toNumber(e.progress),
          status: (e.status || "active").toLowerCase(),
          type: e.type || "society",
        }))
      : [],
  }));
}

function normalizeApiEvents(list) {
  if (!Array.isArray(list)) return [];
  return list.map((e) => ({
    id:              e._id,
    _id:             e._id,
    title:           e.title,
    description:     e.description,
    category:        e.category,
    date:            e.date,
    location:        e.location ?? "",
    coverPhoto:      e.coverPhoto ?? "",        // ← new
    status:          (e.status || "active").toLowerCase(),
    type:            "individual",
    isAdmin:         e.isAdmin ?? false,
    createdBy:       e.createdBy,
    society:         e.society,
    totalMembers:    e.members?.length ?? 0,
    paidMembers:     0,
    pendingPayments: 0,
    totalCollected:  e.budget?.collected ?? 0,
    progress:        e.budget?.target
      ? Math.round(((e.budget.collected ?? 0) / e.budget.target) * 100)
      : 0,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [societies, setSocieties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab]       = useState("events");
  const navigate = useNavigate();

  useEffect(() => {
    setSocieties(normalizeSocieties(seedSocieties));
  }, []);

  const {
    data: rawEvents,
    isLoading,
    isError,
    error,
    refetch: refetchMyEvents,
  } = useQuery({
    queryKey: ["myEvents"],
    queryFn:  fetchMyEvents,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const events = useMemo(() => normalizeApiEvents(rawEvents), [rawEvents]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalCollectedSoc = societies.reduce((s, c) => s + c.totalCollected, 0);
    const totalPendingSoc   = societies.reduce(
      (s, c) => s + c.events.reduce((ps, e) => ps + e.pendingPayments, 0), 0
    );
    const totalCollectedInd = events.reduce((s, e) => s + e.totalCollected, 0);
    const totalPendingInd   = events.reduce((s, e) => s + e.pendingPayments, 0);

    return {
      totalSocieties:       societies.length,
      totalEvents:          events.length + societies.reduce((a, s) => a + s.events.length, 0),
      totalCollected:       totalCollectedSoc + totalCollectedInd,
      totalPending:         totalPendingSoc + totalPendingInd,
      individualEventCount: events.length,
    };
  }, [societies, events]);

  // ── Filtered events ───────────────────────────────────────────────────────
  const filteredPersonalEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeFilter === "all")        return true;
      if (activeFilter === "individual") return e.type === "individual";
      if (activeFilter === "active" || activeFilter === "completed")
        return e.status === activeFilter;
      return true;
    });
  }, [events, activeFilter]);

  const handleEventClick   = (id) => navigate(`/events/${id}`);
  const handleSocietyClick = (id) => navigate(`/society/${id}`);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader size="lg" color="primary" variant="spinner" />
            <p className="mt-4 text-base-content/60 font-medium animate-pulse">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-error">Failed to load events</p>
            <p className="text-sm text-base-content/60">
              {error?.response?.data?.message || error?.message}
            </p>
            <button
              onClick={refetchMyEvents}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-medium hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      {showModal && (
        <CreateEventForm
          onEventCreated={refetchMyEvents}
          setShowModal={setShowModal}
          societies={societies}
          societyId={null}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Community Dashboard"
          subtitle="Manage societies and events efficiently"
          right={
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-success/20 flex items-center">
                <div className="relative">
                  <div className="bg-success w-3 h-3 rounded-full mr-3 animate-ping absolute" />
                  <div className="bg-success w-3 h-3 rounded-full mr-3 relative" />
                </div>
                <span className="text-sm font-semibold text-base-content">Active</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                New Event
              </button>
            </div>
          }
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Societies"
            value={stats.totalSocieties}
            change="+2%"
            trend="up"
            icon={<BuildingLibraryIcon className="h-6 w-6" />}
            gradient="from-primary to-info"
          />
          <StatCard
            label="Total Events"
            value={stats.totalEvents}
            change="+12%"
            trend="up"
            icon={<ChartBarIcon className="h-6 w-6" />}
            gradient="from-secondary to-accent"
          />
          <StatCard
            label="Total Collected"
            value={`₹${stats.totalCollected.toLocaleString()}`}
            change="+23%"
            trend="up"
            icon={<CurrencyRupeeIcon className="h-6 w-6" />}
            gradient="from-success to-success"
          />
          <StatCard
            label="Pending Payments"
            value={stats.totalPending}
            change="-8%"
            trend="down"
            icon={<ClockIcon className="h-6 w-6" />}
            gradient="from-warning to-warning"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-base-100/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-base-200/50 w-fit">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "events"
                ? "bg-gradient-to-r from-primary to-secondary text-primary-content shadow-sm"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Events ({stats.individualEventCount})
          </button>
          <button
            onClick={() => setActiveTab("societies")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "societies"
                ? "bg-gradient-to-r from-primary to-secondary text-primary-content shadow-sm"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
            Societies ({stats.totalSocieties})
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
            <SectionHeader
              title="Personal Events"
              subtitle={`${stats.individualEventCount} personal events`}
              leftIcon={<CalendarIcon className="h-6 w-6 text-primary" />}
              right={
                <div className="flex flex-wrap gap-3">
                  <EventFilters
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                  <button className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 rounded-xl hover:bg-base-200 transition-all duration-200 border border-base-300 shadow-sm flex items-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </button>
                </div>
              }
            />
            <EventGrid
              events={filteredPersonalEvents}
              loading={false}
              onCardClick={handleEventClick}
              emptyCta={() => setShowModal(true)}
              Loader={Loader}
              loaderProps={{ size: "lg", color: "primary", variant: "spinner" }}
            />
            <div className="px-6 py-4 bg-base-200/50 border-t border-base-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-base-content/60">
                  Showing{" "}
                  <span className="font-semibold text-base-content">
                    {filteredPersonalEvents.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-base-content">
                    {events.length}
                  </span>{" "}
                  personal events
                </p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 rounded-xl border border-base-300 shadow-sm hover:bg-base-200 transition-all duration-200">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl shadow-sm">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 rounded-xl border border-base-300 shadow-sm hover:bg-base-200 transition-all duration-200">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Societies Tab */}
        {activeTab === "societies" && (
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
            <SectionHeader
              title="Your Societies"
              subtitle="Manage and track all society communities"
              leftIcon={<BuildingOfficeIcon className="h-6 w-6 text-secondary" />}
              right={
                <button className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 rounded-xl hover:bg-base-200 transition-all duration-200 border border-base-300 shadow-sm flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Society
                </button>
              }
            />
            <SocietyGrid
              societies={societies}
              loading={false}
              onCardClick={handleSocietyClick}
              Loader={Loader}
              loaderProps={{ size: "lg", color: "secondary", variant: "dots" }}
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-base-content/40 text-sm">
            © {new Date().getFullYear()} Community Management System. Crafted with ❤️ for better community living.
          </p>
        </div>
      </div>
    </div>
  );
}