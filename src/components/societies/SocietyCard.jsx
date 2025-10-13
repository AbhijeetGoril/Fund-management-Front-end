// src/components/societies/SocietyCard.jsx
import { ChevronRightIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function SocietyCard({ society, onClick }) {
  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={() => onClick?.(society.id)}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm">ACTIVE</span>
            <h3 className="text-xl font-bold text-white mt-3 line-clamp-1">{society.name}</h3>
            <p className="text-white/80 text-sm mt-1">{society.address}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-bold text-gray-800">{society.totalMembers}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{society.activeEvents}</div>
            <div className="text-xs text-gray-500">Active Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">₹{(society.totalCollected / 1000).toFixed(0)}k</div>
            <div className="text-xs text-gray-500">Collected</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <EyeIcon className="h-4 w-4" />
              View Society
            </button>
            {typeof society.totalEventsForSociety === 'number' && (
              <span className="text-xs text-gray-500">{society.totalEventsForSociety} total events</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
