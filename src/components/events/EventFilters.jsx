const FILTERS = ['all', 'active', 'completed'];

export default function EventFilters({ activeFilter, setActiveFilter }) {
  return (
    <div className="flex bg-gray-100/80 rounded-2xl p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
            activeFilter === filter ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
