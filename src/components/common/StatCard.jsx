export default function StatCard({ label, value, change, trend, icon, gradient = 'from-slate-500 to-slate-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${trend === 'down' ? 'text-rose-600' : 'text-emerald-600'}`}>{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow`}>{icon}</div>
      </div>
    </div>
  );
}
