export default function PageHeader({ title, subtitle, leftEmoji = "🏡", right }) {
  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
        {/* Left: icon + titles */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {leftEmoji && (
            <div className="flex-shrink-0 p-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
              <span className="text-xl sm:text-2xl">{leftEmoji}</span>
            </div>
          )}
          <div className="min-w-0 leading-tight flex-1">
            <h1 className="text-2xl sm:text-[28px] md:text-[36px] font-extrabold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-600 text-sm sm:text-base mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: compact controls */}
        <div className="flex items-center justify-end sm:justify-start gap-2 sm:gap-3 flex-shrink-0">
          {right}
        </div>
      </div>
    </div>
  );
}