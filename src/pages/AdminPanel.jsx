import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import CreateEventForm from '../components/Addmin-Panel/CreateEventForm';
import Navbar from "../components/Navbar/Navbar";
import { axiosInstance } from '../lib/axois';

const fetchAdminOverview = async () => {
  const { data } = await axiosInstance.get('/events/admin-overview');
  return data;
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// Same color-tier logic used in MembersTab — overdue red, due-soon
// orange, upcoming neutral — applied here at the event-card level.
const DueBadge = ({ overdueCount, dueSoonCount }) => {
  if (overdueCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
        <ExclamationTriangleIcon className="h-3.5 w-3.5" />
        {overdueCount} overdue
      </span>
    );
  }
  if (dueSoonCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
        <ClockIcon className="h-3.5 w-3.5" />
        {dueSoonCount} due soon
      </span>
    );
  }
  return null;
};

const EventCard = ({ event, onClick }) => {
  const { overdueCount = 0, dueSoonCount = 0, details = [] } = event.dueSummary || {};
  // Show a few names inline so the admin sees who needs attention
  // without opening the event — full list lives on the event page.
  const preview = details.slice(0, 3);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="font-bold text-base-content truncate">{event.title}</h3>
          {event.society?.name && (
            <p className="text-xs text-base-content/50 mt-0.5">{event.society.name}</p>
          )}
        </div>
        <DueBadge overdueCount={overdueCount} dueSoonCount={dueSoonCount} />
      </div>

      {preview.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {preview.map((d) => (
            <div key={d.memberId} className="flex items-center justify-between text-xs">
              <span
                className={`truncate ${
                  d.status === 'overdue' ? 'text-error font-medium' : 'text-base-content/60'
                }`}
              >
                {d.name}
              </span>
              <span className="text-base-content/40 shrink-0 ml-2">
                ₹{d.amountRemaining.toLocaleString()} · {formatDate(d.dueDate)}
              </span>
            </div>
          ))}
          {details.length > preview.length && (
            <p className="text-[11px] text-base-content/35">
              +{details.length - preview.length} more
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-end mt-3 text-xs text-primary font-medium">
        View event <ArrowRightIcon className="h-3 w-3 ml-1" />
      </div>
    </button>
  );
};

const SocietyCard = ({ society, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 p-5 flex items-center gap-4"
  >
    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <BuildingLibraryIcon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-base-content truncate">{society.name}</h3>
      {society.category && (
        <p className="text-xs text-base-content/50 mt-0.5">{society.category}</p>
      )}
    </div>
    <ArrowRightIcon className="h-4 w-4 text-base-content/30 shrink-0" />
  </button>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: fetchAdminOverview,
  });

  const societies = data?.societies ?? [];
  const events = data?.events ?? [];

  const totalOverdue = events.reduce((sum, e) => sum + (e.dueSummary?.overdueCount ?? 0), 0);
  const totalDueSoon = events.reduce((sum, e) => sum + (e.dueSummary?.dueSoonCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4 flex items-center justify-center gap-3 tracking-tight">
            <CurrencyDollarIcon className="h-10 w-10 text-primary" />
            Fund Event Management
          </h1>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Everything you administer, in one place — societies, events, and who still owes what.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-base-content/50 mb-1">
              <BuildingLibraryIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Societies</p>
            </div>
            <p className="text-2xl font-bold text-base-content">{societies.length}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-base-content/50 mb-1">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Events</p>
            </div>
            <p className="text-2xl font-bold text-base-content">{events.length}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-error/60 mb-1">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Overdue</p>
            </div>
            <p className="text-2xl font-bold text-error">{totalOverdue}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-warning/60 mb-1">
              <ClockIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Due Soon</p>
            </div>
            <p className="text-2xl font-bold text-warning">{totalDueSoon}</p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Fund Event
          </button>
        </div>

        {showForm && (
          <CreateEventForm
            setShowModal={setShowForm}
            onEventCreated={() => {
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
            }}
          />
        )}

        {isLoading && (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-base-300/50 rounded-2xl" />
            <div className="h-24 bg-base-300/40 rounded-2xl" />
          </div>
        )}

        {isError && (
          <div className="bg-base-100/80 rounded-2xl border border-base-200 p-8 text-center">
            <p className="text-error font-medium">Failed to load your admin overview</p>
            <p className="text-sm text-base-content/50 mt-1">
              {error?.response?.data?.message || error?.message}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Societies section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-base-content">Societies You Administer</h2>
                <p className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
                  {societies.length}
                </p>
              </div>

              {societies.length === 0 ? (
                <div className="bg-base-100/60 rounded-2xl border border-base-200 p-8 text-center">
                  <p className="text-base-content/50 text-sm">
                    You're not an admin of any society yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {societies.map((s) => (
                    <SocietyCard
                      key={s._id}
                      society={s}
                      onClick={() => navigate(`/society/${s._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Events section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-base-content">Events You Administer</h2>
                <p className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
                  {events.length}
                </p>
              </div>

              {events.length === 0 ? (
                <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md p-12 text-center border border-base-200">
                  <div className="bg-primary/10 rounded-full p-4 inline-block mb-5">
                    <CurrencyDollarIcon className="h-14 w-14 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-base-content mb-2">No Active Fund Events</h3>
                  <p className="text-base-content/60 mb-8 max-w-md mx-auto">
                    Create your first fund event to start collecting contributions.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-primary text-primary-content font-medium rounded-xl hover:bg-primary/90 transition flex items-center mx-auto shadow-sm hover:shadow"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Fund Event
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((e) => (
                    <EventCard
                      key={e._id}
                      event={e}
                      onClick={() => navigate(`/events/${e._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-base-content/40 text-sm pt-8 border-t border-base-200">
          <p>© {new Date().getFullYear()} Society Fund Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;