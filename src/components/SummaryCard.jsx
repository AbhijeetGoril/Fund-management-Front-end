const SummaryCard = ({ label, value, icon, color = "primary" }) => {
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      border: "border-secondary/20",
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    },
    warning: {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/20",
    },
    error: {
      bg: "bg-error/10",
      text: "text-error",
      border: "border-error/20",
    },
    info: {
      bg: "bg-info/10",
      text: "text-info",
      border: "border-info/20",
    },
  };

  const config = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`rounded-xl shadow-sm p-4 md:p-5 border ${config.border} ${config.bg} backdrop-blur-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/70 font-medium">{label}</p>
          <h2 className={`text-xl md:text-2xl font-bold mt-1 ${config.text}`}>{value}</h2>
        </div>
        <div className={`p-2 rounded-lg ${config.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;