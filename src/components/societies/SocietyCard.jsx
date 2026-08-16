import { useState } from "react";
import {
  BuildingLibraryIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  ShieldCheckIcon,
  MapPinIcon,
  LockClosedIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

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
  const isAdmin = society.isAdmin || society.role === "admin";
  const isPrivate = society.privacy === "private";
  const isNew = events.length === 0 && totalMembers <= 1;

  const formatCollected = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
  };

  return (
    <button
      onClick={() => onClick(society._id || society.id)}
      className="group relative w-full text-left bg-base-100 rounded-3xl border border-base-200/80 hover:border-primary/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Header — cover photo or gradient fallback */}
      <div className="relative h-36 overflow-hidden">
        {hasCover ? (
          <>
            <img
              src={society.logo}
              alt={society.name}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </>
        )}

        {!hasCover && (
          <BuildingLibraryIcon className="absolute right-3 -bottom-2 h-24 w-24 text-white/10 rotate-6" />
        )}

        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm ${statusStyle.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                {status}
              </span>

              {isAdmin && (
                <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <ShieldCheckIcon className="h-3 w-3" />
                  Admin
                </span>
              )}

              {isNew && (
                <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-warning/90 text-warning-content flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3" />
                  New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPrivate ? (
                <LockClosedIcon className="h-4 w-4 text-white/50" />
              ) : (
                <GlobeAltIcon className="h-4 w-4 text-white/50" />
              )}
              <div className="h-7 w-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200">
                <ChevronRightIcon className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {society.category && (
              <p className="text-[10.5px] font-bold text-white/55 uppercase tracking-widest mb-1">
                {society.category}
              </p>
            )}
            <h3 className="text-[22px] font-bold text-white truncate drop-shadow-sm leading-tight tracking-tight">
              {society.name}
            </h3>
            {society.location && (
              <p className="text-xs text-white/75 truncate mt-1.5 flex items-center gap-1">
                <MapPinIcon className="h-3 w-3 shrink-0" />
                {society.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {society.description && (
        <p className="px-4 pt-3 text-[13px] text-base-content/55 line-clamp-2 leading-relaxed">
          {society.description}
        </p>
      )}

      {/* Stats row */}
      <div className={`flex items-stretch px-4 ${society.description ? "pt-3.5" : "pt-4"} pb-4`}>
        <div className="flex-1 flex flex-col items-center py-2.5 rounded-xl group-hover:bg-base-200/40 transition-colors duration-200">
          <UsersIcon className="h-3.5 w-3.5 text-base-content/25 mb-1" />
          <p className="text-lg font-extrabold text-base-content leading-none">{totalMembers}</p>
          <p className="text-[10px] font-medium text-base-content/40 mt-1 uppercase tracking-wide">Members</p>
        </div>
        <div className="w-px bg-base-200 my-1.5" />
        <div className="flex-1 flex flex-col items-center py-2.5 rounded-xl group-hover:bg-base-200/40 transition-colors duration-200">
          <CalendarIcon className="h-3.5 w-3.5 text-info/50 mb-1" />
          <p className="text-lg font-extrabold text-info leading-none">{activeEvents}</p>
          <p className="text-[10px] font-medium text-base-content/40 mt-1 uppercase tracking-wide">Active</p>
        </div>
        <div className="w-px bg-base-200 my-1.5" />
        <div className="flex-1 flex flex-col items-center py-2.5 rounded-xl group-hover:bg-base-200/40 transition-colors duration-200">
          <span className="text-[13px] text-success/60 mb-1 leading-none">₹</span>
          <p className="text-lg font-extrabold text-success leading-none">{formatCollected(totalCollected)}</p>
          <p className="text-[10px] font-medium text-base-content/40 mt-1 uppercase tracking-wide">Collected</p>
        </div>
      </div>

      {/* Events preview */}
      <div className="px-4 pb-4 pt-1 border-t border-base-200/70">
        <div className="flex items-center justify-between mb-2.5 mt-3">
          <p className="text-[13px] font-bold text-base-content/70">Recent Events</p>
          <span className="text-[11px] text-base-content/35 font-medium">{events.length} total</span>
        </div>

        {events.length === 0 ? (
          <div className="flex items-center gap-2 py-1.5">
            <div className="h-1 w-1 rounded-full bg-base-300" />
            <p className="text-[13px] text-base-content/35">No events yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {events.slice(0, 2).map((e) => (
              <div key={e._id} className="flex items-center justify-between text-[13px] py-1.5">
                <span className="text-base-content/75 truncate font-medium">{e.title}</span>
                <span className={`text-[10px] font-bold shrink-0 ml-2 px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  (e.status || "active").toLowerCase() === "active"
                    ? "bg-success/10 text-success"
                    : "bg-base-200 text-base-content/45"
                }`}>
                  {e.status || "active"}
                </span>
              </div>
            ))}
            {events.length > 2 && (
              <p className="text-[12px] text-primary font-bold pt-1.5">
                +{events.length - 2} more event{events.length - 2 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default SocietyCard;