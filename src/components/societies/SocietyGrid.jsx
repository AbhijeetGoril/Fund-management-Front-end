import SocietyCard from './SocietyCard';

export default function SocietyGrid({ societies = [], loading, onCardClick, Loader }) {
  if (loading) return <div className="p-12"><Loader /></div>;
  const list = Array.isArray(societies) ? societies : [];
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((s) => (
          <SocietyCard key={s?.id ?? Math.random()} society={s} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
