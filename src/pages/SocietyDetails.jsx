import { useMemo, useState } from 'react';
import EventCard from '../components/events/EventCard';

export default function SocietyDetails({ society }) {
  const [status, setStatus] = useState('all'); // all | active | completed
  const events = society.events || [];

  const filtered = useMemo(() => {
    if (status === 'all') return events;
    return events.filter(e => e.status === status);
  }, [events, status]);

  return (
    <div className="bg-white/80 rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{society.name}</h2>
          <p className="text-gray-600 mt-1">{society.address}</p>
        </div>
        <div className="flex bg-gray-100/80 rounded-2xl p-1">
          {['all','active','completed'].map(f => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                status === f ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(ev => <EventCard key={ev.id} event={ev} onClick={() => {}} />)}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No events for this filter.</div>
        )}
      </div>
    </div>
  );
}
