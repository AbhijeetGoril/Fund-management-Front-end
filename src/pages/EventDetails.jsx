// EventDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CurrencyRupeeIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ShareIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/20/solid";
import {
  ChartBarIcon,
  UsersIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";
import SummaryCard from "../components/SummaryCard";
import AddNewMember from "../components/DashBorad/AddNewMumber";

import { Loader } from "../components/Loader";

import Navbar from "../components/Navbar/Navbar";

const dummyEventsArray = {
  1: {
    id: 1,
    name: "Annual Function 2024",
    date: "2024-03-15",
    venue: "Community Hall",
    description: "Join us for an evening of cultural performances, delicious food, and community bonding. This annual event brings together all society members for a night of celebration and entertainment.",
    totalBudget: 50000,
    collectedAmount: 35000,
    status: "active",
    progress: 70,
    category: "Cultural",
    color: "blue",
    members: [
      { id: 1, name: "Abhijeet Sharma", email: "abhijeet@gmail.com", hasPaid: true, amount: 500, joinDate: "2024-01-15", avatar: "AS" },
      { id: 2, name: "Anjali Patel", email: "anjali@gmail.com", hasPaid: false, amount: 0, joinDate: "2024-01-10", avatar: "AP" },
      { id: 3, name: "Rohit Kumar", email: "rohit@gmail.com", hasPaid: true, amount: 800, joinDate: "2024-01-08", avatar: "RK" },
      { id: 4, name: "Priya Singh", email: "priya@gmail.com", hasPaid: true, amount: 600, joinDate: "2024-01-12", avatar: "PS" },
      { id: 5, name: "Sanjay Mehta", email: "sanjay@gmail.com", hasPaid: false, amount: 0, joinDate: "2024-01-05", avatar: "SM" },
    ]
  },
  // ... other events
};

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  
  useEffect(() => {
    setTimeout(() => {
      const foundEvent = dummyEventsArray[eventId] || dummyEventsArray[1];
      setEvent(foundEvent);
      setLoading(false);
    }, 1000);
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Event not found</h2>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { members } = event;
  const totalDonations = members.reduce((sum, member) => sum + member.amount, 0);
  const pendingPayments = members.filter(member => !member.hasPaid).length;
  const paidMembers = members.filter(member => member.hasPaid).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {showModal && (
        <AddNewMember 
          members={members} 
          setMembers={(newMembers) => setEvent({...event, members: newMembers})} 
          setShowModal={setShowModal}
        />
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
          
          <div className="flex gap-3">
            <button className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200">
              <ShareIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Event Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl text-white p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {event.category}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {event.status.toUpperCase()}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{event.name}</h1>
              
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">{event.description}</p>
              
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
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-80">
              <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Collected</span>
                  <span className="font-bold">₹{totalDonations.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span className="font-bold">₹{event.totalBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${event.progress}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm font-semibold">
                  {event.progress}% achieved
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            label="Total Participants" 
            value={members.length} 
            icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
            color="blue"
            gradient="from-blue-500 to-cyan-500"
          />
          <SummaryCard 
            label="Paid Members" 
            value={paidMembers} 
            icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
            color="green"
            gradient="from-green-500 to-emerald-500"
          />
          <SummaryCard 
            label="Total Collected" 
            value={`₹${totalDonations.toLocaleString()}`} 
            icon={<CurrencyRupeeIcon className="h-6 w-6 text-amber-500" />}
            color="amber"
            gradient="from-amber-500 to-orange-500"
          />
          <SummaryCard 
            label="Pending Payments" 
            value={pendingPayments} 
            icon={<XCircleIcon className="h-6 w-6 text-red-500" />}
            color="red"
            gradient="from-red-500 to-pink-500"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['members', 'analytics', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'members' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-xl font-semibold text-gray-800">Event Participants</h3>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Participant
                  </button>
                </div>

                {/* Members List */}
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{member.name}</h4>
                            <p className="text-gray-600 text-sm">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-semibold text-gray-800">
                              {member.hasPaid ? `₹${member.amount}` : 'Not Paid'}
                            </div>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              member.hasPaid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.hasPaid ? (
                                <>
                                  <CheckCircleIcon className="h-3 w-3" />
                                  Paid
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Society Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;