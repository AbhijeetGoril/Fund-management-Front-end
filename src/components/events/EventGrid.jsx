import EventCard from './EventCard';

export default function EventGrid({ events = [], loading, onCardClick, emptyCta, Loader }) {
  if (loading) return <div className="p-12"><Loader /></div>;
  const list = Array.isArray(events) ? events : [];
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((e) => <EventCard key={e?.id ?? Math.random()} event={e} onClick={onCardClick} />)}
      </div>

      {list.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">Create the first event to get started</p>
          <button onClick={emptyCta} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
            Create Event
          </button>
        </div>
      )}
    </div>
  );
}
