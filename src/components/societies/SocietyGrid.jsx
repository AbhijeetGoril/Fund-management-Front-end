// components/societies/SocietyGrid.jsx
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import SocietyCard from "./SocietyCard";

export default function SocietyGrid({ societies = [], loading, onCardClick, Loader, loaderProps }) {
  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center min-h-[300px] bg-base-100">
        {Loader ? <Loader {...loaderProps} /> : <p className="text-base-content/50">Loading...</p>}
      </div>
    );
  }

  const list = Array.isArray(societies) ? societies : [];

  if (list.length === 0) {
    return (
      <div className="text-center py-20 bg-base-100">
        <div className="h-14 w-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
          <BuildingLibraryIcon className="h-7 w-7 text-base-content/25" />
        </div>
        <p className="text-base-content/50 font-medium">No societies yet</p>
        <p className="text-xs text-base-content/35 mt-1">Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((s) => (
          <SocietyCard
            key={s?._id ?? s?.id ?? Math.random()}
            society={s}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}