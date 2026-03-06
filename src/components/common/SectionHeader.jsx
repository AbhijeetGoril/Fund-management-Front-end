export default function SectionHeader({ title, subtitle, leftIcon, right }) {
  return (
    <div className="px-6 py-5 border-b border-base-200 bg-base-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {leftIcon && (
            <div className="p-2.5 rounded-xl bg-primary shadow-sm">
              <div className="text-primary-content [&_svg]:text-primary-content [&_svg]:fill-current">
                {leftIcon}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-base-content">{title}</h2>
            {subtitle && (
              <p className="text-sm text-base-content/60 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </div>
  );
}