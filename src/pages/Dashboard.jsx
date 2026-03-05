import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  PlusIcon
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

import { societies as seedSocieties, personalEvents as seedPersonal } from "../data/dummy";

// Normalize helpers
function normalizeSocieties(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(s => ({
    ...s,
    totalMembers: Number.isFinite(Number(s.totalMembers)) ? Number(s.totalMembers) : 0,
    totalCollected: Number.isFinite(Number(String(s.totalCollected).replace(/,/g, ''))) ? Number(String(s.totalCollected).replace(/,/g, '')) : 0,
    status: (s.status || 'active').toLowerCase(),
    events: Array.isArray(s.events) ? s.events.map(ev => ({
      ...ev,
      totalMembers: Number(ev.totalMembers) || 0,
      paidMembers: Number(ev.paidMembers) || 0,
      pendingPayments: Number(ev.pendingPayments) || 0,
      totalCollected: Number(ev.totalCollected) || 0,
      progress: Number(ev.progress) || 0,
      status: (ev.status || 'active').toLowerCase(),
      type: ev.type || 'society'
    })) : []
  }));
}

function normalizePersonal(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(e => ({
    ...e,
    totalMembers: Number(e.totalMembers) || 0,
    paidMembers: Number(e.paidMembers) || 0,
    pendingPayments: Number(e.pendingPayments) || 0,
    totalCollected: Number(e.totalCollected) || 0,
    progress: Number(e.progress) || 0,
    status: (e.status || 'active').toLowerCase(),
    type: e.type || 'individual'
  }));
}

export default function Dashboard() {
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]); // personal only
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("events");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      setSocieties(normalizeSocieties(seedSocieties));
      setEvents(normalizePersonal(seedPersonal));
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // Stats: separate tallies
  const stats = useMemo(() => {
    const totalSocieties = societies.length;

    const totalCollectedSoc = societies.reduce((sum, s) => sum + s.totalCollected, 0);
    const totalPendingSoc = societies.reduce(
      (sum, s) => sum + s.events.reduce((ps, e) => ps + e.pendingPayments, 0),
      0
    );

    const individualEventCount = events.length;
    const totalCollectedInd = events.reduce((sum, e) => sum + e.totalCollected, 0);
    const totalPendingInd = events.reduce((sum, e) => sum + e.pendingPayments, 0);

    // Dashboard totals include both categories
    return {
      totalSocieties,
      totalEvents: individualEventCount + societies.reduce((a, s) => a + s.events.length, 0),
      totalCollected: totalCollectedSoc + totalCollectedInd,
      totalPending: totalPendingSoc + totalPendingInd,
      individualEventCount
    };
  }, [societies, events]);

  // Events tab filters personal events only
  const filteredPersonalEvents = useMemo(() => {
    return events.filter(e => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'individual') return e.type === 'individual';
      if (activeFilter === 'active' || activeFilter === 'completed') return e.status === activeFilter;
      return true;
    });
  }, [events, activeFilter]);

  const handleEventClick = (id) => navigate(`/events/${id}`);
  const handleSocietyClick = (id) => navigate(`/society/${id}`);

  // Show loading state with daisyUI loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader size="lg" color="primary" variant="spinner" />
            <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      {showModal && <CreateEventForm setShowModal={setShowModal} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Community Dashboard"
          subtitle="Manage societies and events efficiently"
          right={
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-green-200/50 flex items-center">
                <div className="relative">
                  <div className="bg-success w-3 h-3 rounded-full mr-3 animate-ping absolute"></div>
                  <div className="bg-success w-3 h-3 rounded-full mr-3 relative"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                New Event
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Societies" 
            value={stats.totalSocieties} 
            change="+2%" 
            trend="up" 
            icon={<BuildingLibraryIcon className="h-6 w-6" />} 
            gradient="from-blue-500 to-cyan-500" 
          />
          <StatCard 
            label="Total Events" 
            value={stats.totalEvents} 
            change="+12%" 
            trend="up" 
            icon={<ChartBarIcon className="h-6 w-6" />} 
            gradient="from-purple-500 to-pink-500" 
          />
          <StatCard 
            label="Total Collected" 
            value={`₹${stats.totalCollected.toLocaleString()}`} 
            change="+23%" 
            trend="up" 
            icon={<CurrencyRupeeIcon className="h-6 w-6" />} 
            gradient="from-emerald-500 to-green-500" 
          />
          <StatCard 
            label="Pending Payments" 
            value={stats.totalPending} 
            change="-8%" 
            trend="down" 
            icon={<ClockIcon className="h-6 w-6" />} 
            gradient="from-amber-500 to-orange-500" 
          />
        </div>

        <div className="flex space-x-1 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/50 w-fit">
          <button 
            onClick={() => setActiveTab("events")} 
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "events" 
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Events ({stats.individualEventCount})
          </button>
          <button 
            onClick={() => setActiveTab("societies")} 
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "societies" 
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
            Societies ({stats.totalSocieties})
          </button>
        </div>

        {activeTab === "events" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <SectionHeader
              title="Personal Events"
              subtitle={`${stats.individualEventCount} personal events`}
              leftIcon={<CalendarIcon className="h-6 w-6" />}
              right={
                <div className="flex flex-wrap gap-3">
                  <EventFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm flex items-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </button>
                </div>
              }
            />
            
            {/* EventGrid with daisyUI loader passed as prop */}
            <EventGrid
              events={filteredPersonalEvents}
              loading={loading}
              onCardClick={handleEventClick}
              emptyCta={() => setShowModal(true)}
              Loader={Loader}
              loaderProps={{
                size: "lg",
                color: "primary",
                variant: "spinner"
              }}
            />
            
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredPersonalEvents.length}</span> of{" "}
                  <span className="font-semibold">{events.length}</span> personal events
                </p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 shadow-sm">Previous</button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-xl shadow-sm">1</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 shadow-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "societies" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <SectionHeader
              title="Your Societies"
              subtitle="Manage and track all society communities"
              leftIcon={<BuildingOfficeIcon className="h-6 w-6" />}
              right={
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Society
                </button>
              }
            />
            
            {/* SocietyGrid with daisyUI loader passed as prop */}
            <SocietyGrid
              societies={societies}
              loading={loading}
              onCardClick={handleSocietyClick}
              Loader={Loader}
              loaderProps={{
                size: "lg",
                color: "secondary",
                variant: "dots"
              }}
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Community Management System. Crafted with ❤️ for better community living.
          </p>
        </div>
      </div>
    </div>
  );
}