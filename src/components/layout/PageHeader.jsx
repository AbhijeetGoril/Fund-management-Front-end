// src/components/layout/PageHeader.jsx
export default function PageHeader({ title, subtitle, leftEmoji = '🏡', right }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-2xl shadow-lg border border-blue-100">
              <span className="text-2xl">{leftEmoji}</span>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
              {subtitle ? <p className="text-gray-600 mt-2 text-lg">{subtitle}</p> : null}
            </div>
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}
