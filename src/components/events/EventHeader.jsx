import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";

const EventHeader = ({ event, onBack, onShare }) => {
  // ── Normalise API shape → component shape ─────────────────────────
  const id            = event?._id        ?? event?.id         ?? "";
  const title         = event?.title      ?? event?.name       ?? "Untitled Event";
  const description   = event?.description ?? "";
  const category      = event?.category   ?? "General";
  const status        = event?.status     ?? "active";
  const location      = event?.location   ?? event?.venue      ?? "—";
  const budgetTarget  = event?.budget?.target ?? event?.totalBudget ?? 0;
  const collected     = event?.collectedAmount ?? 0;
  const progress      = budgetTarget > 0
    ? Math.min(100, Math.round((collected / budgetTarget) * 100))
    : 0;

  // ── Format date nicely ────────────────────────────────────────────
  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day:   "numeric",
        month: "long",
        year:  "numeric",
      })
    : "—";

  return (
    <div className="mb-8">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors duration-200 bg-base-100/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-base-200 hover:shadow-lg"
        >
          <span className="inline-block text-xl">←</span>
          Back to Dashboard
        </button>

        <div className="flex gap-3">
          <Link
            to={`/events/${id}/spends`}
            className="flex items-center gap-2 px-4 py-2 bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:bg-base-100 transition-all duration-200 text-base-content"
            aria-label="View event spends"
          >
            <ReceiptPercentIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold">Spends</span>
          </Link>

          <button
            onClick={onShare}
            className="p-3 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all duration-200"
            aria-label="Share event"
          >
            <ShareIcon className="h-5 w-5 text-base-content/70" />
          </button>

          <button
            className="p-3 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all duration-200"
            aria-label="More options"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-base-content/70" />
          </button>
        </div>
      </div>

      {/* ── Hero card ── */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl text-primary-content p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* Left — event info */}
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-4 py-2 bg-primary-content/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {category}
              </span>
              <span
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold ${
                  status === "active"
                    ? "bg-success/30 text-white"
                    : status === "completed"
                    ? "bg-primary-content/20"
                    : "bg-error/30 text-white"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>

            <p className="text-primary-content/80 text-lg mb-6 max-w-2xl leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 shrink-0" />
                <span className="font-semibold">{formattedDate}</span>
              </div>
              {location && location !== "—" && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — budget card */}
          <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 w-full lg:min-w-80 lg:max-w-sm border border-primary-content/20 shrink-0">
            <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-primary-content/80">Collected</span>
                <span className="font-bold">₹{collected.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-content/80">Target</span>
                <span className="font-bold">
                  {budgetTarget > 0
                    ? `₹${budgetTarget.toLocaleString("en-IN")}`
                    : "No target set"}
                </span>
              </div>

              <div className="w-full bg-primary-content/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary-content h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-center text-sm font-semibold">
                {budgetTarget > 0 ? `${progress}% achieved` : "Budget target not set"}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-primary-content/20 flex gap-2">
              <Link
                to={`/events/${id}/spends`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-content/20 text-primary-content rounded-xl hover:bg-primary-content/30 transition-colors border border-primary-content/30 text-sm font-medium"
              >
                <ReceiptPercentIcon className="h-4 w-4" />
                Manage Spends
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventHeader;