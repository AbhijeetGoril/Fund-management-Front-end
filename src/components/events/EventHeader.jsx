import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { ReceiptPercentIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const EventHeader = ({ event, onBack, onShare }) => {
  const [imgError, setImgError] = useState(false);

  const id           = event?._id        ?? event?.id          ?? "";
  const title        = event?.title      ?? event?.name        ?? "Untitled Event";
  const description  = event?.description ?? "";
  const category     = event?.category   ?? "General";
  const status       = event?.status     ?? "active";
  const location     = event?.location   ?? event?.venue       ?? "";
  const budgetTarget = event?.budget?.target ?? event?.totalBudget ?? 0;
  const collected    = event?.collectedAmount ?? 0;
  const coverPhoto   = event?.coverPhoto ?? "";
  const hasCover     = !!coverPhoto && !imgError;

  const progress = budgetTarget > 0
    ? Math.min(100, Math.round((collected / budgetTarget) * 100))
    : 0;

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const statusConfig = {
    active:    { pill: "bg-success/20 text-success border-success/30", dot: "bg-success" },
    completed: { pill: "bg-info/20 text-info border-info/30", dot: "bg-info" },
    cancelled: { pill: "bg-error/20 text-error border-error/30", dot: "bg-error" },
  }[status] ?? { pill: "bg-white/20 text-white border-white/30", dot: "bg-white" };

  const progressBarColor =
    progress >= 100 ? "bg-success" : progress >= 60 ? "bg-white" : "bg-warning";

  return (
    <div>
      {/* ── Top action bar ── */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors bg-base-100/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-base-200 hover:shadow-lg text-sm font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="flex gap-2">
          <Link
            to={`/events/${id}/spends`}
            className="flex items-center gap-2 px-4 py-2 bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:bg-base-100 transition-all text-base-content text-sm font-semibold"
          >
            <ReceiptPercentIcon className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Spends</span>
          </Link>
          <button
            onClick={onShare}
            className="p-2.5 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:bg-base-100 active:scale-95 transition-all"
            aria-label="Share event"
          >
            <ShareIcon className="h-4 w-4 text-base-content/70" />
          </button>
          <button
            className="p-2.5 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:bg-base-100 active:scale-95 transition-all"
            aria-label="More options"
          >
            <EllipsisVerticalIcon className="h-4 w-4 text-base-content/70" />
          </button>
        </div>
      </div>

      {/* ── Hero card ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-64 ring-1 ring-black/5">

        {hasCover ? (
          <>
            <img
              src={coverPhoto}
              alt={title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        )}

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

          {/* Left — event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                {category}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-semibold ${statusConfig.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-sm break-words">
              {title}
            </h1>

            {description && (
              <p className="text-white/75 text-sm lg:text-base mb-5 max-w-xl line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  <span className="font-medium truncate max-w-[220px]">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — budget card */}
          <div className="w-full lg:w-72 shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                Budget Progress
              </h3>
              {budgetTarget > 0 && (
                <span className="text-white text-xs font-bold bg-white/15 px-2 py-0.5 rounded-full">
                  {progress}%
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Collected</span>
                <span className="text-white font-bold">₹{collected.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Target</span>
                <span className="text-white font-bold">
                  {budgetTarget > 0 ? `₹${budgetTarget.toLocaleString("en-IN")}` : "No target"}
                </span>
              </div>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ease-out ${progressBarColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/70 text-xs text-center mb-4">
              {budgetTarget > 0
                ? progress >= 100
                  ? "Target reached 🎉"
                  : `${progress}% achieved`
                : "No budget target set"}
            </p>

            <Link
              to={`/events/${id}/spends`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/25 text-white rounded-xl transition-all duration-200 text-sm font-medium"
            >
              <ReceiptPercentIcon className="h-4 w-4" />
              Manage Spends
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;