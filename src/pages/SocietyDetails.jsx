import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

import Navbar from "../components/Navbar/Navbar";
import EventCard from "../components/events/EventCard";
import StatCard from "../components/common/StatCard";
import { societies as seedSocieties } from "../data/dummy";
import SectionHeader from "../components/common/SectionHeader";
import EventFilters from "../components/events/EventFilters";
import PageHeader from "../components/layout/PageHeader";
import CreateEventForm from "../components/Addmin-Panel/CreateEventForm";

// Normalize helpers
function normalizeSocieties(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(s => ({
    ...s,
    totalMembers: Number(s.totalMembers) || 0,
    totalCollected: Number(String(s.totalCollected).replace(/,/g, "")) || 0,
    status: (s.status || "active").toLowerCase(),
    events: Array.isArray(s.events)
      ? s.events.map(ev => ({
          ...ev,
          totalMembers: Number(ev.totalMembers) || 0,
          paidMembers: Number(ev.paidMembers) || 0,
          pendingPayments: Number(ev.pendingPayments) || 0,
          totalCollected: Number(ev.totalCollected) || 0,
          progress: Number(ev.progress) || 0,
          status: (ev.status || "active").toLowerCase(),
          type: "society"
        }))
      : []
  }));
}

export default function SocietyDetails() {
  const { id } = useParams();

  const societies = useMemo(() => normalizeSocieties(seedSocieties), []);
  const society = societies.find(s => String(s.id) === String(id));

  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const societyEvents = Array.isArray(society.events) ? society.events : [];
  const activeCount = societyEvents.filter(e => e.status === "active").length;
  const filtered = useMemo(() => {
    if (statusFilter === "all") return societyEvents;
    return societyEvents.filter(e => e.status === statusFilter);
  }, [societyEvents, statusFilter]);

  if (!society) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <p className="text-slate-700">Society not found.</p>
          </div>
        </div>
      </div>
    );
  }

  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with icon + name and right-aligned controls */}
        
        <PageHeader
          title={society.name}
          subtitle={society.address}
          right={
            <div className="flex items-center gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-green-200/50 flex items-center">
                <div className="relative mr-2">
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-ping absolute"></div>
                  <div className="bg-green-500 w-3 h-3 rounded-full relative"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                New Event
              </button>
            </div>
          }
        />

        {/* Stat cards with gradients matching dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Members"
            value={society.totalMembers}
            change="+1%"
            trend="up"
            icon={<UsersIcon className="h-6 w-6" />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Active Events"
            value={activeCount}
            change="+4%"
            trend="up"
            icon={<ShieldCheckIcon className="h-6 w-6" />}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            label="Collected"
            value={`₹${society.totalCollected.toLocaleString()}`}
            change="+9%"
            trend="up"
            icon={<CurrencyRupeeIcon className="h-6 w-6" />}
            gradient="from-emerald-500 to-green-500"
          />
        </div>

        {/* Events container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <SectionHeader
            title="Society Events"
            subtitle={`${filtered.length} ${statusFilter === "all" ? "total" : statusFilter} events`}
            leftIcon={<CalendarIcon className="h-6 w-6" />}
            right={
              <div className="flex flex-wrap gap-3">
                <EventFilters activeFilter={statusFilter} setActiveFilter={setStatusFilter} />
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm flex items-center gap-2">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Export
                </button>
              </div>
            }
          />

          <div className="p-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(ev => (
                  <EventCard
                    key={ev.id}
                    event={{ ...ev, type: "society", societyName: society.name }}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No events for this filter</h3>
                <p className="text-gray-600">Try switching the status filter to see other events</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional: modal hook */}
      {showModal && <CreateEventForm setShowModal={setShowModal} presetSocietyId={society.id} />}
    </div>
  );
}