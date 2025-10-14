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
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={() => id && onClick?.(id)}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm">
              {(status || 'active').toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-white mt-3 line-clamp-1">{name}</h3>
            <p className="text-white/80 text-sm mt-1">{address}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-bold text-gray-800">{Number(totalMembers) || 0}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{activeEvents}</div>
            <div className="text-xs text-gray-500">Active Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">₹{(collectedNumber / 1000).toFixed(0)}k</div>
            <div className="text-xs text-gray-500">Collected</div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800">Events</h4>
            <span className="text-xs text-gray-500">{events.length} total</span>
          </div>
          <ul className="space-y-2">
            {latest.map(ev => (
              <li key={ev?.id ?? Math.random()} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{ev?.title || 'Untitled Event'}</p>
                  <p className="text-xs text-gray-500">{ev?.date || '--'} • {ev?.status || '--'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  (ev?.status || '').toLowerCase() === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {(ev?.type || '') === 'society' ? 'Society' : 'Personal'}
                </span>
              </li>
            ))}
            {events.length === 0 && <li className="text-xs text-gray-500">No events yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
