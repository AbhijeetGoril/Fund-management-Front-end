export default function Badge({ text, className = '' }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${className}`}>{text}</span>;
}
