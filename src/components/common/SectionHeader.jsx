export default function SectionHeader({ title, subtitle, leftIcon, right }) {
  return (
    <div className="px-6 py-6 border-b border-gray-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {leftIcon ? (
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {leftIcon}
              </div>
            ) : null}
            {title}
          </h2>
          {subtitle ? <p className="text-gray-600 mt-2">{subtitle}</p> : null}
        </div>
        {right}
      </div>
    </div>
  );
}
