import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar/Navbar";
import { Loader } from "../components/Loader";
import { axiosInstance } from "../lib/axois";
import SocietyMembersTab from "../components/societies/SocietyMembersTab";
import SocietyEventsTab from "../components/societies/SocietyEventsTab";
import {
  ArrowLeftIcon,
  UsersIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const fetchSocietyDetail = async (societyId) => {
  const { data } = await axiosInstance.get(`/societies/${societyId}`);
  console.log(data)
  return data;
};

const TABS = [
  { key: "members", label: "Members", icon: UsersIcon },
  { key: "events", label: "Events", icon: CalendarIcon },
  { key: "settings", label: "Settings", icon: Cog6ToothIcon },
];

const SocietyDetails = () => {
  const { societyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["society", societyId],
    queryFn: () => fetchSocietyDetail(societyId),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-40 bg-base-300/60 rounded-3xl mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-base-300/60 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-base-300/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !data?.society) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-5">
              <ExclamationTriangleIcon className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              {isError ? "Failed to load society" : "Society not found"}
            </h2>
            {isError && (
              <p className="text-base-content/60 mb-8 text-sm max-w-sm mx-auto">
                {error?.response?.data?.message || error?.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={refetch}
                className="px-6 py-3 border border-base-300 text-base-content rounded-2xl font-semibold hover:bg-base-200 transition-all duration-300"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { society, members, events, isAdmin, summary } = data;

  const formatCollected = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount ?? 0}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors bg-base-100/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-base-200 hover:shadow-lg text-sm font-medium w-fit"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-52 ring-1 ring-black/5">
          {society.logo ? (
            <>
              <img
                src={society.logo}
                alt={society.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
          )}

          <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {society.category && (
                  <span className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                    {society.category}
                  </span>
                )}
                {isAdmin && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                    Admin
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                  {society.privacy === "private" ? (
                    <LockClosedIcon className="h-3.5 w-3.5" />
                  ) : (
                    <GlobeAltIcon className="h-3.5 w-3.5" />
                  )}
                  {society.privacy === "private" ? "Private" : "Public"}
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-sm break-words">
                {society.name}
              </h1>

              {society.description && (
                <p className="text-white/75 text-sm lg:text-base mb-4 max-w-xl line-clamp-2 leading-relaxed">
                  {society.description}
                </p>
              )}

              {society.location && (
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{society.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-base-content/50 mb-1">
              <UsersIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Members</p>
            </div>
            <p className="text-2xl font-bold text-base-content">{summary?.totalMembers ?? 0}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-base-content/50 mb-1">
              <ShieldCheckIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Admins</p>
            </div>
            <p className="text-2xl font-bold text-base-content">{summary?.totalAdmins ?? 0}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-info/60 mb-1">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Active Events</p>
            </div>
            <p className="text-2xl font-bold text-info">{summary?.activeEvents ?? 0}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-success/60 mb-1">
              <BuildingLibraryIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Collected</p>
            </div>
            <p className="text-2xl font-bold text-success">{formatCollected(summary?.totalCollected)}</p>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
          <div className="border-b border-base-200 px-2 sm:px-6">
            <nav className="flex gap-1 sm:gap-2">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xs:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "members" && (
              <SocietyMembersTab
                society={society}
                members={members}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === "events" && (
              <SocietyEventsTab
                society={society}
                events={events}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === "settings" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Cog6ToothIcon className="h-10 w-10 text-base-content/15 mb-3" />
                <p className="text-base-content/50 font-medium">Settings coming soon</p>
                <p className="text-xs text-base-content/35 mt-1">
                  Society configuration options will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-base-content/40 text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetails;