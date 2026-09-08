import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import CreateEventForm from '../components/Addmin-Panel/CreateEventForm';
import Navbar from "../components/Navbar/Navbar";
import { axiosInstance } from '../lib/axois';

const fetchAdminOverview = async () => {
  const { data } = await axiosInstance.get('/events/admin-overview');
  return data;
};

const fetchSentInvitations = async () => {
  const { data } = await axiosInstance.get('/invitations/sent');
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

const invitationStatusClass = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  rejected: "bg-error/10 text-error",
  cancelled: "bg-base-200 text-base-content/50",
};

const InvitationRow = ({ invitation, onCancel, isCancelling }) => {
  const targetLabel = invitation.event?.title || invitation.society?.name || "Unknown";

  return (
    <div className="flex items-center justify-between gap-3 bg-base-100 rounded-xl px-4 py-3 border border-base-200">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-base-content truncate">{invitation.email}</p>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize shrink-0 ${
              invitationStatusClass[invitation.status] || "bg-base-200 text-base-content/50"
            }`}
          >
            {invitation.status}
          </span>
        </div>
        <p className="text-xs text-base-content/45 mt-0.5 truncate">
          {invitation.type === "event" ? "Event" : "Society"}: {targetLabel}
        </p>
      </div>

      {invitation.status === "pending" && (
        <button
          onClick={() => onCancel(invitation._id)}
          disabled={isCancelling}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-error bg-error/10 rounded-lg hover:bg-error/20 transition-all duration-200 disabled:opacity-50 shrink-0"
        >
          <XCircleIcon className="h-3.5 w-3.5" />
          Cancel
        </button>
      )}
    </div>
  );
};

const dueDateStatusClass = {
  overdue: "text-error",
  due_soon: "text-warning",
  upcoming: "text-base-content/50",
};

const DueDateRow = ({ detail, eventTitle, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between gap-3 bg-base-100 rounded-xl px-4 py-3 border border-base-200 hover:border-primary/30 transition-all duration-200 text-left"
  >
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-base-content truncate">{detail.name}</p>
      <p className="text-xs text-base-content/45 truncate">{eventTitle}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-semibold text-base-content">
        ₹{detail.amountRemaining.toLocaleString()}
      </p>
      <p className={`text-xs font-medium ${dueDateStatusClass[detail.status]}`}>
        {formatDate(detail.dueDate)}
      </p>
    </div>
  </button>
);

const EventCard = ({ event, onClick }) => {
  const { overdueCount = 0, dueSoonCount = 0, details = [] } = event.dueSummary || {};
  const preview = details.slice(0, 3);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5"
    >
      <div className="flex items-start gap-3">
        {event.coverPhoto ? (
          <img
            src={event.coverPhoto}
            alt={event.title}
            className="h-14 w-14 rounded-xl object-cover shrink-0 ring-1 ring-black/5"
          />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center shrink-0 shadow-sm">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <h3 className="font-bold text-base-content truncate">{event.title}</h3>
              {event.society?.name && (
                <p className="text-xs text-base-content/50 mt-0.5">{event.society.name}</p>
              )}
            </div>
            <DueBadge overdueCount={overdueCount} dueSoonCount={dueSoonCount} />
          </div>

          {preview.length > 0 && (
            <div className="mt-2 space-y-1.5">
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
        </div>
      </div>
    </button>
  );
};

const SocietyCard = ({ society, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-base-100 rounded-2xl border border-base-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4"
  >
    {society.logo ? (
      <img
        src={society.logo}
        alt={society.name}
        className="h-11 w-11 rounded-xl object-cover shrink-0 ring-1 ring-black/5"
      />
    ) : (
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center shrink-0 shadow-sm">
        <BuildingLibraryIcon className="h-5 w-5 text-white" />
      </div>
    )}
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
  const [invitationFilter, setInvitationFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: fetchAdminOverview,
  });

  const { data: sentData, isLoading: isLoadingInvitations } = useQuery({
    queryKey: ['sentInvitations'],
    queryFn: fetchSentInvitations,
  });
  const sentInvitations = sentData?.invitations ?? [];

  const { mutate: cancelInvitation, isPending: isCancelling } = useMutation({
    mutationFn: async (invitationId) => {
      const { data } = await axiosInstance.patch(`/invitations/${invitationId}/cancel`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sentInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
      toast.success(data?.message || 'Invitation cancelled.', { position: 'top-right' });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Could not cancel invitation.',
        { position: 'top-right' }
      );
    },
  });

  const societies = data?.societies ?? [];
  const events = data?.events ?? [];

  const totalOverdue = events.reduce((sum, e) => sum + (e.dueSummary?.overdueCount ?? 0), 0);
  const totalDueSoon = events.reduce((sum, e) => sum + (e.dueSummary?.dueSoonCount ?? 0), 0);

  // Flatten every event's due-date details into one consolidated list,
  // tagged with which event each entry belongs to, sorted soonest/most
  // overdue first — so an admin can see every outstanding payment
  // across ALL their events in one place, not just per-event.
  const allDueDates = events
    .flatMap((e) =>
      (e.dueSummary?.details ?? []).map((d) => ({
        ...d,
        eventId: e._id,
        eventTitle: e.title,
      }))
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const INVITATION_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'cancelled', label: 'Cancelled' },
  ];
  const invitationCountFor = (key) =>
    key === 'all'
      ? sentInvitations.length
      : sentInvitations.filter((inv) => inv.status === key).length;
  const filteredInvitations =
    invitationFilter === 'all'
      ? sentInvitations
      : sentInvitations.filter((inv) => inv.status === invitationFilter);

  const DUE_DATE_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'overdue', label: 'Already Due' },
    { key: 'due_soon', label: 'Due Soon' },
    { key: 'upcoming', label: 'Upcoming' },
  ];
  const dueDateCountFor = (key) =>
    key === 'all'
      ? allDueDates.length
      : allDueDates.filter((d) => d.status === key).length;
  const filteredDueDates =
    dueDateFilter === 'all'
      ? allDueDates
      : allDueDates.filter((d) => d.status === dueDateFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />

      {/* Ambient background blobs — matches SocietyDetails/EventDetails */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Gradient hero, matching SocietyDetails' hero pattern */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Admin Overview
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-sm flex items-center gap-3">
              <CurrencyDollarIcon className="h-9 w-9 lg:h-11 lg:w-11 shrink-0" />
              Fund Event Management
            </h1>
            <p className="text-white/75 text-sm lg:text-base max-w-xl leading-relaxed">
              Everything you administer, in one place — societies, events, and who still owes what.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-base-content/50 mb-1">
              <BuildingLibraryIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Societies</p>
            </div>
            <p className="text-2xl font-bold text-base-content">{societies.length}</p>
          </div>
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-200/50 p-4">
            <div className="flex items-center gap-2 text-info/60 mb-1">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Events</p>
            </div>
            <p className="text-2xl font-bold text-info">{events.length}</p>
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
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4" />
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
            <div className="h-32 bg-base-300/50 rounded-3xl" />
            <div className="h-32 bg-base-300/40 rounded-3xl" />
          </div>
        )}

        {isError && (
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-10 text-center">
            <div className="h-14 w-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-7 w-7 text-error" />
            </div>
            <p className="text-error font-medium">Failed to load your admin overview</p>
            <p className="text-sm text-base-content/50 mt-1">
              {error?.response?.data?.message || error?.message}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Societies section — wrapped in a backdrop-blur card like SocietyDetails' tab container */}
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-base-content">Societies You Administer</h2>
                <span className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
                  {societies.length}
                </span>
              </div>

              {societies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-12 w-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
                    <BuildingLibraryIcon className="h-6 w-6 text-base-content/25" />
                  </div>
                  <p className="text-base-content/50 text-sm font-medium">
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
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-base-content">Events You Administer</h2>
                <span className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
                  {events.length}
                </span>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CurrencyDollarIcon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">No Active Fund Events</h3>
                  <p className="text-base-content/60 mb-6 max-w-md mx-auto text-sm">
                    Create your first fund event to start collecting contributions.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200 mx-auto"
                  >
                    <PlusIcon className="h-4 w-4" />
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

            {/* Consolidated due dates across ALL events, sorted soonest/most overdue first */}
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Upcoming Due Dates
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {DUE_DATE_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setDueDateFilter(f.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        dueDateFilter === f.key
                          ? "bg-primary text-primary-content shadow-sm"
                          : "bg-base-200 text-base-content/60 hover:bg-base-300"
                      }`}
                    >
                      {f.label} <span className="opacity-70">({dueDateCountFor(f.key)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredDueDates.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-base-content/50 text-sm font-medium">
                    {dueDateFilter === 'all'
                      ? 'No outstanding due dates across your events.'
                      : `No ${DUE_DATE_FILTERS.find((f) => f.key === dueDateFilter)?.label.toLowerCase()} payments.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDueDates.map((d) => (
                    <DueDateRow
                      key={`${d.eventId}-${d.memberId}`}
                      detail={d}
                      eventTitle={d.eventTitle}
                      onClick={() => navigate(`/events/${d.eventId}/members/${d.memberId}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* All invitations you've personally sent, across everything */}
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  Invitations You've Sent
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {INVITATION_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setInvitationFilter(f.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        invitationFilter === f.key
                          ? "bg-primary text-primary-content shadow-sm"
                          : "bg-base-200 text-base-content/60 hover:bg-base-300"
                      }`}
                    >
                      {f.label} <span className="opacity-70">({invitationCountFor(f.key)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingInvitations ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-14 bg-base-200 rounded-xl" />
                  <div className="h-14 bg-base-200 rounded-xl" />
                </div>
              ) : filteredInvitations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-base-content/50 text-sm font-medium">
                    {invitationFilter === 'all'
                      ? "You haven't sent any invitations yet."
                      : `No ${invitationFilter} invitations.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInvitations.map((inv) => (
                    <InvitationRow
                      key={inv._id}
                      invitation={inv}
                      onCancel={cancelInvitation}
                      isCancelling={isCancelling}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-center pt-2">
          <p className="text-base-content/40 text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;