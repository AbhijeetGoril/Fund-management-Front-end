
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  UserIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  FireIcon
} from "@heroicons/react/20/solid";
import {
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import SummaryCard from "../components/SummaryCard";
import CreateEventForm from "../components/Addmin-Panel/CreateEventForm"
import AddNewMember from "../components/DashBorad/AddNewMumber";
import { Loader } from "../components/Loader";
import Navbar from "../components/Navbar/Navbar";

const dummyEvents = [
  {
    id: 1,
    name: "Annual Function 2024",
    title: "Mahagun Moderne, Noida Sector 78",
    date: "2024-03-15",
    venue: "Community Hall",
    totalMembers: 6,
    paidMembers: 3,
    totalCollected: 1900,
    pendingPayments: 3,
    status: "active",
    progress: 65,
    category: "Cultural",
    color: "blue"
  },
  {
    id: 2,
    name: "Maintenance Collection",
    title: "DLF Phase 4, Gurgaon",
    date: "2024-02-01",
    venue: "Society Office",
    totalMembers: 5,
    paidMembers: 2,
    totalCollected: 1100,
    pendingPayments: 3,
    status: "completed",
    progress: 100,
    category: "Maintenance",
    color: "green"
  },
  {
    id: 3,
    name: "Gardening Fund",
    title: "ATS Greens Village, Noida Sector 93A",
    date: "2024-04-01",
    venue: "Society Garden",
    totalMembers: 4,
    paidMembers: 4,
    totalCollected: 2000,
    pendingPayments: 0,
    status: "active",
    progress: 100,
    category: "Development",
    color: "emerald"
  },
  {
    id: 4,
    name: "Security Upgrade",
    title: "Gaur City 2, Greater Noida West",
    date: "2024-01-20",
    venue: "Society Premises",
    totalMembers: 8,
    paidMembers: 5,
    totalCollected: 4000,
    pendingPayments: 3,
    status: "active",
    progress: 62,
    category: "Security",
    color: "purple"
  }
];


const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setEvents(dummyEvents);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeFilter === "all") return true;
    return event.status === activeFilter;
  });

  const totalEvents = events.length;
  const totalCollected = events.reduce((sum, event) => sum + event.totalCollected, 0);
  const totalPending = events.reduce((sum, event) => sum + event.pendingPayments, 0);
  const activeEvents = events.filter(event => event.status === "active").length;
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600';
      case 'completed': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[color] || colors.blue;
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {showModal && (
        <CreateEventForm setShowModal={setShowModal} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-2xl shadow-lg border border-blue-100">
                  <span className="text-2xl">🏡</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Society Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Manage your society events and finances efficiently
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-green-200/50 flex items-center">
                <div className="relative">
                  <div className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-ping absolute"></div>
                  <div className="bg-green-500 w-3 h-3 rounded-full mr-3 relative"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Active Society</span>
              </div>
              
              <button 
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                New Event
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            label="Total Events" 
            value={totalEvents} 
            change="+12%"
            trend="up"
            icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
            color="blue"
            gradient="from-blue-500 to-cyan-500"
          />
          <SummaryCard 
            label="Active Events" 
            value={activeEvents} 
            change="+5%"
            trend="up"
            icon={<FireIcon className="h-6 w-6 text-orange-500" />}
            color="orange"
            gradient="from-orange-500 to-red-500"
          />
          <SummaryCard 
            label="Total Collected" 
            value={`₹${totalCollected.toLocaleString()}`} 
            change="+23%"
            trend="up"
            icon={<CurrencyRupeeIcon className="h-6 w-6 text-emerald-600" />}
            color="emerald"
            gradient="from-emerald-500 to-green-500"
          />
          <SummaryCard 
            label="Pending Payments" 
            value={totalPending} 
            change="-8%"
            trend="down"
            icon={<ClockIcon className="h-6 w-6 text-amber-600" />}
            color="amber"
            gradient="from-amber-500 to-orange-500"
          />
        </div>

       
        
        {/* Events Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  Society Events
                </h2>
                <p className="text-gray-600 mt-2">Manage and track all your society events</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Filter Buttons */}
                <div className="flex bg-gray-100/80 rounded-2xl p-1">
                  {['all', 'active', 'completed'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                        activeFilter === filter
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm flex items-center gap-2">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="p-12">
              <Loader />
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    onClick={() => handleEventClick(event.id)}
                  >
                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${getStatusColor(event.status)} p-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm`}>
                            {event.status.toUpperCase()}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-3 line-clamp-1">
                            {event.title}
                          </h3>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.color)}`}>
                          {event.category}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {event.date}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-800">{event.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(event.status)}`}
                            style={{ width: `${event.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-800">{event.totalMembers}</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{event.paidMembers}</div>
                          <div className="text-xs text-gray-500">Paid</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-amber-600">{event.pendingPayments}</div>
                          <div className="text-xs text-gray-500">Pending</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-semibold text-gray-800">
                            ₹{event.totalCollected.toLocaleString()}
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <EyeIcon className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
                  <p className="text-gray-600 mb-6">Create your first event to get started</p>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredEvents.length}</span> of{" "}
                <span className="font-semibold">{events.length}</span> events
              </p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm">
                  1
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Society Management System. Crafted with ❤️ for better community living.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;