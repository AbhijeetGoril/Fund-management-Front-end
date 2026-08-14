// components/societies/SocietyGrid.jsx
import { BuildingLibraryIcon, ChevronRightIcon, UsersIcon, CalendarIcon } from "@heroicons/react/24/outline";

const statusConfig = {
  active: { pill: "bg-white/20 text-white", dot: "bg-success" },
  inactive: { pill: "bg-white/15 text-white/70", dot: "bg-base-content/30" },
};

const SocietyCard = ({ society, onClick }) => {
  const status = (society.status || "active").toLowerCase();
  const statusStyle = statusConfig[status] || statusConfig.active;

  const totalMembers = society.totalMembers ?? 0;
  const activeEvents = society.activeEvents ?? 0;
  const totalCollected = society.totalCollected ?? 0;
  const events = society.events ?? [];

  const formatCollected = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
  };

  return (
    <button
      onClick={() => onClick(society._id || society.id)}
      className="group w-full text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Header — gradient banner */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-secondary p-5 pb-6">
        <div className="flex items-start justify-between">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5 ${statusStyle.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {status}
          </span>
          <ChevronRightIcon className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
        </div>

        <div className="flex items-center gap-3 mt-4">
          {society.logo ? (
            <img
              src={society.logo}
              alt={society.name}
              className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/30 shrink-0"
            />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <BuildingLibraryIcon className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white truncate">{society.name}</h3>
            {society.location && (
              <p className="text-xs text-white/70 truncate mt-0.5">{society.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-base-200 border-b border-base-200">
        <div className="text-center py-3.5">
          <p className="text-xl font-bold text-base-content">{totalMembers}</p>
          <p className="text-[11px] text-base-content/50 mt-0.5">Members</p>
        </div>
        <div className="text-center py-3.5">
          <p className="text-xl font-bold text-info">{activeEvents}</p>
          <p className="text-[11px] text-base-content/50 mt-0.5">Active Events</p>
        </div>
        <div className="text-center py-3.5">
          <p className="text-xl font-bold text-success">{formatCollected(totalCollected)}</p>
          <p className="text-[11px] text-base-content/50 mt-0.5">Collected</p>
        </div>
      </div>

      {/* Events preview */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-base-content flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-base-content/40" />
            Events
          </p>
          <span className="text-xs text-base-content/40">{events.length} total</span>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-base-content/40 py-2">No events yet</p>
        ) : (
          <div className="space-y-1.5">
            {events.slice(0, 2).map((e) => (
              <div key={e._id} className="flex items-center justify-between text-sm py-1">
                <span className="text-base-content/70 truncate">{e.title}</span>
                <span className="text-xs text-base-content/40 shrink-0 ml-2 capitalize">{e.status || "active"}</span>
              </div>
            ))}
            {events.length > 2 && (
              <p className="text-xs text-primary font-medium pt-1">+{events.length - 2} more</p>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

const SocietyGrid = ({ societies = [], loading, onCardClick, Loader, loaderProps }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        {Loader ? <Loader {...loaderProps} /> : <p className="text-base-content/50">Loading...</p>}
      </div>
    );
  }

  if (societies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="h-14 w-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
          <BuildingLibraryIcon className="h-7 w-7 text-base-content/25" />
        </div>
        <p className="text-base-content/50 font-medium">No societies yet</p>
        <p className="text-xs text-base-content/35 mt-1">Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
      {societies.map((society) => (
        <SocietyCard
          key={society._id || society.id}
          society={society}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default SocietyGrid;