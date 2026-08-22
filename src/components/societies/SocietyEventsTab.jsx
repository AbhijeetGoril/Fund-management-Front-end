import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  PlusIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import CreateSocietyEventForm from "../Addmin-Panel/Createsocietyeventform";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const statusBadgeClass = {
  active: "bg-success/10 text-success",
  completed: "bg-info/10 text-info",
  cancelled: "bg-error/10 text-error",
};

const EventCard = ({ event, onClick }) => {
  const status = (event.status || "active").toLowerCase();
  const target = event.budget?.target ?? 0;
  const collected = event.budget?.collected ?? 0;
  const progress = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <button
      onClick={onClick}
      className="group text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* Cover */}
      <div className="relative h-28 overflow-hidden">
        {event.coverPhoto ? (
          <img
            src={event.coverPhoto}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wide backdrop-blur-sm ${
            statusBadgeClass[status] || "bg-base-200 text-base-content/60"
          }`}
        >
          {status}
        </span>

        <h4 className="absolute bottom-3 left-4 right-4 text-white font-bold text-base truncate drop-shadow-sm">
          {event.title}
        </h4>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-xs text-base-content/50">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          )}
        </div>

        {target > 0 && (
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-base-content flex items-center gap-0.5">
                <CurrencyRupeeIcon className="h-3 w-3" />
                {collected.toLocaleString()}
              </span>
              <span className="text-[11px] text-base-content/40">of ₹{target.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-base-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress >= 100 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

const SocietyEventsTab = ({ society, events = [], isAdmin, members = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((e) => (e.status || "active").toLowerCase() === activeFilter);

  const countFor = (key) =>
    key === "all"
      ? events.length
      : events.filter((e) => (e.status || "active").toLowerCase() === key).length;

  return (
    <div>
      {showCreateModal && (
        <CreateSocietyEventForm
          onEventCreated={() => setShowCreateModal(false)}
          setShowModal={setShowCreateModal}
          societyId={society._id}
          societyMembers={members}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? "bg-primary text-primary-content shadow-sm"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {f.label} <span className="opacity-70">({countFor(f.key)})</span>
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4" />
            New Event
          </button>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-14 w-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="h-7 w-7 text-base-content/25" />
          </div>
          <p className="text-base-content/50 font-medium">
            No {activeFilter === "all" ? "events" : activeFilter} events yet
          </p>
          {isAdmin && activeFilter === "all" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sm text-primary font-medium mt-2 hover:underline"
            >
              Create the first one
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((e) => (
            <EventCard
              key={e._id}
              event={e}
              onClick={() => navigate(`/events/${e._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SocietyEventsTab;