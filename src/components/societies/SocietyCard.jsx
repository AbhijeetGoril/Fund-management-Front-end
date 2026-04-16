import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function SocietyCard({ society = {}, onClick }) {
  const {
    id,
    name = '',
    address = '',
    totalMembers = 0,
    status = 'active',
    totalCollected = 0,
    events: rawEvents
  } = society || {};

  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const latest = events.slice(0, 3);
  const activeEvents = events.filter(e => (e?.status || '').toLowerCase() === 'active').length;
  const collectedNumber = Number.isFinite(Number(totalCollected)) ? Number(totalCollected) : 0;

  return (
    <div
      className="group bg-base-100 rounded-2xl shadow-lg border border-base-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={() => id && onClick?.(id)}
    >
      {/* Header – uses primary color and its content variant */}
      <div className="bg-primary text-primary-content p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
              {(status || 'active').toUpperCase()}
            </span>
            <h3 className="text-xl font-bold mt-3 line-clamp-1">{name}</h3>
            <p className="text-primary-content/80 text-sm mt-1">{address}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-primary-content/80 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-bold text-base-content">{Number(totalMembers) || 0}</div>
            <div className="text-xs text-base-content/70">Members</div>
          </div>
          <div>
            <div className="text-lg font-bold text-info">{activeEvents}</div>
            <div className="text-xs text-base-content/70">Active Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">₹{(collectedNumber / 1000).toFixed(0)}k</div>
            <div className="text-xs text-base-content/70">Collected</div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-base-content">Events</h4>
            <span className="text-xs text-base-content/60">{events.length} total</span>
          </div>
          <ul className="space-y-2">
            {latest.map(ev => (
              <li
                key={ev?.id ?? Math.random()}
                className="flex items-center justify-between rounded-lg border border-base-200 bg-base-100 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-base-content truncate">{ev?.title || 'Untitled Event'}</p>
                  <p className="text-xs text-base-content/60">{ev?.date || '--'} • {ev?.status || '--'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  (ev?.status || '').toLowerCase() === 'active'
                    ? 'bg-success/20 text-success border-success/30'
                    : 'bg-info/20 text-info border-info/30'
                }`}>
                  {(ev?.type || '') === 'society' ? 'Society' : 'Personal'}
                </span>
              </li>
            ))}
            {events.length === 0 && <li className="text-xs text-base-content/50">No events yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}