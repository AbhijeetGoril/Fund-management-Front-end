const FILTERS = ['all', 'active', 'completed'];

export default function EventFilters({ activeFilter, setActiveFilter }) {
  return (
    <div className="flex bg-base-200/80 backdrop-blur-sm rounded-2xl p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
            activeFilter === filter 
              ? 'bg-base-100 text-base-content shadow-md' 
              : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}