import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar/Navbar";
import EventHeader from "../components/events/EventHeader";
import StatsCards from "../components/events/StatsCards";
import MembersTab from "../components/events/MembersTab";
import AddNewMember from "../components/DashBorad/AddNewMumber";
import ShareEventModal from "../components/events/ShareEventModal";
import { Loader } from "../components/Loader";
import { axiosInstance } from "../lib/axois";
import { toast } from "react-toastify";
import {
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const fetchEventById = async (eventId) => {
  const { data } = await axiosInstance.get(`/societies/events/${eventId}`);
  return data;
};

const inviteParticipantApi = async (payload) => {
  const { data } = await axiosInstance.post("/invitations/invite", payload);
  return data;
};

const addOfflineParticipantApi = async (payload) => {
  const { data } = await axiosInstance.post("/events/addParticipant", payload);
  return data;
};

const TABS = [
  { key: "members", label: "Members", icon: UsersIcon },
  { key: "analytics", label: "Analytics", icon: ChartBarIcon },
  { key: "settings", label: "Settings", icon: Cog6ToothIcon },
];

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [isAdmin, setIsAdmin] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

  useEffect(() => {
    if (data?.members) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const isEventAdmin = data.members.some((member) => {
        const userId = member.user?._id || member.user || member._id;
        const currentUserId = currentUser._id || currentUser.id;
        return userId === currentUserId && member.role === "admin";
      });
      setIsAdmin(isEventAdmin);
    }
  }, [data]);

  const onAddSuccess = (data, defaultMsg) => {
    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    setShowModal(false);
    toast.success(data?.message || defaultMsg, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const onAddError = (err) => {
    toast.error(
      err?.response?.data?.message || "Something went wrong. Please try again.",
      { position: "top-right", autoClose: 5000 }
    );
  };

  const { mutateAsync: inviteParticipant, isPending: isInviting } = useMutation({
    mutationFn: inviteParticipantApi,
    onSuccess: (data) => onAddSuccess(data, "Invitation sent successfully!"),
    onError: onAddError,
  });

  const { mutateAsync: addOfflineParticipant, isPending: isAddingOffline } = useMutation({
    mutationFn: addOfflineParticipantApi,
    onSuccess: (data) => onAddSuccess(data, "Participant added successfully!"),
    onError: onAddError,
  });

  const isSubmitting = isInviting || isAddingOffline;

  const handleAddParticipant = async (participantData) => {
    if (participantData.mode === "invite") {
      return await inviteParticipant({
        email: participantData.email,
        type: "event",
        event: eventId,
        amountToPay: participantData.amountToPay ?? 0,
        message: participantData.message ?? "",
      });
    }

    return await addOfflineParticipant({
      eventId,
      name: participantData.name,
      email: participantData.email || undefined,
      phone: participantData.phone || undefined,
      amountToPay: participantData.amountToPay ?? 0,
      message: participantData.message ?? "",
    });
  };

  // ── Loading state ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-40 bg-base-300/60 rounded-3xl mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-base-300/60 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-base-300/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────
  if (isError || !data?.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-5">
              <ExclamationTriangleIcon className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              {isError ? "Failed to load event" : "Event not found"}
            </h2>
            {isError && (
              <p className="text-base-content/60 mb-8 text-sm max-w-sm mx-auto">
                {error?.response?.data?.message || error?.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={refetch}
                className="px-6 py-3 border border-base-300 text-base-content rounded-2xl font-semibold hover:bg-base-200 transition-all duration-300"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { event, members, summary } = data;

  const totalDonations = summary?.totalAmountPaid ?? 0;
  const totalRemainingAmount = summary?.totalPendingAmount ?? 0;
  const paidParticipants = members.filter((m) => m.paymentStatus === "paid").length;
  const pendingParticipants = members.filter((m) => m.paymentStatus === "pending").length;
  const partialParticipants = members.filter((m) => m.paymentStatus === "partial").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />

      {showModal && (
        <AddNewMember
          members={members}
          setShowModal={setShowModal}
          eventTotalBudget={event.budget?.target ?? 0}
          existingMembersCount={summary?.totalMembers ?? 0}
          onSubmit={handleAddParticipant}
          isLoading={isSubmitting}
        />
      )}

      {showShareModal && (
        <ShareEventModal
          eventId={eventId}
          eventName={event.title}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <EventHeader
          event={{
            ...event,
            name: event.title,
            collectedAmount: totalDonations,
            totalBudget: event.budget?.target ?? 0,
          }}
          onBack={() => navigate("/dashboard")}
          onShare={() => setShowShareModal(true)}
        />

        <StatsCards
          members={members}
          paidMembers={paidParticipants}
          totalDonations={totalDonations}
          pendingPayments={pendingParticipants}
          totalBudget={event.budget?.target ?? 0}
          totalRemainingAmount={totalRemainingAmount}
          partialPaidMembers={partialParticipants}
        />

        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
          {/* Tab bar */}
          <div className="border-b border-base-200 px-2 sm:px-6">
            <nav className="flex gap-1 sm:gap-2">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xs:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "members" && (
              <MembersTab
                event={event}
                members={members}
                onAddMember={() => setShowModal(true)}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === "analytics" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ChartBarIcon className="h-10 w-10 text-base-content/15 mb-3" />
                <p className="text-base-content/50 font-medium">Analytics coming soon</p>
                <p className="text-xs text-base-content/35 mt-1">
                  Charts and trends for this event will appear here.
                </p>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Cog6ToothIcon className="h-10 w-10 text-base-content/15 mb-3" />
                <p className="text-base-content/50 font-medium">Settings coming soon</p>
                <p className="text-xs text-base-content/35 mt-1">
                  Event configuration options will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-base-content/40 text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;