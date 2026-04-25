import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import EventHeader from "../components/events/EventHeader";
import StatsCards from "../components/events/StatsCards";
import MembersTab from "../components/events/MembersTab";
import AddNewMember from "../components/DashBorad/AddNewMumber";
import { Loader } from "../components/Loader";

const dummyEventsArray = {
  1: {
    id: 1,
    name: "Annual Function 2024",
    date: "2024-03-15",
    venue: "Community Hall",
    description:
      "Join us for an evening of cultural performances, delicious food, and community bonding. This annual event brings together all society members for a night of celebration and entertainment.",
    totalBudget: 50000,
    collectedAmount: 35000,
    status: "active",
    progress: 70,
    category: "Cultural",
    color: "primary",
    members: [
      { id: 1, name: "Abhijeet Sharma", email: "abhijeet@gmail.com", hasPaid: true, amount: 500, joinDate: "2024-01-15", avatar: "AS" },
      { id: 2, name: "Anjali Patel", email: "anjali@gmail.com", hasPaid: false, amount: 0, joinDate: "2024-01-10", avatar: "AP" },
      { id: 3, name: "Rohit Kumar", email: "rohit@gmail.com", hasPaid: true, amount: 800, joinDate: "2024-01-08", avatar: "RK" },
      { id: 4, name: "Priya Singh", email: "priya@gmail.com", hasPaid: true, amount: 600, joinDate: "2024-01-12", avatar: "PS" },
      { id: 5, name: "Sanjay Mehta", email: "sanjay@gmail.com", hasPaid: false, amount: 0, joinDate: "2024-01-05", avatar: "SM" },
    ],
  },
};

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  useEffect(() => {
    const t = setTimeout(() => {
      const foundEvent = dummyEventsArray[eventId] || dummyEventsArray[1];
      setEvent(foundEvent);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader size="lg" color="primary" variant="spinner" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200 p-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">Event not found</h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { members } = event;
  const totalDonations = members.reduce((sum, m) => sum + m.amount, 0);
  const pendingPayments = members.filter((m) => !m.hasPaid).length;
  const paidMembers = members.filter((m) => m.hasPaid).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />

      {showModal && (
        <AddNewMember
          members={members}
          setMembers={(newMembers) => setEvent({ ...event, members: newMembers })}
          setShowModal={setShowModal}
        />
      )}

      {/* Animated Background Accents */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventHeader
          event={{ ...event, collectedAmount: totalDonations }}
          onBack={() => navigate("/dashboard")}
        />

        <StatsCards
          members={members}
          paidMembers={paidMembers}
          totalDonations={totalDonations}
          pendingPayments={pendingPayments}
        />

        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl shadow-xl border border-base-200/50 overflow-hidden">
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
                members={members}
                onAddMember={() => setShowModal(true)}
              />
            )}
            {activeTab === "analytics" && (
              <div className="text-base-content/70 p-8 text-center">Analytics coming soon…</div>
            )}
            {activeTab === "settings" && (
              <div className="text-base-content/70 p-8 text-center">Settings coming soon…</div>
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