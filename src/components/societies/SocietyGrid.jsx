// src/components/societies/SocietyGrid.jsx
import SocietyCard from './SocietyCard';

export default function SocietyGrid({ societies, loading, onCardClick, Loader }) {
  if (loading) return <div className="p-12"><Loader /></div>;
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {societies.map((s) => <SocietyCard key={s.id} society={s} onClick={onCardClick} />)}
      </div>

      {societies.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No societies found</h3>
          <p className="text-gray-600 mb-6">Add the first society to get started</p>
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
            Add Society
          </button>
        </div>
      )}
    </div>
  );
}
