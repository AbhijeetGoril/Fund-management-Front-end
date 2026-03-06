import EventCard from './EventCard';

export default function EventGrid({ events = [], loading, onCardClick, emptyCta, Loader, loaderProps }) {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader {...loaderProps} />
      </div>
    );
  }
  
  const list = Array.isArray(events) ? events : [];
  
  if (list.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-16 px-4">
          <div className="bg-base-200/50 rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-3">No events found</h3>
            <p className="text-base-content/60 mb-8">Create your first event to get started</p>
            <button 
              onClick={emptyCta} 
              className="btn btn-primary px-8 py-3 h-auto min-h-0 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((e) => (
          <EventCard 
            key={e?.id ?? Math.random()} 
            event={e} 
            onClick={onCardClick} 
          />
        ))}
      </div>
    </div>
  );
}