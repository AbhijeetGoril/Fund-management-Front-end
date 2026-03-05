// src/components/common/StatCard.jsx
export default function StatCard({ 
  label, 
  value, 
  change, 
  trend, 
  icon, 
  gradient = 'from-primary to-secondary' 
}) {
  
  const trendColors = {
    up: 'text-success bg-success/10',
    down: 'text-error bg-error/10'
  };

  // Map your gradients to daisyUI theme colors
  const gradientMap = {
    'from-blue-500 to-cyan-500': 'from-primary to-info',
    'from-purple-500 to-pink-500': 'from-secondary to-accent',
    'from-emerald-500 to-green-500': 'from-success to-success',
    'from-amber-500 to-orange-500': 'from-warning to-warning',
    'from-slate-500 to-slate-600': 'from-base-500 to-base-600'
  };

  const gradientClass = gradientMap[gradient] || gradient;

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} shadow-md`}>
          <div className="text-base-100">
            {icon}
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : '↓'}
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="text-base-content/60 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">{value}</p>
    </div>
  );
}