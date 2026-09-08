import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar/Navbar";
import { Loader } from "../components/Loader";
import PageHeader from "../components/layout/PageHeader";
import { axiosInstance } from "../lib/axois";

// ── Fetchers ──────────────────────────────────────────────────────────────
const fetchDiscoverEvents = async () => {
  const { data } = await axiosInstance.get("/events/discover");
  return data.events;
};

const fetchDiscoverSocieties = async () => {
  const { data } = await axiosInstance.get("/societies/discover");
  return data.societies;
};

const requestToJoinEvent = async (eventId) => {
  const { data } = await axiosInstance.post(`/events/${eventId}/join-request`, {});
  return data;
};

const requestToJoinSociety = async (societyId) => {
  const { data } = await axiosInstance.post(`/societies/${societyId}/join-request`, {});
  return data;
};

// ── Card ──────────────────────────────────────────────────────────────────
function DiscoverCard({ item, type, onRequest, isRequesting, onNavigate }) {
  const isEvent = type === "event";
  const cover = item.coverPhoto || item.logo;

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div
        className="h-32 bg-gradient-to-br from-primary to-secondary relative cursor-pointer"
        style={
          cover
            ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
        onClick={onNavigate}
      >
        <div className="absolute inset-0 bg-black/20" />
        {isEvent && item.category && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-base-100/90 text-primary rounded-full">
            {item.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-semibold text-base-content text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
          onClick={onNavigate}
        >
          {isEvent ? item.title : item.name}
        </h3>

        <p className="text-sm text-base-content/60 line-clamp-2 mb-3 flex-1">
          {item.description || "No description provided."}
        </p>

        <div className="flex items-center gap-3 text-xs text-base-content/50 mb-4 flex-wrap">
          {isEvent && item.date && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(item.date).toLocaleDateString()}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5" />
              {item.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <UserGroupIcon className="h-3.5 w-3.5" />
            {item.createdBy?.name ? `by ${item.createdBy.name}` : "Community"}
          </span>
        </div>

        <button
          disabled={item.hasPendingRequest || isRequesting}
          onClick={() => onRequest(item._id)}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            item.hasPendingRequest
              ? "bg-warning/10 text-warning cursor-default"
              : "bg-gradient-to-r from-primary to-secondary text-primary-content hover:shadow-lg hover:scale-[1.02]"
          } disabled:opacity-70`}
        >
          {item.hasPendingRequest
            ? "Request Pending"
            : isRequesting
            ? "Sending..."
            : "Request to Join"}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="col-span-full text-center py-16">
      <p className="text-base-content/50 font-medium">Nothing new to discover in {label} right now.</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Discover() {
  const [activeTab, setActiveTab] = useState("events");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: rawEvents,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useQuery({
    queryKey: ["discoverEvents"],
    queryFn: fetchDiscoverEvents,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const {
    data: rawSocieties,
    isLoading: isLoadingSocieties,
    isError: isErrorSocieties,
  } = useQuery({
    queryKey: ["discoverSocieties"],
    queryFn: fetchDiscoverSocieties,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const eventMutation = useMutation({
    mutationFn: requestToJoinEvent,
    onSuccess: () => {
      toast.success("Join request sent!");
      queryClient.invalidateQueries({ queryKey: ["discoverEvents"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send request.");
    },
  });

  const societyMutation = useMutation({
    mutationFn: requestToJoinSociety,
    onSuccess: () => {
      toast.success("Join request sent!");
      queryClient.invalidateQueries({ queryKey: ["discoverSocieties"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send request.");
    },
  });

  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const societies = Array.isArray(rawSocieties) ? rawSocieties : [];

  const isLoading = isLoadingEvents || isLoadingSocieties;
  const isError = isErrorEvents || isErrorSocieties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Discover"
          subtitle="Events and societies you haven't joined yet"
        />

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
            Events ({events.length})
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
            Societies ({societies.length})
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" color="primary" variant="spinner" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-16">
            <p className="text-error font-semibold">Failed to load discover data.</p>
          </div>
        )}

        {!isLoading && !isError && activeTab === "events" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <EmptyState label="events" />
            ) : (
              events.map((event) => (
                <DiscoverCard
                  key={event._id}
                  item={event}
                  type="event"
                  isRequesting={eventMutation.isPending && eventMutation.variables === event._id}
                  onRequest={(id) => eventMutation.mutate(id)}
                  onNavigate={() => navigate(`/events/${event._id}`)}
                />
              ))
            )}
          </div>
        )}

        {!isLoading && !isError && activeTab === "societies" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.length === 0 ? (
              <EmptyState label="societies" />
            ) : (
              societies.map((society) => (
                <DiscoverCard
                  key={society._id}
                  item={society}
                  type="society"
                  isRequesting={societyMutation.isPending && societyMutation.variables === society._id}
                  onRequest={(id) => societyMutation.mutate(id)}
                  onNavigate={() => navigate(`/society/${society._id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}