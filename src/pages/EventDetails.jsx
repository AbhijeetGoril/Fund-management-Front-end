import { useState } from "react";
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

// ── API functions ─────────────────────────────────────────────────
const fetchEventById = async (eventId) => {
  const { data } = await axiosInstance.get(`/societies/events/${eventId}`);
  return data;
};

const addParticipantApi = async (payload) => {
  const { data } = await axiosInstance.post(
    "/societies/events/addParticipant",
    payload
  );
  return data;
};

// ── Component ─────────────────────────────────────────────────────
const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  // ── Query: fetch event ────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });

  // ── Mutation: add participant ─────────────────────────────────
  const { mutate: addParticipant, isPending: isAdding } = useMutation({
    mutationFn: addParticipantApi,
    onSuccess: () => {
      // Invalidate so event data auto-refetches (summary + participants refresh)
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      setShowModal(false);
    },
    onError: (err) => {
      console.error("Failed to add participant:", err);
      alert(err.response?.data?.message || "Could not add participant. Please try again.");
    },
  });

  const handleAddParticipant = (participantData) => {
    addParticipant({
      eventId,
      name: participantData.name,
      email: participantData.email,
      phone: participantData.phone ?? "",
      amountToPay: participantData.amountToPay ?? 0,
    });
  };

  // ── Loading ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader size="lg" color="primary" variant="spinner" />
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (isError || !data?.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              {isError ? "Failed to load event" : "Event not found"}
            </h2>
            {isError && (
              <p className="text-base-content/60 mb-6 text-sm">
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

  // ── Destructure API response ──────────────────────────────────
  const { event, members, participants, summary } = data;

  // ── Derived stats from API summary ───────────────────────────
  const totalDonations        = summary?.totalAmountPaid     ?? 0;
  const totalRemainingAmount  = summary?.totalPendingAmount  ?? 0;
  const totalParticipants     = summary?.totalParticipants   ?? 0;
  const paidParticipants      = participants.filter((p) => p.paymentStatus === "paid").length;
  const pendingParticipants   = participants.filter((p) => p.paymentStatus === "pending").length;
  const partialParticipants   = participants.filter((p) => p.paymentStatus === "partial").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />

      {/* Add Participant Modal */}
      {showModal && (
        <AddNewMember
          members={participants}
          setMembers={() => {}}           // managed by React Query now
          setShowModal={setShowModal}
          eventTotalBudget={event.budget?.target ?? 0}
          existingMembersCount={totalParticipants}
          onSubmit={handleAddParticipant} // pass the mutation handler
          isLoading={isAdding}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareEventModal
          eventId={eventId}
          eventName={event.title}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Background accents */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <EventHeader
          event={{
            ...event,
            name: event.title,                        // normalise title → name
            collectedAmount: totalDonations,
            totalBudget: event.budget?.target ?? 0,
          }}
          onBack={() => navigate("/dashboard")}
          onShare={() => setShowShareModal(true)}
        />

        <StatsCards
          members={participants}
          paidMembers={paidParticipants}
          totalDonations={totalDonations}
          pendingPayments={pendingParticipants}
          totalBudget={event.budget?.target ?? 0}
          totalRemainingAmount={totalRemainingAmount}
          partialPaidMembers={partialParticipants}
        />

        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-base-200">
            <nav className="flex space-x-8 px-6">
              {["members", "analytics", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "members" && (
              <MembersTab
                event={event}
                members={participants}       // participants are the "members" in the UI
                onAddMember={() => setShowModal(true)}
              />
            )}
            {activeTab === "analytics" && (
              <div className="text-base-content/70 p-8 text-center">
                Analytics coming soon…
              </div>
            )}
            {activeTab === "settings" && (
              <div className="text-base-content/70 p-8 text-center">
                Settings coming soon…
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base-content/40 text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;