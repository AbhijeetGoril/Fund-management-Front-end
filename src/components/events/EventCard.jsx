import { CalendarIcon, ChevronRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import Badge from '../common/Badge';
import { getStatusGradient, getCategoryBadgeColor, getEventTypeBadge } from '../../utils/ui';

export default function EventCard({ event = {}, onClick }) {
  const {
    id,
    title = '',
    date = '',
    totalMembers = 0,
    paidMembers = 0,
    pendingPayments = 0,
    totalCollected = 0,
    status = 'active',
    progress = 0,
    category = '',
    color = 'blue',
    type = 'society',
    societyName = ''
  } = event || {};

  const collected = Number.isFinite(Number(totalCollected)) ? Number(totalCollected) : 0;

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={() => id && onClick?.(id)}
    >
      <div className={`bg-gradient-to-r ${getStatusGradient(status)} p-4`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Badge text={(status || 'active').toUpperCase()} className="text-white bg-white/20 border-transparent" />
              <Badge text={type === 'society' ? 'Society' : 'Personal'} className={getEventTypeBadge(type)} />
            </div>
            <h3 className="text-xl font-bold text-white mt-1 line-clamp-1">{title}</h3>
            {type === 'society' && societyName && (
              <p className="text-white/80 text-sm">{societyName}</p>
            )}
          </div>
          <ChevronRightIcon className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Badge text={category} className={getCategoryBadgeColor(color)} />
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {date}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-800">{Number(progress) || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full bg-gradient-to-r ${getStatusGradient(status)}`} style={{ width: `${Number(progress) || 0}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-800">{Number(totalMembers) || 0}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{Number(paidMembers) || 0}</div>
            <div className="text-xs text-gray-500">Paid</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-600">{Number(pendingPayments) || 0}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-800">₹{collected.toLocaleString()}</div>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <EyeIcon className="h-4 w-4" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
