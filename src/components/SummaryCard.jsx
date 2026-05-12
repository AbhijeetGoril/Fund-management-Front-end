const SummaryCard = ({ label, value, icon, color = "primary", trend, trendLabel }) => {
  const config = {
    primary:   { bg: "bg-primary/8",   text: "text-primary",   border: "border-primary/15",   icon: "bg-primary/15",   glow: "hover:shadow-primary/10"   },
    secondary: { bg: "bg-secondary/8", text: "text-secondary", border: "border-secondary/15", icon: "bg-secondary/15", glow: "hover:shadow-secondary/10" },
    success:   { bg: "bg-success/8",   text: "text-success",   border: "border-success/15",   icon: "bg-success/15",   glow: "hover:shadow-success/10"   },
    warning:   { bg: "bg-warning/8",   text: "text-warning",   border: "border-warning/15",   icon: "bg-warning/15",   glow: "hover:shadow-warning/10"   },
    error:     { bg: "bg-error/8",     text: "text-error",     border: "border-error/15",     icon: "bg-error/15",     glow: "hover:shadow-error/10"     },
    info:      { bg: "bg-info/8",      text: "text-info",      border: "border-info/15",      icon: "bg-info/15",      glow: "hover:shadow-info/10"      },
  }[color] || {};

  return (
    <div className={`
      relative rounded-2xl p-5 border backdrop-blur-sm
      bg-base-100/80 ${config.border}
      shadow-sm hover:shadow-lg ${config.glow}
      transition-all duration-300 hover:-translate-y-0.5
      overflow-hidden group
    `}>
      {/* subtle background accent */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${config.bg} blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300`} />

      <div className="relative flex items-start justify-between gap-3">
        {/* left — label + value */}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 truncate">
            {label}
          </p>
          <p className={`text-2xl font-bold ${config.text} leading-none`}>
            {value}
          </p>
          {trendLabel && (
            <p className="text-xs text-base-content/40 mt-1.5">{trendLabel}</p>
          )}
        </div>

        {/* right — icon circle */}
        <div className={`shrink-0 w-11 h-11 rounded-xl ${config.icon} flex items-center justify-center`}>
          <span className={config.text}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;