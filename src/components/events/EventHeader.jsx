import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/20/solid";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";

const EventHeader = ({ event, onBack, onShare }) => {  // ← Added onShare prop
  return (
    <div className="mb-8">
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
            to={`/events/${event.id}/spends`}
            className="flex items-center gap-2 px-4 py-2 bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg hover:bg-base-100 transition-all duration-200 text-base-content"
            aria-label="View event spends"
          >
            <ReceiptPercentIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold">Spends</span>
          </Link>

          <button 
            onClick={onShare}  // ← Added onClick handler
            className="p-3 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all duration-200"
          >
            <ShareIcon className="h-5 w-5 text-base-content/70" />
          </button>
          <button className="p-3 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all duration-200">
            <EllipsisVerticalIcon className="h-5 w-5 text-base-content/70" />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl text-primary-content p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-primary-content/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {event.category}
              </span>
              <span className="px-4 py-2 bg-primary-content/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {event.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{event.name}</h1>

            <p className="text-primary-content/80 text-lg mb-6 max-w-2xl">{event.description}</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span className="font-semibold">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                <span className="font-semibold">{event.venue}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-content/10 backdrop-blur-sm rounded-2xl p-6 min-w-80 border border-primary-content/20">
            <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Collected</span>
                <span className="font-bold">₹{event.collectedAmount?.toLocaleString?.() ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target</span>
                <span className="font-bold">₹{event.totalBudget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-primary-content/30 rounded-full h-3">
                <div
                  className="bg-primary-content h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${event.progress}%` }}
                />
              </div>
              <div className="text-center text-sm font-semibold">
                {event.progress}% achieved
              </div>
            </div>

            <div className="mt-4">
              <Link
                to={`/events/${event.id}/spends`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-content/20 text-primary-content rounded-xl hover:bg-primary-content/30 transition-colors border border-primary-content/30"
              >
                <ReceiptPercentIcon className="h-5 w-5" />
                <span>Manage Spends</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;