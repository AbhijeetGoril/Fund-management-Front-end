const SummaryCard = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  };
  
  const colorConfig = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`rounded-xl shadow-sm p-4 md:p-5 border ${colorConfig.border} ${colorConfig.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <h2 className={`text-xl md:text-2xl font-bold mt-1 ${colorConfig.text}`}>{value}</h2>
        </div>
        <div className={`p-2 rounded-lg ${colorConfig.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;