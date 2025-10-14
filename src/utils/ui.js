export const getStatusGradient = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'active': return 'from-green-500 to-emerald-600';
    case 'completed': return 'from-blue-500 to-cyan-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

export const getCategoryBadgeColor = (color) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200'
  };
  return colors[color] || colors.blue;
};

export const getEventTypeBadge = (type) =>
  (type || '') === 'society'
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-amber-100 text-amber-800 border-amber-200';
