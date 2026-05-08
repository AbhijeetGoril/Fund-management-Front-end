import { CalendarIcon, ChevronRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import Badge from '../common/Badge';

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
    color = 'primary',
    type = 'society',
    societyName = ''
  } = event || {};

  const collected = Number.isFinite(Number(totalCollected)) ? Number(totalCollected) : 0;

  // Status gradients mapping
  const statusGradients = {
    active: 'from-success to-success/80',
    completed: 'from-info to-info/80',
    pending: 'from-warning to-warning/80',
    cancelled: 'from-error to-error/80',
    default: 'from-primary to-secondary'
  };

  // Category badge colors
  const categoryColors = {
    Maintenance: 'badge-primary',
    Cultural: 'badge-secondary',
    Security: 'badge-accent',
    Development: 'badge-info',
    Emergency: 'badge-error',
    default: 'badge-ghost'
  };

  // Event type badges
  const typeBadges = {
    society: 'badge-outline badge-primary',
    individual: 'badge-outline badge-secondary',
    default: 'badge-outline'
  };

  const statusGradient = statusGradients[status] || statusGradients.default;
  const categoryBadge = categoryColors[category] || categoryColors.default;
  const typeBadge = typeBadges[type] || typeBadges.default;

  return (
    <div
      className="group bg-base-100 rounded-2xl shadow-lg border border-base-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
      onClick={() => id && onClick?.(id)}
    >
      <div className={`bg-gradient-to-r ${statusGradient} p-4`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Badge
                text={(status || 'active').toUpperCase()}
                className="badge badge-outline text-white border-white/30 bg-white/10"
              />
              <Badge
                text={type === 'society' ? 'Society' : 'Personal'}
                className={`badge ${typeBadge}`}
              />
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
          <Badge
            text={category}
            className={`badge ${categoryBadge}`}
          />
          <div className="text-sm text-base-content/60 flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {new Date(date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Progress</span>
            <span className="font-semibold text-base-content">{Number(progress) || 0}%</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${statusGradient}`}
              style={{ width: `${Math.min(Number(progress) || 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-base-content">{Number(totalMembers) || 0}</div>
            <div className="text-xs text-base-content/60">Members</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">{Number(paidMembers) || 0}</div>
            <div className="text-xs text-base-content/60">Paid</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">{Number(pendingPayments) || 0}</div>
            <div className="text-xs text-base-content/60">Pending</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-base-200">
          <div className="flex justify-between items-center">
            <div className="text-base font-bold text-base-content">₹{collected.toLocaleString()}</div>
            <button
              className="text-primary hover:text-primary-focus text-sm font-medium flex items-center gap-1 transition-colors duration-200"
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