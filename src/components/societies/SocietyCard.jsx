import { useState } from "react";
import { BuildingLibraryIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/24/outline";

const statusConfig = {
  active: { pill: "bg-white/20 text-white", dot: "bg-success" },
  inactive: { pill: "bg-white/15 text-white/70", dot: "bg-base-content/30" },
};

const SocietyCard = ({ society, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const status = (society.status || "active").toLowerCase();
  const statusStyle = statusConfig[status] || statusConfig.active;

  const totalMembers = society.totalMembers ?? 0;
  const activeEvents = society.activeEvents ?? 0;
  const totalCollected = society.totalCollected ?? 0;
  const events = society.events ?? [];
  const hasCover = !!society.logo && !imgError;

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
      {/* Header — cover photo or gradient fallback */}
      <div className="relative h-32 overflow-hidden">
        {hasCover ? (
          <>
            <img
              src={society.logo}
              alt={society.name}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        )}

        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5 ${statusStyle.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {status}
            </span>
            <ChevronRightIcon className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white truncate drop-shadow-sm">{society.name}</h3>
            {society.location && (
              <p className="text-xs text-white/80 truncate mt-0.5">{society.location}</p>
            )}
          </div>
        </div>

        {/* Fallback icon watermark when no cover photo */}
        {!hasCover && (
          <BuildingLibraryIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-16 text-white/10" />
        )}
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

export default SocietyCard;