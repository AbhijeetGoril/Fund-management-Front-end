// src/components/common/StatCard.jsx
export default function StatCard({ label, value, change, trend, icon, gradient = 'from-slate-500 to-slate-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${gradient} text-white shadow`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold ${trend === 'down' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm mt-3">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
